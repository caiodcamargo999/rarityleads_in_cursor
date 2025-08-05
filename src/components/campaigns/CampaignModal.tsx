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
  Target, 
  Users, 
  Calendar,
  BarChart3,
  MessageSquare,
  Globe,
  Save,
  Edit3,
  Trash2,
  Plus,
  ExternalLink,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Linkedin
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Campaign {
  id: string
  name: string
  description?: string
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived'
  type: 'email' | 'whatsapp' | 'linkedin' | 'multi_channel'
  target_audience?: string
  budget?: number
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  leads_count?: number
  conversion_rate?: number
  total_revenue?: number
  channels?: string[]
  tags?: string[]
  notes?: string
  user_id?: string
}

interface CampaignModalProps {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
  onSave: (campaign: Campaign) => void
  onDelete?: (id: string) => void
}

export default function CampaignModal({ 
  campaign, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: CampaignModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedCampaign, setEditedCampaign] = useState<Campaign | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newChannel, setNewChannel] = useState('')

  // Handle deep linking - open modal if campaign ID is in URL
  useEffect(() => {
    const campaignId = searchParams?.get('id')
    if (campaignId && !isOpen && campaign?.id === campaignId) {
      // Modal should already be open if campaign matches
    }
  }, [searchParams, isOpen, campaign])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && campaign) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', campaign.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, campaign, router])

  // Initialize edited campaign when modal opens
  useEffect(() => {
    if (campaign) {
      setEditedCampaign({
        ...campaign,
        notes: campaign.notes || '',
        tags: campaign.tags || [],
        channels: campaign.channels || []
      })
    }
  }, [campaign])

  const handleSave = async () => {
    if (!editedCampaign) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(editedCampaign)
      setIsEditing(false)
      
      toast({
        title: t('campaigns.campaignUpdated'),
        description: t('campaigns.campaignUpdatedSuccessfully'),
      })
    } catch (error) {
      toast({
        title: t('campaigns.errorUpdating'),
        description: t('campaigns.errorUpdating'),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!campaign || !onDelete) return
    
    if (confirm(t('campaigns.confirmDelete'))) {
      try {
        onDelete(campaign.id)
        onClose()
        toast({
          title: t('campaigns.deleted'),
          description: t('campaigns.campaignDeleted'),
        })
      } catch (error) {
        toast({
          title: t('campaigns.deleteFailed'),
          description: t('campaigns.errorDeleting'),
          variant: 'destructive'
        })
      }
    }
  }

  const addTag = () => {
    if (newTag.trim() && editedCampaign) {
      setEditedCampaign({
        ...editedCampaign,
        tags: [...(editedCampaign.tags || []), newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedCampaign) {
      setEditedCampaign({
        ...editedCampaign,
        tags: editedCampaign.tags?.filter(tag => tag !== tagToRemove) || []
      })
    }
  }

  const addChannel = () => {
    if (newChannel.trim() && editedCampaign) {
      setEditedCampaign({
        ...editedCampaign,
        channels: [...(editedCampaign.channels || []), newChannel.trim()]
      })
      setNewChannel('')
    }
  }

  const removeChannel = (channelToRemove: string) => {
    if (editedCampaign) {
      setEditedCampaign({
        ...editedCampaign,
        channels: editedCampaign.channels?.filter(channel => channel !== channelToRemove) || []
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  if (!campaign || !editedCampaign) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <CardHeader className="border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-muted-foreground" />
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedCampaign.name}
                          onChange={(e) => setEditedCampaign({ ...editedCampaign, name: e.target.value })}
                          className="text-xl font-medium border-none p-0 h-auto bg-transparent"
                          placeholder={t('campaigns.campaignName')}
                        />
                      ) : (
                        <CardTitle className="text-xl">{editedCampaign.name}</CardTitle>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {t(`campaigns.${editedCampaign.type}`)} • {t(`campaigns.${editedCampaign.status}`)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? t('common.saving') : t('common.save')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false)
                            setEditedCampaign(campaign)
                          }}
                        >
                          {t('common.cancel')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          {t('common.edit')}
                        </Button>
                        {onDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('common.delete')}
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onClose}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.basicInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.campaignName')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCampaign.name}
                              onChange={(e) => setEditedCampaign({ ...editedCampaign, name: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              {editedCampaign.name}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.type')}
                          </label>
                          {isEditing ? (
                            <Select
                              value={editedCampaign.type}
                              onValueChange={(value: 'email' | 'whatsapp' | 'linkedin' | 'multi_channel') =>
                                setEditedCampaign({ ...editedCampaign, type: value })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">{t('campaigns.email')}</SelectItem>
                                <SelectItem value="whatsapp">{t('campaigns.whatsapp')}</SelectItem>
                                <SelectItem value="linkedin">{t('campaigns.linkedin')}</SelectItem>
                                <SelectItem value="multi_channel">{t('campaigns.multiChannel')}</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="mt-1">{t(`campaigns.${editedCampaign.type}`)}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.targetAudience')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCampaign.target_audience || ''}
                              onChange={(e) => setEditedCampaign({ ...editedCampaign, target_audience: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {editedCampaign.target_audience || t('campaigns.noTargetAudience')}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.budget')}
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editedCampaign.budget || ''}
                              onChange={(e) => setEditedCampaign({ ...editedCampaign, budget: parseFloat(e.target.value) || 0 })}
                              className="mt-1"
                              placeholder="0.00"
                            />
                          ) : (
                            <p className="mt-1">
                              ${editedCampaign.budget?.toFixed(2) || '0.00'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.dates')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.startDate')}
                          </label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editedCampaign.start_date || ''}
                              onChange={(e) => setEditedCampaign({ ...editedCampaign, start_date: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {editedCampaign.start_date ? new Date(editedCampaign.start_date).toLocaleDateString() : t('campaigns.noStartDate')}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('campaigns.endDate')}
                          </label>
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editedCampaign.end_date || ''}
                              onChange={(e) => setEditedCampaign({ ...editedCampaign, end_date: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {editedCampaign.end_date ? new Date(editedCampaign.end_date).toLocaleDateString() : t('campaigns.noEndDate')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.channels')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedCampaign.channels?.map((channel, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {channel === 'email' && <Mail className="w-3 h-3 mr-1" />}
                            {channel === 'whatsapp' && <MessageSquare className="w-3 h-3 mr-1" />}
                            {channel === 'linkedin' && <Linkedin className="w-3 h-3 mr-1" />}
                            {channel === 'phone' && <Phone className="w-3 h-3 mr-1" />}
                            {t(`campaigns.${channel}`)}
                            {isEditing && (
                              <button
                                onClick={() => removeChannel(channel)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2">
                          <Select
                            value={newChannel}
                            onValueChange={setNewChannel}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder={t('campaigns.addChannel')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">{t('campaigns.email')}</SelectItem>
                              <SelectItem value="whatsapp">{t('campaigns.whatsapp')}</SelectItem>
                              <SelectItem value="linkedin">{t('campaigns.linkedin')}</SelectItem>
                              <SelectItem value="phone">{t('campaigns.phone')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" onClick={addChannel}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.description')}</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedCampaign.description || ''}
                          onChange={(e) => setEditedCampaign({ ...editedCampaign, description: e.target.value })}
                          placeholder={t('campaigns.addDescription')}
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          {editedCampaign.description ? (
                            <p className="whitespace-pre-wrap">{editedCampaign.description}</p>
                          ) : (
                            <p className="text-muted-foreground">{t('campaigns.noDescription')}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.notes')}</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedCampaign.notes || ''}
                          onChange={(e) => setEditedCampaign({ ...editedCampaign, notes: e.target.value })}
                          placeholder={t('campaigns.addNotes')}
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          {editedCampaign.notes ? (
                            <p className="whitespace-pre-wrap">{editedCampaign.notes}</p>
                          ) : (
                            <p className="text-muted-foreground">{t('campaigns.noNotes')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.status')}</h3>
                      {isEditing ? (
                        <Select
                          value={editedCampaign.status}
                          onValueChange={(value: 'draft' | 'active' | 'paused' | 'completed' | 'archived') =>
                            setEditedCampaign({ ...editedCampaign, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">{t('campaigns.draft')}</SelectItem>
                            <SelectItem value="active">{t('campaigns.active')}</SelectItem>
                            <SelectItem value="paused">{t('campaigns.paused')}</SelectItem>
                            <SelectItem value="completed">{t('campaigns.completed')}</SelectItem>
                            <SelectItem value="archived">{t('campaigns.archived')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant={
                            editedCampaign.status === 'active' ? 'default' :
                            editedCampaign.status === 'completed' ? 'success' :
                            editedCampaign.status === 'paused' ? 'warning' :
                            editedCampaign.status === 'archived' ? 'secondary' : 'outline'
                          }
                          className="text-sm"
                        >
                          {t(`campaigns.${editedCampaign.status}`)}
                        </Badge>
                      )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.performance')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('campaigns.leadsCount')}</span>
                          <span className="font-medium">{editedCampaign.leads_count || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('campaigns.conversionRate')}</span>
                          <span className="font-medium">{(editedCampaign.conversion_rate || 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('campaigns.totalRevenue')}</span>
                          <span className="font-medium">${(editedCampaign.total_revenue || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.tags')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedCampaign.tags?.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            placeholder={t('campaigns.addTag')}
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, addTag)}
                            className="flex-1"
                          />
                          <Button size="sm" variant="outline" onClick={addTag}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Activity */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('campaigns.activity')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('campaigns.created')}</span>
                          <span className="font-medium">{new Date(editedCampaign.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('campaigns.updated')}</span>
                          <span className="font-medium">{new Date(editedCampaign.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 