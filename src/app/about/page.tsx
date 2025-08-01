"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  MessageSquare,
  BarChart3,
  Rocket,
  XCircle,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import { ClientOnly } from '@/components/ClientOnly'

export default function AboutPage() {
  const { t } = useTranslation();
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const values = [
    {
      title: t('about.values.aiFirst.title'),
      description: t('about.values.aiFirst.description'),
      icon: Zap
    },
    {
      title: t('about.values.humanCentric.title'),
      description: t('about.values.humanCentric.description'),
      icon: Users
    },
    {
      title: t('about.values.transparentROI.title'),
      description: t('about.values.transparentROI.description'),
      icon: BarChart3
    },
    {
      title: t('about.values.continuousEvolution.title'),
      description: t('about.values.continuousEvolution.description'),
      icon: Rocket
    }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 border-b border-border">
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
              <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.features')}
              </Link>
              <Link href="/#solution" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.solution')}
              </Link>
              <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                {t('navigation.pricing')}
              </Link>
              <Link href="/about" className="text-foreground font-medium">
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
                className="hidden sm:block bg-rarity-600 hover:bg-rarity-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm shadow-sm"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 border-b border-border"
        >
          <div className="px-4 py-4 space-y-4">
            <Link 
              href="/#features" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.features')}
            </Link>
            <Link 
              href="/#solution" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.solution')}
            </Link>
            <Link 
              href="/#pricing" 
              className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.pricing')}
            </Link>
            <Link 
              href="/about" 
              className="block text-foreground font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('navigation.about')}
            </Link>
            <div className="pt-4 border-t border-border space-y-3">
              <Link 
                href="/auth" 
                className="block text-foreground hover:text-muted-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClientOnly fallback="Sign Up">
                  {t('auth.signUp')}
                </ClientOnly>
              </Link>
              <Link 
                href="/auth" 
                className="block text-foreground hover:text-muted-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ClientOnly fallback="Login">
                  {t('auth.login')}
                </ClientOnly>
              </Link>
              <div className="flex items-center gap-4 pt-2">
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
        </motion.div>
      )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
              {t('about.hero.title')}
              <span className="text-rarity-600"> {t('about.hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              {t('about.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="whitespace-nowrap">
                  {t('about.hero.startTrial')}
                </Button>
              </Link>
              <Link href="#mission">
                <Button variant="outline" size="lg">
                  {t('about.hero.learnMission')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              {t('about.problemSection.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('about.problemSection.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-medium text-foreground mb-4">{t('about.problemSection.manualFails')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.issues.timeWasted.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.issues.timeWasted.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.issues.poorQuality.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.issues.poorQuality.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.issues.inconsistentFollowup.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.issues.inconsistentFollowup.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.issues.scalingRequiresHeadcount.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.issues.scalingRequiresHeadcount.description')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-medium text-foreground mb-4">{t('about.problemSection.aiSolves')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.solutions.aiQualification.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.solutions.aiQualification.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.solutions.multiChannelOutreach.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.solutions.multiChannelOutreach.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.solutions.predictableGrowth.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.solutions.predictableGrowth.description')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                                      <h4 className="text-foreground font-medium mb-1">{t('about.problemSection.solutions.humanHandoff.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('about.problemSection.solutions.humanHandoff.description')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              {t('about.values.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('about.values.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-card border border-border hover:border-border/50 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <value.icon className="w-8 h-8 text-rarity-600 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
              {t('about.ctaSection.title')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('about.ctaSection.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="whitespace-nowrap">
                  {t('about.ctaSection.startTrial')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  {t('about.ctaSection.seeDemo')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 