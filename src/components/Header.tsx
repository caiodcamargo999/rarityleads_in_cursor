'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Solution', href: '#solution' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-lg bg-sidebar-bg/80 shadow-xl border-b border-border'
          : 'backdrop-blur bg-sidebar-bg/60 border-b border-border'
      }`}
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <nav className="w-full">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-8 gap-8 h-20 min-h-[72px] py-0">
          {/* Logo */}
          <Link href="/" className="text-2xl font-medium text-primary-text no-underline tracking-wide transition-colors hover:text-secondary-text">
            Rarity Leads
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center h-full">
            {navLinks.map((item) => (
              <motion.li
                key={item.label}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="relative h-full flex items-center"
              >
                <Link
                  href={item.href}
                  className="text-primary-text no-underline font-normal text-base transition-colors hover:text-secondary-text px-2 py-0 flex items-center h-full"
                >
                  {item.label}
                  <motion.span
                    className="block h-0.5 bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] mt-1 rounded-full origin-left"
                    layoutId="nav-underline"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center h-full">
            <motion.div whileHover={{ scale: 1.06, boxShadow: '0 2px 16px 0 rgba(139, 92, 246, 0.12)' }} whileTap={{ scale: 0.97 }} className="h-full flex items-center">
              <Link
                href="/auth?mode=login"
                className="rounded-full border border-[#8B5CF6] px-7 py-0 text-base font-medium text-primary-text bg-transparent transition-all duration-300 hover:bg-[#232336] hover:text-white h-12 flex items-center focus:outline-none"
                aria-label="Login"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08, boxShadow: '0 2px 24px 0 rgba(139, 92, 246, 0.18)' }} whileTap={{ scale: 0.97 }} className="h-full flex items-center">
              <Link
                href="/auth?mode=signup"
                className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] px-7 py-0 text-base font-medium text-white transition-all duration-300 h-12 flex items-center focus:outline-none"
                aria-label="Sign Up"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>
      <style jsx>{`
        header { box-shadow: 0 2px 24px 0 rgba(0,0,0,0.08); }
      `}</style>
    </motion.header>
  );
} 