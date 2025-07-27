"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Check, Star, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import { ClientOnly } from '@/components/ClientOnly'
import { useState } from 'react'

export default function HomePage() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      title: t('sales.features.aiSdr'),
      description: t('sales.features.aiSdrDescription')
    },
    {
      title: t('sales.features.whatsapp'),
      description: t('sales.features.whatsappDescription')
    },
    {
      title: t('sales.features.intelligence'),
      description: t('sales.features.intelligenceDescription')
    }
  ]

  const solutions = [
    {
      title: t('sales.solutions.automation.title'),
      features: [
        t('sales.solutions.automation.feature1'),
        t('sales.solutions.automation.feature2'),
        t('sales.solutions.automation.feature3'),
        t('sales.solutions.automation.feature4')
      ]
    },
    {
      title: t('sales.solutions.intelligence.title'),
      features: [
        t('sales.solutions.intelligence.feature1'),
        t('sales.solutions.intelligence.feature2'),
        t('sales.solutions.intelligence.feature3'),
        t('sales.solutions.intelligence.feature4')
      ]
    }
  ]

  const pricingPlans = [
    {
      name: t('sales.pricing.starter.name'),
      price: t('sales.pricing.starter.price'),
      period: t('sales.pricing.period'),
      features: [
        t('sales.pricing.starter.feature1'),
        t('sales.pricing.starter.feature2'),
        t('sales.pricing.starter.feature3'),
        t('sales.pricing.starter.feature4')
      ],
      cta: t('sales.pricing.starter.cta'),
      popular: false
    },
    {
      name: t('sales.pricing.pro.name'),
      price: t('sales.pricing.pro.price'),
      period: t('sales.pricing.period'),
      features: [
        t('sales.pricing.pro.feature1'),
        t('sales.pricing.pro.feature2'),
        t('sales.pricing.pro.feature3'),
        t('sales.pricing.pro.feature4')
      ],
      cta: t('sales.pricing.pro.cta'),
      popular: true
    },
    {
      name: t('sales.pricing.enterprise.name'),
      price: t('sales.pricing.enterprise.price'),
      period: t('sales.pricing.period'),
      features: [
        t('sales.pricing.enterprise.feature1'),
        t('sales.pricing.enterprise.feature2'),
        t('sales.pricing.enterprise.feature3'),
        t('sales.pricing.enterprise.feature4')
      ],
      cta: t('sales.pricing.enterprise.cta'),
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Left */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-medium text-foreground">
                <ClientOnly fallback="Rarity Leads">
                  {t('company.name')}
                </ClientOnly>
              </Link>
            </div>
            
            {/* Navigation Links - Center */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.features')}
              </Link>
              <Link href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.solution')}
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.pricing')}
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.about')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Auth Buttons, Theme Toggle and Language Switcher - Right */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/auth" className="hidden sm:block text-foreground hover:text-muted-foreground transition-colors text-sm">
                <ClientOnly fallback="Login">
                  {t('auth.login')}
                </ClientOnly>
              </Link>
              <Link 
                href="/auth" 
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm shadow-lg hover:shadow-purple-500/25"
              >
                <ClientOnly fallback="Sign Up">
                  {t('auth.signUp')}
                </ClientOnly>
              </Link>
              <ClientOnly fallback={
                <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
              }>
                <ThemeToggle />
              </ClientOnly>
              <ClientOnly fallback={
                <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
              }>
                <LanguageSwitcher />
              </ClientOnly>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="#features" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.features')}
            </Link>
            <Link 
              href="#solution" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.solution')}
            </Link>
            <Link 
              href="#pricing" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.pricing')}
            </Link>
            <Link 
              href="/about" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            <div className="pt-4 border-t border-border">
              <Link 
                href="/auth" 
                className="block text-foreground hover:text-muted-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClientOnly fallback="Login">
                  {t('auth.login')}
                </ClientOnly>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ClientOnly fallback="AI powered warm lead hunting for faster deals, deeper conversations, and scalable outreach with zero guesswork.">
              {t('sales.hero.title')}
            </ClientOnly>
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ClientOnly fallback="Rarity Leads is your native AI platform to attract, qualify and close customers — without manual work.">
              {t('sales.hero.subtitle')}
            </ClientOnly>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              href="/auth" 
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 text-lg"
            >
              <ClientOnly fallback="Start for Free →">
                {t('sales.hero.cta')}
              </ClientOnly>
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
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              <ClientOnly fallback="The End of Manual Prospecting">
                {t('sales.features.title')}
              </ClientOnly>
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
                className="relative bg-gradient-to-br from-background via-background to-background/50 p-8 rounded-lg border border-border overflow-hidden shadow-lg dark:from-background/90 dark:to-background/70"
              >
                {/* Purple gradient overlay - more prominent in light theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-transparent pointer-events-none dark:from-purple-500/5 dark:to-transparent"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center mb-6 shadow-lg dark:from-purple-500/30 dark:to-purple-400/30">
                    {index === 0 && <Star className="w-6 h-6 text-white" />}
                    {index === 1 && <Check className="w-6 h-6 text-white" />}
                    {index === 2 && <ArrowRight className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-background/95 dark:from-background/90 dark:to-background/70">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              <ClientOnly fallback="The Solution: AI Powered Prospecting, Human Results">
                {t('sales.solution.title')}
              </ClientOnly>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              <ClientOnly fallback="Rarity Leads automates and humanizes your entire lead generation process, so you can focus on closing deals, not chasing prospects. Our platform combines advanced AI, real time data, and multi channel outreach to deliver qualified leads, actionable insights, and scalable growth for agencies and sales teams.">
                {t('sales.solution.description')}
              </ClientOnly>
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
                className="relative bg-gradient-to-br from-background via-background to-background/50 p-8 rounded-lg border border-border overflow-hidden shadow-lg dark:from-background/90 dark:to-background/70"
              >
                {/* Purple gradient overlay - more prominent in light theme */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-transparent pointer-events-none dark:from-purple-500/5 dark:to-transparent"></div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {solution.title}
                  </h3>
                  <ul className="space-y-3">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-muted-foreground flex items-start">
                        <Check className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0 dark:text-purple-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-background/95 dark:from-background/90 dark:to-background/70">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              <ClientOnly fallback="Simple, Transparent Pricing. No Surprises.">
                {t('sales.pricing.title')}
              </ClientOnly>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-[99999]">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-xl whitespace-nowrap border border-purple-400/20 dark:from-purple-500/40 dark:to-purple-400/40 dark:border-purple-300/20">
                      {t('sales.pricing.mostPopular')}
                    </span>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative p-8 pt-12 rounded-lg border overflow-hidden shadow-lg ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-background via-background to-background/50 border-purple-500/50 dark:from-background/90 dark:to-background/70 dark:border-purple-400/30' 
                      : 'bg-gradient-to-br from-background via-background to-background/50 border-border dark:from-background/90 dark:to-background/70'
                  }`}
                >
                  {/* Purple gradient overlay - more prominent for popular plan and in light theme */}
                  <div className={`absolute inset-0 pointer-events-none ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-purple-500/20 via-purple-400/15 to-transparent dark:from-purple-500/8 dark:to-transparent' 
                      : 'bg-gradient-to-br from-purple-500/12 to-transparent dark:from-purple-500/4 dark:to-transparent'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mb-2">
                        <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-muted-foreground flex items-start">
                          <Check className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0 dark:text-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Link href="/auth" className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 hover:shadow-purple-500/25 dark:from-purple-500/40 dark:to-purple-400/40 dark:hover:from-purple-500/50 dark:hover:to-purple-400/50' 
                          : 'bg-gradient-to-r from-muted to-muted/80 text-foreground hover:from-muted/90 hover:to-muted/70 dark:from-muted/60 dark:to-muted/40 dark:hover:from-muted/70 dark:hover:to-muted/50'
                      }`}>
                        {plan.cta}
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Purple gradient background - more prominent in light theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95 dark:from-background/90 dark:to-background/70"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-purple-400/10 to-transparent dark:from-purple-500/5 dark:to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              <ClientOnly fallback="Ready to Build Your Unfair Advantage?">
                {t('sales.finalCta.title')}
              </ClientOnly>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              <ClientOnly fallback="Join high growth companies that trust Rarity Leads to build their sales pipeline on autopilot.">
                {t('sales.finalCta.subtitle')}
              </ClientOnly>
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth" className="inline-block bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 text-lg dark:from-purple-500/40 dark:to-purple-400/40 dark:hover:from-purple-500/50 dark:hover:to-purple-400/50">
                <ClientOnly fallback="Get Started for Free">
                  {t('sales.finalCta.button')}
                </ClientOnly>
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border bg-gradient-to-br from-background to-background/95 dark:from-background/90 dark:to-background/70">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            <ClientOnly fallback="© 2024 Rarity Leads. All rights reserved.">
              {t('footer.copyright')}
            </ClientOnly>
          </p>
        </div>
      </footer>
    </div>
  )
} 