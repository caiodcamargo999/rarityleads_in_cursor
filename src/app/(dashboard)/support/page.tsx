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
      title: t('helpArticles.gettingStarted.title'),
      category: 'onboarding',
      description: t('helpArticles.gettingStarted.description'),
      tags: t('helpArticles.gettingStarted.tags', { returnObjects: true }),
      readTime: t('helpArticles.gettingStarted.readingTime'),
      popular: true
    },
    {
      id: '2',
      title: t('helpArticles.whatsappBusiness.title'),
      category: 'integrations',
      description: t('helpArticles.whatsappBusiness.description'),
      tags: t('helpArticles.whatsappBusiness.tags', { returnObjects: true }),
      readTime: t('helpArticles.whatsappBusiness.readingTime'),
      popular: true
    },
    {
      id: '3',
      title: t('helpArticles.leadScoring.title'),
      category: 'features',
      description: t('helpArticles.leadScoring.description'),
      tags: t('helpArticles.leadScoring.tags', { returnObjects: true }),
      readTime: t('helpArticles.leadScoring.readingTime'),
      popular: false
    },
    {
      id: '4',
      title: t('helpArticles.crmPipeline.title'),
      category: 'features',
      description: t('helpArticles.crmPipeline.description'),
      tags: t('helpArticles.crmPipeline.tags', { returnObjects: true }),
      readTime: t('helpArticles.crmPipeline.readingTime'),
      popular: false
    },
    {
      id: '5',
      title: t('helpArticles.apiIntegration.title'),
      category: 'integrations',
      description: t('helpArticles.apiIntegration.description'),
      tags: t('helpArticles.apiIntegration.tags', { returnObjects: true }),
      readTime: t('helpArticles.apiIntegration.readingTime'),
      popular: false
    },
    {
      id: '6',
      title: t('helpArticles.billingSubscription.title'),
      category: 'account',
      description: t('helpArticles.billingSubscription.description'),
      tags: t('helpArticles.billingSubscription.tags', { returnObjects: true }),
      readTime: t('helpArticles.billingSubscription.readingTime'),
      popular: false
    }
  ]

  const faqs: FAQ[] = [
    {
      question: t('faqs.leadGeneration.question'),
      answer: t('faqs.leadGeneration.answer'),
      category: 'features'
    },
    {
      question: t('faqs.exportLeads.question'),
      answer: t('faqs.exportLeads.answer'),
      category: 'features'
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