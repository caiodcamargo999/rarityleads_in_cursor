'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-sidebar-bg border-b border-border z-50 font-sans">
      <nav className="w-full">
        <div className="flex items-center justify-between max-w-6xl mx-auto px-8 py-5 gap-8">
          {/* Logo */}
          <Link href="/" className="text-2xl font-medium text-primary-text no-underline tracking-wide transition-colors hover:text-secondary-text">
            Rarity Leads
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className="hidden md:hidden bg-transparent border-none text-primary-text cursor-pointer p-2 rounded-btn transition-colors hover:bg-button-bg"
            aria-label="Toggle Menu"
          >
            <svg 
              className={`w-6 h-6 transition-all ${isMenuOpen ? 'hidden' : 'block'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg 
              className={`w-6 h-6 transition-all ${isMenuOpen ? 'block' : 'hidden'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
            <li><a href="#features" className="text-primary-text no-underline font-normal text-sm transition-colors hover:text-secondary-text">Features</a></li>
            <li><a href="#solution" className="text-primary-text no-underline font-normal text-sm transition-colors hover:text-secondary-text">Solution</a></li>
            <li><a href="#pricing" className="text-primary-text no-underline font-normal text-sm transition-colors hover:text-secondary-text">Pricing</a></li>
            <li><a href="#about" className="text-primary-text no-underline font-normal text-sm transition-colors hover:text-secondary-text">About</a></li>
          </ul>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/auth" className="bg-transparent text-primary-text border border-border rounded-btn px-6 py-2 font-medium text-sm no-underline transition-colors hover:bg-button-bg">
              Login
            </Link>
            <Link href="/auth" className="bg-button-bg text-button-text border-none rounded-btn px-6 py-2 font-medium text-sm no-underline transition-colors hover:bg-button-hover-bg">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-sidebar-bg border-b border-border">
            <div className="px-8 py-6 space-y-6">
              <ul className="space-y-4">
                <li><a href="#features" onClick={closeMenu} className="block text-primary-text no-underline font-normal py-3 border-b border-border transition-colors hover:text-secondary-text">Features</a></li>
                <li><a href="#solution" onClick={closeMenu} className="block text-primary-text no-underline font-normal py-3 border-b border-border transition-colors hover:text-secondary-text">Solution</a></li>
                <li><a href="#pricing" onClick={closeMenu} className="block text-primary-text no-underline font-normal py-3 border-b border-border transition-colors hover:text-secondary-text">Pricing</a></li>
                <li><a href="#about" onClick={closeMenu} className="block text-primary-text no-underline font-normal py-3 border-b border-border transition-colors hover:text-secondary-text">About</a></li>
              </ul>
              <div className="space-y-3 pt-4">
                <Link href="/auth" onClick={closeMenu} className="block w-full bg-transparent text-primary-text border border-border rounded-btn px-6 py-3 font-medium text-center no-underline transition-colors hover:bg-button-bg">
                  Login
                </Link>
                <Link href="/auth" onClick={closeMenu} className="block w-full bg-button-bg text-button-text border-none rounded-btn px-6 py-3 font-medium text-center no-underline transition-colors hover:bg-button-hover-bg">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
} 