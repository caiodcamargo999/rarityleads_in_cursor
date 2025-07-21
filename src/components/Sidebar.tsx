"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  Building2, 
  MessageSquare, 
  BarChart3, 
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  user: {
    name: string
    email: string
    avatar?: string | null
  }
  onProfileClick: () => void
  onLogout: () => void
}

const navigationItems = [
  {
    title: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Prospecting",
    items: [
      { name: "Leads", href: "/prospecting/leads", icon: Target },
      { name: "Companies", href: "/prospecting/companies", icon: Building2 },
    ]
  },
  {
    title: "Outreach",
    items: [
      { name: "WhatsApp", href: "/approaching/whatsapp", icon: MessageSquare },
      { name: "LinkedIn", href: "/approaching/linkedin", icon: MessageSquare },
      { name: "Email", href: "/approaching/email", icon: MessageSquare },
    ]
  },
  {
    title: "Analytics & Support",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Support", href: "/support", icon: HelpCircle },
    ]
  }
]

export function Sidebar({ user, onProfileClick, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const handleProfileClick = () => {
    onProfileClick()
  }

  const handleLogout = () => {
    onLogout()
  }

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "sidebar transition-all duration-300",
        collapsed && "w-16"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-bold text-lg text-sidebar-foreground"
              >
                RARITY LEADS
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              className="p-1 h-8 w-8"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8">
          {navigationItems.map((section, sectionIndex) => (
            <div key={section.title}>
              {!collapsed && (
                <motion.h3
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="nav-section-title"
                >
                  {section.title}
                </motion.h3>
              )}
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "sidebar-nav-link",
                          isActive && "active"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Profile & Logout Section */}
        <div className="sidebar-logout">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="w-full justify-start"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
                </div>
              </Button>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  )
} 