"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { supabase } from '@/integrations/supabase/client'
import { useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'

const filtersList = [
  {
    label: "Annual Revenue",
    key: "revenue",
    options: ["$0-1M", "$1-5M", "$5-10M", "$10-50M", "$50M+"]
  },
  {
    label: "Company Size",
    key: "size",
    options: ["1-10", "11-50", "51-200", "201-1000", "1000+"]
  },
  {
    label: "Country/City",
    key: "location",
    options: ["USA", "UK", "Germany", "Brazil", "Singapore"]
  },
  {
    label: "Lead Role",
    key: "role",
    options: ["CEO", "Head of Marketing", "CTO", "Founder", "Sales Director"]
  },
  {
    label: "Contact Channel",
    key: "channel",
    options: ["WhatsApp", "LinkedIn", "Instagram", "Facebook", "X (Twitter)"]
  },
  {
    label: "Business Needs",
    key: "needs",
    options: ["Paid Ads", "Funnel", "CRM", "Outreach", "SEO"]
  },
]

type Props = { onClose?: () => void; onLeadsGenerated?: (leads: any[], description: string) => void }

export default function LeadInputForm({ onClose, onLeadsGenerated }: Props) {
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
    <form onSubmit={handleSubmit} className="bg-[#18181c] rounded-2xl shadow-lg p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 relative w-full">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
      )}
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="relative mt-2">
        <textarea
          id="lead-description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={4}
          className="w-full bg-dark-bg-secondary text-white rounded-lg border border-dark-border p-4 pt-8 resize-none focus:outline-none focus:ring-2 focus:ring-rarity-500 transition-all peer"
          placeholder=" "
        />
        <span
          className={
            `absolute left-4 top-4 text-gray-400 text-base pointer-events-none transition-all duration-200 ` +
            ((description && description.length > 0) ? 'text-xs -top-2 bg-[#18181c] px-1' : 'peer-focus:text-xs peer-focus:-top-2 peer-focus:bg-[#18181c] peer-focus:px-1')
          }
        >
          Describe your ideal client (industry, role, location, budget, contact method, etc.)
        </span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {filtersList.map(f => (
          <div key={f.key} className="relative">
            <button
              type="button"
              className={`px-3 lg:px-4 py-2 rounded-full bg-dark-bg border border-dark-border text-gray-300 text-xs lg:text-sm hover:bg-dark-bg-tertiary transition-all flex items-center gap-2 ${openDropdown === f.key ? 'ring-2 ring-rarity-600' : ''}`}
              onClick={() => setOpenDropdown(openDropdown === f.key ? null : f.key)}
            >
              {f.label}
              {filters[f.key] && filters[f.key].length > 0 && (
                <span className="ml-2 text-xs text-rarity-600">({filters[f.key].length})</span>
              )}
            </button>
            <AnimatePresence>
              {openDropdown === f.key && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-2 left-0 min-w-[180px] bg-[#232336] border border-dark-border rounded-lg shadow-lg p-2 flex flex-col gap-1"
                >
                  {f.options.map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-all ${filters[f.key]?.includes(option) ? 'bg-rarity-600 text-white' : 'text-gray-200 hover:bg-dark-bg-tertiary'}`}
                      onClick={() => handleSelectOption(f.key, option)}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex justify-end"
      >
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="px-8 text-base font-medium"
          disabled={loading || !description.trim()}
        >
          Generate Leads
        </Button>
      </motion.div>
    </form>
  )
} 