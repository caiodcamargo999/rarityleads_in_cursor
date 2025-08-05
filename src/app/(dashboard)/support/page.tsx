"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  HelpCircle, 
  MessageSquare, 
  BookOpen,
  Video,
  Mail,
  Phone,
  Search,
  ExternalLink,
  ChevronRight,
  FileText,
  Users,
  Settings,
  Zap
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'

interface HelpArticle {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  readTime: string
  popular: boolean
}

interface FAQ {
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with Rarity Leads',
      category: 'onboarding',
      description: 'Learn how to set up your account and start generating leads in minutes.',
      tags: ['beginner', 'setup'],
      readTime: '5 min',
      popular: true
    },
    {
      id: '2',
      title: 'Connecting WhatsApp Business',
      category: 'integrations',
      description: 'Step-by-step guide to connect your WhatsApp Business account.',
      tags: ['whatsapp', 'integration'],
      readTime: '8 min',
      popular: true
    },
    {
      id: '3',
      title: 'Understanding Lead Scoring',
      category: 'features',
      description: 'How our AI scores and prioritizes your leads for better conversion.',
      tags: ['ai', 'scoring'],
      readTime: '6 min',
      popular: false
    },
    {
      id: '4',
      title: 'CRM Pipeline Management',
      category: 'features',
      description: 'Organize and track your leads through the sales pipeline.',
      tags: ['crm', 'pipeline'],
      readTime: '7 min',
      popular: false
    },
    {
      id: '5',
      title: 'API Integration Guide',
      category: 'integrations',
      description: 'Connect Rarity Leads with your existing tools and workflows.',
      tags: ['api', 'integration'],
      readTime: '10 min',
      popular: false
    },
    {
      id: '6',
      title: 'Billing and Subscription',
      category: 'account',
      description: 'Manage your subscription, billing, and account settings.',
      tags: ['billing', 'account'],
      readTime: '4 min',
      popular: false
    }
  ]

  const faqs: FAQ[] = [
    {
      question: 'How does lead generation work?',
      answer: 'Our AI analyzes your target criteria and searches multiple data sources to find qualified leads that match your ideal customer profile.',
      category: 'features'
    },
    {
      question: 'Can I export my leads?',
      answer: 'Yes, you can export leads in CSV format and integrate with popular CRM systems like HubSpot, Salesforce, and Pipedrive.',
      category: 'features'
    },
    {
      question: 'Is my data secure?',
      answer: 'We use enterprise-grade security with encryption at rest and in transit. All data is stored in secure, compliant data centers.',
      category: 'security'
    },
    {
      question: 'How many leads can I generate?',
      answer: 'Lead limits depend on your subscription plan. Contact us for custom enterprise solutions.',
      category: 'pricing'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all new subscriptions.',
      category: 'billing'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time with no cancellation fees.',
      category: 'billing'
    }
  ]

  const categories = [
    { id: 'all', name: t('support.allCategories'), icon: BookOpen },
    { id: 'onboarding', name: t('support.onboarding'), icon: Users },
    { id: 'features', name: t('support.features'), icon: Zap },
    { id: 'integrations', name: t('support.integrations'), icon: Settings },
    { id: 'account', name: t('support.account'), icon: FileText }
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-medium text-foreground">
          <ClientOnly fallback="Support Center">
            {t('support.supportCenter')}
          </ClientOnly>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          <ClientOnly fallback="Find answers to your questions, learn how to use Rarity Leads, and get help when you need it.">
            {t('support.description')}
          </ClientOnly>
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder={t('support.searchHelp')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-border">
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">{t('support.contactSupport')}</h3>
            <p className="text-sm text-muted-foreground">{t('support.contactDescription')}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-border">
          <CardContent className="p-6 text-center">
            <Video className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">{t('support.videoTutorials')}</h3>
            <p className="text-sm text-muted-foreground">{t('support.videoDescription')}</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-border">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-2">{t('support.documentation')}</h3>
            <p className="text-sm text-muted-foreground">{t('support.documentationDescription')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Help Articles */}
      {filteredArticles.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-foreground">
            <ClientOnly fallback="Help Articles">
              {t('support.helpArticles')}
            </ClientOnly>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-border h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      {article.popular && (
                        <Badge variant="secondary" className="text-xs">
                          {t('support.popular')}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.readTime}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {filteredFAQs.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium text-foreground">
            <ClientOnly fallback="Frequently Asked Questions">
              {t('support.faq')}
            </ClientOnly>
          </h2>
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support */}
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium mb-2">
          <ClientOnly fallback="Still need help?">
            {t('support.stillNeedHelp')}
          </ClientOnly>
        </h3>
        <p className="text-muted-foreground mb-4">
          <ClientOnly fallback="Our support team is here to help you succeed.">
            {t('support.contactMessage')}
          </ClientOnly>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <ClientOnly fallback="Email Support">
              {t('support.emailSupport')}
            </ClientOnly>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <ClientOnly fallback="Call Us">
              {t('support.callUs')}
            </ClientOnly>
          </Button>
        </div>
      </div>
    </div>
  )
} 