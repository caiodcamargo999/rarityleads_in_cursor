'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FloatingProfilePanelProps {
  user?: {
    name?: string;
    email?: string;
  };
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function FloatingProfilePanel({ 
  user, 
  isVisible, 
  onClose, 
  onLogout 
}: FloatingProfilePanelProps) {
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

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
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed bottom-4 left-4 z-50 w-80 bg-card-bg border border-border rounded-card shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-button-bg rounded-full flex items-center justify-center border border-border">
              <span className="text-primary-text font-medium text-sm">
                {getUserInitial()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary-text truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-secondary-text truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2">
          {/* Profile & Settings */}
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm text-primary-text hover:bg-button-bg rounded-btn transition-colors"
            onClick={onClose}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile & Settings
          </Link>

          {/* Language Selector */}
          <div className="px-3 py-2">
            <div className="text-xs text-secondary-text mb-2">Language</div>
            <div className="flex flex-wrap gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs rounded-btn transition-colors ${
                    language === lang.code
                      ? 'bg-button-bg text-primary-text'
                      : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'
                  }`}
                >
                  {lang.flag} {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="px-3 py-2">
            <div className="text-xs text-secondary-text mb-2">Theme</div>
            <div className="flex gap-1">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 text-xs rounded-btn transition-colors ${
                  theme === 'dark'
                    ? 'bg-button-bg text-primary-text'
                    : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'
                }`}
              >
                🌙 Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 text-xs rounded-btn transition-colors ${
                  theme === 'light'
                    ? 'bg-button-bg text-primary-text'
                    : 'text-secondary-text hover:bg-button-bg hover:text-primary-text'
                }`}
              >
                ☀️ Light
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
              className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-btn transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 