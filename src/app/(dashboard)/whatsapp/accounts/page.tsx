"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  LogOut, 
  Smartphone,
  Users,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface WhatsAppSession {
  id: string;
  session_name: string;
  phone_number: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'expired' | 'reconnecting';
  last_activity: string;
  connected_leads_count: number;
}

export default function WhatsAppAccountsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [sessionName, setSessionName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  // Load user's WhatsApp sessions
  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_whatsapp_sessions', { user_uuid: user?.id });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  // Start new WhatsApp connection
  const startConnection = async () => {
    if (!sessionName.trim() || !phoneNumber.trim()) {
      alert('Please enter both session name and phone number');
      return;
    }

    setIsConnecting(true);
    try {
      // Create session in database
      const { data: session, error: sessionError } = await supabase
        .from('whatsapp_sessions')
        .insert({
          user_id: user?.id,
          session_name: sessionName.trim(),
          phone_number: phoneNumber.trim(),
          status: 'connecting'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Call backend to generate QR code
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.id,
          sessionName: sessionName.trim(),
          phoneNumber: phoneNumber.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to start connection');

      const { qrCode: qr } = await response.json();
      setQrCode(qr);
      setShowQRModal(true);

      // Start polling for connection status
      pollConnectionStatus(session.id);

    } catch (error) {
      console.error('Error starting connection:', error);
      alert('Failed to start WhatsApp connection');
    } finally {
      setIsConnecting(false);
    }
  };

  // Poll for connection status
  const pollConnectionStatus = async (sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('whatsapp_sessions')
          .select('status')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        if (data.status === 'connected') {
          clearInterval(interval);
          setShowQRModal(false);
          loadSessions(); // Refresh the list
        } else if (data.status === 'expired' || data.status === 'disconnected') {
          clearInterval(interval);
          setShowQRModal(false);
          loadSessions();
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
    }, 120000);
  };

  // Disconnect session
  const disconnectSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to disconnect this WhatsApp session?')) {
      return;
    }

    try {
      // Call backend to disconnect
      await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      // Update status in database
      await supabase
        .from('whatsapp_sessions')
        .update({ status: 'disconnected' })
        .eq('id', sessionId);

      loadSessions();
    } catch (error) {
      console.error('Error disconnecting session:', error);
      alert('Failed to disconnect session');
    }
  };

  // Reconnect session
  const reconnectSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/whatsapp/reconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) throw new Error('Failed to reconnect');

      const { qrCode: qr } = await response.json();
      setQrCode(qr);
      setShowQRModal(true);

      pollConnectionStatus(sessionId);
    } catch (error) {
      console.error('Error reconnecting session:', error);
      alert('Failed to reconnect session');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
      case 'reconnecting':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'expired':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">WhatsApp Accounts</h1>
        <p className="text-muted-foreground">
          Manage your WhatsApp connections for multi-account messaging
        </p>
      </motion.div>

      {/* Connect New Account */}
      <motion.div variants={itemVariants}>
        <Card className="card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Connect New WhatsApp Number
            </CardTitle>
            <CardDescription>
              Add a new WhatsApp number to your account for multi-account messaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  placeholder="e.g., Business Account, Personal"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={startConnection}
              disabled={isConnecting || !sessionName.trim() || !phoneNumber.trim()}
              className="w-full md:w-auto"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect WhatsApp
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Connected Accounts */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Connected Accounts ({sessions.length})
        </h2>
        
        {sessions.length === 0 ? (
          <Card className="card">
            <CardContent className="text-center py-12">
              <Smartphone className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No WhatsApp accounts connected</p>
              <p className="text-sm text-muted-foreground/70">
                Connect your first WhatsApp number to start messaging leads
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ y: -2, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="card group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(session.status)}
                        <CardTitle className="text-lg">{session.session_name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3" />
                      {session.phone_number}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {session.connected_leads_count} leads
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(session.last_activity).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {session.status === 'connected' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => disconnectSession(session.id)}
                          className="flex-1"
                        >
                          <LogOut className="h-3 w-3 mr-1" />
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reconnectSession(session.id)}
                          className="flex-1"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reconnect
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => window.location.href = `/whatsapp/conversations?session=${session.id}`}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Open WhatsApp on your phone and scan this QR code to connect your account
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCode ? (
              <div className="p-4 bg-white rounded-lg">
                <img
                  src={qrCode}
                  alt="WhatsApp QR Code"
                  className="w-64 h-64"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              The QR code will automatically refresh. Keep this window open while scanning.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 