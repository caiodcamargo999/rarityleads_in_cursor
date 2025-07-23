"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Instagram, 
  Plus, 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Heart,
  Share2,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function InstagramPage() {
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: 'Connected Accounts', value: '2', icon: Instagram, color: 'text-pink-500' },
    { label: 'Total Followers', value: '1,247', icon: Users, color: 'text-blue-500' },
    { label: 'Engagement Rate', value: '4.2%', icon: Heart, color: 'text-red-500' },
    { label: 'Messages Sent', value: '89', icon: MessageSquare, color: 'text-green-500' }
  ]

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
          <h1 className="text-2xl font-medium text-dark-text mb-2">
            Instagram Outreach
          </h1>
          <p className="text-base text-dark-text-secondary">
            Connect and engage with prospects on Instagram
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

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-12"
        >
          <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-text mb-2">Instagram Integration Coming Soon</h3>
          <p className="text-dark-text-secondary mb-6 max-w-md mx-auto">
            We're working on bringing Instagram outreach capabilities to Rarity Leads. 
            You'll be able to connect your Instagram accounts and engage with prospects directly.
          </p>
          <Button variant="outline">
            Get Notified
          </Button>
        </motion.div>
      </div>
    </div>
  )
} 