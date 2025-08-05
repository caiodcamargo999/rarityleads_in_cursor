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

  const handleSaveToPipeline = (lead: Lead) => {
    // TODO: Implement save to CRM pipeline
    console.log('Saving lead to pipeline:', lead)
    // This would typically:
    // 1. Save lead to database
    // 2. Add to CRM pipeline (to-contact stage)
    // 3. Show success notification
    // 4. Optionally redirect to CRM page
  }

  const handleContact = (lead: Lead) => {
    // TODO: Implement contact action
    console.log('Contacting lead:', lead)
    // This would typically:
    // 1. Open contact modal/form
    // 2. Show contact options (email, WhatsApp, etc.)
    // 3. Pre-fill with lead data
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
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleSaveToPipeline(lead)}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      <ClientOnly fallback="Save to Pipeline">
                        {t('leads.saveToPipeline')}
                      </ClientOnly>
                    </Button>
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