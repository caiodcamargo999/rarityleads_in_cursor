"use client"

import { motion } from "framer-motion"

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify-center min-h-[200px]"
    >
      {leads.length === 0 ? (
        <div className="text-gray-500 text-base">No leads generated yet. Fill the form and click Generate Leads.</div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.full_name + lead.company_name + i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-[#18181c] rounded-xl shadow-lg p-6 border border-dark-border flex flex-col gap-2"
            >
              <div className="text-lg font-medium text-white mb-1">{lead.full_name}</div>
              <div className="text-sm text-gray-300 mb-1">{lead.company_name} — {lead.job_title}</div>
              <div className="text-sm text-gray-400 mb-1">{lead.location} ({lead.timezone})</div>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-xs text-gray-400">Main Channel:</span>
                {lead.contact_channels?.map((ch, idx) => (
                  <span key={ch + idx} className="px-2 py-1 rounded bg-dark-bg-tertiary text-xs text-gray-200">{ch}</span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-1">Best time: {lead.best_contact_time}</div>
              <div className="flex flex-wrap gap-1 mb-1">
                {lead.tags?.map(tag => (
                  <span key={tag} className="bg-rarity-600 text-white text-xs px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {lead.suggested_services?.map(svc => (
                  <span key={svc} className="bg-dark-bg-tertiary text-xs text-gray-300 px-2 py-1 rounded-full">{svc}</span>
                ))}
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 rounded bg-rarity-600 text-white text-sm font-medium hover:bg-rarity-700 transition">Save to Pipeline</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
} 