"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import WhatsAppQRCodeModal from "@/components/whatsapp/WhatsAppQRCodeModal";
import WhatsAppAccountDropdown from "@/components/whatsapp/WhatsAppAccountDropdown";
import { getSupabase } from "@/lib/supabase";

interface WhatsAppSession {
  id: string;
  phone_number: string | null;
  session_name: string;
  status: 'active' | 'inactive' | 'connecting' | 'expired' | 'error';
  created_at: string;
  last_seen: string | null;
  qr_code: string | null;
}

interface User {
  id: string;
  name?: string;
  email?: string;
}

export default function WhatsAppPage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndSessions = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      
      setUser(user);
      await loadSessions();
    };

    fetchUserAndSessions();
  }, [router]);

  const loadSessions = async () => {
    const supabase = getSupabase();
    if (!supabase || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSessions(data.map(item => ({
          id: String(item.id),
          phone_number: item.phone_number ? String(item.phone_number) : null,
          session_name: String(item.session_name || `Sessão ${item.id}`),
          status: item.status as 'active' | 'inactive' | 'connecting' | 'expired' | 'error',
          created_at: String(item.created_at),
          last_seen: item.last_seen ? String(item.last_seen) : null,
          qr_code: item.qr_code ? String(item.qr_code) : null,
        })));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionName.trim() || !user) return;

    const supabase = getSupabase();
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("whatsapp_sessions")
        .insert({
          user_id: user.id,
          session_name: newSessionName.trim(),
          status: 'inactive'
        })
        .select()
        .single();

      if (!error && data) {
        const newSession: WhatsAppSession = {
          id: String(data.id),
          phone_number: data.phone_number ? String(data.phone_number) : null,
          session_name: String(data.session_name),
          status: data.status,
          created_at: String(data.created_at),
          last_seen: data.last_seen ? String(data.last_seen) : null,
          qr_code: data.qr_code ? String(data.qr_code) : null,
        };

        setSessions([newSession, ...sessions]);
        setNewSessionName('');
        setShowAddSession(false);
      }
    } catch (error) {
      console.error('Error adding session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowQRModal(true);
  };

  const handleDisconnectSession = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sessions/${sessionId}/disconnect`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSessions(sessions.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'inactive' }
            : session
        ));
      }
    } catch (error) {
      console.error('Error disconnecting session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta sessão?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("whatsapp_sessions")
        .delete()
        .eq("id", sessionId);

      if (!error) {
        setSessions(sessions.filter(session => session.id !== sessionId));
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'inactive': return 'text-red-400';
      case 'expired': return 'text-orange-400';
      case 'error': return 'text-red-500';
      default: return 'text-secondary-text';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'inactive': return 'Desconectado';
      case 'expired': return 'Expirado';
      case 'error': return 'Erro';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'connecting': return '🔄';
      case 'inactive': return '❌';
      case 'expired': return '⏰';
      case 'error': return '⚠️';
      default: return '❓';
    }
  };

  const activeSessions = sessions.filter(session => session.status === 'active');

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar user={user ? { name: user.name, email: user.email } : undefined} onProfileClick={() => {}} />
      
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-medium text-primary-text">WhatsApp</h1>
              <p className="text-secondary-text mt-1">
                Gerencie suas contas WhatsApp e converse com leads
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddSession(true)}
                className="bg-main-bg border border-border text-primary-text px-4 py-2 rounded-lg hover:bg-border transition-colors"
              >
                + Nova Conta
              </button>
              <button
                onClick={() => router.push('/whatsapp/messages')}
                disabled={activeSessions.length === 0}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeSessions.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-main-bg border border-border text-secondary-text cursor-not-allowed'
                }`}
              >
                Abrir Mensagens
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card-bg border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-text text-sm">Contas Conectadas</p>
                  <p className="text-2xl font-medium text-primary-text">{activeSessions.length}</p>
                </div>
                <div className="text-green-400 text-2xl">📱</div>
              </div>
            </div>
            <div className="bg-card-bg border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-text text-sm">Total de Contas</p>
                  <p className="text-2xl font-medium text-primary-text">{sessions.length}</p>
                </div>
                <div className="text-blue-400 text-2xl">🔗</div>
              </div>
            </div>
            <div className="bg-card-bg border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-text text-sm">Mensagens Hoje</p>
                  <p className="text-2xl font-medium text-primary-text">0</p>
                </div>
                <div className="text-yellow-400 text-2xl">💬</div>
              </div>
            </div>
          </div>

          {/* Add Session Form */}
          {showAddSession && (
            <div className="bg-card-bg border border-border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-primary-text mb-4">Nova Conta WhatsApp</h3>
              <form onSubmit={handleAddSession} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  placeholder="Nome da conta (ex: Vendas, Suporte, etc.)"
                  className="flex-1 bg-main-bg border border-border rounded-lg px-4 py-2 text-primary-text placeholder-secondary-text"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSession(false)}
                  className="bg-main-bg border border-border text-primary-text px-4 py-2 rounded-lg hover:bg-border transition-colors"
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}

          {/* Sessions List */}
          <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-medium text-primary-text">Contas WhatsApp</h2>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-text"></div>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-secondary-text mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">Nenhuma conta WhatsApp configurada</p>
                    <p className="text-sm mt-2">Clique em "Nova Conta" para começar</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-main-bg rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getStatusIcon(session.status)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-primary-text">{session.session_name}</h3>
                            <span className={`text-sm ${getStatusColor(session.status)}`}>
                              {getStatusText(session.status)}
                            </span>
                          </div>
                          <div className="text-secondary-text text-sm">
                            {session.phone_number || 'Número não configurado'}
                          </div>
                          <div className="text-secondary-text text-xs">
                            Criado em: {new Date(session.created_at).toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {session.status === 'inactive' && (
                          <button
                            onClick={() => handleConnectSession(session.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            Conectar
                          </button>
                        )}
                        
                        {session.status === 'active' && (
                          <button
                            onClick={() => handleDisconnectSession(session.id)}
                            className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                          >
                            Desconectar
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQRModal && selectedSessionId && (
        <WhatsAppQRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          sessionId={selectedSessionId}
          onConnected={() => {
            loadSessions();
            setShowQRModal(false);
          }}
        />
      )}

      <FloatingProfilePanel />
    </div>
  );
} 