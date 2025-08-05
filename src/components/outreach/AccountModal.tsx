"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  X, 
  Settings, 
  Users, 
  MessageSquare, 
  Target, 
  Phone,
  Mail,
  Calendar,
  Save,
  Edit3,
  Eye,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  QrCode,
  Shield,
  Key
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Account {
  id: string
  name: string
  channel: 'whatsapp' | 'linkedin' | 'instagram' | 'facebook' | 'x' | 'email' | 'sms'
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  phone_number?: string
  email?: string
  username?: string
  access_token?: string
  refresh_token?: string
  expires_at?: string
  is_default: boolean
  created_at: string
  updated_at: string
  last_used?: string
  message_count: number
  lead_count: number
  user_id?: string
}

interface AccountModalProps {
  account: Account | null
  isOpen: boolean
  onClose: () => void
  onSave?: (account: Account) => void
  onDelete?: (id: string) => void
  onConnect?: (id: string) => void
  onDisconnect?: (id: string) => void
  onSetDefault?: (id: string) => void
}

export default function AccountModal({ 
  account, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  onConnect,
  onDisconnect,
  onSetDefault
}: AccountModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    channel: 'whatsapp',
    phone_number: '',
    email: '',
    username: '',
    is_default: false
  })

  // Handle deep linking - open modal if account ID is in URL
  useEffect(() => {
    const accountId = searchParams?.get('id')
    if (accountId && !isOpen && account?.id === accountId) {
      // Modal should already be open if account matches
    }
  }, [searchParams, isOpen, account])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && account) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', account.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, account, router])

  // Initialize form data when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        channel: account.channel,
        phone_number: account.phone_number,
        email: account.email,
        username: account.username,
        is_default: account.is_default
      })
    }
  }, [account])

  const handleSave = async () => {
    if (!account) return
    
    setIsLoading(true)
    try {
      const updatedAccount = {
        ...account,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      if (onSave) {
        await onSave(updatedAccount)
      }
      
      toast({
        title: t('common.saved'),
        description: t('outreach.accountSaved'),
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('outreach.accountSaveError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!account) return
    
    setIsLoading(true)
    try {
      if (onConnect) {
        await onConnect(account.id)
      }
      
      setShowQR(true)
      toast({
        title: t('outreach.connecting'),
        description: t('outreach.scanQRCode'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('outreach.connectionError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!account) return
    
    if (confirm(t('outreach.confirmDisconnect'))) {
      setIsLoading(true)
      try {
        if (onDisconnect) {
          await onDisconnect(account.id)
        }
        
        toast({
          title: t('outreach.disconnected'),
          description: t('outreach.accountDisconnected'),
        })
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('outreach.disconnectError'),
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSetDefault = async () => {
    if (!account) return
    
    setIsLoading(true)
    try {
      if (onSetDefault) {
        await onSetDefault(account.id)
      }
      
      toast({
        title: t('outreach.defaultSet'),
        description: t('outreach.defaultAccountUpdated'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('outreach.setDefaultError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!account) return
    
    if (confirm(t('outreach.confirmDeleteAccount'))) {
      setIsLoading(true)
      try {
        if (onDelete) {
          await onDelete(account.id)
        }
        
        toast({
          title: t('common.deleted'),
          description: t('outreach.accountDeleted'),
        })
        
        onClose()
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('outreach.accountDeleteError'),
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return MessageSquare
      case 'linkedin': return Users
      case 'instagram': return Target
      case 'facebook': return Users
      case 'x': return MessageSquare
      case 'email': return Mail
      case 'sms': return Phone
      default: return MessageSquare
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-gray-500'
      case 'connecting': return 'bg-blue-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return t('outreach.status.connected')
      case 'disconnected': return t('outreach.status.disconnected')
      case 'connecting': return t('outreach.status.connecting')
      case 'error': return t('outreach.status.error')
      default: return 'Unknown'
    }
  }

  const ChannelIcon = account ? getChannelIcon(account.channel) : MessageSquare

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
                <ChannelIcon className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-medium text-foreground">
                    <ClientOnly fallback="Account Details">
                      {account ? (isEditing ? t('outreach.editAccount') : t('outreach.accountDetails')) : t('outreach.newAccount')}
                    </ClientOnly>
                  </h2>
                  {account && (
                    <p className="text-sm text-muted-foreground">
                      {t('outreach.channel')}: {t(`outreach.channels.${account.channel}`)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {account && !isEditing && (
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
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('outreach.accountName')}
                      </label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('outreach.enterAccountName')}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('outreach.channel')}
                        </label>
                        <Select
                          value={formData.channel || 'whatsapp'}
                          onValueChange={(value) => setFormData({ ...formData, channel: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">{t('outreach.channels.whatsapp')}</SelectItem>
                            <SelectItem value="linkedin">{t('outreach.channels.linkedin')}</SelectItem>
                            <SelectItem value="instagram">{t('outreach.channels.instagram')}</SelectItem>
                            <SelectItem value="facebook">{t('outreach.channels.facebook')}</SelectItem>
                            <SelectItem value="x">{t('outreach.channels.x')}</SelectItem>
                            <SelectItem value="email">{t('outreach.channels.email')}</SelectItem>
                            <SelectItem value="sms">{t('outreach.channels.sms')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('outreach.phoneNumber')}
                        </label>
                        <Input
                          value={formData.phone_number || ''}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder={t('outreach.enterPhoneNumber')}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('outreach.email')}
                        </label>
                        <Input
                          value={formData.email || ''}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('outreach.enterEmail')}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t('outreach.username')}
                        </label>
                        <Input
                          value={formData.username || ''}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder={t('outreach.enterUsername')}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {account && (
                      <>
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {account.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(account.status)}>
                              {getStatusText(account.status)}
                            </Badge>
                            {account.is_default && (
                              <Badge variant="secondary">
                                {t('outreach.default')}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('outreach.accountInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.channel')}:</span>
                                <div className="flex items-center gap-2">
                                  <ChannelIcon className="w-4 h-4" />
                                  <span className="text-foreground">{t(`outreach.channels.${account.channel}`)}</span>
                                </div>
                              </div>
                              {account.phone_number && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.phoneNumber')}:</span>
                                  <span className="text-foreground">{account.phone_number}</span>
                                </div>
                              )}
                              {account.email && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.email')}:</span>
                                  <span className="text-foreground">{account.email}</span>
                                </div>
                              )}
                              {account.username && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.username')}:</span>
                                  <span className="text-foreground">{account.username}</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('outreach.accountStats')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.messages')}:</span>
                                <span className="text-foreground">{account.message_count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.leads')}:</span>
                                <span className="text-foreground">{account.lead_count}</span>
                              </div>
                              {account.last_used && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.lastUsed')}:</span>
                                  <span className="text-foreground">
                                    {new Date(account.last_used).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        {showQR && account.channel === 'whatsapp' && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('outreach.scanQRCode')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                              <div className="bg-white p-4 rounded-lg inline-block">
                                <QrCode className="w-32 h-32 text-black" />
                              </div>
                              <p className="text-sm text-muted-foreground mt-4">
                                {t('outreach.scanQRDescription')}
                              </p>
                            </CardContent>
                          </Card>
                        )}
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
                      {t('outreach.quickActions')}
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
                          {account && account.status === 'disconnected' && (
                            <Button
                              onClick={handleConnect}
                              disabled={isLoading}
                              className="w-full"
                              aria-label={t('outreach.connect')}
                            >
                              <Wifi className="w-4 h-4 mr-2" />
                              {t('outreach.connect')}
                            </Button>
                          )}
                          {account && account.status === 'connected' && (
                            <>
                              <Button
                                variant="outline"
                                onClick={handleDisconnect}
                                disabled={isLoading}
                                className="w-full"
                                aria-label={t('outreach.disconnect')}
                              >
                                <WifiOff className="w-4 h-4 mr-2" />
                                {t('outreach.disconnect')}
                              </Button>
                              {!account.is_default && (
                                <Button
                                  variant="outline"
                                  onClick={handleSetDefault}
                                  disabled={isLoading}
                                  className="w-full"
                                  aria-label={t('outreach.setDefault')}
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  {t('outreach.setDefault')}
                                </Button>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {account && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        {t('outreach.accountInfo')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('outreach.created')}:</span>
                          <span className="text-foreground">
                            {new Date(account.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('outreach.updated')}:</span>
                          <span className="text-foreground">
                            {new Date(account.updated_at).toLocaleDateString()}
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