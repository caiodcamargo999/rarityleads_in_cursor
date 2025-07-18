import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Target,
  Check,
  Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A23] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A23]/80 backdrop-blur-md border-b border-[#232336]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">Rarity Leads</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-[#e0e0e0] hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-[#e0e0e0] hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/auth" className="btn-secondary">
                Sign In
              </Link>
              <Link href="/auth" className="btn-primary">
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              AI-powered warm lead hunting for{' '}
              <span className="gradient-text">faster deals</span>, deeper conversations, and scalable outreach
            </h1>
            <p className="text-xl md:text-2xl text-[#b0b0b0] mb-8 max-w-4xl mx-auto">
              Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="btn-secondary text-lg px-8 py-4">
                  See How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#232136]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything you need to scale your outreach
            </h2>
            <p className="text-xl text-[#b0b0b0] max-w-3xl mx-auto">
              From AI-powered lead discovery to multi-channel messaging, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered SDR That Qualifies Leads for You",
                description: "Automatically discover and score leads based on firmographics, technographics, and intent signals."
              },
              {
                icon: MessageSquare,
                title: "Smart WhatsApp Follow-ups, No Manual Messaging",
                description: "Multi-account WhatsApp management with AI-suggested messages and automated sequences."
              },
              {
                icon: BarChart3,
                title: "Campaign Intelligence for Google and Meta",
                description: "Track performance across all channels with real-time analytics and optimization insights."
              },
              {
                icon: Users,
                title: "Multi-Channel Outreach",
                description: "Reach prospects on WhatsApp, LinkedIn, Instagram, Facebook, and X with unified messaging."
              },
              {
                icon: Target,
                title: "Intent-Based Targeting",
                description: "Identify prospects showing buying signals through web activity and technology adoption."
              },
              {
                icon: Check,
                title: "Seamless CRM Integration",
                description: "Sync leads and conversations with your existing CRM through our open API."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 hover:border-[#8B5CF6] transition-colors"
              >
                <feature.icon className="h-12 w-12 text-[#8B5CF6] mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#b0b0b0]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple Pricing for Scalable Growth
            </h2>
            <p className="text-xl text-[#b0b0b0] max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                period: "/month",
                description: "Perfect for small teams getting started",
                features: [
                  "100 AI-qualified leads per month",
                  "WhatsApp multi-account (2 accounts)",
                  "Basic analytics dashboard",
                  "Email support",
                  "API access"
                ],
                cta: "Start for Free",
                popular: false
              },
              {
                name: "Professional",
                price: "$149",
                period: "/month",
                description: "For growing teams and agencies",
                features: [
                  "500 AI-qualified leads per month",
                  "WhatsApp multi-account (5 accounts)",
                  "All social media channels",
                  "Advanced analytics & reporting",
                  "Priority support",
                  "Custom integrations"
                ],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations with custom needs",
                features: [
                  "Unlimited AI-qualified leads",
                  "Unlimited WhatsApp accounts",
                  "Custom AI models",
                  "Dedicated account manager",
                  "SLA guarantees",
                  "On-premise deployment"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card p-8 relative ${plan.popular ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#8B5CF6] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-[#b0b0b0]">{plan.period}</span>
                  </div>
                  <p className="text-[#b0b0b0]">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-[#8B5CF6] mr-3 flex-shrink-0" />
                      <span className="text-[#e0e0e0]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#232136]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stop Chasing Leads. Start Closing.
            </h2>
            <p className="text-xl text-[#b0b0b0] mb-8">
              Join thousands of agencies and sales teams using Rarity Leads to scale their outreach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/auth">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[#b0b0b0]">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-2" />
                <span>4.9 Stars on Clutch</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-[#8B5CF6] mr-2" />
                <span>1,200+ Clients</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-[#8B5CF6] mr-2" />
                <span>AI-Powered and Human-Approved</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#232336]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold gradient-text mb-4">Rarity Leads</h3>
              <p className="text-[#b0b0b0]">
                AI-powered B2B lead generation platform for agencies and sales teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-[#b0b0b0]">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-[#b0b0b0]">
                <li><Link href="/support" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[#b0b0b0]">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#232336] mt-8 pt-8 text-center text-[#b0b0b0]">
            <p>&copy; 2024 Rarity Leads. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 