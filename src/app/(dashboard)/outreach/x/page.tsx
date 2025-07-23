"use client"

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Twitter, Users, MessageSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function XPage() {
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const stats = [
    { label: 'Followers', value: '1,892', icon: Users, color: 'text-blue-500' },
    { label: 'DMs Sent', value: '67', icon: MessageSquare, color: 'text-green-500' },
    { label: 'Response Rate', value: '6.2%', icon: BarChart3, color: 'text-purple-500' },
    { label: 'Leads Generated', value: '9', icon: Twitter, color: 'text-blue-400' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-bg p-4">
      <div className="w-full pl-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-medium text-dark-text mb-2">
            X (Twitter) Outreach
          </h1>
          <p className="text-base text-dark-text-secondary">
            Connect and engage with prospects on X (Twitter)
          </p>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center py-12"
        >
          <Twitter className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-text mb-2">X (Twitter) Integration Coming Soon</h3>
          <p className="text-dark-text-secondary mb-6 max-w-md mx-auto">
            We're working on bringing X (Twitter) outreach capabilities to Rarity Leads.
          </p>
          <Button variant="outline">Get Notified</Button>
        </motion.div>
      </div>
    </div>
  )
} 