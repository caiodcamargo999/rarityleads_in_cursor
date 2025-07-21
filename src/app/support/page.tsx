"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  HelpCircle, 
  ChevronDown,
  ChevronUp,
  BookOpen,
  Video,
  FileText,
  Zap,
  Users,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const faqs: FAQItem[] = [
    {
      question: "How do I connect my WhatsApp account?",
      answer: "Go to Dashboard > Outreach > WhatsApp > Accounts, click 'Add Account', and scan the QR code with your WhatsApp mobile app. Make sure your phone has an active internet connection.",
      category: "whatsapp"
    },
    {
      question: "What's the difference between qualified and unqualified leads?",
      answer: "Qualified leads have shown genuine interest through engagement, meet your target criteria, and are ready for sales conversations. Unqualified leads need more nurturing or don't fit your ideal customer profile.",
      category: "leads"
    },
    {
      question: "How does the AI lead qualification work?",
      answer: "Our AI analyzes prospect behavior, engagement patterns, and responses to determine their buying intent and fit for your services. It uses machine learning to improve accuracy over time.",
      category: "ai"
    },
    {
      question: "Can I use multiple WhatsApp accounts?",
      answer: "Yes! You can connect multiple WhatsApp accounts for different campaigns or team members. Each account operates independently with its own conversations and analytics.",
      category: "whatsapp"
    },
    {
      question: "How do I export my lead data?",
      answer: "Go to Dashboard > Leads, use the filters to select your data, then click the 'Export' button. You can export as CSV, Excel, or PDF formats.",
      category: "leads"
    },
    {
      question: "What channels do you support for outreach?",
      answer: "We currently support WhatsApp, Instagram, LinkedIn, Facebook, and X (Twitter). More channels are being added regularly based on user demand.",
      category: "outreach"
    },
    {
      question: "How secure is my data?",
      answer: "We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is never shared with third parties without explicit consent.",
      category: "security"
    },
    {
      question: "Can I customize message templates?",
      answer: "Absolutely! Create personalized templates with variables like {name}, {company}, and {custom_fields}. Save templates for different campaigns and use cases.",
      category: "outreach"
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
    { id: 'leads', name: 'Lead Management', icon: Users },
    { id: 'ai', name: 'AI Features', icon: Zap },
    { id: 'outreach', name: 'Outreach', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
            Support Center
          </h1>
          <p className="text-base text-gray-400">
            Get help with Rarity Leads and find answers to common questions
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or contact support..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#18181c] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <MessageSquare className="w-8 h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-lg font-normal text-white mb-2">Live Chat</h3>
              <p className="text-sm text-gray-400 mb-4">Get instant help from our support team</p>
              <Button variant="outline" size="sm" className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <Mail className="w-8 h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-lg font-normal text-white mb-2">Email Support</h3>
              <p className="text-sm text-gray-400 mb-4">Send us a detailed message</p>
              <Button variant="outline" size="sm" className="w-full">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-lg font-normal text-white mb-2">Knowledge Base</h3>
              <p className="text-sm text-gray-400 mb-4">Browse detailed guides and tutorials</p>
              <Button variant="outline" size="sm" className="w-full">
                Browse Articles
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-normal text-white mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white'
                    : 'bg-[#18181c] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-normal text-white mb-4">
            Frequently Asked Questions
            {filteredFAQs.length > 0 && (
              <span className="text-gray-400 text-base font-normal ml-2">
                ({filteredFAQs.length} results)
              </span>
            )}
          </h2>
          
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-[#232336] transition-colors"
                      >
                        <h3 className="text-white font-normal pr-4">{faq.question}</h3>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-normal text-white mb-2">No results found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search terms or browse by category</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="text-center">
            <h2 className="text-xl font-normal text-white mb-4">Still Need Help?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you succeed with Rarity Leads. 
              We typically respond within 2 hours during business hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 