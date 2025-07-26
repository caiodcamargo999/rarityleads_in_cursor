"use client"

import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  ArrowRight,
  Plus,
  Calendar,
  CheckCircle,
  MousePointer,
  Clock,
  RefreshCw,
  BarChart3,
  Activity,
  Edit,
  Trash2,
  UserPlus,
  Send,
  Play,
  Pause
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// No user/session logic here; handled by layout

export default function DashboardPage() {
  const dashboardRef = useRef(null)
  const dashboardInView = useInView(dashboardRef, { once: true })

  const keyMetrics = [
    {
      title: "Total Leads",
      value: "0",
      change: "0%",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Qualified Leads",
      value: "0",
      change: "0%",
      icon: Target,
      color: "text-green-400",
      trend: "up"
    },
    {
      title: "Active Conversations",
      value: "0",
      change: "0%",
      icon: MessageSquare,
      color: "text-purple-400",
      trend: "up"
    },
    {
      title: "Pipeline Value",
      value: "$0k",
      change: "0%",
      icon: TrendingUp,
      color: "text-orange-400"
    }
  ]

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "0.0%",
      target: "0%",
      icon: BarChart3,
      color: "text-purple-400",
      progress: 0
    },
    {
      title: "Response Rate",
      value: "0.0%",
      target: "0%",
      icon: MousePointer,
      color: "text-blue-400",
      progress: 0
    },
    {
      title: "Avg Response Time",
      value: "0h",
      target: "0h",
      icon: Clock,
      color: "text-orange-400"
    }
  ]

  const channelBreakdown = [
    { name: "WhatsApp", leads: 0, color: "bg-green-400" },
    { name: "Instagram", leads: 0, color: "bg-purple-400" },
    { name: "LinkedIn", leads: 0, color: "bg-blue-400" },
    { name: "Facebook", leads: 0, color: "bg-indigo-400" },
    { name: "X (Twitter)", leads: 0, color: "bg-gray-400" }
  ]

  const leadStatusPipeline = [
    { status: "New", count: 0, color: "bg-gray-400" },
    { status: "Qualified", count: 0, color: "bg-green-400" },
    { status: "In Progress", count: 0, color: "bg-blue-400" },
    { status: "Converted", count: 0, color: "bg-purple-400" },
    { status: "Lost", count: 0, color: "bg-red-400" }
  ]

  const activityFeed = [
    { id: 1, type: 'lead_created', user: 'Alice', time: '2 min ago', desc: 'Created a new lead: John Smith', icon: UserPlus },
    { id: 2, type: 'lead_edited', user: 'Bob', time: '10 min ago', desc: 'Edited lead: Sarah Johnson', icon: Edit },
    { id: 3, type: 'campaign_launched', user: 'Alice', time: '30 min ago', desc: 'Launched campaign: Spring SaaS Push', icon: Play },
    { id: 4, type: 'lead_deleted', user: 'Charlie', time: '1 hour ago', desc: 'Deleted lead: Mike Wilson', icon: Trash2 },
    { id: 5, type: 'message_sent', user: 'Alice', time: '2 hours ago', desc: 'Sent WhatsApp message to John Smith', icon: Send },
    { id: 6, type: 'campaign_paused', user: 'Bob', time: '3 hours ago', desc: 'Paused campaign: LinkedIn Outreach Q2', icon: Pause },
    { id: 7, type: 'lead_converted', user: 'Alice', time: '4 hours ago', desc: 'Converted lead: Sarah Johnson', icon: CheckCircle },
  ];

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#0a0a0a] w-full overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
            Dashboard
          </h1>
          <p className="text-base text-gray-400">
            Track your lead generation performance and campaign insights
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 p-4">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    {metric.trend && (
                      <div className="flex items-center text-green-400 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metric.change}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                  <p className="text-2xl font-normal text-white leading-tight">{metric.value}</p>
                  {!metric.trend && (
                    <p className="text-xs text-gray-500 mt-1">{metric.change}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4"
        >
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300 p-4">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <metric.icon className={`w-5 h-5 ${metric.color} mr-2`} />
                    <h3 className="text-base font-normal text-white leading-tight">{metric.title}</h3>
                  </div>
                  <div className="mb-2">
                    <p className="text-xl font-normal text-white leading-tight">{metric.value}</p>
                    <p className="text-xs text-gray-400 leading-tight">Target: {metric.target}</p>
                  </div>
                  {metric.progress !== undefined && (
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-[#8b5cf6] h-1 rounded-full transition-all duration-300"
                        style={{ width: `${metric.progress}%` }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Breakdown and Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Channel Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={dashboardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-[#18181c] border border-gray-800 p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base font-normal text-white flex items-center leading-tight">
                  <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
                  Channel Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {channelBreakdown.map((channel, index) => (
                    <div key={channel.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${channel.color}`}></div>
                        <span className="text-white font-normal text-sm leading-tight">{channel.name}</span>
                      </div>
                      <span className="text-white font-normal text-sm leading-tight">{channel.leads} leads</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lead Status Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={dashboardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-[#18181c] border border-gray-800 p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-base font-normal text-white flex items-center leading-tight">
                  <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
                  Lead Status Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {leadStatusPipeline.map((status, index) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.color}`}></div>
                        <span className="text-white font-normal text-sm leading-tight">{status.status}</span>
                      </div>
                      <span className="text-white font-normal text-sm leading-tight">{status.count} leads</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={dashboardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full max-w-5xl mx-auto mt-8"
        >
          <h2 className="text-xl font-normal text-white mb-4">Recent Activity</h2>
          <div className="bg-[#18181c] border border-gray-800 rounded-xl p-4">
            {activityFeed.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No recent activity yet.</div>
            ) : (
              <ul className="divide-y divide-gray-800">
                {activityFeed.map((item, idx) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                    className="flex items-center gap-4 py-3"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#232336]">
                      <item.icon className="w-5 h-5 text-[#8b5cf6]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">{item.desc}</div>
                      <div className="text-xs text-gray-400">{item.user} • {item.time}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 