'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const plans = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small teams getting started',
    features: [
      '100 leads per month',
      '1 WhatsApp account',
      'Basic AI scoring',
      'Email support',
      'API access (read-only)',
      'Basic analytics'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'For growing teams that need more power',
    features: [
      '1,000 leads per month',
      '5 WhatsApp accounts',
      'Advanced AI scoring',
      'All messaging channels',
      'Priority support',
      'Full API access',
      'Custom integrations',
      'Advanced analytics',
      'Team collaboration'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams with custom needs',
    features: [
      'Unlimited leads',
      'Unlimited accounts',
      'Custom AI models',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'White-label options',
      'On-premise deployment',
      'Advanced security'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

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
              <Link href="/features" className="text-[#e0e0e0] hover:text-white transition-colors">
                Features
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
            Simple pricing for
            <br />
            <span className="text-[#8B5CF6]">scalable growth</span>
          </h1>
          <p className="text-xl text-[#e0e0e0] max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <motion.div 
            className="inline-flex items-center gap-4 p-1 bg-[#232336] rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#e0e0e0] hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#e0e0e0] hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-sm text-[#25D366]">Save 20%</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
                className={`relative bg-[#18181c] rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/20'
                    : 'border-[#232336]'
                }`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#8B5CF6] text-white text-sm rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-medium text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-5xl font-medium text-white">
                      {plan.price === 'Custom' ? plan.price : (
                        billingPeriod === 'annual' && plan.price !== 'Custom'
                          ? `$${Math.floor(parseInt(plan.price.slice(1)) * 0.8)}`
                          : plan.price
                      )}
                    </span>
                    {plan.period && (
                      <span className="text-[#b0b0b0]">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-[#b0b0b0]">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#8B5CF6] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#e0e0e0]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED]'
                      : 'bg-[#232336] text-white hover:bg-[#2a2a3f]'
                  }`}
                >
                  <Link href={plan.name === 'Enterprise' ? '/contact' : '/auth'}>
                    {plan.cta}
                  </Link>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#18181c]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-[#e0e0e0]">
              Everything you need to know about Rarity Leads
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                question: 'Can I try Rarity Leads for free?',
                answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
              },
              {
                question: 'What counts as a lead?',
                answer: 'A lead is any contact you add to the system, whether manually or through enrichment. Duplicate leads are not counted.'
              },
              {
                question: 'Can I change plans anytime?',
                answer: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
              },
              {
                question: 'Do you offer custom integrations?',
                answer: 'Yes, Professional and Enterprise plans include API access for custom integrations. Enterprise plans can include dedicated integration support.'
              },
              {
                question: 'What messaging channels are included?',
                answer: 'Professional and Enterprise plans include WhatsApp, Instagram, Facebook, X (Twitter), and LinkedIn messaging.'
              },
              {
                question: 'Is there a setup fee?',
                answer: 'No setup fees for any plan. Enterprise customers get free onboarding and training.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-[#232336] rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                <p className="text-[#b0b0b0]">{faq.answer}</p>
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
            Ready to accelerate your sales?
          </h2>
          <p className="text-xl text-[#e0e0e0] mb-8">
            Join thousands of teams closing more deals with Rarity Leads
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/auth" 
              className="px-8 py-4 bg-[#8B5CF6] text-white rounded-full text-lg font-medium hover:bg-[#7C3AED] transition-colors inline-block"
            >
              Start Your Free Trial
            </Link>
          </motion.div>
          <p className="mt-4 text-sm text-[#b0b0b0]">
            No credit card required • 14-day free trial
          </p>
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