"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Calendar,
  Download,
  Share2,
  Filter,
  RefreshCw
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface AnalyticsReport {
  id: string
  name: string
  type: 'leads' | 'revenue' | 'campaigns' | 'conversions' | 'custom'
  date_range: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  metrics: {
    total_leads?: number
    conversion_rate?: number
    total_revenue?: number
    avg_deal_size?: number
    response_time?: number
    engagement_rate?: number
  }
  filters?: Record<string, any>
  user_id?: string
}

interface AnalyticsModalProps {
  report: AnalyticsReport | null
  isOpen: boolean
  onClose: () => void
  onSave?: (report: AnalyticsReport) => void
  onDelete?: (id: string) => void
}

export default function AnalyticsModal({ 
  report, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: AnalyticsModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [selectedDateRange, setSelectedDateRange] = useState<string>('month')
  const [isLoading, setIsLoading] = useState(false)

  // Handle deep linking - open modal if report ID is in URL
  useEffect(() => {
    const reportId = searchParams?.get('id')
    if (reportId && !isOpen && report?.id === reportId) {
      // Modal should already be open if report matches
    }
  }, [searchParams, isOpen, report])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && report) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', report.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, report, router])

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    toast({
      title: t('analytics.exporting'),
      description: `${t('analytics.exporting')} ${format.toUpperCase()}`,
    })
    // TODO: Implement export functionality
  }

  const handleShare = () => {
    toast({
      title: t('analytics.sharing'),
      description: t('analytics.shareLinkCopied'),
    })
    // TODO: Implement share functionality
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: t('analytics.refreshed'),
        description: t('analytics.dataRefreshed'),
      })
    } catch (error) {
      toast({
        title: t('analytics.errorRefreshing'),
        description: t('analytics.errorRefreshing'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!report) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <CardHeader className="border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-xl">{report.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t(`analytics.${report.type}`)} • {t(`analytics.${report.date_range}`)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">{t('analytics.today')}</SelectItem>
                        <SelectItem value="week">{t('analytics.week')}</SelectItem>
                        <SelectItem value="month">{t('analytics.month')}</SelectItem>
                        <SelectItem value="quarter">{t('analytics.quarter')}</SelectItem>
                        <SelectItem value="year">{t('analytics.year')}</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRefresh}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {t('analytics.refresh')}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      {t('analytics.share')}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport('pdf')}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      {t('analytics.export')}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onClose}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-card border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('analytics.totalLeads')}</p>
                            <p className="text-2xl font-medium">{report.metrics.total_leads || 0}</p>
                          </div>
                          <Users className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+12.5%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('analytics.conversionRate')}</p>
                            <p className="text-2xl font-medium">{(report.metrics.conversion_rate || 0).toFixed(1)}%</p>
                          </div>
                          <Target className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+2.3%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('analytics.totalRevenue')}</p>
                            <p className="text-2xl font-medium">${(report.metrics.total_revenue || 0).toLocaleString()}</p>
                          </div>
                          <DollarSign className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-500">+8.7%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('analytics.avgDealSize')}</p>
                            <p className="text-2xl font-medium">${(report.metrics.avg_deal_size || 0).toLocaleString()}</p>
                          </div>
                          <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingDown className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-500">-1.2%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">{t('analytics.leadsOverTime')}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                            <p>{t('analytics.chartPlaceholder')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-card border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">{t('analytics.revenueTrends')}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
                            <p>{t('analytics.chartPlaceholder')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Metrics */}
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{t('analytics.detailedMetrics')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium">{t('analytics.performance')}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t('analytics.responseTime')}</span>
                              <span className="text-sm font-medium">{report.metrics.response_time || 0}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">{t('analytics.engagementRate')}</span>
                              <span className="text-sm font-medium">{(report.metrics.engagement_rate || 0).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">{t('analytics.channels')}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Email</span>
                              <span className="text-sm font-medium">45%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">WhatsApp</span>
                              <span className="text-sm font-medium">32%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">LinkedIn</span>
                              <span className="text-sm font-medium">23%</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">{t('analytics.topSources')}</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Organic Search</span>
                              <span className="text-sm font-medium">28%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Direct Traffic</span>
                              <span className="text-sm font-medium">25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Social Media</span>
                              <span className="text-sm font-medium">22%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Filters and Settings */}
                  <Card className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">{t('analytics.filtersAndSettings')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('analytics.reportType')}
                          </label>
                          <p className="mt-1">{t(`analytics.${report.type}`)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('analytics.dateRange')}
                          </label>
                          <p className="mt-1">{t(`analytics.${report.date_range}`)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('analytics.created')}
                          </label>
                          <p className="mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('analytics.lastUpdated')}
                          </label>
                          <p className="mt-1">{new Date(report.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 