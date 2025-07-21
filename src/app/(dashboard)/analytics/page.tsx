"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  totalLeads: number
  qualifiedLeads: number
  totalConversations: number
  activeCampaigns: number
  conversionRate: number
  responseRate: number
  avgResponseTime: number
  pipelineValue: number
  weeklyGrowth: number
  monthlyGrowth: number
  channelBreakdown: {
    whatsapp: number
    instagram: number
    facebook: number
    x: number
    linkedin: number
  }
  leadStatus: {
    new: number
    qualified: number
    contacted: number
    engaged: number
    booked: number
    closed: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    status: string
  }>
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalLeads: 0,
    qualifiedLeads: 0,
    totalConversations: 0,
    activeCampaigns: 0,
    conversionRate: 0,
    responseRate: 0,
    avgResponseTime: 0,
    pipelineValue: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    channelBreakdown: {
      whatsapp: 0,
      instagram: 0,
      facebook: 0,
      x: 0,
      linkedin: 0
    },
    leadStatus: {
      new: 0,
      qualified: 0,
      contacted: 0,
      engaged: 0,
      booked: 0,
      closed: 0
    },
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch leads data
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', getDateFromRange(timeRange))

      if (leadsError) throw leadsError

      // Fetch conversations data
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .gte('created_at', getDateFromRange(timeRange))

      if (conversationsError) throw conversationsError

      // Fetch campaigns data
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')

      if (campaignsError) throw campaignsError

      // Calculate metrics
      const totalLeads = leads?.length || 0
      const qualifiedLeads = leads?.filter(lead => lead.ai_score >= 70).length || 0
      const totalConversations = conversations?.length || 0
      const activeCampaigns = campaigns?.length || 0

      // Calculate channel breakdown
      const channelBreakdown = {
        whatsapp: conversations?.filter(c => c.channel === 'whatsapp').length || 0,
        instagram: conversations?.filter(c => c.channel === 'instagram').length || 0,
        facebook: conversations?.filter(c => c.channel === 'facebook').length || 0,
        x: conversations?.filter(c => c.channel === 'x').length || 0,
        linkedin: conversations?.filter(c => c.channel === 'linkedin').length || 0
      }

      // Calculate lead status breakdown
      const leadStatus = {
        new: leads?.filter(lead => lead.status === 'new').length || 0,
        qualified: leads?.filter(lead => lead.status === 'qualified').length || 0,
        contacted: leads?.filter(lead => lead.status === 'contacted').length || 0,
        engaged: leads?.filter(lead => lead.status === 'engaged').length || 0,
        booked: leads?.filter(lead => lead.status === 'booked').length || 0,
        closed: leads?.filter(lead => lead.status === 'closed').length || 0
      }

      // Calculate conversion and response rates
      const conversionRate = totalLeads > 0 ? (leadStatus.closed / totalLeads) * 100 : 0
      const responseRate = totalConversations > 0 ? 65 : 0 // Mock data
      const avgResponseTime = 2.5 // Mock data in hours
      const pipelineValue = totalLeads * 2500 // Mock average deal value

      // Calculate growth rates
      const weeklyGrowth = 12.5 // Mock data
      const monthlyGrowth = 28.3 // Mock data

      setAnalyticsData({
        totalLeads,
        qualifiedLeads,
        totalConversations,
        activeCampaigns,
        conversionRate,
        responseRate,
        avgResponseTime,
        pipelineValue,
        weeklyGrowth,
        monthlyGrowth,
        channelBreakdown,
        leadStatus,
        recentActivity: generateRecentActivity()
      })

    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateFromRange = (range: string) => {
    const now = new Date()
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const generateRecentActivity = () => {
    return [
      {
        id: '1',
        type: 'lead_created',
        description: 'New lead added: John Smith at TechCorp',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '2',
        type: 'message_sent',
        description: 'WhatsApp message sent to Sarah Johnson',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '3',
        type: 'lead_qualified',
        description: 'Lead qualified: Mike Davis (AI Score: 85)',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'success'
      },
      {
        id: '4',
        type: 'campaign_paused',
        description: 'Campaign "Q4 Outreach" paused due to low engagement',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'warning'
      }
    ]
  }

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'purple' 
  }: {
    title: string
    value: string | number
    icon: any
    trend?: 'up' | 'down'
    trendValue?: number
    color?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-normal mb-2">{title}</p>
            <p className="text-3xl font-medium text-white mb-2">
              {typeof value === 'number' && value >= 1000 
                ? `${(value / 1000).toFixed(1)}k` 
                : value}
            </p>
            {trend && trendValue && (
              <div className={`flex items-center text-sm ${
                trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {trendValue}% from last period
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 border border-${color}-500/30`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>
      </Card>
    </motion.div>
  )

  const ProgressBar = ({ value, max, label, color = 'purple' }: {
    value: number
    max: number
    label: string
    color?: string
  }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-white">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-medium text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your lead generation performance and campaign insights</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <Button variant="primary" aria-label="Export report">
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Leads"
          value={analyticsData.totalLeads}
          icon={Users}
          trend="up"
          trendValue={analyticsData.weeklyGrowth}
          color="blue"
        />
        <MetricCard
          title="Qualified Leads"
          value={analyticsData.qualifiedLeads}
          icon={Target}
          trend="up"
          trendValue={15.2}
          color="green"
        />
        <MetricCard
          title="Active Conversations"
          value={analyticsData.totalConversations}
          icon={MessageSquare}
          trend="up"
          trendValue={8.7}
          color="purple"
        />
        <MetricCard
          title="Pipeline Value"
          value={`$${(analyticsData.pipelineValue / 1000).toFixed(0)}k`}
          icon={TrendingUp}
          trend="up"
          trendValue={analyticsData.monthlyGrowth}
          color="orange"
        />
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
            Conversion Rate
          </h3>
          <div className="text-3xl font-medium text-white mb-2">
            {analyticsData.conversionRate.toFixed(1)}%
          </div>
          <ProgressBar
            value={analyticsData.conversionRate}
            max={100}
            label="Target: 15%"
            color="green"
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <MousePointer className="w-5 h-5 mr-2 text-blue-400" />
            Response Rate
          </h3>
          <div className="text-3xl font-medium text-white mb-2">
            {analyticsData.responseRate.toFixed(1)}%
          </div>
          <ProgressBar
            value={analyticsData.responseRate}
            max={100}
            label="Industry avg: 45%"
            color="blue"
          />
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-400" />
            Avg Response Time
          </h3>
          <div className="text-3xl font-medium text-white mb-2">
            {analyticsData.avgResponseTime}h
          </div>
          <div className="text-sm text-gray-400">
            Target: &lt; 4 hours
          </div>
        </Card>
      </motion.div>

      {/* Channel Breakdown & Lead Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-purple-400" />
            Channel Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.channelBreakdown).map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 bg-${getChannelColor(channel)}-500`}></div>
                  <span className="text-gray-300 capitalize">{channel}</span>
                </div>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Lead Status Pipeline
          </h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.leadStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 bg-${getStatusColor(status)}-500`}></div>
                  <span className="text-gray-300 capitalize">{status}</span>
                </div>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${
                    activity.status === 'success' ? 'bg-green-500/20' : 
                    activity.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    {activity.status === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                     activity.status === 'warning' ? <AlertCircle className="w-4 h-4 text-yellow-400" /> :
                     <XCircle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div>
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

function getChannelColor(channel: string): string {
  const colors: { [key: string]: string } = {
    whatsapp: 'green',
    instagram: 'pink',
    facebook: 'blue',
    x: 'gray',
    linkedin: 'blue'
  }
  return colors[channel] || 'gray'
}

function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    new: 'gray',
    qualified: 'green',
    contacted: 'blue',
    engaged: 'purple',
    booked: 'orange',
    closed: 'green'
  }
  return colors[status] || 'gray'
} 