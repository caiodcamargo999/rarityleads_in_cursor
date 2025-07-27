"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CreditCard, Download, Calendar, DollarSign, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
}

export default function BillingPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('Pro')
  const [nextBillingDate, setNextBillingDate] = useState('2024-02-15')
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: 97,
      status: 'paid',
      description: 'Pro Plan - January 2024'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: 97,
      status: 'paid',
      description: 'Pro Plan - December 2023'
    }
  ])

  const handleDownloadInvoice = async (invoiceId: string) => {
    setLoading(true)
    try {
      // In a real implementation, you'd generate and download the invoice PDF
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: t('common.success'),
        description: `Invoice ${invoiceId} downloaded successfully`
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to download invoice',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePaymentMethod = () => {
    // In a real implementation, you'd integrate with Stripe or another payment processor
    toast({
      title: 'Coming Soon',
      description: 'Payment method update will be available soon'
    })
  }

  const handleCancelSubscription = () => {
    // In a real implementation, you'd handle subscription cancellation
    toast({
      title: 'Coming Soon',
      description: 'Subscription cancellation will be available soon'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <ClientOnly fallback="Back">
            {t('common.back')}
          </ClientOnly>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            <ClientOnly fallback="Billing & Plan">
              {t('settings.billing.title')}
            </ClientOnly>
          </h1>
          <p className="text-gray-400 mt-1">
            <ClientOnly fallback="Manage your subscription and billing information">
              Manage your subscription and billing information
            </ClientOnly>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Current Plan">
                  {t('settings.billing.currentPlan')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Your current subscription details">
                  Your current subscription details
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-neutral-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-lg">{currentPlan}</span>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    Active
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm">
                  <ClientOnly fallback="$97/month">
                    {t('settings.billing.price')}
                  </ClientOnly>
                </p>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">
                  <ClientOnly fallback="Next billing date:">
                    Next billing date:
                  </ClientOnly>
                </span>
                <span className="text-white">{nextBillingDate}</span>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleUpdatePaymentMethod}
                  variant="outline"
                  className="flex-1 border-neutral-700 text-white hover:bg-neutral-800"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Update Payment Method">
                    Update Payment Method
                  </ClientOnly>
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <ClientOnly fallback="Cancel">
                    Cancel
                  </ClientOnly>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Usage">
                  Usage
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Your current usage statistics">
                  Your current usage statistics
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    <ClientOnly fallback="Leads Generated">
                      Leads Generated
                    </ClientOnly>
                  </span>
                  <span className="text-white">247 / 500</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '49%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    <ClientOnly fallback="Messages Sent">
                      Messages Sent
                    </ClientOnly>
                  </span>
                  <span className="text-white">1,234 / 2,000</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">
                    <ClientOnly fallback="Team Members">
                      Team Members
                    </ClientOnly>
                  </span>
                  <span className="text-white">1 / 5</span>
                </div>
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Download className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Invoices">
                  {t('settings.billing.invoices')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Download your billing history">
                  Download your billing history
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-medium">{invoice.id}</span>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{invoice.description}</p>
                      <p className="text-gray-400 text-sm">{invoice.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">${invoice.amount}</span>
                      <Button
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 text-white hover:bg-neutral-700"
                        disabled={loading}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 