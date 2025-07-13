'use client';
import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-sidebar-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI-Powered SDR That Qualifies Leads for You",
    description: "Deploy an AI agent that identifies ideal customers, engages them in human-like conversations, and qualifies their interest—so your team only talks to meeting-ready leads."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-sidebar-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: "Smart WhatsApp Follow-ups, No Manual Messaging",
    description: "Connect with prospects across any channel—WhatsApp, LinkedIn, & Email. Our AI crafts and sends personalized follow-ups at the perfect time, ensuring no opportunity is missed."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-sidebar-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Campaign Intelligence for Google and Meta",
    description: "Move beyond vanity metrics. Rarity analyzes your entire sales funnel, providing actionable insights to optimize campaigns, lower acquisition costs, and maximize your return."
  }
];

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="border border-border rounded-card p-8 bg-card-bg hover:border-primary-text transition-colors duration-300"
      whileHover={{ scale: 1.03, boxShadow: '0 4px 32px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-lg md:text-xl font-medium mb-4 text-primary-text font-bentosans">{title}</h3>
      <p className="text-secondary-text font-normal leading-relaxed font-inter">{description}</p>
    </motion.div>
  );
}

export default function FeatureSection() {
  return (
    <motion.section
      id="features"
      className="py-16 md:py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.h2
        className="text-2xl md:text-3xl lg:text-4xl font-medium text-center mb-12 text-primary-text font-bentosans"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        The End of Manual Prospecting
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </motion.section>
  );
} 