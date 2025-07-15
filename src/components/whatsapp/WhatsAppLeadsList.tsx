"use client";

import { useState, useEffect } from "react";

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

interface WhatsAppLeadsListProps {
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
  searchTerm: string;
}

export default function WhatsAppLeadsList({
  selectedLead,
  onSelectLead,
  searchTerm,
}: WhatsAppLeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      // This would connect to your backend API
      const response = await fetch('http://localhost:3001/api/leads/whatsapp');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone_number.includes(searchTerm) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-text"></div>
      </div>
    );
  }

  if (filteredLeads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-secondary-text">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-center">
          {searchTerm ? 'Nenhum lead encontrado' : 'Nenhum lead ainda'}
        </p>
        <p className="text-sm text-center mt-1">
          {searchTerm ? 'Tente alterar os termos de busca' : 'Leads aparecerão aqui quando receberem mensagens'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredLeads.map((lead) => (
        <button
          key={lead.id}
          onClick={() => onSelectLead(lead)}
          className={`w-full text-left p-4 rounded-lg transition-colors ${
            selectedLead?.id === lead.id
              ? 'bg-card-bg border border-border'
              : 'hover:bg-card-bg'
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-main-bg rounded-full flex items-center justify-center">
                {lead.avatar ? (
                  <img src={lead.avatar} alt={lead.name} className="w-full h-full rounded-full" />
                ) : (
                  <div className="text-primary-text font-medium">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {lead.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-main-bg"></div>
              )}
            </div>

            {/* Lead Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-primary-text font-medium truncate">
                  {lead.name}
                </div>
                <div className="flex items-center space-x-2">
                  {lead.last_message && (
                    <div className="text-xs text-secondary-text">
                      {formatTime(lead.last_message.timestamp)}
                    </div>
                  )}
                  {lead.unread_count && lead.unread_count > 0 && (
                    <div className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {lead.unread_count > 99 ? '99+' : lead.unread_count}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-secondary-text truncate">
                {lead.company || lead.phone_number}
              </div>
              
              {lead.last_message && (
                <div className="flex items-center space-x-1 mt-1">
                  {lead.last_message.direction === 'out' && (
                    <svg className="w-3 h-3 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  <div className="text-sm text-secondary-text truncate">
                    {truncateMessage(lead.last_message.content)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}