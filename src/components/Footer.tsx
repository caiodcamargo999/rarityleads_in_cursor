'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      className="text-center py-8 px-4 border-t border-border"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      role="contentinfo"
    >
      <p className="text-secondary-text">
        &copy; 2024 Rarity Leads. All rights reserved.
      </p>
    </motion.footer>
  );
} 