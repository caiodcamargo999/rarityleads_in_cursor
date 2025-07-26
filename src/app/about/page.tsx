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

export default function AboutPage() {
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const values = [
    {
      title: "AI-First Innovation",
      description: "We believe in leveraging cutting-edge AI to solve real business problems, not just add complexity.",
      icon: Zap
    },
    {
      title: "Human-Centric Results",
      description: "Technology should enhance human relationships, not replace them. Our AI works alongside your team.",
      icon: Users
    },
    {
      title: "Transparent ROI",
      description: "Every feature, every metric, every decision is designed to deliver measurable business impact.",
      icon: BarChart3
    },
    {
      title: "Continuous Evolution",
      description: "We're constantly learning from our users and improving our platform to stay ahead of the curve.",
      icon: Rocket
    }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a]">
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

            {/* Navigation Links - Center (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/#solution" className="text-gray-300 hover:text-white transition-colors">
                Solution
              </Link>
              <Link href="/#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/about" className="text-white font-medium">
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
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a] border-t border-gray-800"
            >
              <div className="px-4 py-4 space-y-4">
                <Link 
                  href="/#features" 
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/#solution" 
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solution
                </Link>
                <Link 
                  href="/#pricing" 
                  className="block text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/about" 
                  className="block text-white font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
              We're Building the Future of
              <span className="text-[#8b5cf6]"> Lead Generation</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-4xl mx-auto">
              Rarity Leads was born from a simple frustration: why is lead generation still so manual, 
              unpredictable, and expensive? We're changing that with AI that actually works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="whitespace-nowrap">
                  Start Your Free Trial →
                </Button>
              </Link>
              <Link href="#mission">
                <Button variant="outline" size="lg">
                  Learn Our Mission
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
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              The Problem We're Solving
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Traditional lead generation is broken. Agencies waste countless hours on manual prospecting, 
              only to end up with low-quality leads and unpredictable results. We're fixing this with 
              intelligent automation that actually delivers qualified prospects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-medium text-white mb-4">Why Manual Prospecting Fails</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">80% of your SDR's time is wasted</h4>
                    <p className="text-gray-400 text-sm">Research, cold calling, and manual follow-ups leave little time for actual selling.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Poor lead quality kills conversions</h4>
                    <p className="text-gray-400 text-sm">Most prospects aren't qualified, leading to wasted demos and sales calls.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Inconsistent follow-up loses deals</h4>
                    <p className="text-gray-400 text-sm">Manual processes mean prospects fall through the cracks and deals are lost.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Scaling requires more headcount</h4>
                    <p className="text-gray-400 text-sm">Growing your pipeline means hiring more SDRs, not improving efficiency.</p>
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
              <h3 className="text-2xl font-medium text-white mb-4">How Our AI Solves It</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">AI-powered lead qualification</h4>
                    <p className="text-gray-400 text-sm">Our AI identifies and qualifies prospects before they reach your sales team, ensuring only interested leads get through.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Intelligent multi-channel outreach</h4>
                    <p className="text-gray-400 text-sm">Engage prospects across WhatsApp, LinkedIn, and email with personalized messages that actually get responses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Predictable pipeline growth</h4>
                    <p className="text-gray-400 text-sm">Scale your lead generation without proportionally increasing headcount or costs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Human handoff at the right moment</h4>
                    <p className="text-gray-400 text-sm">AI handles the grunt work, your team focuses on closing deals with qualified prospects.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#18181c]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              These principles guide everything we build and every decision we make.
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
                <Card className="bg-[#0a0a0a] border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <value.icon className="w-8 h-8 text-[#8b5cf6] mb-4" />
                    <h3 className="text-lg font-medium text-white mb-3">{value.title}</h3>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
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
              Ready to End Manual Prospecting?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join agencies who've already automated their lead generation and are seeing 
              predictable, scalable growth without the manual grind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="whitespace-nowrap">
                  Start Your Free Trial →
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  See Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 