"use client";

import { useState } from "react";

interface WhatsAppAccount {
  id: string;
  phone_number: string;
  session_name: string;
  status: 'active' | 'inactive' | 'connecting' | 'expired' | 'error';
}

interface WhatsAppAccountDropdownProps {
  accounts: WhatsAppAccount[];
  selectedAccount: WhatsAppAccount | null;
  onSelectAccount: (account: WhatsAppAccount) => void;
  disabled?: boolean;
}

export default function WhatsAppAccountDropdown({
  accounts,
  selectedAccount,
  onSelectAccount,
  disabled = false,
}: WhatsAppAccountDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      case 'expired': return 'bg-orange-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
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

  const activeAccounts = accounts.filter(account => account.status === 'active');

  if (activeAccounts.length === 0) {
    return (
      <div className="bg-main-bg border border-border rounded-lg p-3 text-secondary-text">
        Nenhuma conta WhatsApp conectada
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full bg-main-bg border border-border rounded-lg p-3 text-left flex items-center justify-between transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-border'
        }`}
      >
        <div className="flex items-center space-x-3">
          {selectedAccount ? (
            <>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedAccount.status)}`} />
              <div>
                <div className="text-primary-text font-medium">
                  {selectedAccount.phone_number || selectedAccount.session_name}
                </div>
                <div className="text-secondary-text text-sm">
                  {getStatusText(selectedAccount.status)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-secondary-text">Selecione uma conta</div>
          )}
        </div>
        <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card-bg border border-border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {activeAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  onSelectAccount(account);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-main-bg transition-colors flex items-center space-x-3 ${
                  selectedAccount?.id === account.id ? 'bg-main-bg' : ''
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${getStatusColor(account.status)}`} />
                <div>
                  <div className="text-primary-text font-medium">
                    {account.phone_number || account.session_name}
                  </div>
                  <div className="text-secondary-text text-sm">
                    {getStatusText(account.status)}
                  </div>
                </div>
                {selectedAccount?.id === account.id && (
                  <div className="ml-auto text-primary-text">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}