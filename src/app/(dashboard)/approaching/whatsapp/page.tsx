"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Plus, 
  QrCode, 
  Smartphone, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface WhatsAppSession {
  id: string;
  phone_number: string;
  status: 'inactive' | 'connecting' | 'connected' | 'disconnected';
  created_at: string;
}

interface Message {
  id: string;
  direction: 'inbound' | 'outbound';
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export default function WhatsAppPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectNewAccount = async () => {
    setIsConnecting(true);
    try {
      // Simulate QR code generation
      setTimeout(() => {
        setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Error connecting account:', error);
      setIsConnecting(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession) return;

    const message: Message = {
      id: Date.now().toString(),
      direction: 'outbound',
      content: newMessage,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-500';
      case 'connecting':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'disconnected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          WhatsApp Management
        </h1>
        <p className="text-[#b0b0b0]">
          Connect multiple WhatsApp accounts and manage your outreach campaigns.
        </p>
      </motion.div>

      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="bg-[#232336]">
          <TabsTrigger value="accounts" className="data-[state=active]:bg-[#8B5CF6]">
            <Smartphone className="h-4 w-4 mr-2" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-[#8B5CF6]">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-[#8B5CF6]">
            <Users className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
          {/* Connect New Account */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">Connect WhatsApp Account</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                Add a new WhatsApp account to your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!qrCode ? (
                <Button 
                  onClick={connectNewAccount}
                  disabled={isConnecting}
                  className="btn-primary"
                >
                  {isConnecting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Connect New Account
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <QrCode className="h-32 w-32" />
                  </div>
                  <p className="text-[#b0b0b0]">
                    Scan this QR code with your WhatsApp app to connect your account
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setQrCode(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected Accounts */}
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">Connected Accounts</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                Manage your WhatsApp accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin text-[#8B5CF6] mx-auto mb-4" />
                  <p className="text-[#b0b0b0]">Loading accounts...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
                  <p className="text-[#b0b0b0]">No WhatsApp accounts connected</p>
                  <p className="text-sm text-[#b0b0b0] mt-2">
                    Connect your first account to start messaging
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-[#232336] rounded-lg hover:border-[#8B5CF6] transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Smartphone className="h-6 w-6 text-[#8B5CF6]" />
                        <div>
                          <p className="font-medium text-white">{session.phone_number}</p>
                          <p className="text-sm text-[#b0b0b0]">
                            Connected {new Date(session.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(session.status)}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1">{session.status}</span>
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Message Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Selection */}
            <Card className="card lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Select Account</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <p className="text-[#b0b0b0]">No accounts available</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => setSelectedSession(session.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedSession === session.id
                            ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                            : 'border-[#232336] hover:border-[#8B5CF6]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-[#8B5CF6]" />
                          <div>
                            <p className="font-medium text-white">{session.phone_number}</p>
                            <p className="text-sm text-[#b0b0b0]">{session.status}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedSession ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
                    <p className="text-[#b0b0b0]">Select an account to start messaging</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Messages List */}
                    <div className="h-64 overflow-y-auto space-y-2 border border-[#232336] rounded-lg p-4">
                      {messages.length === 0 ? (
                        <p className="text-center text-[#b0b0b0] py-8">
                          No messages yet. Start a conversation!
                        </p>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-lg ${
                                message.direction === 'outbound'
                                  ? 'bg-[#8B5CF6] text-white'
                                  : 'bg-[#232336] text-white'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button 
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-primary"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card className="card">
            <CardHeader>
              <CardTitle className="text-white">WhatsApp Campaigns</CardTitle>
              <CardDescription className="text-[#b0b0b0]">
                Create and manage bulk messaging campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
                <p className="text-[#b0b0b0]">No campaigns created yet</p>
                <p className="text-sm text-[#b0b0b0] mt-2 mb-4">
                  Create your first WhatsApp campaign to reach multiple leads
                </p>
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 