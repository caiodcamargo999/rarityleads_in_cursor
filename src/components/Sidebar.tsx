'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface SidebarProps {
  user?: {
    name?: string;
    email?: string;
  };
  onProfileClick?: () => void;
}

export default function Sidebar({ user, onProfileClick }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    // Main Dashboard
    { href: '/dashboard', label: 'Dashboard', icon: 'home', page: 'dashboard' },
    
    // Prospecting Section
    { href: '/dashboard/prospecting/leads', label: 'Leads', icon: 'users', page: 'leads' },
    { href: '/dashboard/prospecting/companies', label: 'Companies', icon: 'briefcase', page: 'companies' },
    
    // Approaching Section
    { href: '/dashboard/approaching/whatsapp', label: 'WhatsApp', icon: 'message-circle', page: 'whatsapp' },
    { href: '/dashboard/approaching/instagram', label: 'Instagram', icon: 'instagram', page: 'instagram' },
    { href: '/dashboard/approaching/facebook', label: 'Facebook', icon: 'facebook', page: 'facebook' },
    { href: '/dashboard/approaching/x', label: 'X (Twitter)', icon: 'x', page: 'x' },
    { href: '/dashboard/approaching/linkedin', label: 'LinkedIn', icon: 'linkedin', page: 'linkedin' },
    
    // Management Section
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: 'target', page: 'campaigns' },
    { href: '/dashboard/conversations', label: 'Conversations', icon: 'message-square', page: 'conversations' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: 'bar-chart-2', page: 'analytics' },
    
    // Settings & Support
    { href: '/dashboard/settings', label: 'Settings', icon: 'settings', page: 'settings' },
    { href: '/dashboard/support', label: 'Support', icon: 'help-circle', page: 'support' },
  ];

  const getCurrentPage = () => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/prospecting/leads')) return 'leads';
    if (pathname.startsWith('/dashboard/prospecting/companies')) return 'companies';
    if (pathname.startsWith('/dashboard/approaching/whatsapp')) return 'whatsapp';
    if (pathname.startsWith('/dashboard/approaching/instagram')) return 'instagram';
    if (pathname.startsWith('/dashboard/approaching/facebook')) return 'facebook';
    if (pathname.startsWith('/dashboard/approaching/x')) return 'x';
    if (pathname.startsWith('/dashboard/approaching/linkedin')) return 'linkedin';
    if (pathname.startsWith('/dashboard/campaigns')) return 'campaigns';
    if (pathname.startsWith('/dashboard/conversations')) return 'conversations';
    if (pathname.startsWith('/dashboard/analytics')) return 'analytics';
    if (pathname.startsWith('/dashboard/settings')) return 'settings';
    if (pathname.startsWith('/dashboard/support')) return 'support';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      case 'message-circle':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
            <path d="M27 27h-4.5v-7c0-1.1-.9-2-2-2s-2 .9-2 2v7H9V12h4.5v2.1c.7-1.2 2.1-2.1 3.5-2.1 2.5 0 4.5 2 4.5 4.5v10.5ZM7 10.5A2.5 2.5 0 1 1 7 5a2.5 2.5 0 0 1 0 5Zm2.25 16.5H4.75V12h4.5v15ZM27 3H5C3.9 3 3 3.9 3 5v22c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
            <path d="M32 16c0-8.837-7.163-16-16-16S0 7.163 0 16c0 7.99 5.851 14.604 13.5 15.797V20.625h-4.062V16h4.062v-3.125c0-4.012 2.388-6.225 6.041-6.225 1.75 0 3.582.313 3.582.313v3.937h-2.018c-1.988 0-2.607 1.234-2.607 2.5V16h4.437l-.708 4.625h-3.729v11.172C26.149 30.604 32 23.99 32 16z" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'target':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'message-square':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'bar-chart-2':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'help-circle':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-sidebar-bg border border-border rounded-btn p-2 text-primary-text"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-sidebar-bg border-r border-border z-40 transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 w-64`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-button-bg rounded-btn flex items-center justify-center mr-3">
              <span className="text-primary-text font-medium text-sm">R</span>
            </div>
            <span className="text-primary-text font-medium">Rarity Leads</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {/* Main Navigation */}
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-sidebar-link-active text-primary-text border-l-3 border-primary-text'
                    : 'text-sidebar-text hover:bg-sidebar-link-hover hover:text-primary-text'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{getIcon('home')}</span>
                Dashboard
              </Link>
            </li>

            {/* Prospecting Section */}
            <li className="px-6 py-2 mt-6">
              <span className="text-xs font-medium text-sidebar-text-secondary uppercase tracking-wider">
                Prospecting
              </span>
            </li>
            {navigationItems.slice(1, 3).map((item) => (
              <li key={item.page}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                    currentPage === item.page
                      ? 'bg-sidebar-link-active text-primary-text border-l-3 border-primary-text'
                      : 'text-sidebar-text hover:bg-sidebar-link-hover hover:text-primary-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Approaching Section */}
            <li className="px-6 py-2 mt-6">
              <span className="text-xs font-medium text-sidebar-text-secondary uppercase tracking-wider">
                Approaching
              </span>
            </li>
            {navigationItems.slice(3, 8).map((item) => (
              <li key={item.page}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                    currentPage === item.page
                      ? 'bg-sidebar-link-active text-primary-text border-l-3 border-primary-text'
                      : 'text-sidebar-text hover:bg-sidebar-link-hover hover:text-primary-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Management Section */}
            <li className="px-6 py-2 mt-6">
              <span className="text-xs font-medium text-sidebar-text-secondary uppercase tracking-wider">
                Management
              </span>
            </li>
            {navigationItems.slice(8, 11).map((item) => (
              <li key={item.page}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                    currentPage === item.page
                      ? 'bg-sidebar-link-active text-primary-text border-l-3 border-primary-text'
                      : 'text-sidebar-text hover:bg-sidebar-link-hover hover:text-primary-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Settings & Support Section */}
            <li className="px-6 py-2 mt-6">
              <span className="text-xs font-medium text-sidebar-text-secondary uppercase tracking-wider">
                Settings & Support
              </span>
            </li>
            {navigationItems.slice(11).map((item) => (
              <li key={item.page}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                    currentPage === item.page
                      ? 'bg-sidebar-link-active text-primary-text border-l-3 border-primary-text'
                      : 'text-sidebar-text hover:bg-sidebar-link-hover hover:text-primary-text'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{getIcon(item.icon)}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-border p-4">
          <button
            onClick={onProfileClick}
            className="flex items-center w-full p-3 rounded-btn hover:bg-button-bg transition-colors"
          >
            <div className="w-8 h-8 bg-button-bg rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-text font-medium text-sm">{getUserInitial()}</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-primary-text">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-secondary-text">
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <svg className="w-4 h-4 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 