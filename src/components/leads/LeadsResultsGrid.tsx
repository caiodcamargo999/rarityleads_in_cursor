"use client"

import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next'
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
}

export default function LeadsResultsGrid({ leads = [] }: { leads?: Lead[] }) {
  const { t } = useTranslation()

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
                <div className="space-y-2">
                  <h3 className="font-medium text-foreground">{lead.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.company_name}</p>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                  {lead.job_title && (
                    <p className="text-sm text-muted-foreground">{lead.job_title}</p>
                  )}
                  {lead.location && (
                    <p className="text-sm text-muted-foreground">{lead.location}</p>
                  )}
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lead.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
} 