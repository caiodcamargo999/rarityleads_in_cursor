"use client"

import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Building, 
  Mail, 
  MapPin, 
  Briefcase,
  Save,
  MessageSquare,
  Phone,
  Globe,
  Linkedin,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

type Lead = {
  id?: string;
  user_id?: string;
  full_name: string;
  company_name: string;
  email?: string;
  created_at?: string;
  job_title?: string | undefined;
  location?: string | undefined;
  timezone?: string | undefined;
  contact_channels?: string[];
  source?: string | undefined;
  tags?: string[];
  suggested_services?: string[];
  best_contact_time?: string | undefined;
  ai_score?: number;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  company_size?: string;
  annual_revenue?: string;
  industry?: string;
  status?: string;
  priority?: 'low' | 'medium' | 'high';
}

export default function LeadsResultsGrid({ leads = [] }: { leads?: Lead[] }) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()
  const [stageByLead, setStageByLead] = useState<Record<string, string>>({})

  const handleSaveToPipeline = async (lead: Lead) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Ensure lead exists in DB (basic de-duplication by user + email)
      let dbLeadId: string | null = null
      if (lead.email) {
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('user_id', user.id)
          .eq('email', lead.email)
          .limit(1)
          .maybeSingle()
        dbLeadId = existing?.id || null
      }

      if (!dbLeadId) {
        const { data: inserted, error: insertErr } = await supabase
          .from('leads')
          .insert({
            user_id: user.id,
            full_name: lead.full_name,
            company_name: lead.company_name,
            job_title: lead.job_title,
            location: lead.location,
            timezone: lead.timezone,
            contact_channels: lead.contact_channels || [],
            source: lead.source,
            tags: lead.tags || [],
            suggested_services: lead.suggested_services || [],
            best_contact_time: lead.best_contact_time,
            email: lead.email,
            phone: lead.phone,
            website: lead.website,
            linkedin_url: lead.linkedin_url,
            company_size: lead.company_size,
            industry: lead.industry,
          })
          .select('id')
          .single()
        if (insertErr) throw insertErr
        dbLeadId = inserted.id
      }

      // Add to CRM pipeline (default stage: To Contact) — avoid duplicates for same lead
      if (dbLeadId) {
        const { data: existingLink } = await supabase
          .from('crm_pipelines')
          .select('pipeline_id')
          .eq('user_id', user.id)
          .eq('lead_id', dbLeadId)
          .limit(1)
          .maybeSingle()
        if (!existingLink?.pipeline_id) {
          await supabase
            .from('crm_pipelines')
            .insert({ user_id: user.id, lead_id: dbLeadId, stage: stageByLead[dbLeadId] || 'To Contact' })
        }
      }

      toast({ title: t('leads.saved'), description: t('leads.savedToPipeline') })
    } catch (error: any) {
      toast({ title: t('common.error'), description: error?.message || 'Failed to save', variant: 'destructive' })
    }
  }

  const handleContact = async (lead: Lead) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Ensure lead exists and get id
      let dbLeadId: string | null = null
      if (lead.email) {
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('user_id', user.id)
          .eq('email', lead.email)
          .limit(1)
          .maybeSingle()
        dbLeadId = existing?.id || null
      }
      if (!dbLeadId) {
        const { data: inserted, error: insertErr } = await supabase
          .from('leads')
          .insert({
            user_id: user.id,
            full_name: lead.full_name,
            company_name: lead.company_name,
            job_title: lead.job_title,
            location: lead.location,
            timezone: lead.timezone,
            contact_channels: lead.contact_channels || [],
            source: lead.source,
            tags: lead.tags || [],
            suggested_services: lead.suggested_services || [],
            best_contact_time: lead.best_contact_time,
            email: lead.email,
            phone: lead.phone,
            website: lead.website,
            linkedin_url: lead.linkedin_url,
            company_size: lead.company_size,
            industry: lead.industry,
          })
          .select('id')
          .single()
        if (insertErr) throw insertErr
        dbLeadId = inserted.id
      }

      // Choose best channel
      const preferred = (lead.contact_channels && lead.contact_channels[0]?.toLowerCase()) || ''
      let channel: 'whatsapp' | 'linkedin' | 'email' = 'email'
      let contact_identifier = lead.email || ''
      if (preferred.includes('whatsapp') || (!lead.email && lead.phone)) {
        channel = 'whatsapp'; contact_identifier = lead.phone || ''
      } else if (preferred.includes('linkedin') || (!lead.email && lead.linkedin_url)) {
        channel = 'linkedin'; contact_identifier = lead.linkedin_url || ''
      }

      if (!contact_identifier) throw new Error('No valid contact for conversation')

      // Create conversation if not exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .eq('lead_id', dbLeadId)
        .eq('channel', channel)
        .limit(1)
        .maybeSingle()

      let conversationId = existingConv?.id as string | undefined
      if (!conversationId) {
        const { data: created, error: convErr } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            lead_id: dbLeadId,
            channel,
            contact_identifier,
            contact_name: lead.full_name,
            status: 'active'
          })
          .select('id')
          .single()
        if (convErr) throw convErr
        conversationId = created.id
      }

      router.push(`/dashboard/messages?conversationId=${conversationId}`)
    } catch (error: any) {
      toast({ title: t('common.error'), description: error?.message || 'Failed to start conversation', variant: 'destructive' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 mb-8"
    >
      <div>
        <h2 className="text-xl font-medium text-foreground mb-4">
          <ClientOnly fallback="Generated Leads">
            Generated Leads
          </ClientOnly>
        </h2>
        
        {leads.length === 0 ? (
          <div className="text-muted-foreground text-base text-center py-8">
            <ClientOnly fallback="No leads generated yet. Fill the form and click Generate Leads.">
              {t('leads.noLeadsGenerated')}
            </ClientOnly>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-border rounded-lg p-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="space-y-3">
                  {/* Lead Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {lead.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building className="w-3 h-3" />
                        {lead.company_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {lead.ai_score && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs font-medium text-foreground">{lead.ai_score}</span>
                        </div>
                      )}
                      {lead.source && (
                        <Badge variant="outline" className="text-xs">
                          {lead.source}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1">
                    {lead.email && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </p>
                    )}
                    {lead.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {lead.phone}
                      </p>
                    )}
                    {lead.job_title && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Briefcase className="w-3 h-3" />
                        {lead.job_title}
                      </p>
                    )}
                    {lead.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {lead.location}
                      </p>
                    )}
                    {lead.best_contact_time && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {lead.best_contact_time}
                      </p>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="space-y-1">
                    {lead.industry && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        {lead.industry} • {lead.company_size} • {lead.annual_revenue}
                      </p>
                    )}
                  </div>

                  {/* Tags and Services */}
                  <div className="space-y-2">
                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {lead.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    {lead.suggested_services && lead.suggested_services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lead.suggested_services.slice(0, 2).map((service, serviceIndex) => (
                          <Badge key={serviceIndex} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {lead.suggested_services.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.suggested_services.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border items-center">
                    <div className="flex-1 flex items-center gap-2">
                      <Select
                        value={stageByLead[lead.email || lead.full_name] || 'To Contact'}
                        onValueChange={(v) => setStageByLead(prev => ({ ...prev, [lead.email || lead.full_name]: v }))}
                      >
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue placeholder="To Contact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="To Contact">To Contact</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="In Conversation">In Conversation</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleSaveToPipeline(lead)}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        <ClientOnly fallback="Add to CRM">
                          {t('leads.saveToPipeline')}
                        </ClientOnly>
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      {lead.website && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs p-1"
                          onClick={() => window.open(lead.website, '_blank')}
                        >
                          <Globe className="w-3 h-3" />
                        </Button>
                      )}
                      {lead.linkedin_url && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-xs p-1"
                          onClick={() => window.open(lead.linkedin_url, '_blank')}
                        >
                          <Linkedin className="w-3 h-3" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs p-1"
                        onClick={() => handleContact(lead)}
                      >
                        <MessageSquare className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
} 