"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  X, 
  Settings, 
  User, 
  Shield, 
  Bell, 
  CreditCard,
  Save,
  Edit3,
  Eye,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  Globe,
  Palette,
  Mail,
  Phone,
  Building
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Settings {
  id: string
  type: 'profile' | 'security' | 'notifications' | 'billing' | 'team' | 'integrations' | 'appearance'
  title: string
  description: string
  data: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
  user_id?: string
}

interface SettingsModalProps {
  settings: Settings | null
  isOpen: boolean
  onClose: () => void
  onSave?: (settings: Settings) => void
  onDelete?: (id: string) => void
  onToggle?: (id: string, isActive: boolean) => void
}

export default function SettingsModal({ 
  settings, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  onToggle
}: SettingsModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Settings>>({
    title: '',
    description: '',
    data: {},
    is_active: true
  })

  // Handle deep linking - open modal if settings ID is in URL
  useEffect(() => {
    const settingsId = searchParams?.get('id')
    if (settingsId && !isOpen && settings?.id === settingsId) {
      // Modal should already be open if settings matches
    }
  }, [searchParams, isOpen, settings])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && settings) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', settings.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, settings, router])

  // Initialize form data when settings changes
  useEffect(() => {
    if (settings) {
      setFormData({
        title: settings.title,
        description: settings.description,
        data: settings.data,
        is_active: settings.is_active
      })
    }
  }, [settings])

  const handleSave = async () => {
    if (!settings) return
    
    setIsLoading(true)
    try {
      const updatedSettings = {
        ...settings,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      if (onSave) {
        await onSave(updatedSettings)
      }
      
      toast({
        title: t('common.saved'),
        description: t('settings.settingsSaved'),
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.settingsSaveError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (isActive: boolean) => {
    if (!settings) return
    
    setIsLoading(true)
    try {
      if (onToggle) {
        await onToggle(settings.id, isActive)
      }
      
      toast({
        title: isActive ? t('settings.enabled') : t('settings.disabled'),
        description: t('settings.settingsUpdated'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('settings.settingsUpdateError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!settings) return
    
    if (confirm(t('settings.confirmDeleteSettings'))) {
      setIsLoading(true)
      try {
        if (onDelete) {
          await onDelete(settings.id)
        }
        
        toast({
          title: t('common.deleted'),
          description: t('settings.settingsDeleted'),
        })
        
        onClose()
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('settings.settingsDeleteError'),
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getSettingsIcon = (type: string) => {
    switch (type) {
      case 'profile': return User
      case 'security': return Shield
      case 'notifications': return Bell
      case 'billing': return CreditCard
      case 'team': return Building
      case 'integrations': return Globe
      case 'appearance': return Palette
      default: return Settings
    }
  }

  const getSettingsTypeText = (type: string) => {
    switch (type) {
      case 'profile': return t('settings.types.profile')
      case 'security': return t('settings.types.security')
      case 'notifications': return t('settings.types.notifications')
      case 'billing': return t('settings.types.billing')
      case 'team': return t('settings.types.team')
      case 'integrations': return t('settings.types.integrations')
      case 'appearance': return t('settings.types.appearance')
      default: return type
    }
  }

  const SettingsIcon = settings ? getSettingsIcon(settings.type) : Settings

  const renderSettingsForm = () => {
    if (!settings) return null

    switch (settings.type) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.fullName')}
              </label>
              <Input
                value={formData.data?.full_name || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, full_name: e.target.value }
                })}
                placeholder={t('settings.enterFullName')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.email')}
              </label>
              <Input
                value={formData.data?.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, email: e.target.value }
                })}
                placeholder={t('settings.enterEmail')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.phone')}
              </label>
              <Input
                value={formData.data?.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, phone: e.target.value }
                })}
                placeholder={t('settings.enterPhone')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.company')}
              </label>
              <Input
                value={formData.data?.company || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, company: e.target.value }
                })}
                placeholder={t('settings.enterCompany')}
                className="w-full"
              />
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.currentPassword')}
              </label>
              <Input
                type="password"
                value={formData.data?.current_password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, current_password: e.target.value }
                })}
                placeholder={t('settings.enterCurrentPassword')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.newPassword')}
              </label>
              <Input
                type="password"
                value={formData.data?.new_password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, new_password: e.target.value }
                })}
                placeholder={t('settings.enterNewPassword')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.confirmPassword')}
              </label>
              <Input
                type="password"
                value={formData.data?.confirm_password || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  data: { ...formData.data, confirm_password: e.target.value }
                })}
                placeholder={t('settings.confirmNewPassword')}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {t('settings.twoFactorAuth')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.twoFactorDescription')}
                </p>
              </div>
              <Switch
                checked={formData.data?.two_factor_enabled || false}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  data: { ...formData.data, two_factor_enabled: checked }
                })}
              />
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {t('settings.emailNotifications')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.emailNotificationsDescription')}
                </p>
              </div>
              <Switch
                checked={formData.data?.email_notifications || false}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  data: { ...formData.data, email_notifications: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {t('settings.pushNotifications')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.pushNotificationsDescription')}
                </p>
              </div>
              <Switch
                checked={formData.data?.push_notifications || false}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  data: { ...formData.data, push_notifications: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">
                  {t('settings.smsNotifications')}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t('settings.smsNotificationsDescription')}
                </p>
              </div>
              <Switch
                checked={formData.data?.sms_notifications || false}
                onCheckedChange={(checked) => setFormData({
                  ...formData,
                  data: { ...formData.data, sms_notifications: checked }
                })}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.title')}
              </label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('settings.enterTitle')}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.description')}
              </label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('settings.enterDescription')}
                className="w-full"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-medium text-foreground">
                    <ClientOnly fallback="Settings Details">
                      {settings ? (isEditing ? t('settings.editSettings') : t('settings.settingsDetails')) : t('settings.newSettings')}
                    </ClientOnly>
                  </h2>
                  {settings && (
                    <p className="text-sm text-muted-foreground">
                      {t('settings.type')}: {getSettingsTypeText(settings.type)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings && !isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      aria-label={t('common.edit')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      aria-label={t('common.delete')}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label={t('common.close')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Main Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {isEditing ? (
                  renderSettingsForm()
                ) : (
                  <div className="space-y-6">
                    {settings && (
                      <>
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {settings.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {settings.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('settings.settingsInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('settings.type')}:</span>
                                <Badge variant="secondary">
                                  {getSettingsTypeText(settings.type)}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('settings.status')}:</span>
                                <Badge className={settings.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                                  {settings.is_active ? t('settings.active') : t('settings.inactive')}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('settings.settingsData')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {Object.entries(settings.data).map(([key, value]) => (
                                  <div key={key} className="flex justify-between p-2 bg-muted rounded">
                                    <span className="text-sm text-foreground">{key}:</span>
                                    <span className="text-sm text-muted-foreground">
                                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                    </span>
                                  </div>
                                ))}
                                {Object.keys(settings.data).length === 0 && (
                                  <p className="text-sm text-muted-foreground text-center">
                                    {t('settings.noData')}
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border p-6 bg-muted/30">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      {t('settings.quickActions')}
                    </h3>
                    <div className="space-y-2">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full"
                            aria-label={t('common.save')}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {t('common.save')}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                            className="w-full"
                            aria-label={t('common.cancel')}
                          >
                            {t('common.cancel')}
                          </Button>
                        </>
                      ) : (
                        <>
                          {settings && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{t('settings.enabled')}</span>
                              <Switch
                                checked={settings.is_active}
                                onCheckedChange={handleToggle}
                                disabled={isLoading}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {settings && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        {t('settings.settingsInfo')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('settings.created')}:</span>
                          <span className="text-foreground">
                            {new Date(settings.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('settings.updated')}:</span>
                          <span className="text-foreground">
                            {new Date(settings.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 