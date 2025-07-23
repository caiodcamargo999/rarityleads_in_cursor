"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { number: "0", label: "Agencies Trust Us", icon: Shield },
    { number: "0", label: "Leads Generated", icon: Users },
    { number: "0%", label: "Conversion Rate", icon: TrendingUp },
    { number: "0", label: "AI Automation", icon: Zap }
  ]

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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, Digital Growth Agency",
      company: "ScaleUp Digital",
      content: "Rarity Leads transformed our lead generation from a manual nightmare into a predictable revenue machine. We've seen a 300% increase in qualified leads while reducing our SDR workload by 60%.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Performance Director",
      company: "Elite Marketing Solutions",
      content: "The AI-powered qualification is game-changing. We're now closing deals with prospects who are genuinely interested, not just tire-kickers. Our conversion rate jumped from 12% to 28%.",
      rating: 5
    },
    {
      name: "Jennifer Park",
      role: "Agency Owner",
      company: "Park & Partners",
      content: "Finally, a tool that understands agency workflows. The multi-channel outreach and intelligent follow-ups have made our outreach campaigns 5x more effective.",
      rating: 5
    }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a]">
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
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
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

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#18181c]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 text-[#8b5cf6] mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-medium text-white mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
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
              Our Mission: End Manual Prospecting
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              We're on a mission to eliminate the manual, time-consuming, and often frustrating 
              process of lead generation. Our AI doesn't just automate—it intelligently qualifies, 
              engages, and converts prospects into paying customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-medium text-white mb-4">The Problem We Solve</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Manual prospecting is killing your ROI</h4>
                    <p className="text-gray-400 text-sm">Your SDRs spend 80% of their time on research and outreach, not closing deals.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Poor lead quality wastes resources</h4>
                    <p className="text-gray-400 text-sm">Most leads aren't qualified, leading to wasted sales calls and demos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Inconsistent follow-up loses deals</h4>
                    <p className="text-gray-400 text-sm">Manual follow-up is unreliable and prospects fall through the cracks.</p>
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
              <h3 className="text-2xl font-medium text-white mb-4">Our AI-Powered Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Intelligent lead qualification</h4>
                    <p className="text-gray-400 text-sm">Our AI identifies and qualifies prospects before they reach your sales team.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Automated multi-channel outreach</h4>
                    <p className="text-gray-400 text-sm">Engage prospects across WhatsApp, LinkedIn, and email with personalized messages.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-1">Predictable pipeline growth</h4>
                    <p className="text-gray-400 text-sm">Scale your lead generation without proportionally increasing headcount.</p>
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Trusted by Leading Agencies
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              See how Rarity Leads is transforming lead generation for agencies worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    <div>
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-sm text-[#8b5cf6]">{testimonial.company}</p>
                    </div>
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
              Ready to Transform Your Lead Generation?
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of agencies who've already automated their prospecting and 
              are seeing predictable, scalable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
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