'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 text-center px-4 bg-main-bg">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-bentosans font-medium mb-6 text-primary-text leading-tight"
          style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 24px rgba(0,0,0,0.18)',
            lineHeight: 1.1,
          }}
        >
          AI-powered warm lead hunting for faster deals, deeper conversations, and scalable outreach — with zero guesswork.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          className="text-secondary-text mb-10 max-w-2xl mx-auto font-inter font-normal"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.7rem)' }}
        >
          Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.07, boxShadow: '0 4px 32px 0 rgba(139, 92, 246, 0.18)' }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-full overflow-hidden shadow-lg"
          >
            <Link
              href="/auth"
              className="inline-flex items-center justify-center w-full h-full bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] text-white font-medium rounded-full px-10 py-5 text-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-border min-w-[220px] text-center group"
              aria-label="Start for Free"
              style={{
                boxShadow: '0 2px 24px 0 rgba(139, 92, 246, 0.18)',
                position: 'relative',
              }}
            >
              <span className="relative z-10 pr-4">Start for Free</span>
              <motion.span
                className="relative z-10 flex items-center"
                initial={{ x: 0 }}
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <svg
                  className="ml-2 w-6 h-6 text-white group-hover:text-[#8B5CF6] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  style={{ display: 'block', borderRadius: '9999px', background: 'transparent' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </motion.span>
              {/* Shimmer effect */}
              <span className="absolute left-0 top-0 w-full h-full rounded-full bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <style jsx>{`
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
} 