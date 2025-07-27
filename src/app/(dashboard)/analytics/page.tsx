"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  MessageSquare,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('30d')
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: t('dashboard.totalLeads'), value: '0', change: '0%', icon: Users, color: 'text-blue-500' },
    { label: t('dashboard.conversionRate'), value: '0%', change: '0%', icon: Target, color: 'text-green-500' },
    { label: t('dashboard.messagesSent'), value: '0', change: '0%', icon: MessageSquare, color: 'text-purple-500' },
    { label: t('dashboard.revenueGenerated'), value: '$0', change: '0%', icon: TrendingUp, color: 'text-yellow-500' }
  ]

  const chartData = [
    { month: 'Jan', leads: 0, conversions: 0, revenue: 0 },
    { month: 'Feb', leads: 0, conversions: 0, revenue: 0 },
    { month: 'Mar', leads: 0, conversions: 0, revenue: 0 },
    { month: 'Apr', leads: 0, conversions: 0, revenue: 0 },
    { month: 'May', leads: 0, conversions: 0, revenue: 0 },
    { month: 'Jun', leads: 0, conversions: 0, revenue: 0 }
  ]

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
          <h1 className="text-xl lg:text-2xl font-normal text-foreground mb-2">
            {t('analytics.title')}
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Track your analytics and campaign insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 px-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                  <span className={`text-xs lg:text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg lg:text-2xl font-medium text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 px-4"
        >
          {/* Leads & Conversions Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t('dashboard.leadsConversions')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('dashboard.monthlyTrends')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground w-12">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-16 bg-blue-500/20 rounded h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded transition-all duration-300"
                            style={{ width: `${(data.leads / 250) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.leads} leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-green-500/20 rounded h-2">
                          <div 
                            className="bg-green-500 h-2 rounded transition-all duration-300"
                            style={{ width: `${(data.conversions / 60) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{data.conversions} conversions</span>
                      </div>
                    </div>
                    <span className="text-sm text-foreground font-medium">${data.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t('dashboard.performanceMetrics')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('dashboard.keyIndicators')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: t('dashboard.leadResponseTime'), value: '0h', target: '0h', status: 'good' },
                  { label: t('dashboard.conversionRate'), value: '0%', target: '0%', status: 'good' },
                  { label: t('dashboard.costPerLead'), value: '$0', target: '$0', status: 'good' },
                  { label: t('dashboard.customerLifetimeValue'), value: '$0', target: '$0', status: 'excellent' }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-lg font-medium text-foreground">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{t('dashboard.target')}: {metric.target}</p>
                      <span className={`text-xs font-medium ${
                        metric.status === 'excellent' ? 'text-green-500' : 
                        metric.status === 'good' ? 'text-blue-500' : 'text-yellow-500'
                      }`}>
                        {metric.status === 'excellent' ? t('dashboard.excellent') : 
                         metric.status === 'good' ? t('dashboard.good') : t('dashboard.needsImprovement')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{t('dashboard.recentActivity')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('dashboard.latestActivities')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: t('dashboard.newLeadQualified'), target: 'Sarah Johnson - TechCorp', time: '2 ' + t('dashboard.minutesAgo'), type: 'success' },
                  { action: t('dashboard.campaignCompleted'), target: 'Q1 SaaS Outreach', time: '1 ' + t('dashboard.hourAgo'), type: 'info' },
                  { action: t('dashboard.leadConverted'), target: 'Michael Chen - Innovate Labs', time: '3 ' + t('dashboard.hoursAgo'), type: 'success' },
                  { action: t('dashboard.accountConnected'), target: 'WhatsApp Business', time: '1 ' + t('dashboard.dayAgo'), type: 'info' },
                  { action: t('dashboard.importCompleted'), target: '150 new leads', time: '2 ' + t('dashboard.daysAgo'), type: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.action}</span> - {activity.target}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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