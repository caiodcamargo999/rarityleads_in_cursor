"use client";

import { useState, useEffect, useRef } from "react";
import WhatsAppMessageInput from "./WhatsAppMessageInput";

interface Message {
  id: string;
  direction: 'in' | 'out';
  content: {
    text?: string;
    image?: string;
    audio?: string;
    video?: string;
    document?: string;
  };
  message_type: 'text' | 'image' | 'audio' | 'video' | 'document';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  phone_number: string;
}

interface Lead {
  id: string;
  name: string;
  phone_number: string;
  company?: string;
  avatar?: string;
}

interface WhatsAppChatWindowProps {
  selectedLead: Lead | null;
  selectedAccount: { id: string; phone_number: string } | null;
  onClose: () => void;
}

export default function WhatsAppChatWindow({
  selectedLead,
  selectedAccount,
  onClose,
}: WhatsAppChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedLead && selectedAccount) {
      loadMessages();
    }
  }, [selectedLead, selectedAccount]);

  const loadMessages = async () => {
    if (!selectedLead || !selectedAccount) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/messages?phone_number=${selectedLead.phone_number}&session_id=${selectedAccount.id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' | 'video' | 'document' = 'text') => {
    if (!selectedLead || !selectedAccount || !content.trim()) return;

    const tempMessage: Message = {
      id: Date.now().toString(),
      direction: 'out',
      content: { text: content },
      message_type: type,
      status: 'sent',
      created_at: new Date().toISOString(),
      phone_number: selectedLead.phone_number,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch('http://localhost:3001/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: selectedAccount.id,
          phone_number: selectedLead.phone_number,
          content: content,
          type: type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, id: data.message_id, status: 'delivered' }
              : msg
          )
        );
      } else {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...msg, status: 'failed' }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      case 'failed': return '⚠';
      default: return '';
    }
  };

  const getMessageStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-gray-400';
      case 'delivered': return 'text-gray-400';
      case 'read': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!selectedLead || !selectedAccount) {
    return (
      <div className="h-full flex items-center justify-center text-secondary-text">
        Selecione um lead e uma conta para iniciar a conversa
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-main-bg">
      {/* Header */}
      <div className="bg-card-bg border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-main-bg rounded-full flex items-center justify-center">
            {selectedLead.avatar ? (
              <img src={selectedLead.avatar} alt={selectedLead.name} className="w-full h-full rounded-full" />
            ) : (
              <div className="text-primary-text font-medium">
                {selectedLead.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="text-primary-text font-medium">{selectedLead.name}</div>
            <div className="text-secondary-text text-sm">{selectedLead.phone_number}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-secondary-text hover:text-primary-text transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-text"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-secondary-text">
            Nenhuma mensagem ainda. Inicie a conversa!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.direction === 'out' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.direction === 'out'
                    ? 'bg-blue-600 text-white'
                    : 'bg-card-bg text-primary-text'
                }`}
              >
                <div className="text-sm">{message.content.text}</div>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="text-xs opacity-70">
                    {formatTime(message.created_at)}
                  </span>
                  {message.direction === 'out' && (
                    <span className={`text-xs ${getMessageStatusColor(message.status)}`}>
                      {getMessageStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card-bg text-primary-text max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-secondary-text rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-secondary-text rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-secondary-text rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4">
        <WhatsAppMessageInput
          onSendMessage={sendMessage}
          disabled={!selectedAccount || selectedAccount.id === ''}
        />
      </div>
    </div>
  );
}