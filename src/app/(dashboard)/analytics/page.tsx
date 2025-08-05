"use client"

import { useState, useEffect } from 'react'
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
  Filter,
  DollarSign,
  Phone,
  Mail,
  Building,
  Globe,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClientOnly } from '@/components/ClientOnly'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js'

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, ArcElement)

export default function AnalyticsPage() {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  // Enhanced stats with realistic data
  const stats = [
    { 
      label: t('dashboard.totalLeads'), 
      value: '1,247', 
      change: '+12.5%', 
      icon: Users, 
      color: 'text-blue-500',
      description: 'Total leads generated'
    },
    { 
      label: t('dashboard.conversionRate'), 
      value: '23.4%', 
      change: '+5.2%', 
      icon: Target, 
      color: 'text-green-500',
      description: 'Lead to customer rate'
    },
    { 
      label: t('dashboard.messagesSent'), 
      value: '3,891', 
      change: '+18.7%', 
      icon: MessageSquare, 
      color: 'text-purple-500',
      description: 'Outreach messages sent'
    },
    { 
      label: t('dashboard.revenueGenerated'), 
      value: '$127,450', 
      change: '+32.1%', 
      icon: DollarSign, 
      color: 'text-yellow-500',
      description: 'Revenue from leads'
    }
  ]

  // Enhanced chart data
  const chartData = [
    { month: 'Jan', leads: 156, conversions: 23, revenue: 18450, messages: 432 },
    { month: 'Feb', leads: 189, conversions: 31, revenue: 22100, messages: 567 },
    { month: 'Mar', leads: 234, conversions: 42, revenue: 28900, messages: 678 },
    { month: 'Apr', leads: 198, conversions: 38, revenue: 25600, messages: 543 },
    { month: 'May', leads: 267, conversions: 51, revenue: 32400, messages: 789 },
    { month: 'Jun', leads: 203, conversions: 39, revenue: 26400, messages: 612 }
  ]

  // Pipeline data
  const pipelineData = {
    labels: ['To Contact', 'Contacted', 'In Conversation', 'Closed'],
    datasets: [{
      data: [45, 23, 18, 14],
      backgroundColor: ['#3B82F6', '#F59E0B', '#8B5CF6', '#10B981'],
      borderWidth: 0
    }]
  }

  // Channel performance data
  const channelData = {
    labels: ['WhatsApp', 'LinkedIn', 'Email', 'Phone'],
    datasets: [{
      data: [42, 28, 18, 12],
      backgroundColor: ['#25D366', '#0077B5', '#EA4335', '#34A853'],
      borderWidth: 0
    }]
  }

  // Lead source data
  const sourceData = {
    labels: ['Apollo', 'LinkedIn', 'Crunchbase', 'Manual', 'Clearbit'],
    datasets: [{
      data: [35, 28, 15, 12, 10],
      backgroundColor: ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  }

  // Performance metrics
  const performanceMetrics = [
    { label: 'Response Rate', value: '34.2%', trend: '+8.5%', color: 'text-green-500' },
    { label: 'Avg Response Time', value: '2.3h', trend: '-15.2%', color: 'text-green-500' },
    { label: 'Meeting Booked', value: '67', trend: '+12.3%', color: 'text-green-500' },
    { label: 'Deals Closed', value: '23', trend: '+18.7%', color: 'text-green-500' }
  ]

  // Top performing campaigns
  const topCampaigns = [
    { name: 'B2B SaaS Outreach', leads: 89, conversion: '28.4%', revenue: '$45,200' },
    { name: 'Agency Partnership', leads: 67, conversion: '31.2%', revenue: '$38,900' },
    { name: 'Enterprise Sales', leads: 45, conversion: '42.1%', revenue: '$67,800' },
    { name: 'Startup Growth', leads: 34, conversion: '25.6%', revenue: '$22,400' }
  ]

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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
            <ClientOnly fallback="Track your analytics and campaign insights">
              {t('analytics.description')}
            </ClientOnly>
          </p>
        </motion.div>

        {/* Time Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-between items-center mb-6 px-4"
        >
          <div>
            <h2 className="text-lg font-medium text-foreground">Performance Overview</h2>
            <p className="text-sm text-muted-foreground">Track your lead generation and conversion metrics</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 px-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-md transition-all duration-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                  <Badge variant="secondary" className={`text-xs ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg lg:text-2xl font-medium text-foreground mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 px-4"
        >
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className={`text-xs font-medium ${metric.color}`}>
                    {metric.trend}
                  </span>
                </div>
                <p className="text-xl font-medium text-foreground">{metric.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 px-4"
        >
          {/* Leads & Conversions Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Leads & Conversions Trend</CardTitle>
              <CardDescription className="text-muted-foreground">
                Monthly performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: chartData.map(d => d.month),
                  datasets: [
                    {
                      label: 'Leads Generated',
                      data: chartData.map(d => d.leads),
                      backgroundColor: '#3B82F6',
                      borderColor: '#3B82F6',
                      borderWidth: 1
                    },
                    {
                      label: 'Conversions',
                      data: chartData.map(d => d.conversions),
                      backgroundColor: '#10B981',
                      borderColor: '#10B981',
                      borderWidth: 1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Generation</CardTitle>
              <CardDescription className="text-muted-foreground">
                Revenue trend from lead conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: chartData.map(d => d.month),
                  datasets: [
                    {
                      label: 'Revenue ($)',
                      data: chartData.map(d => d.revenue),
                      borderColor: '#F59E0B',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderWidth: 2,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Pipeline & Channel Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 px-4"
        >
          {/* Pipeline Distribution */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Pipeline Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">
                Current leads by stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut
                data={pipelineData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Channel Performance</CardTitle>
              <CardDescription className="text-muted-foreground">
                Lead generation by channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut
                data={channelData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Lead Sources */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lead Sources</CardTitle>
              <CardDescription className="text-muted-foreground">
                Distribution by data source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut
                data={sourceData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="px-4 mb-6"
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Top Performing Campaigns</CardTitle>
              <CardDescription className="text-muted-foreground">
                Best performing campaigns by conversion rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">{campaign.leads} leads generated</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{campaign.conversion}</p>
                      <p className="text-sm text-muted-foreground">{campaign.revenue}</p>
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