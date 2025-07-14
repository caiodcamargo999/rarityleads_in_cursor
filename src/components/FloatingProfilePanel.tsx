'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRef } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Language } from '@/lib/LanguageContext';

interface FloatingProfilePanelProps {
  user?: {
    name?: string;
    email?: string;
  };
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MoonIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
);
const SunIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41"/></svg>
);

export default function FloatingProfilePanel({ 
  user, 
  isVisible, 
  onClose, 
  onLogout 
}: FloatingProfilePanelProps) {
  // Remover estados locais de theme/language
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'pt-BR', name: 'PT' },
    { code: 'es', name: 'ES' },
    { code: 'fr', name: 'FR' },
  ];

  // Persistência de tema e idioma
  const handleThemeChange = (t: string) => {
    setTheme(t);
    if (typeof window !== 'undefined') localStorage.setItem('theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  };
  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    if (typeof window !== 'undefined') localStorage.setItem('lang', code);
  };

  // Upload de avatar (apenas preview local)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Close profile panel"
      />
      {/* Panel - alinhado à direita, estilo Anthropic */}
      <div className="fixed bottom-6 right-6 z-50 w-80 max-w-[95vw] bg-card-bg border border-border rounded-xl shadow-2xl animate-fadeIn flex flex-col"
        style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.24)' }}
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-secondary-text hover:bg-button-bg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
          aria-label="Close profile panel"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <div className="w-12 h-12 bg-button-bg rounded-full flex items-center justify-center border border-border overflow-hidden cursor-pointer group" onClick={() => fileInputRef.current?.click()} tabIndex={0} aria-label="Upload avatar">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-text font-medium text-lg">{getUserInitial()}</span>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span className="absolute bottom-0 right-0 bg-sidebar-bg text-xs px-1 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity">Edit</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-primary-text truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-secondary-text truncate">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
        {/* Content */}
        <div className="p-2 flex flex-col gap-2">
          {/* Profile & Settings */}
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm text-primary-text hover:bg-button-bg rounded-btn transition-colors"
            onClick={onClose}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile & Settings
          </Link>
          {/* Language Selector */}
          <div className="px-3 py-2">
            <div className="text-xs text-secondary-text mb-2">Language</div>
            <div className="flex gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as Language)}
                  className={`px-2 py-1 text-xs rounded-btn transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${
                    language === lang.code
                      ? 'bg-button-bg text-primary-text border-[#8B5CF6]' : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
          {/* Theme Toggle */}
          <div className="px-3 py-2">
            <div className="text-xs text-secondary-text mb-2">Theme</div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-full transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${theme === 'dark' ? 'bg-button-bg text-primary-text border-[#8B5CF6]' : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'}`}
                aria-label="Switch to dark mode"
              >
                <MoonIcon />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-full transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] ${theme === 'light' ? 'bg-button-bg text-primary-text border-[#8B5CF6]' : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'}`}
                aria-label="Switch to light mode"
              >
                <SunIcon />
              </button>
            </div>
          </div>
          {/* Logout */}
          <div className="border-t border-border mt-2 pt-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-secondary-text hover:bg-button-bg rounded-btn transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 