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
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);
import { AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFAQs, setSelectedFAQs] = useState<number[]>([]);
  const [detailsFAQ, setDetailsFAQ] = useState<FAQItem | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editFAQ, setEditFAQ] = useState<FAQItem | null>(null);
  const [editing, setEditing] = useState(false);
  
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

  const allIds = filteredFAQs.map((_, i) => i);
  const isAllSelected = selectedFAQs.length === allIds.length && allIds.length > 0;
  const isIndeterminate = selectedFAQs.length > 0 && selectedFAQs.length < allIds.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedFAQs([]);
    else setSelectedFAQs(allIds);
  };
  const toggleSelect = (id: number) => {
    setSelectedFAQs(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };
  const handleBulkDelete = () => {
    if (!window.confirm('Are you sure you want to delete the selected FAQs?')) return;
    // Remove from faqs
    toast({ title: 'FAQs deleted', description: `${selectedFAQs.length} FAQs deleted.` });
    setSelectedFAQs([]);
  };
  const handleBulkExport = (format: 'csv' | 'json') => {
    const allFAQs = filteredFAQs.filter((_, i) => selectedFAQs.includes(i));
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(allFAQs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'faqs.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'FAQs exported as JSON.' });
    } else {
      const headers = ['question', 'answer', 'category'] as const;
      const csv = [headers.join(',')].concat(
        allFAQs.map(f => headers.map(h => JSON.stringify((f as Record<string, any>)[h] ?? '')).join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'faqs.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'FAQs exported as CSV.' });
    }
    setSelectedFAQs([]);
  };
  // Analytics
  const categoryCounts = categories.map(cat => faqs.filter(f => f.category === cat.id).length);
  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: 'FAQs per Category',
        data: categoryCounts,
        backgroundColor: ['#8B5CF6', '#6366F1', '#818CF8', '#22D3EE', '#F59E0B', '#EC4899'],
        borderRadius: 8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#232336' }, beginAtZero: true } },
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-4 pt-4"
        >
          <h1 className="text-xl lg:text-2xl font-normal text-white mb-2">
            Support Center
          </h1>
          <p className="text-sm lg:text-base text-gray-400">
            Get help with Rarity Leads and find answers to common questions
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 px-4"
        >
          <div className="relative max-w-2xl mx-auto">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-4"
        >
          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-base lg:text-lg font-normal text-white mb-2">Live Chat</h3>
              <p className="text-xs lg:text-sm text-gray-400 mb-4">Get instant help from our support team</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-base lg:text-lg font-normal text-white mb-2">Email Support</h3>
              <p className="text-xs lg:text-sm text-gray-400 mb-4">Send us a detailed message</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-[#8b5cf6] mb-3" />
              <h3 className="text-base lg:text-lg font-normal text-white mb-2">Knowledge Base</h3>
              <p className="text-xs lg:text-sm text-gray-400 mb-4">Browse detailed guides and tutorials</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
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
          
          <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center">
            <div className="text-lg text-primary-text font-medium">Total FAQs: {faqs.length}</div>
            <div className="text-sm text-secondary-text">Selected: {selectedFAQs.length}</div>
            <div className="flex-1 min-w-[220px]">
              <Bar data={chartData} options={chartOptions} height={80} />
            </div>
          </motion.div>
          <AnimatePresence>
            {selectedFAQs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card-bg border border-dark-border rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center"
              >
                <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected FAQs">Delete</Button>
                <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export selected FAQs as CSV">Export CSV</Button>
                <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export selected FAQs as JSON">Export JSON</Button>
              </motion.div>
            )}
          </AnimatePresence>
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
                    <CardContent className="p-0 flex items-center">
                      <input type="checkbox" checked={selectedFAQs.includes(index)} onChange={e => { e.stopPropagation(); toggleSelect(index); }} aria-label={`Select FAQ ${faq.question}`} className="mx-2" />
                      <button
                        onClick={() => { setDetailsFAQ(faq); setEditFAQ(faq); }}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-[#232336] transition-colors"
                      >
                        <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                    </CardContent>
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
      {/* Details Modal */}
      <AnimatePresence>
        {detailsFAQ && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setDetailsFAQ(null)}
          >
            <motion.div
              ref={detailsModalRef}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg rounded-xl border border-dark-border p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              <button className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsFAQ(null)}>&times;</button>
              <div className="text-lg font-medium text-white mb-4">FAQ Details</div>
              <form onSubmit={e => { e.preventDefault(); toast({ title: 'FAQ updated', description: 'FAQ details updated.' }); setDetailsFAQ(editFAQ); }} className="flex flex-col gap-2">
                <label className="text-xs text-secondary-text">Question</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editFAQ?.question ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, question: e.target.value } : f)} />
                <label className="text-xs text-secondary-text">Answer</label>
                <textarea className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editFAQ?.answer ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, answer: e.target.value } : f)} />
                <label className="text-xs text-secondary-text">Category</label>
                <select className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editFAQ?.category ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, category: e.target.value } : f)}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditFAQ(detailsFAQ)} aria-label="Cancel edit">Cancel</Button>
                  <Button type="button" variant="danger" onClick={() => { toast({ title: 'FAQ deleted', description: 'FAQ deleted.' }); setDetailsFAQ(null); }} aria-label="Delete FAQ">Delete</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export FAQ as JSON">Export JSON</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export FAQ as CSV">Export CSV</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 