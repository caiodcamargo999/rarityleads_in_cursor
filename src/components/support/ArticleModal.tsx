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
  BookOpen, 
  HelpCircle, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Search,
  Tag,
  Calendar,
  User,
  Edit3,
  Save,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { useToast } from '@/components/ui/use-toast'

interface SupportArticle {
  id: string
  title: string
  content: string
  category: 'getting_started' | 'features' | 'troubleshooting' | 'api' | 'billing' | 'general'
  status: 'draft' | 'published' | 'archived'
  author?: string
  created_at: string
  updated_at: string
  views?: number
  helpful_votes?: number
  unhelpful_votes?: number
  tags?: string[]
  related_articles?: string[]
  user_id?: string
}

interface ArticleModalProps {
  article: SupportArticle | null
  isOpen: boolean
  onClose: () => void
  onSave?: (article: SupportArticle) => void
  onDelete?: (id: string) => void
}

export default function ArticleModal({ 
  article, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: ArticleModalProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedArticle, setEditedArticle] = useState<SupportArticle | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Handle deep linking - open modal if article ID is in URL
  useEffect(() => {
    const articleId = searchParams?.get('id')
    if (articleId && !isOpen && article?.id === articleId) {
      // Modal should already be open if article matches
    }
  }, [searchParams, isOpen, article])

  // Update URL when modal opens/closes
  useEffect(() => {
    if (isOpen && article) {
      const url = new URL(window.location.href)
      url.searchParams.set('id', article.id)
      router.replace(url.pathname + url.search, { scroll: false })
    } else if (!isOpen) {
      const url = new URL(window.location.href)
      url.searchParams.delete('id')
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [isOpen, article, router])

  // Initialize edited article when modal opens
  useEffect(() => {
    if (article) {
      setEditedArticle({
        ...article,
        tags: article.tags || []
      })
    }
  }, [article])

  const handleSave = async () => {
    if (!editedArticle || !onSave) return
    
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(editedArticle)
      setIsEditing(false)
      
      toast({
        title: t('support.articleUpdated'),
        description: t('support.articleUpdatedSuccessfully'),
      })
    } catch (error) {
      toast({
        title: t('support.errorUpdating'),
        description: t('support.errorUpdating'),
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!article || !onDelete) return
    
    if (confirm(t('support.confirmDelete'))) {
      try {
        onDelete(article.id)
        onClose()
        toast({
          title: t('support.deleted'),
          description: t('support.articleDeleted'),
        })
      } catch (error) {
        toast({
          title: t('support.deleteFailed'),
          description: t('support.errorDeleting'),
          variant: 'destructive'
        })
      }
    }
  }

  const handleVote = (helpful: boolean) => {
    if (!editedArticle) return
    
    setEditedArticle({
      ...editedArticle,
      helpful_votes: helpful ? (editedArticle.helpful_votes || 0) + 1 : editedArticle.helpful_votes || 0,
      unhelpful_votes: !helpful ? (editedArticle.unhelpful_votes || 0) + 1 : editedArticle.unhelpful_votes || 0
    })
    
    toast({
      title: t('support.thankYou'),
      description: t('support.feedbackSubmitted'),
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || '',
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: t('support.linkCopied'),
        description: t('support.articleLinkCopied'),
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && editedArticle) {
      setEditedArticle({
        ...editedArticle,
        tags: [...(editedArticle.tags || []), newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedArticle) {
      setEditedArticle({
        ...editedArticle,
        tags: editedArticle.tags?.filter(tag => tag !== tagToRemove) || []
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      action()
    }
  }

  if (!article || !editedArticle) return null

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
            <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
              {/* Header */}
              <CardHeader className="border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                    <div>
                      {isEditing ? (
                        <Input
                          value={editedArticle.title}
                          onChange={(e) => setEditedArticle({ ...editedArticle, title: e.target.value })}
                          className="text-xl font-medium border-none p-0 h-auto bg-transparent"
                          placeholder={t('support.articleTitle')}
                        />
                      ) : (
                        <CardTitle className="text-xl">{editedArticle.title}</CardTitle>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {t(`support.${editedArticle.category}`)}
                        </Badge>
                        <span>•</span>
                        <span>{t(`support.${editedArticle.status}`)}</span>
                        <span>•</span>
                        <span>{editedArticle.views || 0} {t('support.views')}</span>
                      </div>
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
                            setEditedArticle(article)
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
                          onClick={handleShare}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="w-4 h-4" />
                          {t('support.share')}
                        </Button>
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                  {/* Main Content */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Article Content */}
                    <div className="space-y-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t('support.category')}
                            </label>
                            <Select
                              value={editedArticle.category}
                              onValueChange={(value: 'getting_started' | 'features' | 'troubleshooting' | 'api' | 'billing' | 'general') =>
                                setEditedArticle({ ...editedArticle, category: value })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="getting_started">{t('support.gettingStarted')}</SelectItem>
                                <SelectItem value="features">{t('support.features')}</SelectItem>
                                <SelectItem value="troubleshooting">{t('support.troubleshooting')}</SelectItem>
                                <SelectItem value="api">{t('support.api')}</SelectItem>
                                <SelectItem value="billing">{t('support.billing')}</SelectItem>
                                <SelectItem value="general">{t('support.general')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {t('support.content')}
                            </label>
                            <Textarea
                              value={editedArticle.content}
                              onChange={(e) => setEditedArticle({ ...editedArticle, content: e.target.value })}
                              placeholder={t('support.writeContent')}
                              rows={20}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                            {editedArticle.content}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Feedback Section */}
                    {!isEditing && (
                      <div className="border-t border-border pt-6">
                        <h3 className="text-lg font-medium mb-4">{t('support.wasThisHelpful')}</h3>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => handleVote(true)}
                            className="flex items-center gap-2"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {t('support.yes')} ({editedArticle.helpful_votes || 0})
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleVote(false)}
                            className="flex items-center gap-2"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            {t('support.no')} ({editedArticle.unhelpful_votes || 0})
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Article Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('support.articleInfo')}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('support.author')}</span>
                          <span className="font-medium">{editedArticle.author || t('support.unknown')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('support.created')}</span>
                          <span className="font-medium">{new Date(editedArticle.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('support.updated')}</span>
                          <span className="font-medium">{new Date(editedArticle.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('support.views')}</span>
                          <span className="font-medium">{editedArticle.views || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('support.tags')}</h3>
                      
                      <div className="flex flex-wrap gap-2">
                        {editedArticle.tags?.map((tag, index) => (
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
                            placeholder={t('support.addTag')}
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

                    {/* Related Articles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('support.relatedArticles')}</h3>
                      
                      <div className="space-y-2">
                        <div className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <p className="text-sm font-medium">{t('support.gettingStartedGuide')}</p>
                          <p className="text-xs text-muted-foreground">{t('support.gettingStartedGuideDesc')}</p>
                        </div>
                        <div className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <p className="text-sm font-medium">{t('support.apiDocumentation')}</p>
                          <p className="text-xs text-muted-foreground">{t('support.apiDocumentationDesc')}</p>
                        </div>
                        <div className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <p className="text-sm font-medium">{t('support.billingFAQ')}</p>
                          <p className="text-xs text-muted-foreground">{t('support.billingFAQDesc')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{t('support.searchArticles')}</h3>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder={t('support.searchPlaceholder')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
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