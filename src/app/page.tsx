'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A23]">
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0A23]/95 backdrop-blur-lg border-b border-[#232336]' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-2xl font-medium text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Rarity Leads
            </motion.div>
            <div className="flex items-center gap-8">
              <Link href="/features" className="text-[#e0e0e0] hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-[#e0e0e0] hover:text-white transition-colors">
                Pricing
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  href="/auth" 
                  className="px-6 py-2.5 bg-[#232336] text-white rounded-full hover:bg-[#2a2a3f] transition-colors"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A23] via-[#232136] to-[#0A0A23]" />
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundImage: [
                'radial-gradient(circle at 20% 50%, #8B5CF6 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, #8B5CF6 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, #8B5CF6 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div 
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-medium text-white mb-6 leading-tight"
            variants={fadeInUp}
          >
            AI-powered warm lead hunting
            <br />
            <span className="text-[#8B5CF6]">for faster deals</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-[#e0e0e0] mb-12 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/auth" 
                className="px-8 py-4 bg-[#8B5CF6] text-white rounded-full text-lg font-medium hover:bg-[#7C3AED] transition-colors inline-block"
              >
                Start for Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/demo" 
                className="px-8 py-4 bg-[#232336] text-white rounded-full text-lg font-medium hover:bg-[#2a2a3f] transition-colors inline-block"
              >
                Watch Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
            variants={staggerContainer}
          >
            {[
              { value: '95%', label: 'Lead Accuracy' },
              { value: '10x', label: 'Faster Outreach' },
              { value: '24/7', label: 'AI Assistant' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl font-medium text-[#8B5CF6] mb-2">{stat.value}</div>
                <div className="text-[#b0b0b0]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">
              Everything you need to close more deals
            </h2>
            <p className="text-xl text-[#e0e0e0]">
              Powered by AI, designed for growth
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'AI-Powered SDR',
                description: 'Automatically qualify leads with our AI that understands your ideal customer profile.',
                icon: '🤖'
              },
              {
                title: 'Multi-Channel Outreach',
                description: 'WhatsApp, LinkedIn, Instagram, and more - reach prospects where they are.',
                icon: '📱'
              },
              {
                title: 'Smart Analytics',
                description: 'Real-time insights on what\'s working and what\'s not in your campaigns.',
                icon: '📊'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#18181c] border border-[#232336] rounded-2xl p-8 hover:border-[#8B5CF6]/50 transition-colors"
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-[#b0b0b0]">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <motion.div 
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6">
            Stop Chasing Leads. Start Closing.
          </h2>
          <p className="text-xl text-[#e0e0e0] mb-8">
            Join thousands of teams using Rarity Leads to accelerate their sales
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/auth" 
              className="px-8 py-4 bg-[#8B5CF6] text-white rounded-full text-lg font-medium hover:bg-[#7C3AED] transition-colors inline-block"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232336] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="text-[#b0b0b0]">
              © 2024 Rarity Leads. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-[#b0b0b0] hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-[#b0b0b0] hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
