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
  X,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Loading } from '@/components/ui/loading'
import { sidebarSlide, fadeInUp } from '@/lib/motion'
import AnthropicProfilePanel from '@/components/AnthropicProfilePanel'

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
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false)
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
    setIsProfilePanelVisible(false)
  }

  const handleProfileClick = () => {
    setIsProfilePanelVisible(true)
  }

  const handleSettingsClick = () => {
    router.push('/settings')
    setIsProfilePanelVisible(false)
  }

  const getUserInitials = (email: string) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U'
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sidebar */}
      <motion.aside
        variants={sidebarSlide}
        initial="initial"
        animate="animate"
        className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border lg:block hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground">Rarity Leads</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              if (item.isSection) {
                return (
                  <div key={item.name}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {item.name}
                    </h3>
                    <div className="space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(child.href)
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          {child.icon && <child.icon className="h-4 w-4 mr-3" />}
                          {child.name}
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
                  className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile - Clickable Avatar */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-xs">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-45 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-foreground">Rarity Leads</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navigation.map((item) => {
                    if (item.isSection) {
                      return (
                        <div key={item.name}>
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {item.name}
                          </h3>
                          <div className="space-y-1">
                            {item.children?.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isActive(child.href)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                {child.icon && <child.icon className="h-4 w-4 mr-3" />}
                                {child.name}
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
                        className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-3" />}
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* User Profile - Clickable Avatar */}
                <div className="p-4 border-t border-border">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={handleProfileClick}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-xs">
                          {getUserInitials(user?.email)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pl-0 lg:pl-64 flex-1">
        <motion.main
          className="bg-background pt-20 lg:pt-6 pb-20 lg:pb-6 p-4 lg:p-6 min-h-screen"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.main>

        {/* Bottom Tab Navigation - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border">
          <div className="flex justify-around">
            {bottomTabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                  isActive(tab.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

        {/* Anthropic-style Profile Panel */}
        <AnthropicProfilePanel
          user={user}
          isVisible={isProfilePanelVisible}
          onClose={() => setIsProfilePanelVisible(false)}
          onLogout={handleSignOut}
          onSettingsClick={handleSettingsClick}
        />
    </div>
  )
} 