'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FloatingProfilePanel from '@/components/FloatingProfilePanel';
import { supabase, getCurrentUser, getWhatsAppSessions, createWhatsAppSession, updateWhatsAppSession } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface WhatsAppSession {
  id: string;
  phone_number: string | null;
  status: string;
  qr_code: string | null;
  last_activity: string;
  created_at: string;
}

export default function WhatsAppAccounts() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingSession, setConnectingSession] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth');
          return;
        }
        setUser(currentUser);
        await loadWhatsAppSessions(currentUser.id);
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/auth');
      }
    };
    checkUser();
  }, [router]);

  const loadWhatsAppSessions = async (userId: string) => {
    try {
      setLoading(true);
      const sessionsData = await getWhatsAppSessions(userId);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error('Error loading WhatsApp sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddSession = async () => {
    if (!newPhoneNumber.trim()) return;
    
    try {
      const session = await createWhatsAppSession({
        user_id: user!.id,
        phone_number: newPhoneNumber.trim(),
        status: 'connecting',
        session_data: {},
        qr_code: null,
        last_activity: new Date().toISOString()
      });
      
      setSessions(prev => [session, ...prev]);
      setNewPhoneNumber('');
      setShowAddModal(false);
      
      // Start connection process
      await startConnection(session.id);
    } catch (error) {
      console.error('Error creating WhatsApp session:', error);
    }
  };

  const startConnection = async (sessionId: string) => {
    setConnectingSession(sessionId);
    
    try {
      // In a real implementation, this would connect to your local WhatsApp service
      // For now, we'll simulate the connection process
      
      // Update session status to connecting
      await updateWhatsAppSession(sessionId, {
        status: 'connecting',
        qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      });
      
      // Simulate QR code generation delay
      setTimeout(async () => {
        try {
          await updateWhatsAppSession(sessionId, {
            status: 'active',
            qr_code: null,
            last_activity: new Date().toISOString()
          });
          
          // Refresh sessions
          if (user) {
            await loadWhatsAppSessions(user.id);
          }
        } catch (error) {
          console.error('Error updating session status:', error);
        } finally {
          setConnectingSession(null);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error starting connection:', error);
      setConnectingSession(null);
    }
  };

  const handleReconnect = async (sessionId: string) => {
    await startConnection(sessionId);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await supabase
        .from('whatsapp_sessions')
        .delete()
        .eq('id', sessionId);
      
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'connecting':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'connecting':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'expired':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg flex items-center justify-center">
        <div className="text-primary-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar 
        user={user} 
        onProfileClick={() => setIsProfilePanelVisible(true)} 
      />
      
      <main className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-medium text-primary-text mb-2">
                WhatsApp Accounts
              </h1>
              <p className="text-lg text-secondary-text">
                Manage your WhatsApp Business sessions for automated messaging.
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="px-6 py-3"
            >
              Add New Account
            </Button>
          </div>
        </motion.header>

        {/* Sessions Grid */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {sessions.length === 0 ? (
            <div className="bg-card-bg border border-border rounded-card p-12 text-center">
              <div className="w-16 h-16 bg-button-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-primary-text mb-2">No WhatsApp Accounts</h3>
              <p className="text-secondary-text mb-6">
                Connect your first WhatsApp Business account to start automated messaging.
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="primary"
                className="px-6 py-3"
              >
                Add Your First Account
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session, index) => (
                <motion.div 
                  key={session.id}
                  className="bg-card-bg border border-border rounded-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-button-bg rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-primary-text font-medium">
                          {session.phone_number || 'Unknown Number'}
                        </h3>
                        <p className="text-sm text-secondary-text">
                          Added {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Display */}
                  {session.status === 'connecting' && session.qr_code && (
                    <div className="mb-4 p-4 bg-button-bg rounded-card text-center">
                      <p className="text-sm text-secondary-text mb-2">Scan QR Code with WhatsApp</p>
                      <img 
                        src={session.qr_code} 
                        alt="QR Code" 
                        className="w-32 h-32 mx-auto border border-border rounded"
                      />
                    </div>
                  )}

                  {/* Last Activity */}
                  <div className="mb-4">
                    <p className="text-xs text-secondary-text">
                      Last activity: {new Date(session.last_activity).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {session.status === 'expired' && (
                      <Button
                        onClick={() => handleReconnect(session.id)}
                        variant="secondary"
                        className="flex-1"
                        disabled={connectingSession === session.id}
                      >
                        {connectingSession === session.id ? 'Connecting...' : 'Reconnect'}
                      </Button>
                    )}
                    {session.status === 'active' && (
                      <Button
                        onClick={() => router.push(`/dashboard/approaching/whatsapp/${session.id}`)}
                        variant="primary"
                        className="flex-1"
                      >
                        Open Chat
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDeleteSession(session.id)}
                      variant="secondary"
                      className="px-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-card-bg border border-border rounded-card p-6 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-medium text-primary-text mb-4">Add WhatsApp Account</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newPhoneNumber}
                  onChange={(e) => setNewPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSession}
                  variant="primary"
                  className="flex-1"
                  disabled={!newPhoneNumber.trim()}
                >
                  Add Account
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <FloatingProfilePanel
        isVisible={isProfilePanelVisible}
        onClose={() => setIsProfilePanelVisible(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}