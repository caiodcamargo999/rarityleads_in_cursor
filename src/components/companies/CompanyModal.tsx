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
  Building, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Users, 
  Calendar,
  Save,
  Edit3,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  website: string
  phone?: string
  email?: string
  founded: string
  revenue: string
  employees: number
  leads: number
  status: 'active' | 'prospect' | 'customer' | 'inactive'
  tags: string[]
  lastContact: string
  notes?: string
  keyContacts?: Array<{
    name: string
    role: string
    email: string
    phone?: string
  }>
}

interface CompanyModalProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
  onSave: (company: Company) => void
  onDelete?: (id: string) => void
}

export default function CompanyModal({ 
  company, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: CompanyModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedCompany, setEditedCompany] = useState<Company | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newContact, setNewContact] = useState({ name: '', role: '', email: '', phone: '' })

  // Handle deep linking - open modal if company ID is in URL
  useEffect(() => {
    const companyId = searchParams.get('id')
    if (companyId && !isOpen && company?.id === companyId) {
      // Modal should already be open if company matches
    }
  }, [searchParams, isOpen, company])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && company) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', company.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, company, router])

  // Initialize edited company when modal opens
  useEffect(() => {
    if (company) {
      setEditedCompany({
        ...company,
        notes: company.notes || '',
        keyContacts: company.keyContacts || []
      })
    }
  }, [company])

  const handleSave = async () => {
    if (!editedCompany) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(editedCompany)
      setIsEditing(false)
      
      toast({
        title: t('companies.companyUpdated'),
        description: t('companies.companyUpdatedSuccessfully'),
      })
    } catch (error) {
      toast({
        title: t('companies.errorUpdating'),
        description: t('companies.errorUpdating'),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!company || !onDelete) return
    
    if (confirm(t('companies.confirmDelete'))) {
      try {
        onDelete(company.id)
        onClose()
        toast({
          title: t('companies.deleted'),
          description: t('companies.companyDeleted'),
        })
      } catch (error) {
        toast({
          title: t('companies.deleteFailed'),
          description: t('companies.errorDeleting'),
          variant: 'destructive'
        })
      }
    }
  }

  const addTag = () => {
    if (newTag.trim() && editedCompany) {
      setEditedCompany({
        ...editedCompany,
        tags: [...editedCompany.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedCompany) {
      setEditedCompany({
        ...editedCompany,
        tags: editedCompany.tags.filter(tag => tag !== tagToRemove)
      })
    }
  }

  const addContact = () => {
    if (newContact.name && newContact.role && newContact.email && editedCompany) {
      setEditedCompany({
        ...editedCompany,
        keyContacts: [...(editedCompany.keyContacts || []), { ...newContact }]
      })
      setNewContact({ name: '', role: '', email: '', phone: '' })
    }
  }

  const removeContact = (index: number) => {
    if (editedCompany) {
      setEditedCompany({
        ...editedCompany,
        keyContacts: editedCompany.keyContacts?.filter((_, i) => i !== index) || []
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  if (!company || !editedCompany) return null

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
                    <Building className="w-6 h-6 text-muted-foreground" />
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedCompany.name}
                          onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                          className="text-xl font-medium border-none p-0 h-auto bg-transparent"
                          placeholder={t('companies.companyName')}
                        />
                      ) : (
                        <CardTitle className="text-xl">{editedCompany.name}</CardTitle>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {editedCompany.industry} • {editedCompany.location}
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
                            setEditedCompany(company)
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
                      <h3 className="text-lg font-medium">{t('companies.basicInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.industry')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.industry}
                              onChange={(e) => setEditedCompany({ ...editedCompany, industry: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedCompany.industry}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.size')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.size}
                              onChange={(e) => setEditedCompany({ ...editedCompany, size: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedCompany.size}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.location')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.location}
                              onChange={(e) => setEditedCompany({ ...editedCompany, location: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {editedCompany.location}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.founded')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.founded}
                              onChange={(e) => setEditedCompany({ ...editedCompany, founded: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {editedCompany.founded}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.revenue')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.revenue}
                              onChange={(e) => setEditedCompany({ ...editedCompany, revenue: e.target.value })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1">{editedCompany.revenue}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.employees')}
                          </label>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editedCompany.employees}
                              onChange={(e) => setEditedCompany({ ...editedCompany, employees: parseInt(e.target.value) || 0 })}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {editedCompany.employees}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('companies.contactInformation')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.website')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.website}
                              onChange={(e) => setEditedCompany({ ...editedCompany, website: e.target.value })}
                              className="mt-1"
                              placeholder="https://example.com"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              {editedCompany.website ? (
                                <a 
                                  href={editedCompany.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {editedCompany.website}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('companies.noWebsite')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.email')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.email || ''}
                              onChange={(e) => setEditedCompany({ ...editedCompany, email: e.target.value })}
                              className="mt-1"
                              placeholder="contact@company.com"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {editedCompany.email ? (
                                <a 
                                  href={`mailto:${editedCompany.email}`}
                                  className="text-primary hover:underline"
                                >
                                  {editedCompany.email}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('companies.noEmail')}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {t('companies.phone')}
                          </label>
                          {isEditing ? (
                            <Input
                              value={editedCompany.phone || ''}
                              onChange={(e) => setEditedCompany({ ...editedCompany, phone: e.target.value })}
                              className="mt-1"
                              placeholder="+1 (555) 123-4567"
                            />
                          ) : (
                            <div className="mt-1 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {editedCompany.phone ? (
                                <a 
                                  href={`tel:${editedCompany.phone}`}
                                  className="text-primary hover:underline"
                                >
                                  {editedCompany.phone}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">{t('companies.noPhone')}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Key Contacts */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('companies.keyContacts')}</h3>
                      
                      {editedCompany.keyContacts && editedCompany.keyContacts.length > 0 && (
                        <div className="space-y-3">
                          {editedCompany.keyContacts.map((contact, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.role}</p>
                                <p className="text-sm text-muted-foreground">{contact.email}</p>
                                {contact.phone && (
                                  <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                )}
                              </div>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeContact(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="space-y-3 p-4 border border-dashed border-border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder={t('companies.contactName')}
                              value={newContact.name}
                              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                              onKeyPress={(e) => handleKeyPress(e, addContact)}
                            />
                            <Input
                              placeholder={t('companies.contactRole')}
                              value={newContact.role}
                              onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                              onKeyPress={(e) => handleKeyPress(e, addContact)}
                            />
                            <Input
                              placeholder={t('companies.contactEmail')}
                              value={newContact.email}
                              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                              onKeyPress={(e) => handleKeyPress(e, addContact)}
                            />
                            <Input
                              placeholder={t('companies.contactPhone')}
                              value={newContact.phone}
                              onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                              onKeyPress={(e) => handleKeyPress(e, addContact)}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={addContact}
                            className="flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            {t('companies.addContact')}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('companies.notes')}</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedCompany.notes || ''}
                          onChange={(e) => setEditedCompany({ ...editedCompany, notes: e.target.value })}
                          placeholder={t('companies.addNotes')}
                          rows={4}
                        />
                      ) : (
                        <div className="p-4 border border-border rounded-lg bg-muted/50">
                          {editedCompany.notes ? (
                            <p className="whitespace-pre-wrap">{editedCompany.notes}</p>
                          ) : (
                            <p className="text-muted-foreground">{t('companies.noNotes')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('companies.status')}</h3>
                      {isEditing ? (
                        <Select
                          value={editedCompany.status}
                          onValueChange={(value: 'active' | 'prospect' | 'customer' | 'inactive') => 
                            setEditedCompany({ ...editedCompany, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">{t('companies.active')}</SelectItem>
                            <SelectItem value="prospect">{t('companies.prospect')}</SelectItem>
                            <SelectItem value="customer">{t('companies.customer')}</SelectItem>
                            <SelectItem value="inactive">{t('companies.inactive')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          {t(`companies.${editedCompany.status}`)}
                        </Badge>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('companies.tags')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedCompany.tags.map((tag, index) => (
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
                            placeholder={t('companies.addTag')}
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
                      <h3 className="text-lg font-medium">{t('companies.activity')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('companies.leads')}</span>
                          <span className="font-medium">{editedCompany.leads}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('companies.lastContact')}</span>
                          <span className="font-medium">{editedCompany.lastContact}</span>
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