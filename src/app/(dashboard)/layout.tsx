"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
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
  Settings, 
  LogOut,
  Home,
  Target,
  ChevronDown,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'PROSPECTING', href: '#', icon: null, isSection: true, children: [
    { name: 'Leads', href: '/prospecting/leads', icon: Users },
    { name: 'Companies', href: '/prospecting/companies', icon: Building2 }
  ]},
  { name: 'OUTREACH', href: '#', icon: null, isSection: true, children: [
    { name: 'WhatsApp', href: '/approaching/whatsapp', icon: MessageSquare },
    { name: 'LinkedIn', href: '/approaching/linkedin', icon: Linkedin },
    { name: 'Instagram', href: '/approaching/instagram', icon: Instagram },
    { name: 'Facebook', href: '/approaching/facebook', icon: Facebook },
    { name: 'X (Twitter)', href: '/approaching/x', icon: Twitter }
  ]},
  { name: 'SUPPORT', href: '#', icon: null, isSection: true, children: [
    { name: 'Support', href: '/support', icon: HelpCircle }
  ]}
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-50 w-70 bg-[#101014] border-r border-gray-800 lg:static lg:inset-0 lg:z-auto lg:w-70 lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-800">
            <Link href="/dashboard" className="text-2xl font-medium text-white">
              Rarity Leads
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              if (item.isSection) {
                return (
                  <div key={item.name} className="mb-4">
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-normal text-gray-400 uppercase tracking-wider">
                        {item.name}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center space-x-3 px-4 py-3 text-sm font-normal rounded-lg transition-all duration-200 ${
                            isActive(child.href)
                              ? 'bg-[#232336] text-white'
                              : 'text-gray-400 hover:text-white hover:bg-[#18181c]'
                          }`}
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
                      ? 'bg-[#232336] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-[#18181c]'
                  }`}
                >
                  {item.icon ? <item.icon className="w-5 h-5" /> : null}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section - Avatar with Popup */}
          <div className="border-t border-gray-800 p-4 mt-auto">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-[#18181c] transition-colors"
              >
                <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                  <span className="text-white font-normal text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-normal text-white">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </motion.button>

              {/* Profile Menu Popup */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-[#18181c] border border-gray-800 rounded-lg shadow-lg z-50"
                >
                  <div className="p-2">
                    <Link href="/profile">
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#232336] transition-colors">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-white">Profile Settings</span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#232336] transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-red-400">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-70">
        <main className="h-full bg-[#0a0a0a]">
          {children}
        </main>
      </div>
    </div>
  )
} 