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
  BarChart3
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
      change: "0",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Qualified Leads",
      value: "0",
      change: "15.2% from last period",
      icon: Target,
      color: "text-green-400",
      trend: "up"
    },
    {
      title: "Active Conversations",
      value: "0",
      change: "8.7% from last period",
      icon: MessageSquare,
      color: "text-purple-400",
      trend: "up"
    },
    {
      title: "Pipeline Value",
      value: "$0k",
      change: "0",
      icon: TrendingUp,
      color: "text-orange-400"
    }
  ]

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "0.0%",
      target: "15%",
      icon: BarChart3,
      color: "text-purple-400",
      progress: 0
    },
    {
      title: "Response Rate",
      value: "0.0%",
      target: "45%",
      icon: MousePointer,
      color: "text-blue-400",
      progress: 0
    },
    {
      title: "Avg Response Time",
      value: "0h",
      target: "< 4 hours",
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

  return (
    <div ref={dashboardRef} className="min-h-screen bg-[#0a0a0a] p-4 w-full pl-4">
      <div className="w-full">
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
      </div>
    </div>
  )
} 