"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  MessageSquare, 
  Plus, 
  Users, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Send,
  Settings,
  BarChart3,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  leads: number
  sent: number
  responses: number
  conversionRate: number
  lastSent: string
  template: string
}

export default function WhatsAppPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: 'Active Campaigns', value: 0, icon: MessageSquare, color: 'text-green-500' },
    { label: 'Total Leads', value: 0, icon: Users, color: 'text-blue-500' },
    { label: 'Avg Response Rate', value: '0%', icon: Target, color: 'text-purple-500' },
    { label: 'Messages Sent Today', value: 0, icon: TrendingUp, color: 'text-yellow-500' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'draft': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'paused': return 'Paused'
      case 'completed': return 'Completed'
      case 'draft': return 'Draft'
      default: return 'Unknown'
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-bg p-4">
      <div className="w-full pl-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-dark-text mb-2">
                WhatsApp Outreach
              </h1>
              <p className="text-base text-dark-text-secondary">
                Manage your WhatsApp campaigns and conversations
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/dashboard/outreach/whatsapp/accounts">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Accounts
                </Button>
              </Link>
              <Link href="/dashboard/outreach/whatsapp/conversations">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Conversations
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
          </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-text-muted">{stat.label}</p>
                    <p className="text-lg font-medium text-dark-text">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-dark-bg-secondary border-dark-border hover:border-dark-border-secondary transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <MessageSquare className="w-8 h-8 text-rarity-500 mb-3" />
              <h3 className="text-lg font-medium text-dark-text mb-2">Create Campaign</h3>
              <p className="text-sm text-dark-text-secondary mb-4">Start a new WhatsApp outreach campaign</p>
              <Button variant="outline" size="sm" className="w-full">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-dark-bg-secondary border-dark-border hover:border-dark-border-secondary transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-rarity-500 mb-3" />
              <h3 className="text-lg font-medium text-dark-text mb-2">Import Leads</h3>
              <p className="text-sm text-dark-text-secondary mb-4">Upload your prospect list</p>
              <Button variant="outline" size="sm" className="w-full">
                Import CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-dark-bg-secondary border-dark-border hover:border-dark-border-secondary transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <BarChart3 className="w-8 h-8 text-rarity-500 mb-3" />
              <h3 className="text-lg font-medium text-dark-text mb-2">View Analytics</h3>
              <p className="text-sm text-dark-text-secondary mb-4">Track campaign performance</p>
              <Button variant="outline" size="sm" className="w-full">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Active Campaigns</CardTitle>
              <CardDescription className="text-dark-text-secondary">
                Manage your WhatsApp outreach campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-dark-bg border border-dark-border rounded-lg hover:bg-dark-bg-tertiary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-dark-text">{campaign.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)} text-white`}>
                          {getStatusText(campaign.status)}
                        </span>
                      </div>
                      <p className="text-sm text-dark-text-secondary mb-2">
                        {campaign.template.substring(0, 60)}...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-dark-text-muted">
                        <span>{campaign.leads} leads</span>
                        <span>{campaign.sent} sent</span>
                        <span>{campaign.responses} responses</span>
                        <span>{campaign.conversionRate}% rate</span>
                        <span>Last: {campaign.lastSent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Message sent', target: 'Sarah Johnson', time: '2 min ago', status: 'success' },
                  { action: 'Campaign started', target: 'Tech Startup Outreach', time: '1 hour ago', status: 'success' },
                  { action: 'Lead imported', target: '150 contacts', time: '3 hours ago', status: 'success' },
                  { action: 'Account connected', target: 'WhatsApp Business', time: '1 day ago', status: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm text-dark-text">
                        <span className="font-medium">{activity.action}</span> to {activity.target}
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