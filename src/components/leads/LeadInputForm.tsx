"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { supabase } from '@/integrations/supabase/client'
import { useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useTranslation } from 'react-i18next'
import { ClientOnly } from '@/components/ClientOnly'

const filtersList = [
  {
    label: "leads.filters.annualRevenue",
    key: "revenue",
    options: ["$0-1M", "$1-5M", "$5-10M", "$10-50M", "$50M+"]
  },
  {
    label: "leads.filters.companySize",
    key: "size",
    options: ["1-10", "11-50", "51-200", "201-1000", "1000+"]
  },
  {
    label: "leads.filters.countryCity",
    key: "location",
    options: ["USA", "UK", "Germany", "Brazil", "Singapore"]
  },
  {
    label: "leads.filters.leadRole",
    key: "role",
    options: ["CEO", "Head of Marketing", "CTO", "Founder", "Sales Director"]
  },
  {
    label: "leads.filters.contactChannel",
    key: "channel",
    options: ["WhatsApp", "LinkedIn", "Instagram", "Facebook", "X (Twitter)"]
  },
  {
    label: "leads.filters.businessNeeds",
    key: "needs",
    options: ["Paid Ads", "Funnel", "CRM", "Outreach", "SEO"]
  },
]

type Props = { onClose?: () => void; onLeadsGenerated?: (leads: any[], description: string) => void }

export default function LeadInputForm({ onClose, onLeadsGenerated }: Props) {
  const { t } = useTranslation()
  const [description, setDescription] = useState("")
  const [filters, setFilters] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Insert new lead request in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { data: request, error: insertError } = await supabase
        .from('lead_requests')
        .insert({
          user_id: user.id,
          description_text: description,
          filters,
          status: 'pending',
        })
        .select()
        .single();
      if (insertError) throw insertError;

      // Call Edge Function to generate leads
      const res = await fetch('/functions/v1/generate_leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, filters })
      });
      if (!res.ok) throw new Error('Failed to generate leads');
      const data = await res.json();

      // Optionally: Save leads to Supabase (not shown here)

      if (onLeadsGenerated) onLeadsGenerated(data.leads, description);
      if (onClose) onClose();
    } catch (err: any) {
      setError(err.message || "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  function handleSelectOption(filterKey: string, option: string) {
    setFilters((prev: any) => {
      const prevVal = prev[filterKey] || []
      // Toggle selection (multi-select)
      if (prevVal.includes(option)) {
        return { ...prev, [filterKey]: prevVal.filter((o: string) => o !== option) }
      } else {
        return { ...prev, [filterKey]: [...prevVal, option] }
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-lg shadow-sm p-6 mb-8"
    >
      
      <div>
        <h2 className="text-xl font-medium text-foreground mb-4">
          <ClientOnly fallback="AI-Powered Lead Generation">
            {t('leads.aiGeneration.title')}
          </ClientOnly>
        </h2>
        <p className="text-muted-foreground mb-6">
          <ClientOnly fallback="Describe your ideal client and let our AI find the perfect leads for you">
            {t('leads.aiGeneration.description')}
          </ClientOnly>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <ClientOnly fallback="Describe your ideal client">
                {t('leads.idealClientDescription')}
              </ClientOnly>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder={t('leads.idealClientDescription')}
              required
            />
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              <ClientOnly fallback="Optional Filters">
                {t('leads.optionalFilters')}
              </ClientOnly>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtersList.map((filter) => (
                <div key={filter.key} className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <ClientOnly fallback={filter.label}>
                      {t(filter.label)}
                    </ClientOnly>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === filter.key ? null : filter.key)}
                      className="w-full p-3 border border-border rounded-lg bg-background text-foreground text-left focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <span className="text-muted-foreground">
                        {filters[filter.key]?.length > 0 
                          ? `${filters[filter.key].length} ${t('leads.selected')}`
                          : t('leads.selectOptions')
                        }
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {openDropdown === filter.key && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                        >
                          {filter.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleSelectOption(filter.key, option)}
                              className={`w-full p-2 text-left hover:bg-muted dark:hover:bg-muted/60 transition-colors ${
                                filters[filter.key]?.includes(option) 
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                                  : 'text-foreground'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

                     {/* Submit Button */}
           <div className="flex justify-end">
             <Button
               type="submit"
               disabled={loading || !description.trim()}
               variant="primary"
               className="w-full sm:w-auto"
             >
              {loading ? (
                <ClientOnly fallback="Generating leads with AI...">
                  {t('leads.aiGeneration.generating')}
                </ClientOnly>
              ) : (
                <ClientOnly fallback="Generate Leads">
                  {t('leads.generateLeads')}
                </ClientOnly>
              )}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
    </motion.div>
  )
} 