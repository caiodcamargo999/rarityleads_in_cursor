"use client"
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Building2,
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  BarChart3,
  HelpCircle,
  LogOut,
  Home,
  ChevronDown,
  User,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Loading } from '@/components/ui/loading'
import { sidebarSlide, fadeInUp } from '@/lib/motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'CRM', href: '/dashboard/crm', icon: BarChart3 },
  { name: 'OUTREACH', href: '#', icon: null, isSection: true, children: [
    { name: 'WhatsApp', href: '/outreach/whatsapp', icon: MessageSquare },
    { name: 'Instagram', href: '/outreach/instagram', icon: Instagram },
    { name: 'LinkedIn', href: '/outreach/linkedin', icon: Linkedin },
    { name: 'Facebook', href: '/outreach/facebook', icon: Facebook },
    { name: 'X (Twitter)', href: '/outreach/x', icon: Twitter }
  ]},
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Support', href: '/support', icon: HelpCircle }
]

// Bottom tab navigation for mobile
const bottomTabs = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'CRM', href: '/dashboard/crm', icon: BarChart3 },
  { name: 'Messages', href: '/outreach/whatsapp', icon: MessageSquare }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/auth')
        } else if (session?.user) {
          setUser(session.user)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const isActive = (href: string) => {
    if (href === '#') return false
    const safePath = pathname ?? ''
    return safePath === href || safePath.startsWith(href + '/')
  }

  // Always close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <Loading message="Loading your dashboard..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden on mobile by default */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-bg-secondary border-r border-dark-border lg:static lg:inset-0 lg:z-auto transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-border">
            <Link href="/dashboard" className="text-xl font-medium text-dark-text">
              Rarity Leads
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              if (item.isSection) {
                return (
                  <div key={item.name} className="mb-4">
                    <h3 className="px-4 py-2 text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                      {item.name}
                    </h3>
                    <div className="space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center space-x-3 px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 ${
                            isActive(child.href)
                              ? 'bg-rarity-600 text-white'
                              : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg-tertiary'
                          }`}
                          prefetch={true}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <child.icon className="w-5 h-5" />
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 text-sm font-normal rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-rarity-600 text-white'
                      : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-bg-tertiary'
                  }`}
                  prefetch={true}
                  onClick={() => setSidebarOpen(false)}
                >
                  {typeof item.icon === 'function' ? <item.icon className="w-5 h-5" /> : null}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-dark-border">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-bg-tertiary">
              <div className="w-8 h-8 bg-rarity-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-text truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-dark-text-muted truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-dark-text-secondary hover:text-dark-text"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-dark-bg border-b border-dark-border">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-lg font-medium text-white">Rarity Leads</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open sidebar menu"
            onClick={() => setSidebarOpen(true)}
            className="ml-auto"
          >
            <Menu className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Page content */}
        <motion.main
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full pt-4 px-4 pb-20 lg:pt-6 lg:px-8 lg:pb-6 overflow-x-hidden"
        >
          {children}
        </motion.main>

        {/* Bottom tab navigation for mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-bg-secondary border-t border-dark-border z-30">
          <div className="flex justify-around">
            {bottomTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center py-3 px-4 flex-1 transition-all duration-200 ${
                  isActive(tab.href)
                    ? 'text-rarity-500'
                    : 'text-dark-text-secondary hover:text-dark-text'
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 