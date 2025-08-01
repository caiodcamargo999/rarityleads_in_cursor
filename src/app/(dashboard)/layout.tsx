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
import { useTranslation } from 'react-i18next'

const getNavigation = (t: any) => [
  { name: t('navigation.dashboard'), href: '/dashboard', icon: Home },
  { name: t('navigation.leads'), href: '/leads', icon: Users },
  { name: t('navigation.companies'), href: '/companies', icon: Building2 },
  { name: t('navigation.crm'), href: '/dashboard/crm', icon: BarChart3 },
  { name: t('navigation.outreach'), href: '#', icon: null, isSection: true, children: [
    { name: t('navigation.whatsapp'), href: '/outreach/whatsapp', icon: MessageSquare },
    { name: t('navigation.instagram'), href: '/outreach/instagram', icon: Instagram },
    { name: t('navigation.linkedin'), href: '/outreach/linkedin', icon: Linkedin },
    { name: t('navigation.facebook'), href: '/outreach/facebook', icon: Facebook },
    { name: t('navigation.twitter'), href: '/outreach/x', icon: Twitter }
  ]},
  { name: t('navigation.analytics'), href: '/analytics', icon: BarChart3 },
  { name: t('navigation.support'), href: '/support', icon: HelpCircle }
]

// Bottom tab navigation for mobile
const getBottomTabs = (t: any) => [
  { name: t('navigation.dashboard'), href: '/dashboard', icon: Home },
  { name: t('navigation.crm'), href: '/dashboard/crm', icon: BarChart3 },
  { name: t('navigation.whatsapp'), href: '/outreach/whatsapp', icon: MessageSquare }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()
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
            {getNavigation(t).map((item) => {
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
                  {getNavigation(t).map((item) => {
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
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium text-foreground">Rarity Leads</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfileClick}
            className="text-foreground"
          >
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-medium text-xs">
                {getUserInitials(user?.email)}
              </span>
            </div>
          </Button>
        </div>

        <motion.main
          className="bg-background pt-16 lg:pt-6 pb-20 lg:pb-6 p-4 lg:p-6 min-h-screen"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {children}
        </motion.main>

        {/* Bottom Tab Navigation - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border pb-safe">
          <div className="flex justify-around">
            {getBottomTabs(t).map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors min-h-[60px] justify-center ${
                  isActive(tab.href)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{tab.name}</span>
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