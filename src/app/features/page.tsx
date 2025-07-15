'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

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

const features = {
  prospecting: {
    title: 'AI-Powered Lead Discovery',
    description: 'Find and qualify your ideal customers with precision',
    icon: '🎯',
    capabilities: [
      {
        name: 'Multi-Source Enrichment',
        description: 'Pull data from Clearbit, Apollo, LinkedIn, and Crunchbase simultaneously'
      },
      {
        name: 'AI Scoring (0-100)',
        description: 'Intelligent lead ranking based on company size, industry, engagement, and decision-maker level'
      },
      {
        name: 'Decision Maker Extraction',
        description: 'Automatically identify C-suite executives and key decision makers with contact info'
      },
      {
        name: 'Real-time Data',
        description: 'Always up-to-date company information, funding status, and tech stack'
      }
    ]
  },
  messaging: {
    title: 'Multi-Channel Outreach',
    description: 'Reach prospects where they are, at scale',
    icon: '📱',
    capabilities: [
      {
        name: 'WhatsApp Multi-Account',
        description: 'Connect unlimited WhatsApp accounts with QR code scanning and persistent sessions'
      },
      {
        name: 'Social Channel Integration',
        description: 'Direct messaging on Instagram, Facebook, X (Twitter), and LinkedIn'
      },
      {
        name: 'Smart Fallback Logic',
        description: 'Automatic channel switching: WhatsApp → Instagram → LinkedIn → X → Facebook'
      },
      {
        name: 'Template Library',
        description: 'Pre-built and AI-generated message templates for every scenario'
      }
    ]
  },
  ai: {
    title: 'AI Writing Assistant',
    description: 'Never stare at a blank message again',
    icon: '🤖',
    capabilities: [
      {
        name: 'Personalized Messages',
        description: 'AI crafts unique messages based on lead data and context'
      },
      {
        name: 'Multi-Language Support',
        description: 'Communicate in any language with native-level fluency'
      },
      {
        name: 'Sequence Builder',
        description: 'Create intelligent follow-up sequences that adapt to responses'
      },
      {
        name: 'Tone Matching',
        description: 'Adjust messaging style to match your brand voice'
      }
    ]
  },
  automation: {
    title: 'Intelligent Automation',
    description: 'Work smarter, not harder',
    icon: '⚡',
    capabilities: [
      {
        name: 'Campaign Orchestration',
        description: 'Set up multi-step campaigns that run on autopilot'
      },
      {
        name: 'Smart Timing',
        description: 'Messages sent at optimal times based on recipient timezone and behavior'
      },
      {
        name: 'Auto-Qualification',
        description: 'Leads automatically move through your pipeline based on engagement'
      },
      {
        name: 'Human Handoff',
        description: 'Seamlessly transfer hot leads to your sales team'
      }
    ]
  },
  analytics: {
    title: 'Real-Time Analytics',
    description: 'Data-driven decisions at your fingertips',
    icon: '📊',
    capabilities: [
      {
        name: 'Pipeline Visualization',
        description: 'See your entire sales funnel from cold to closed'
      },
      {
        name: 'Channel Performance',
        description: 'Compare effectiveness across all messaging channels'
      },
      {
        name: 'AI Recommendations',
        description: 'Get actionable insights on what to do next'
      },
      {
        name: 'Custom Reports',
        description: 'Export detailed reports for stakeholders'
      }
    ]
  },
  api: {
    title: 'Open API Access',
    description: 'Connect your entire tech stack',
    icon: '🔌',
    capabilities: [
      {
        name: 'RESTful API',
        description: 'Full programmatic access to leads, campaigns, and messages'
      },
      {
        name: 'Webhook Events',
        description: 'Real-time notifications for lead updates and message events'
      },
      {
        name: 'CRM Integration',
        description: 'Push and pull data from any CRM via our API'
      },
      {
        name: 'Custom Workflows',
        description: 'Build your own automations and integrations'
      }
    ]
  }
}

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('prospecting')

  return (
    <div className="min-h-screen bg-[#0A0A23]">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 bg-[#0A0A23]/95 backdrop-blur-lg border-b border-[#232336]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-medium text-white hover:text-[#8B5CF6] transition-colors">
              Rarity Leads
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/" className="text-[#e0e0e0] hover:text-white transition-colors">
                Home
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
      <section className="pt-32 pb-20 px-6">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-medium text-white mb-6">
            Everything you need to
            <br />
            <span className="text-[#8B5CF6]">close more deals</span>
          </h1>
          <p className="text-xl text-[#e0e0e0] max-w-3xl mx-auto">
            From lead discovery to closed deals, Rarity Leads gives you superpowers at every step of the sales process.
          </p>
        </motion.div>
      </section>

      {/* Features Tabs */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {Object.entries(features).map(([key, feature]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 rounded-full text-lg font-medium transition-all ${
                  activeTab === key
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-[#232336] text-[#e0e0e0] hover:bg-[#2a2a3f]'
                }`}
              >
                <span className="mr-2">{feature.icon}</span>
                {feature.title}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#18181c] rounded-2xl p-8 md:p-12 border border-[#232336]"
          >
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{features[activeTab].icon}</div>
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
                {features[activeTab].title}
              </h2>
              <p className="text-xl text-[#e0e0e0]">
                {features[activeTab].description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features[activeTab].capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">{capability.name}</h3>
                    <p className="text-[#b0b0b0]">{capability.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-[#18181c]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">
              Connects with everything
            </h2>
            <p className="text-xl text-[#e0e0e0]">
              Integrate with your existing tools or build custom workflows
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { name: 'Salesforce', icon: '☁️' },
              { name: 'HubSpot', icon: '🔧' },
              { name: 'Pipedrive', icon: '🎯' },
              { name: 'Slack', icon: '💬' },
              { name: 'Microsoft Teams', icon: '👥' },
              { name: 'Google Sheets', icon: '📊' },
              { name: 'Webhooks', icon: '🔗' },
              { name: 'Custom API', icon: '⚙️' }
            ].map((integration, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#232336] rounded-xl p-6 text-center hover:border-[#8B5CF6]/50 border border-transparent transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-3">{integration.icon}</div>
                <h3 className="text-white font-medium">{integration.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <motion.div 
          className="max-w-4xl mx-auto px-6 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6">
            Ready to 10x your sales?
          </h2>
          <p className="text-xl text-[#e0e0e0] mb-8">
            Join thousands of teams using Rarity Leads to find and close more deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/auth" 
                className="px-8 py-4 bg-[#8B5CF6] text-white rounded-full text-lg font-medium hover:bg-[#7C3AED] transition-colors inline-block"
              >
                Start Free Trial
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/pricing" 
                className="px-8 py-4 bg-[#232336] text-white rounded-full text-lg font-medium hover:bg-[#2a2a3f] transition-colors inline-block"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
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