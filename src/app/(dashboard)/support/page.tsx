"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SupportPage() {
  const supportRef = useRef(null)
  const supportInView = useInView(supportRef, { once: true })
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const faqs = [
    {
      id: 'getting-started',
      question: 'How do I get started with Rarity Leads?',
      answer: 'Getting started is easy! Simply sign up for an account, connect your WhatsApp number, and start importing your leads. Our AI will help you qualify and engage with prospects automatically.'
    },
    {
      id: 'whatsapp-setup',
      question: 'How do I connect my WhatsApp number?',
      answer: 'To connect your WhatsApp number, go to the WhatsApp section in your dashboard, click "Connect Number", and follow the QR code setup process. Make sure your phone is nearby during setup.'
    },
    {
      id: 'lead-import',
      question: 'What file formats can I import leads from?',
      answer: 'We support CSV, Excel (.xlsx), and Google Sheets imports. Your file should include columns for contact name, email, phone number, and company information for best results.'
    },
    {
      id: 'pricing',
      question: 'How does the pricing work?',
      answer: 'We offer three simple pricing tiers: Starter ($47/month), Pro ($97/month), and Enterprise ($197/month). All plans include unlimited leads, AI-powered qualification, and multi-channel outreach.'
    },
    {
      id: 'ai-features',
      question: 'What AI features are included?',
      answer: 'Our AI includes lead scoring, automated qualification, personalized message generation, optimal send time detection, and conversation routing to your team when prospects are ready to buy.'
    },
    {
      id: 'integrations',
      question: 'What integrations are available?',
      answer: 'We integrate with popular CRMs like HubSpot, Salesforce, and Pipedrive. We also support WhatsApp Business API, LinkedIn, and email channels for comprehensive outreach.'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageSquare,
      action: 'Start Chat',
      href: '#'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      href: 'mailto:support@rarityleads.com'
    },
    {
      title: 'Phone Support',
      description: 'Speak with our team directly',
      icon: Phone,
      action: 'Call Us',
      href: 'tel:+1234567890'
    }
  ]

  return (
    <div ref={supportRef} className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-normal text-white mb-4">
            Support Center
          </h1>
          <p className="text-xl text-gray-400">
            Find answers to common questions and get help when you need it.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <method.icon className="w-12 h-12 text-[#8b5cf6] mx-auto mb-4" />
                  <h3 className="text-xl font-normal text-white mb-2">{method.title}</h3>
                  <p className="text-gray-400 mb-4">{method.description}</p>
                  <Button variant="secondary" size="sm" className="w-full">
                    {method.action}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-normal text-white">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredFaqs.length} questions found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-xl font-normal text-white mb-4">
                    No questions found
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Try adjusting your search terms or contact our support team directly.
                  </p>
                  <Button variant="primary" size="lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Support
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-gray-800 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-6 bg-[#0a0a0a]/50 hover:bg-[#0a0a0a]/70 transition-all duration-300 text-left"
                      >
                        <h3 className="text-lg font-normal text-white pr-4">{faq.question}</h3>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={supportInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-normal text-white">Additional Resources</CardTitle>
              <CardDescription className="text-gray-400">
                Learn more about getting the most out of Rarity Leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0a0a0a]/50 rounded-lg">
                  <h3 className="text-lg font-normal text-white mb-2">Getting Started Guide</h3>
                  <p className="text-gray-400 mb-4">Step-by-step instructions to set up your account and start generating leads.</p>
                  <Button variant="secondary" size="sm">
                    Read Guide
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                <div className="p-6 bg-[#0a0a0a]/50 rounded-lg">
                  <h3 className="text-lg font-normal text-white mb-2">Video Tutorials</h3>
                  <p className="text-gray-400 mb-4">Watch our video tutorials to learn advanced features and best practices.</p>
                  <Button variant="secondary" size="sm">
                    Watch Videos
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 