"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Bell, Mail, Smartphone, MessageSquare, Users, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

interface NotificationSettings {
  email: {
    newLeads: boolean
    leadConversions: boolean
    campaignUpdates: boolean
    billing: boolean
    security: boolean
  }
  push: {
    newLeads: boolean
    leadConversions: boolean
    campaignUpdates: boolean
    messages: boolean
  }
  sms: {
    urgentLeads: boolean
    highValueConversions: boolean
  }
}

export default function NotificationsPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      newLeads: true,
      leadConversions: true,
      campaignUpdates: false,
      billing: true,
      security: true
    },
    push: {
      newLeads: true,
      leadConversions: false,
      campaignUpdates: false,
      messages: true
    },
    sms: {
      urgentLeads: false,
      highValueConversions: false
    }
  })

  const handleToggleSetting = async (category: keyof NotificationSettings, setting: string) => {
    setLoading(true)
    try {
      // Update local state
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
        }
      }))

      // In a real implementation, you'd save to Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          notification_settings: settings
        })

      if (error) {
        throw error
      }

      toast({
        title: t('common.success'),
        description: 'Notification settings updated'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to update settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAll = async () => {
    setLoading(true)
    try {
      // In a real implementation, you'd save all settings to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: t('common.success'),
        description: 'All notification settings saved'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to save settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <ClientOnly fallback="Back">
            {t('common.back')}
          </ClientOnly>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            <ClientOnly fallback="Notifications">
              {t('settings.notifications.title')}
            </ClientOnly>
          </h1>
          <p className="text-gray-400 mt-1">
            <ClientOnly fallback="Manage your notification preferences">
              Manage your notification preferences
            </ClientOnly>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Email Notifications">
                  {t('settings.notifications.email')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Receive notifications via email">
                  Receive notifications via email
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">New Leads</p>
                    <p className="text-gray-400 text-sm">When new leads are generated</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email.newLeads}
                  onCheckedChange={() => handleToggleSetting('email', 'newLeads')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Lead Conversions</p>
                    <p className="text-gray-400 text-sm">When leads convert to customers</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email.leadConversions}
                  onCheckedChange={() => handleToggleSetting('email', 'leadConversions')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Campaign Updates</p>
                    <p className="text-gray-400 text-sm">Campaign performance and updates</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email.campaignUpdates}
                  onCheckedChange={() => handleToggleSetting('email', 'campaignUpdates')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Billing & Security</p>
                    <p className="text-gray-400 text-sm">Important account updates</p>
                  </div>
                </div>
                <Switch
                  checked={settings.email.billing && settings.email.security}
                  onCheckedChange={() => {
                    handleToggleSetting('email', 'billing')
                    handleToggleSetting('email', 'security')
                  }}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Push Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Push Notifications">
                  {t('settings.notifications.push')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Receive notifications in your browser">
                  Receive notifications in your browser
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">New Leads</p>
                    <p className="text-gray-400 text-sm">Real-time lead notifications</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push.newLeads}
                  onCheckedChange={() => handleToggleSetting('push', 'newLeads')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">New Messages</p>
                    <p className="text-gray-400 text-sm">When you receive messages</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push.messages}
                  onCheckedChange={() => handleToggleSetting('push', 'messages')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Lead Conversions</p>
                    <p className="text-gray-400 text-sm">Conversion milestone alerts</p>
                  </div>
                </div>
                <Switch
                  checked={settings.push.leadConversions}
                  onCheckedChange={() => handleToggleSetting('push', 'leadConversions')}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SMS Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                <ClientOnly fallback="SMS Notifications">
                  {t('settings.notifications.sms')}
                </ClientOnly>
              </CardTitle>
              <CardDescription className="text-gray-400">
                <ClientOnly fallback="Receive urgent notifications via SMS">
                  Receive urgent notifications via SMS
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Urgent Leads</p>
                    <p className="text-gray-400 text-sm">High-priority lead alerts</p>
                  </div>
                </div>
                <Switch
                  checked={settings.sms.urgentLeads}
                  onCheckedChange={() => handleToggleSetting('sms', 'urgentLeads')}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">High-Value Conversions</p>
                    <p className="text-gray-400 text-sm">Major deal closures</p>
                  </div>
                </div>
                <Switch
                  checked={settings.sms.highValueConversions}
                  onCheckedChange={() => handleToggleSetting('sms', 'highValueConversions')}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSaveAll}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <ClientOnly fallback="Saving...">
                Saving...
              </ClientOnly>
            ) : (
              <ClientOnly fallback="Save All Settings">
                Save All Settings
              </ClientOnly>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
} 