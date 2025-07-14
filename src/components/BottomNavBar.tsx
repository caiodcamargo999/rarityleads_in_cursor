"use client";

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ) },
  { href: '/leads', label: 'Leads', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 10-8 0 4 4 0 008 0zm6 4v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6" /></svg>
  ) },
  { href: '/profile', label: 'Profile', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ) },
];

const sessionItems = [
  { href: '/companies', label: 'Companies' },
  { href: '/whatsapp', label: 'WhatsApp' },
  { href: '/linkedin', label: 'LinkedIn' },
  { href: '/instagram', label: 'Instagram' },
  { href: '/facebook', label: 'Facebook' },
  { href: '/x', label: 'X (Twitter)' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/support', label: 'Support' },
];

export default function BottomNavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-sidebar-bg border-t border-border flex md:hidden justify-between items-center px-2 py-1 shadow-2xl">
      {/* Left icon */}
      <Link href="/dashboard" className={`flex flex-col items-center flex-1 py-2 ${pathname === '/dashboard' ? 'text-[#8B5CF6]' : 'text-primary-text'}`}>{navItems[0].icon}<span className="text-xs mt-1">Home</span></Link>
      {/* Center hamburger */}
      <button
        className="flex flex-col items-center flex-1 py-2 focus:outline-none"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        <span className="text-xs mt-1">Menu</span>
      </button>
      {/* Right icon */}
      <Link href="/leads" className={`flex flex-col items-center flex-1 py-2 ${pathname === '/leads' ? 'text-[#8B5CF6]' : 'text-primary-text'}`}>{navItems[1].icon}<span className="text-xs mt-1">Leads</span></Link>
      <Link href="/profile" className={`flex flex-col items-center flex-1 py-2 ${pathname === '/profile' ? 'text-[#8B5CF6]' : 'text-primary-text'}`}>{navItems[2].icon}<span className="text-xs mt-1">Profile</span></Link>
      {/* Modal/drawer for session options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm bg-card-bg rounded-t-2xl shadow-2xl p-6 pb-8 flex flex-col gap-4"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-3 right-4 p-2 rounded-full text-secondary-text hover:bg-button-bg focus:outline-none" onClick={() => setOpen(false)} aria-label="Close menu">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex flex-col gap-2 mt-4">
                {sessionItems.map(item => (
                  <Link key={item.href} href={item.href} className="w-full px-4 py-3 rounded-btn text-primary-text text-base font-medium hover:bg-button-bg transition-colors text-left" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 