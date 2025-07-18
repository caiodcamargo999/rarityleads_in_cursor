"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  BookOpen, 
  Video,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      question: "How do I connect my WhatsApp account?",
      answer: "To connect your WhatsApp account, go to the WhatsApp Management page, click 'Connect New Account', and scan the QR code with your WhatsApp app. Make sure your phone has a stable internet connection.",
      category: "whatsapp"
    },
    {
      question: "How does AI lead scoring work?",
      answer: "Our AI analyzes company size, industry, location, and other factors to assign a score from 1-100. Higher scores indicate better prospects based on your target criteria.",
      category: "ai"
    },
    {
      question: "Can I use multiple WhatsApp accounts?",
      answer: "Yes! You can connect up to 5 WhatsApp accounts per user. Each account can be used for different campaigns or target audiences.",
      category: "whatsapp"
    },
    {
      question: "How do I create a campaign?",
      answer: "Navigate to the Approaching section, select your preferred channel, and click 'Create Campaign'. You can set target audience, message templates, and scheduling.",
      category: "campaigns"
    },
    {
      question: "What data sources do you use for lead enrichment?",
      answer: "We integrate with Clearbit, Apollo, Crunchbase, and LinkedIn Sales Navigator to provide comprehensive company and contact information.",
      category: "data"
    },
    {
      question: "How do I export my data?",
      answer: "You can export leads, campaigns, and analytics data from their respective pages using the export button. Data is available in CSV format.",
      category: "data"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'ai', label: 'AI Features' },
    { value: 'campaigns', label: 'Campaigns' },
    { value: 'data', label: 'Data & Export' }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Support Center
        </h1>
        <p className="text-[#b0b0b0]">
          Get help with Rarity Leads and find answers to common questions.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="card hover:border-[#8B5CF6] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#232336] rounded-lg">
                <MessageSquare className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Live Chat</h3>
                <p className="text-sm text-[#b0b0b0]">Get instant help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card hover:border-[#8B5CF6] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#232336] rounded-lg">
                <Mail className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Email Support</h3>
                <p className="text-sm text-[#b0b0b0]">support@rarityleads.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card hover:border-[#8B5CF6] transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#232336] rounded-lg">
                <BookOpen className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Documentation</h3>
                <p className="text-sm text-[#b0b0b0]">Read our guides</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Find answers to common questions about Rarity Leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.value
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                      : 'border-[#232336] text-[#b0b0b0] hover:border-[#8B5CF6]'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[#232336] rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#232336] transition-colors"
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-[#8B5CF6]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#8B5CF6]" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-4 pb-4">
                      <p className="text-[#b0b0b0]">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Contact Support</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Can't find what you're looking for? Send us a message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-[#e0e0e0]">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#e0e0e0]">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="text-[#e0e0e0]">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What can we help you with?"
                  className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-[#e0e0e0]">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={4}
                  className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                />
              </div>
              <Button type="submit" className="btn-primary">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Additional Resources</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Learn more about Rarity Leads and get the most out of the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Getting Started</h3>
                <ul className="space-y-2 text-sm text-[#b0b0b0]">
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Quick Start Guide</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Setting Up Your First Campaign</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Connecting WhatsApp Accounts</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Understanding AI Scoring</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Advanced Features</h3>
                <ul className="space-y-2 text-sm text-[#b0b0b0]">
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Multi-Channel Campaigns</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Analytics & Reporting</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">API Documentation</a></li>
                  <li>• <a href="#" className="text-[#8B5CF6] hover:underline">Best Practices</a></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 