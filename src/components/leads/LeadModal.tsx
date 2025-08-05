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
  User, 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Linkedin,
  Calendar,
  Clock,
  Star,
  Save,
  Edit3,
  Trash2,
  Plus,
  ExternalLink,
  TrendingUp
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Lead {
  id: string
  user_id?: string
  full_name: string
  company_name: string
  email: string
  created_at: string
  job_title?: string
  location?: string
  timezone?: string
  contact_channels?: string[]
  source?: string
  tags?: string[]
  suggested_services?: string[]
  best_contact_time?: string
  status?: string
  ai_score?: number
  phone?: string
  website?: string
  linkedin_url?: string
  company_size?: string
  annual_revenue?: string
  industry?: string
  priority?: 'low' | 'medium' | 'high'
  notes?: string
  whatsapp?: string
  social?: string
}

interface LeadModalProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onSave: (lead: Lead) => void
  onDelete?: (id: string) => void
}

export default function LeadModal({ 
  lead, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: LeadModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedLead, setEditedLead] = useState<Lead | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newService, setNewService] = useState('')

  // Handle deep linking - open modal if lead ID is in URL
  useEffect(() => {
    const leadId = searchParams?.get('id')
    if (leadId && !isOpen && lead?.id === leadId) {
      // Modal should already be open if lead matches
    }
  }, [searchParams, isOpen, lead])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && lead) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', lead.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, lead, router])

  // Initialize edited lead when modal opens
  useEffect(() => {
    if (lead) {
      setEditedLead({
        ...lead,
        notes: lead.notes || '',
        tags: lead.tags || [],
        suggested_services: lead.suggested_services || []
      })
    }
  }, [lead])

  const handleSave = async () => {
    if (!editedLead) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(editedLead)
      setIsEditing(false)
      
      toast({
        title: t('leads.leadUpdated'),
        description: t('leads.leadUpdatedSuccessfully'),
      })
    } catch (error) {
      toast({
        title: t('leads.errorUpdating'),
        description: t('leads.errorUpdating'),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!lead || !onDelete) return
    
    if (confirm(t('leads.confirmDeleteSingle'))) {
      try {
        onDelete(lead.id)
        onClose()
        toast({
          title: t('leads.leadDeleted'),
          description: t('leads.leadDeleted'),
        })
      } catch (error) {
        toast({
          title: t('leads.errorDeleting'),
          description: t('leads.errorDeleting'),
          variant: 'destructive'
        })
      }
    }
  }

  const addTag = () => {
    if (newTag.trim() && editedLead) {
      setEditedLead({
        ...editedLead,
        tags: [...(editedLead.tags || []), newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedLead) {
      setEditedLead({
        ...editedLead,
        tags: editedLead.tags?.filter(tag => tag !== tagToRemove) || []
      })
    }
  }

  const addService = () => {
    if (newService.trim() && editedLead) {
      setEditedLead({
        ...editedLead,
        suggested_services: [...(editedLead.suggested_services || []), newService.trim()]
      })
      setNewService('')
    }
  }

  const removeService = (serviceToRemove: string) => {
    if (editedLead) {
      setEditedLead({
        ...editedLead,
        suggested_services: editedLead.suggested_services?.filter(service => service !== serviceToRemove) || []
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  if (!lead || !editedLead) return null

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
                    <User className="w-6 h-6 text-muted-foreground" />
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedLead.full_name}
                          onChange={(e) => setEditedLead({ ...editedLead, full_name: e.target.value })}
                          className="text-xl font-medium border-none p-0 h-auto bg-transparent"
                          placeholder={t('leads.fullName')}
                        />
                      ) : (
                        <CardTitle className="text-xl">{editedLead.full_name}</CardTitle>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {editedLead.job_title} • {editedLead.company_name}
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
                            setEditedLead(lead)
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
                      <h3 className="text-lg font-medium">{t('leads.basicInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.fullName')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.full_name}
                              onChange={(e) => setEditedLead({ ...editedLead, full_name: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {editedLead.full_name}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.companyName')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.company_name}
                              onChange={(e) => setEditedLead({ ...editedLead, company_name: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {editedLead.company_name}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.jobTitle')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.job_title || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, job_title: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedLead.job_title || t('leads.noJobTitle')}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.location')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.location || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, location: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {editedLead.location || t('leads.noLocation')}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.industry')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.industry || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, industry: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedLead.industry || t('leads.noIndustry')}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.bestContactTime')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.best_contact_time || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, best_contact_time: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {editedLead.best_contact_time || t('leads.noContactTime')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.contactInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.email')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.email}
                              onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                              className="mt-1"
                              type="email"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {editedLead.email ? (
                                <a 
                                  href={`mailto:${editedLead.email}`}
                                  className="text-primary hover:underline"
                                >
                                  {editedLead.email}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('leads.noEmail')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.phone')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.phone || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {editedLead.phone ? (
                                <a 
                                  href={`tel:${editedLead.phone}`}
                                  className="text-primary hover:underline"
                                >
                                  {editedLead.phone}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('leads.noPhone')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.website')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.website || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, website: e.target.value })}
                              className="mt-1"
                              placeholder="https://example.com"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              {editedLead.website ? (
                                <a 
                                  href={editedLead.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {editedLead.website}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('leads.noWebsite')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            LinkedIn
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.linkedin_url || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, linkedin_url: e.target.value })}
                              className="mt-1"
                              placeholder="https://linkedin.com/in/username"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Linkedin className="w-4 h-4" />
                              {editedLead.linkedin_url ? (
                                <a 
                                  href={editedLead.linkedin_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  LinkedIn Profile
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('leads.noLinkedin')}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.companyInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.companySize')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.company_size || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, company_size: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedLead.company_size || t('leads.noCompanySize')}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.annualRevenue')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.annual_revenue || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, annual_revenue: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedLead.annual_revenue || t('leads.noRevenue')}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('leads.source')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedLead.source || ''}
                              onChange={(e) => setEditedLead({ ...editedLead, source: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedLead.source || t('leads.noSource')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.notes')}</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedLead.notes || ''}
                          onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                          placeholder={t('leads.addNotes')}
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          {editedLead.notes ? (
                            <p className="whitespace-pre-wrap">{editedLead.notes}</p>
                          ) : (
                            <p className="text-muted-foreground">{t('leads.noNotes')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* AI Score */}
                    {editedLead.ai_score && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{t('leads.aiScore')}</h3>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-2xl font-medium">{editedLead.ai_score}</span>
                          <Badge variant="outline" className="text-sm">
                            {editedLead.ai_score >= 80 ? t('leads.highScore') : 
                             editedLead.ai_score >= 60 ? t('leads.mediumScore') : t('leads.lowScore')}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.status')}</h3>
                      {isEditing ? (
                        <Select
                          value={editedLead.status || 'to_contact'}
                          onValueChange={(value) => setEditedLead({ ...editedLead, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="to_contact">{t('leads.toContact')}</SelectItem>
                            <SelectItem value="contacted">{t('leads.contacted')}</SelectItem>
                            <SelectItem value="in_conversation">{t('leads.inConversation')}</SelectItem>
                            <SelectItem value="closed">{t('leads.closed')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          {t(`leads.${editedLead.status || 'toContact'}`)}
                        </Badge>
                      )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.priority')}</h3>
                      {isEditing ? (
                        <Select
                          value={editedLead.priority || 'medium'}
                          onValueChange={(value: 'low' | 'medium' | 'high') => 
                            setEditedLead({ ...editedLead, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">{t('leads.lowPriority')}</SelectItem>
                            <SelectItem value="medium">{t('leads.mediumPriority')}</SelectItem>
                            <SelectItem value="high">{t('leads.highPriority')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant={editedLead.priority === 'high' ? 'danger' : 
                                  editedLead.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-sm"
                        >
                          {t(`leads.${editedLead.priority || 'medium'}Priority`)}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.tags')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedLead.tags?.map((tag, index) => (
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
                            placeholder={t('leads.addTag')}
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

                    {/* Suggested Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.suggestedServices')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedLead.suggested_services?.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {service}
                            {isEditing && (
                              <button
                                onClick={() => removeService(service)}
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
                            placeholder={t('leads.addService')}
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, addService)}
                            className="flex-1"
                          />
                          <Button size="sm" variant="outline" onClick={addService}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Activity */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('leads.activity')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('leads.created')}</span>
                          <span className="font-medium">{new Date(editedLead.created_at).toLocaleDateString()}</span>
                        </div>
                        {editedLead.contact_channels && editedLead.contact_channels.length > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('leads.contactChannels')}</span>
                            <span className="font-medium">{editedLead.contact_channels.join(', ')}</span>
                          </div>
                        )}
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