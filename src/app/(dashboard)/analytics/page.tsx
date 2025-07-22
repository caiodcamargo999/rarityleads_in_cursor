"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
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
  const [timeRange, setTimeRange] = useState('30d')
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: 'Total Leads', value: '1,247', change: '+12.5%', icon: Users, color: 'text-blue-500' },
    { label: 'Conversion Rate', value: '23.4%', change: '+2.1%', icon: Target, color: 'text-green-500' },
    { label: 'Messages Sent', value: '8,934', change: '+18.2%', icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Revenue Generated', value: '$47,892', change: '+15.7%', icon: TrendingUp, color: 'text-yellow-500' }
  ]

  const chartData = [
    { month: 'Jan', leads: 120, conversions: 28, revenue: 8500 },
    { month: 'Feb', leads: 145, conversions: 34, revenue: 10200 },
    { month: 'Mar', leads: 180, conversions: 42, revenue: 12800 },
    { month: 'Apr', leads: 210, conversions: 49, revenue: 15200 },
    { month: 'May', leads: 195, conversions: 46, revenue: 14100 },
    { month: 'Jun', leads: 230, conversions: 54, revenue: 16800 }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
            Analytics
          </h1>
          <p className="text-base text-gray-400">
            Track your analytics and campaign insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-dark-bg-secondary border-dark-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm text-dark-text-muted mb-1">{stat.label}</p>
                <p className="text-2xl font-medium text-dark-text">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Leads & Conversions Chart */}
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Leads & Conversions</CardTitle>
              <CardDescription className="text-dark-text-secondary">
                Monthly lead generation and conversion trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-secondary w-12">{data.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-16 bg-blue-500/20 rounded h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded transition-all duration-300"
                            style={{ width: `${(data.leads / 250) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-text-secondary">{data.leads} leads</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-green-500/20 rounded h-2">
                          <div 
                            className="bg-green-500 h-2 rounded transition-all duration-300"
                            style={{ width: `${(data.conversions / 60) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-text-secondary">{data.conversions} conversions</span>
                      </div>
                    </div>
                    <span className="text-sm text-dark-text font-medium">${data.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Performance Metrics</CardTitle>
              <CardDescription className="text-dark-text-secondary">
                Key performance indicators and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { label: 'Lead Response Time', value: '2.4h', target: '4h', status: 'good' },
                  { label: 'Conversion Rate', value: '23.4%', target: '20%', status: 'good' },
                  { label: 'Cost per Lead', value: '$47', target: '$50', status: 'good' },
                  { label: 'Customer Lifetime Value', value: '$2,847', target: '$2,500', status: 'excellent' }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-dark-text-secondary">{metric.label}</p>
                      <p className="text-lg font-medium text-dark-text">{metric.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-dark-text-muted">Target: {metric.target}</p>
                      <span className={`text-xs font-medium ${
                        metric.status === 'excellent' ? 'text-green-500' : 
                        metric.status === 'good' ? 'text-blue-500' : 'text-yellow-500'
                      }`}>
                        {metric.status === 'excellent' ? 'Excellent' : 
                         metric.status === 'good' ? 'Good' : 'Needs Improvement'}
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
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Recent Activity</CardTitle>
              <CardDescription className="text-dark-text-secondary">
                Latest lead generation activities and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'New lead qualified', target: 'Sarah Johnson - TechCorp', time: '2 min ago', type: 'success' },
                  { action: 'Campaign completed', target: 'Q1 SaaS Outreach', time: '1 hour ago', type: 'info' },
                  { action: 'Lead converted', target: 'Michael Chen - Innovate Labs', time: '3 hours ago', type: 'success' },
                  { action: 'Account connected', target: 'WhatsApp Business', time: '1 day ago', type: 'info' },
                  { action: 'Import completed', target: '150 new leads', time: '2 days ago', type: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-dark-text">
                        <span className="font-medium">{activity.action}</span> - {activity.target}
                      </p>
                      <p className="text-xs text-dark-text-muted">{activity.time}</p>
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