"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const features = [
    {
      title: "AI Powered SDR That Qualifies Leads for You",
      description: "Deploy an AI agent that identifies ideal customers, engages them in human like conversations, and qualifies their interest so your team only talks to meeting ready leads."
    },
    {
      title: "Smart WhatsApp Follow ups, No Manual Messaging",
      description: "Connect with prospects across any channel WhatsApp, LinkedIn, & Email. Our AI crafts and sends personalized follow ups at the perfect time, ensuring no opportunity is missed."
    },
    {
      title: "Campaign Intelligence for Google and Meta",
      description: "Move beyond vanity metrics. Rarity analyzes your entire sales funnel, providing actionable insights to optimize campaigns, lower acquisition costs, and maximize your return."
    }
  ]

  const solutions = [
    {
      title: "AI Driven Automation",
      features: [
        "Capture, enrich, and score leads automatically",
        "AI powered SDR qualifies and routes prospects",
        "Smart WhatsApp, LinkedIn, and Email follow ups",
        "Human handoff for high value conversations"
      ]
    },
    {
      title: "Actionable Intelligence",
      features: [
        "Real time analytics and campaign optimization",
        "Intent targeting and decision maker identification",
        "Predictive insights and AI recommendations",
        "Custom dashboards for every role"
      ]
    }
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$47",
      period: "/month",
      features: [
        "Qualified Leads",
        "AI Powered SDR",
        "Multi Channel Outreach",
        "Email & Chat Support"
      ],
      cta: "Choose Plan",
      popular: false
    },
    {
      name: "Pro",
      price: "$97",
      period: "/month",
      features: [
        "More Qualified Leads",
        "Everything in Starter",
        "Campaign Intelligence",
        "Priority Support"
      ],
      cta: "Choose Plan",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$197",
      period: "/month",
      features: [
        "Unlimited Leads",
        "Everything in Pro",
        "Dedicated Success Manager",
        "Custom Integrations"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-medium text-white">
                Rarity Leads
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#solution" className="text-gray-300 hover:text-white transition-colors">
                Solution
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </div>

            {/* Buttons - Right */}
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <motion.span
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-4 py-2 rounded-lg font-medium text-white bg-[#232336] border border-[#8b5cf6] shadow-sm hover:shadow-lg hover:border-[#8b5cf6] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50"
                >
                  Login
                </motion.span>
              </Link>
              <Link href="/auth">
                <motion.span
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-4 py-2 rounded-lg font-medium text-white bg-[#8b5cf6] border border-[#8b5cf6] shadow-sm hover:shadow-lg hover:bg-[#7c3aed] hover:border-[#8b5cf6] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50"
                >
                  Sign Up
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-x-clip">
        
        <div className="max-w-7xl mx-auto text-center relative z-20">
          {/* Headline */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            AI powered warm lead hunting for faster deals, deeper conversations, and scalable outreach{" "}
            <span className="text-purple-400">with zero guesswork.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p 
            className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Rarity Leads is your AI native platform to attract, qualify, and close clients — without the manual grind.
          </motion.p>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="/auth" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 text-lg">
              Start for Free →
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              The End of Manual Prospecting
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={
                  `p-6 rounded-2xl shadow-lg text-white ` +
                  (index === 0
                    ? 'bg-gradient-to-br from-[#8b5cf6] via-[#232136] to-[#0a0a23]'
                    : index === 1
                    ? 'bg-gradient-to-br from-[#232136] via-[#6d28d9] to-[#8b5cf6]'
                    : 'bg-gradient-to-br from-[#0a0a23] via-[#232136] to-[#6d28d9]')
                }
              >
                <h3 className="text-lg font-medium text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#18181c]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              The Solution: AI Powered Prospecting, Human Results
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Rarity Leads automates and humanizes your entire lead generation process, so you can focus on closing deals, not chasing prospects. Our platform combines advanced AI, real time data, and multi channel outreach to deliver qualified leads, actionable insights, and scalable growth for agencies and sales teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={
                  `p-6 rounded-2xl shadow-lg text-white ` +
                  (index === 0
                    ? 'bg-gradient-to-br from-[#8b5cf6] via-[#232136] to-[#0a0a23]'
                    : 'bg-gradient-to-br from-[#232136] via-[#6d28d9] to-[#8b5cf6]')
                }
              >
                <h3 className="text-lg font-medium text-white mb-4">
                  {solution.title}
                </h3>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-200 text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Simple, Transparent Pricing. No Surprises.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={
                  `relative p-6 rounded-2xl shadow-lg text-white ` +
                  (index === 0
                    ? 'bg-gradient-to-br from-[#8b5cf6] via-[#232136] to-[#0a0a23]'
                    : index === 1
                    ? 'bg-gradient-to-br from-[#232136] via-[#6d28d9] to-[#8b5cf6] border-2 border-[#8b5cf6]'
                    : 'bg-gradient-to-br from-[#0a0a23] via-[#232136] to-[#6d28d9]')
                }
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#8b5cf6] text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-medium text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Link href="/auth" className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:from-[#6d28d9] hover:to-[#7c3aed]' 
                      : 'bg-[#232336] text-white hover:bg-[#2d2d47]'
                  }`}>
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#18181c]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Ready to Build Your Unfair Advantage?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join high growth companies that trust Rarity Leads to build their sales pipeline on autopilot.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth" className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white px-8 py-4 rounded-lg font-medium hover:from-[#6d28d9] hover:to-[#7c3aed] transition-all duration-200 text-lg">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Rarity Leads. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 