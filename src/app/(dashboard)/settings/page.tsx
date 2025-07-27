"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  User, 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  FileText, 
  CreditCard, 
  Users, 
  Bell,
  Shield,
  Key,
  Building2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { ClientOnly } from '@/components/ClientOnly'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const isDarkTheme = theme === 'dark'
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  })

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
      setLoading(false)
    }
    checkUser()
  }, [])

  const handleThemeToggle = () => {
    setTheme(isDarkTheme ? 'light' : 'dark')
  }

  const handleNotificationToggle = (type: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }))
  }

  const handleSettingsClick = (page: string) => {
    router.push(`/settings/${page}`)
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // In a real implementation, you'd save profile data to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: t('common.success'),
        description: 'Profile updated successfully'
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error?.message || 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <ClientOnly fallback="Settings">
            {t('settings.title')}
          </ClientOnly>
        </h1>
        <p className="text-muted-foreground mt-1">
          <ClientOnly fallback="Manage your account settings and preferences">
            {t('settings.description')}
          </ClientOnly>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Profile Settings">
                  {t('settings.profile.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Update your personal information">
                  {t('settings.profile.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  <ClientOnly fallback="Full Name">
                    {t('settings.profile.fullName')}
                  </ClientOnly>
                </Label>
                <Input
                  id="name"
                  defaultValue={user?.user_metadata?.full_name || ''}
                />
              </div>
              <div>
                <Label htmlFor="email">
                  <ClientOnly fallback="Email">
                    {t('settings.profile.email')}
                  </ClientOnly>
                </Label>
                <Input
                  id="email"
                  defaultValue={user?.email || ''}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="company">
                  <ClientOnly fallback="Company">
                    {t('settings.profile.company')}
                  </ClientOnly>
                </Label>
                <Input
                  id="company"
                  defaultValue={user?.user_metadata?.company || ''}
                />
              </div>
              <Button 
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ClientOnly fallback="Saving...">
                    Saving...
                  </ClientOnly>
                ) : (
                  <ClientOnly fallback="Save Changes">
                    {t('settings.profile.saveChanges')}
                  </ClientOnly>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance & Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Appearance & Language">
                  {t('settings.appearance.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Customize your interface">
                  {t('settings.appearance.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div>
                <Label className="mb-3 block">
                  <ClientOnly fallback="Theme">
                    {t('settings.appearance.theme')}
                  </ClientOnly>
                </Label>
                <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={theme === 'light' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="flex-1 h-10"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    <ClientOnly fallback="Light">
                      {t('settings.appearance.light')}
                    </ClientOnly>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="flex-1 h-10"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    <ClientOnly fallback="Dark">
                      {t('settings.appearance.dark')}
                    </ClientOnly>
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div>
                <Label className="mb-2 block">
                  <ClientOnly fallback="Language">
                    {t('settings.appearance.language')}
                  </ClientOnly>
                </Label>
                <LanguageSwitcher />
              </div>

              {/* Additional Appearance Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <Label>
                      <ClientOnly fallback="System Language">
                        System Language
                      </ClientOnly>
                    </Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <Label>
                      <ClientOnly fallback="Compact Mode">
                        Compact Mode
                      </ClientOnly>
                    </Label>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Notifications">
                  {t('settings.notifications.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Manage your notification preferences">
                  {t('settings.notifications.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  <ClientOnly fallback="Email Notifications">
                    {t('settings.notifications.email')}
                  </ClientOnly>
                </Label>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={() => handleNotificationToggle('email')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>
                  <ClientOnly fallback="Push Notifications">
                    {t('settings.notifications.push')}
                  </ClientOnly>
                </Label>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={() => handleNotificationToggle('push')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>
                  <ClientOnly fallback="SMS Notifications">
                    {t('settings.notifications.sms')}
                  </ClientOnly>
                </Label>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={() => handleNotificationToggle('sms')}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => handleSettingsClick('notifications')}
              >
                <Bell className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Manage All Notifications">
                  Manage All Notifications
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Security">
                  {t('settings.security.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Manage your account security">
                  {t('settings.security.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSettingsClick('change-password')}
              >
                <Key className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Change Password">
                  {t('settings.security.changePassword')}
                </ClientOnly>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSettingsClick('two-factor')}
              >
                <Shield className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Two-Factor Authentication">
                  {t('settings.security.twoFactor')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Billing & Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Billing & Plan">
                  {t('settings.billing.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Manage your subscription and billing">
                  {t('settings.billing.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    <ClientOnly fallback="Current Plan">
                      {t('settings.billing.currentPlan')}
                    </ClientOnly>
                  </span>
                  <span className="text-primary font-medium">Pro</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1">
                  <ClientOnly fallback="$97/month">
                    {t('settings.billing.price')}
                  </ClientOnly>
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSettingsClick('billing')}
              >
                <ClientOnly fallback="Manage Billing">
                  {t('settings.billing.manageBilling')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Team Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <ClientOnly fallback="Team Management">
                  {t('settings.team.title')}
                </ClientOnly>
              </CardTitle>
              <CardDescription>
                <ClientOnly fallback="Manage your team members and permissions">
                  {t('settings.team.description')}
                </ClientOnly>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    <ClientOnly fallback="Team Members">
                      {t('settings.team.members')}
                    </ClientOnly>
                  </span>
                  <span className="text-primary font-medium">1/5</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSettingsClick('team')}
              >
                <Users className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Invite Team Member">
                  {t('settings.team.inviteMember')}
                </ClientOnly>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 