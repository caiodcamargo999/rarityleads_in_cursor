'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <motion.section
      className="py-16 md:py-20 px-4 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-medium mb-6 text-primary-text font-bentosans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
        >
          Ready to Build Your Unfair Advantage?
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-secondary-text mb-8 font-normal max-w-2xl mx-auto font-inter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
        >
          Join high-growth companies that trust Rarity Leads to build their sales pipeline on autopilot.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.07, boxShadow: '0 4px 32px 0 rgba(139, 92, 246, 0.18)' }}
          whileTap={{ scale: 0.97 }}
          className="relative rounded-full overflow-hidden shadow-lg inline-block"
        >
          <Link
            href="/auth?cta=final"
            className="inline-flex items-center justify-center w-full h-full bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] text-white font-medium rounded-full px-10 py-5 text-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-border min-w-[220px] text-center group"
            aria-label="Get Started for Free"
            style={{
              boxShadow: '0 2px 24px 0 rgba(139, 92, 246, 0.18)',
              position: 'relative',
            }}
          >
            <span className="relative z-10 pr-4">Get Started for Free</span>
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
    </motion.section>
  );
} 