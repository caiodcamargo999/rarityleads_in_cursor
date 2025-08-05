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
import { 
  X, 
  Send, 
  Clock, 
  Users, 
  Target, 
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Settings,
  Save,
  Edit3,
  Eye,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  title: string
  content: string
  channel: 'whatsapp' | 'linkedin' | 'instagram' | 'facebook' | 'x' | 'email' | 'sms'
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'failed'
  recipients: string[]
  scheduled_at?: string
  sent_at?: string
  created_at: string
  updated_at: string
  template_id?: string
  variables?: Record<string, string>
  user_id?: string
}

interface MessageModalProps {
  message: Message | null
  isOpen: boolean
  onClose: () => void
  onSave?: (message: Message) => void
  onDelete?: (id: string) => void
  onSend?: (id: string) => void
}

export default function MessageModal({ 
  message, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  onSend
}: MessageModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Message>>({
    title: '',
    content: '',
    channel: 'whatsapp',
    status: 'draft',
    recipients: [],
    scheduled_at: undefined
  })

  // Handle deep linking - open modal if message ID is in URL
  useEffect(() => {
    const messageId = searchParams?.get('id')
    if (messageId && !isOpen && message?.id === messageId) {
      // Modal should already be open if message matches
    }
  }, [searchParams, isOpen, message])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && message) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', message.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, message, router])

  // Initialize form data when message changes
  useEffect(() => {
    if (message) {
      setFormData({
        title: message.title,
        content: message.content,
        channel: message.channel,
        status: message.status,
        recipients: message.recipients,
        scheduled_at: message.scheduled_at
      })
    }
  }, [message])

  const handleSave = async () => {
    if (!message) return
    
    setIsLoading(true)
    try {
      const updatedMessage = {
        ...message,
        ...formData,
        updated_at: new Date().toISOString()
      }
      
      if (onSave) {
        await onSave(updatedMessage)
      }
      
      toast({
        title: t('common.saved'),
        description: t('outreach.messageSaved'),
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('outreach.messageSaveError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!message) return
    
    setIsLoading(true)
    try {
      if (onSend) {
        await onSend(message.id)
      }
      
      toast({
        title: t('outreach.messageSent'),
        description: t('outreach.messageSentDescription'),
      })
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('outreach.messageSendError'),
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!message) return
    
    if (confirm(t('outreach.confirmDeleteMessage'))) {
      setIsLoading(true)
      try {
        if (onDelete) {
          await onDelete(message.id)
        }
        
        toast({
          title: t('common.deleted'),
          description: t('outreach.messageDeleted'),
        })
        
        onClose()
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('outreach.messageDeleteError'),
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
      case 'draft': return 'bg-gray-500'
      case 'scheduled': return 'bg-blue-500'
      case 'sent': return 'bg-green-500'
      case 'delivered': return 'bg-green-600'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return t('outreach.status.draft')
      case 'scheduled': return t('outreach.status.scheduled')
      case 'sent': return t('outreach.status.sent')
      case 'delivered': return t('outreach.status.delivered')
      case 'failed': return t('outreach.status.failed')
      default: return 'Unknown'
    }
  }

  const ChannelIcon = message ? getChannelIcon(message.channel) : MessageSquare

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
                    <ClientOnly fallback="Message Details">
                      {message ? (isEditing ? t('outreach.editMessage') : t('outreach.messageDetails')) : t('outreach.newMessage')}
                    </ClientOnly>
                  </h2>
                  {message && (
                    <p className="text-sm text-muted-foreground">
                      {t('outreach.channel')}: {t(`outreach.channels.${message.channel}`)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {message && !isEditing && (
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
                        {t('outreach.messageTitle')}
                      </label>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={t('outreach.enterMessageTitle')}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t('outreach.messageContent')}
                      </label>
                      <Textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder={t('outreach.enterMessageContent')}
                        className="w-full min-h-[200px]"
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
                          {t('outreach.status')}
                        </label>
                        <Select
                          value={formData.status || 'draft'}
                          onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">{t('outreach.status.draft')}</SelectItem>
                            <SelectItem value="scheduled">{t('outreach.status.scheduled')}</SelectItem>
                            <SelectItem value="sent">{t('outreach.status.sent')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {message && (
                      <>
                        <div>
                          <h3 className="text-lg font-medium text-foreground mb-2">
                            {message.title}
                          </h3>
                          <div className="bg-muted rounded-lg p-4">
                            <p className="text-foreground whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('outreach.messageInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.channel')}:</span>
                                <div className="flex items-center gap-2">
                                  <ChannelIcon className="w-4 h-4" />
                                  <span className="text-foreground">{t(`outreach.channels.${message.channel}`)}</span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.status')}:</span>
                                <Badge className={getStatusColor(message.status)}>
                                  {getStatusText(message.status)}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('outreach.recipients')}:</span>
                                <span className="text-foreground">{message.recipients.length}</span>
                              </div>
                              {message.scheduled_at && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.scheduledFor')}:</span>
                                  <span className="text-foreground">
                                    {new Date(message.scheduled_at).toLocaleString()}
                                  </span>
                                </div>
                              )}
                              {message.sent_at && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">{t('outreach.sentAt')}:</span>
                                  <span className="text-foreground">
                                    {new Date(message.sent_at).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">{t('outreach.recipients')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {message.recipients.length > 0 ? (
                                <div className="space-y-2">
                                  {message.recipients.slice(0, 5).map((recipient, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                      <span className="text-sm text-foreground">{recipient}</span>
                                      <Button variant="ghost" size="sm" aria-label={t('common.copy')}>
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  {message.recipients.length > 5 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                      +{message.recipients.length - 5} {t('outreach.moreRecipients')}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground text-center">
                                  {t('outreach.noRecipients')}
                                </p>
                              )}
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
                          {message && message.status === 'draft' && (
                            <Button
                              onClick={handleSend}
                              disabled={isLoading}
                              className="w-full"
                              aria-label={t('outreach.sendMessage')}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {t('outreach.sendMessage')}
                            </Button>
                          )}
                          {message && message.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              onClick={handleSend}
                              disabled={isLoading}
                              className="w-full"
                              aria-label={t('outreach.sendNow')}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              {t('outreach.sendNow')}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {message && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">
                        {t('outreach.messageStats')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('outreach.created')}:</span>
                          <span className="text-foreground">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('outreach.updated')}:</span>
                          <span className="text-foreground">
                            {new Date(message.updated_at).toLocaleDateString()}
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