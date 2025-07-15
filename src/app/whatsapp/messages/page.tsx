"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import WhatsAppAccountDropdown from "@/components/whatsapp/WhatsAppAccountDropdown";
import WhatsAppLeadsList from "@/components/whatsapp/WhatsAppLeadsList";
import WhatsAppChatWindow from "@/components/whatsapp/WhatsAppChatWindow";
import { getSupabase } from "@/lib/supabase";

interface WhatsAppAccount {
  id: string;
  phone_number: string;
  session_name: string;
  status: 'active' | 'inactive' | 'connecting' | 'expired' | 'error';
}

interface Lead {
  id: string;
  name: string;
  phone_number: string;
  company?: string;
  avatar?: string;
  last_message?: {
    content: string;
    timestamp: string;
    direction: 'in' | 'out';
  };
  unread_count?: number;
  status?: 'active' | 'inactive' | 'blocked';
}

interface User {
  id: string;
  name?: string;
  email?: string;
}

export default function WhatsAppMessagesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchUserAndAccounts = async () => {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);
      await loadAccounts(user.id);
    };

    fetchUserAndAccounts();
  }, [router]);

  const loadAccounts = async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("whatsapp_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const formattedAccounts = data.map(item => ({
          id: String(item.id),
          phone_number: item.phone_number || '',
          session_name: String(item.session_name || `Sessão ${item.id}`),
          status: item.status as 'active' | 'inactive' | 'connecting' | 'expired' | 'error',
        }));

        setAccounts(formattedAccounts);
        
        // Auto-select first active account
        if (formattedAccounts.length > 0) {
          setSelectedAccount(formattedAccounts[0]);
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleCloseChat = () => {
    if (isMobile) {
      setShowChat(false);
    }
    setSelectedLead(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg flex">
        <Sidebar user={user ? { name: user.name, email: user.email } : undefined} onProfileClick={() => {}} />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-text"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar user={user ? { name: user.name, email: user.email } : undefined} onProfileClick={() => {}} />
      
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <div className="bg-card-bg border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/whatsapp')}
                className="text-secondary-text hover:text-primary-text transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl font-medium text-primary-text">WhatsApp Messages</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <WhatsAppAccountDropdown
                  accounts={accounts}
                  selectedAccount={selectedAccount}
                  onSelectAccount={setSelectedAccount}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Leads Sidebar */}
          <div className={`${isMobile ? (showChat ? 'hidden' : 'w-full') : 'w-80'} border-r border-border bg-main-bg flex flex-col`}>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar leads..."
                  className="w-full pl-10 pr-4 py-2 bg-card-bg border border-border rounded-lg text-primary-text placeholder-secondary-text"
                />
              </div>
            </div>
            
            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-4">
              <WhatsAppLeadsList
                selectedLead={selectedLead}
                onSelectLead={handleSelectLead}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className={`${isMobile ? (showChat ? 'w-full' : 'hidden') : 'flex-1'} flex flex-col`}>
            {accounts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-secondary-text text-center">
                <div>
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg mb-2">Nenhuma conta WhatsApp conectada</p>
                  <p className="text-sm">
                    Conecte uma conta WhatsApp para começar a conversar com leads
                  </p>
                  <button
                    onClick={() => router.push('/whatsapp')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Conectar Conta
                  </button>
                </div>
              </div>
            ) : (
              <WhatsAppChatWindow
                selectedLead={selectedLead}
                selectedAccount={selectedAccount}
                onClose={handleCloseChat}
              />
            )}
          </div>
        </div>
      </main>

      <FloatingProfilePanel />
    </div>
  );
}