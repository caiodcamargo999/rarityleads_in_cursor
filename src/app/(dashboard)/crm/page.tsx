"use client"

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MessageSquare, 
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Upload
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'

interface Lead {
  id: string
  name: string
  company: string
  role: string
  email: string
  phone?: string
  location: string
  stage: 'to-contact' | 'contacted' | 'in-conversation' | 'closed'
  value: number
  lastContact?: string
  tags: string[]
  source: string
  priority: 'high' | 'medium' | 'low'
  notes?: string
  nextFollowUp?: string
  assignedTo?: string
  order?: number
}

interface Stage {
  id: string
  title: string
  color: string
  count: number
  description: string
}

export default function CRMPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Mock data for demonstration
      setLeads([
        {
          id: '1',
          name: 'John Smith',
          company: 'TechCorp Inc',
          role: 'CEO',
          email: 'john@techcorp.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          stage: 'to-contact',
          value: 50000,
          tags: ['SaaS', 'B2B'],
          source: 'LinkedIn',
          priority: 'high',
          notes: 'Interested in scaling their sales process',
          nextFollowUp: '2024-01-20'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          company: 'Digital Solutions',
          role: 'Marketing Director',
          email: 'sarah@digitalsolutions.com',
          location: 'New York, NY',
          stage: 'contacted',
          value: 25000,
          lastContact: '2024-01-15',
          tags: ['Marketing', 'Agency'],
          source: 'Apollo',
          priority: 'medium',
          notes: 'Followed up with proposal',
          nextFollowUp: '2024-01-22'
        },
        {
          id: '3',
          name: 'Mike Chen',
          company: 'StartupXYZ',
          role: 'Founder',
          email: 'mike@startupxyz.com',
          location: 'Austin, TX',
          stage: 'in-conversation',
          value: 75000,
          lastContact: '2024-01-14',
          tags: ['Startup', 'Tech'],
          source: 'Crunchbase',
          priority: 'high',
          notes: 'Very interested, discussing contract details',
          nextFollowUp: '2024-01-18'
        },
        {
          id: '4',
          name: 'Lisa Rodriguez',
          company: 'Growth Partners',
          role: 'VP of Sales',
          email: 'lisa@growthpartners.com',
          location: 'Miami, FL',
          stage: 'closed',
          value: 100000,
          lastContact: '2024-01-10',
          tags: ['Enterprise', 'Sales'],
          source: 'LinkedIn',
          priority: 'high',
          notes: 'Deal closed successfully',
          nextFollowUp: '2024-01-25'
        },
        {
          id: '5',
          name: 'David Kim',
          company: 'Innovation Labs',
          role: 'CTO',
          email: 'david@innovationlabs.com',
          location: 'Seattle, WA',
          stage: 'to-contact',
          value: 35000,
          tags: ['Tech', 'Innovation'],
          source: 'Apollo',
          priority: 'medium',
          notes: 'Looking for technical solutions',
          nextFollowUp: '2024-01-21'
        }
      ])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Calculate stage counts
  const stages: Stage[] = [
    {
      id: 'to-contact',
      title: t('crm.toContact'),
      color: 'bg-blue-500',
      count: leads.filter(lead => lead.stage === 'to-contact').length,
      description: t('crm.toContactDescription')
    },
    {
      id: 'contacted',
      title: t('crm.contacted'),
      color: 'bg-yellow-500',
      count: leads.filter(lead => lead.stage === 'contacted').length,
      description: t('crm.contactedDescription')
    },
    {
      id: 'in-conversation',
      title: t('crm.inConversation'),
      color: 'bg-purple-500',
      count: leads.filter(lead => lead.stage === 'in-conversation').length,
      description: t('crm.inConversationDescription')
    },
    {
      id: 'closed',
      title: t('crm.closed'),
      color: 'bg-green-500',
      count: leads.filter(lead => lead.stage === 'closed').length,
      description: t('crm.closedDescription')
    }
  ]

  // Filter leads based on search and filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || lead.priority === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const handleStageChange = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, stage: newStage as any, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ))
    
    toast({
      title: t('crm.leadMoved'),
      description: t('crm.leadMovedSuccessfully')
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedLeads.length === 0) {
      toast({
        title: t('crm.noLeadsSelected'),
        description: t('crm.selectLeadsFirst'),
        variant: 'destructive'
      })
      return
    }

    switch (action) {
      case 'move-to-contact':
        setLeads(prev => prev.map(lead => 
          selectedLeads.includes(lead.id) 
            ? { ...lead, stage: 'contacted', lastContact: new Date().toISOString().split('T')[0] }
            : lead
        ))
        break
      case 'export':
        // TODO: Implement export functionality
        toast({
          title: t('crm.exportStarted'),
          description: t('crm.exportInProgress')
        })
        break
      case 'delete':
        if (confirm(t('crm.confirmDelete'))) {
          setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.id)))
          setSelectedLeads([])
          toast({
            title: t('crm.leadsDeleted'),
            description: t('crm.leadsDeletedSuccessfully')
          })
        }
        break
    }
  }

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const selectAllLeads = () => {
    setSelectedLeads(prev => 
      prev.length === filteredLeads.length 
        ? [] 
        : filteredLeads.map(lead => lead.id)
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-24 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium text-foreground">
            <ClientOnly fallback="CRM Pipeline">
              {t('crm.title')}
            </ClientOnly>
          </h1>
          <p className="text-muted-foreground mt-1">
            <ClientOnly fallback="Manage your leads and track your sales pipeline">
              {t('crm.description')}
            </ClientOnly>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/dashboard/leads')}>
            <Plus className="w-4 h-4 mr-2" />
            <ClientOnly fallback="Add Lead">
              {t('crm.addLead')}
            </ClientOnly>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                <Download className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Export">
                  {t('crm.export')}
                </ClientOnly>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('move-to-contact')}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Move to Contacted">
                  {t('crm.moveToContacted')}
                </ClientOnly>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Delete Selected">
                  {t('crm.deleteSelected')}
                </ClientOnly>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stage.title}</p>
                <p className="text-2xl font-medium text-foreground">{stage.count}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stage.description}</p>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('crm.searchLeads')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <ClientOnly fallback="Filter">
              {t('crm.filter')}
            </ClientOnly>
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                <ClientOnly fallback={`${selectedLeads.length} leads selected`}>
                  {t('crm.selectedCount', { count: selectedLeads.length })}
                </ClientOnly>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={selectAllLeads}
              >
                <ClientOnly fallback="Select All">
                  {t('crm.selectAll')}
                </ClientOnly>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('move-to-contact')}
              >
                <ClientOnly fallback="Move to Contacted">
                  {t('crm.moveToContacted')}
                </ClientOnly>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('export')}
              >
                <Download className="w-4 h-4 mr-2" />
                <ClientOnly fallback="Export">
                  {t('crm.export')}
                </ClientOnly>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                <h3 className="font-medium text-foreground">{stage.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                {stage.count}
              </Badge>
            </div>

            {/* Stage Cards */}
            <Reorder.Group
              axis="y"
              values={filteredLeads.filter(lead => lead.stage === stage.id)}
              onReorder={(newOrder) => {
                // Update lead order within the stage
                const updatedLeads = [...leads]
                newOrder.forEach((lead, index) => {
                  const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
                  if (leadIndex !== -1) {
                    updatedLeads[leadIndex] = { ...lead, order: index }
                  }
                })
                setLeads(updatedLeads)
              }}
              className="space-y-3"
            >
              {filteredLeads
                .filter(lead => lead.stage === stage.id)
                .map((lead) => (
                  <Reorder.Item
                    key={lead.id}
                    value={lead}
                    whileDrag={{ scale: 1.02, zIndex: 10 }}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                  >
                    <Card 
                      className={`cursor-pointer hover:shadow-md transition-all duration-200 border-border group ${
                        selectedLeads.includes(lead.id) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => router.push(`/dashboard/crm/${lead.id}`)}
                    >
                      <CardContent className="p-4">
                        {/* Selection Checkbox */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                toggleLeadSelection(lead.id)
                              }}
                              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm group-hover:text-rarity-500 transition-colors">{lead.name}</h4>
                              <p className="text-muted-foreground text-xs">{lead.role}</p>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                        </div>

                        {/* Company */}
                        <div className="flex items-center gap-1 mb-2">
                          <Building className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{lead.company}</p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{lead.location}</p>
                        </div>

                        {/* Value */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-foreground">
                            {formatCurrency(lead.value)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lead.source}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Next Follow Up */}
                        {lead.nextFollowUp && (
                          <div className="flex items-center gap-1 mt-2">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              <ClientOnly fallback={`Follow up: ${lead.nextFollowUp}`}>
                                {t('crm.followUp')}: {lead.nextFollowUp}
                              </ClientOnly>
                            </p>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${lead.email}`, '_blank');
                            }}
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                          {lead.phone && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${lead.phone}`, '_blank');
                              }}
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement message action
                            }}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {stages.map((stageOption) => (
                                <DropdownMenuItem
                                  key={stageOption.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStageChange(lead.id, stageOption.id);
                                  }}
                                >
                                  <ClientOnly fallback={`Move to ${stageOption.title}`}>
                                    {t('crm.moveTo')} {stageOption.title}
                                  </ClientOnly>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </Reorder.Item>
                ))}
            </Reorder.Group>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 