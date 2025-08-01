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
import { useTranslation } from 'react-i18next'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const { t } = useTranslation()
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
      question: t('support.faqs.whatsappConnection.question'),
      answer: t('support.faqs.whatsappConnection.answer'),
      category: "whatsapp"
    },
    {
      question: t('support.faqs.qualifiedLeads.question'),
      answer: t('support.faqs.qualifiedLeads.answer'),
      category: "leads"
    },
    {
      question: t('support.faqs.aiQualification.question'),
      answer: t('support.faqs.aiQualification.answer'),
      category: "ai"
    },
    {
      question: t('support.faqs.multipleWhatsapp.question'),
      answer: t('support.faqs.multipleWhatsapp.answer'),
      category: "whatsapp"
    },
    {
      question: t('support.faqs.exportData.question'),
      answer: t('support.faqs.exportData.answer'),
      category: "leads"
    },
    {
      question: t('support.faqs.supportedChannels.question'),
      answer: t('support.faqs.supportedChannels.answer'),
      category: "outreach"
    },
    {
      question: t('support.faqs.dataSecurity.question'),
      answer: t('support.faqs.dataSecurity.answer'),
      category: "security"
    },
    {
      question: t('support.faqs.messageTemplates.question'),
      answer: t('support.faqs.messageTemplates.answer'),
      category: "outreach"
    }
  ]

  const categories = [
    { id: 'all', name: t('support.allQuestions'), icon: HelpCircle },
    { id: 'whatsapp', name: t('support.whatsapp'), icon: MessageSquare },
    { id: 'leads', name: t('support.leadManagement'), icon: Users },
    { id: 'ai', name: t('support.aiFeatures'), icon: Zap },
    { id: 'outreach', name: t('support.outreach'), icon: Mail },
    { id: 'security', name: t('support.security'), icon: Shield }
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
    if (!window.confirm(t('support.confirmDeleteFaqs'))) return;
    // Remove from faqs
    toast({ title: t('support.faqsDeleted'), description: `${selectedFAQs.length} FAQs deleted.` });
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
      toast({ title: t('support.faqsExported'), description: 'FAQs exported as JSON.' });
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
      toast({ title: t('support.faqsExported'), description: 'FAQs exported as CSV.' });
    }
    setSelectedFAQs([]);
  };
  // Analytics
  const categoryCounts = categories.map(cat => faqs.filter(f => f.category === cat.id).length);
  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        label: t('support.faqsPerCategory'),
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
    <div ref={pageRef} className="min-h-screen bg-background w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-4 pt-4"
        >
          <h1 className="text-xl lg:text-2xl font-medium text-foreground mb-2">
            {t('support.supportCenter')}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            {t('support.getHelp')}
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
              placeholder={t('support.searchForHelp')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-rarity-600/50 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 px-4 max-w-7xl mx-auto"
        >
          <Card className="bg-card border border-border hover:border-border/50 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <MessageSquare className="w-6 h-6 lg:w-8 lg:h-8 text-rarity-600 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">{t('support.liveChat')}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">{t('support.getInstantHelp')}</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                {t('support.startChat')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:border-border/50 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 lg:p-6">
              <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-rarity-600 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">{t('support.emailSupport')}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">{t('support.sendDetailedMessage')}</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                {t('support.sendEmail')}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:border-border/50 transition-all duration-300 cursor-pointer sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 lg:p-6">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-rarity-600 mb-3" />
              <h3 className="text-base lg:text-lg font-medium text-foreground mb-2">{t('support.knowledgeBase')}</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mb-4">{t('support.browseGuides')}</p>
              <Button variant="outline" size="sm" className="w-full text-xs lg:text-sm">
                {t('support.browseArticles')}
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
          <h2 className="text-xl font-medium text-foreground mb-4 px-4">{t('support.browseByCategory')}</h2>
          <div className="flex flex-wrap gap-2 px-4 max-w-7xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-rarity-600 border-rarity-600 text-white'
                    : 'bg-card border-border text-muted-foreground hover:border-border/50 hover:text-foreground'
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
          <h2 className="text-xl font-medium text-foreground mb-4 px-4">
            {t('support.frequentlyAskedQuestions')}
            {filteredFAQs.length > 0 && (
              <span className="text-muted-foreground text-base font-normal ml-2">
                ({filteredFAQs.length} {t('support.results')})
              </span>
            )}
          </h2>
          
          <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center px-4">
            <div className="text-lg text-foreground font-medium">{t('support.totalFaqs')}: {faqs.length}</div>
            <div className="text-sm text-muted-foreground">{t('support.selected')}: {selectedFAQs.length}</div>
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
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-sm px-6 py-3 flex gap-4 items-center"
              >
                <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected FAQs">{t('support.delete')}</Button>
                <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export selected FAQs as CSV">{t('support.exportCsv')}</Button>
                <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export selected FAQs as JSON">{t('support.exportJson')}</Button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="space-y-3 px-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <Card className="bg-card border border-border hover:border-border/50 transition-all duration-300">
                    <CardContent className="p-0 flex items-center">
                      <input type="checkbox" checked={selectedFAQs.includes(index)} onChange={e => { e.stopPropagation(); toggleSelect(index); }} aria-label={`Select FAQ ${faq.question}`} className="mx-2" />
                      <button
                        onClick={() => { setDetailsFAQ(faq); setEditFAQ(faq); }}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-muted transition-colors"
                      >
                        <h3 className="text-lg font-medium text-foreground pr-4">{faq.question}</h3>
                        {expandedFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{t('support.noResultsFound')}</h3>
                <p className="text-muted-foreground mb-6">{t('support.tryAdjustingSearch')}</p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  variant="outline"
                >
                  {t('support.clearFilters')}
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
          className="mt-12 pt-8 border-t border-border px-4"
        >
          <div className="text-center max-w-7xl mx-auto">
            <h2 className="text-xl font-medium text-foreground mb-4">{t('support.stillNeedHelp')}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('support.supportTeamHere')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {t('support.contactSupport')}
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                {t('support.scheduleDemo')}
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
              className="bg-card rounded-xl border border-border p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-2xl" aria-label="Close details" onClick={() => setDetailsFAQ(null)}>&times;</button>
              <div className="text-lg font-medium text-foreground mb-4">{t('support.faqDetails')}</div>
                              <form onSubmit={e => { e.preventDefault(); toast({ title: t('support.faqUpdated'), description: 'FAQ details updated.' }); setDetailsFAQ(editFAQ); }} className="flex flex-col gap-2">
                  <label className="text-xs text-muted-foreground">{t('support.question')}</label>
                  <input type="text" className="bg-muted text-foreground rounded px-2 py-1 text-sm border border-border" value={editFAQ?.question ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, question: e.target.value } : f)} />
                  <label className="text-xs text-muted-foreground">{t('support.answer')}</label>
                  <textarea className="bg-muted text-foreground rounded px-2 py-1 text-sm border border-border" value={editFAQ?.answer ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, answer: e.target.value } : f)} />
                  <label className="text-xs text-muted-foreground">{t('support.category')}</label>
                  <select className="bg-muted text-foreground rounded px-2 py-1 text-sm border border-border" value={editFAQ?.category ?? ''} onChange={e => setEditFAQ(f => f ? { ...f, category: e.target.value } : f)}>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">{t('support.save')}</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditFAQ(detailsFAQ)} aria-label="Cancel edit">{t('support.cancel')}</Button>
                  <Button type="button" variant="danger" onClick={() => { toast({ title: t('support.faqDeleted'), description: 'FAQ deleted.' }); setDetailsFAQ(null); }} aria-label="Delete FAQ">{t('support.delete')}</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export FAQ as JSON">{t('support.exportJson')}</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export FAQ as CSV">{t('support.exportCsv')}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 