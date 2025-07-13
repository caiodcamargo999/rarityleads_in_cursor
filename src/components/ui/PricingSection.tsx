'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
  {
    name: "Starter",
    price: "$47",
    features: [
      "Qualified Leads",
      "AI-Powered SDR",
      "Multi-Channel Outreach",
      "Email & Chat Support"
    ],
    cta: "Choose Plan",
    href: "/auth?plan=starter",
    popular: false
  },
  {
    name: "Pro",
    price: "$97",
    features: [
      "More Qualified Leads",
      "Everything in Starter",
      "Campaign Intelligence",
      "Priority Support"
    ],
    cta: "Choose Plan",
    href: "/auth?plan=pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$197",
    features: [
      "Unlimited Leads",
      "Everything in Pro",
      "Dedicated Success Manager",
      "Custom Integrations"
    ],
    cta: "Contact Sales",
    href: "/auth?plan=enterprise",
    popular: false
  }
];

interface PricingCardProps {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
}

function PricingCard({ name, price, features, cta, href, popular }: PricingCardProps) {
  return (
    <motion.div
      className={`border border-border rounded-2xl p-8 bg-card-bg relative transition-all duration-300 ${popular ? '' : ''}`}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.18)' }}
      whileTap={{ scale: 0.98 }}
    >
      {popular && (
        <div className="flex justify-center mb-2">
          <span className="inline-block bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] text-white px-4 py-1 rounded-full text-xs font-medium shadow-md" style={{ position: 'relative', top: '-1.5rem', marginBottom: '-1.5rem', zIndex: 2 }}>
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-lg md:text-xl font-medium text-primary-text mb-4 font-bentosans text-center">{name}</h3>
      <p className="text-3xl md:text-4xl font-medium text-primary-text mb-6 font-bentosans text-center">{price}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, featureIndex: number) => (
          <li key={featureIndex} className="flex items-center text-secondary-text font-normal font-inter">
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
        <Link
          href={href}
          className="block w-full text-center font-medium rounded-full py-3 px-6 bg-gradient-to-r from-[#6D28D9] via-[#8B5CF6] to-[#232336] text-white transition-all duration-300 text-lg"
          aria-label={cta}
        >
          {cta}
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function PricingSection() {
  return (
    <motion.section
      id="pricing"
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
        Simple, Transparent Pricing. No Surprises.
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </motion.section>
  );
} 