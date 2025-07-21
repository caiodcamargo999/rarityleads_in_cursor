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
        <nav className="flex-1 px-4 py-4 space-y-4">
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

        {/* Anthropic-style Profile/Settings at the very bottom */}
        {!collapsed && (
          <div className="w-full px-3 pb-3 mt-auto">
            <div className="flex items-center bg-[#232336] rounded-lg px-3 py-2 gap-2">
              <div className="w-8 h-8 rounded-full bg-[#393552] flex items-center justify-center text-white font-medium text-base">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate leading-tight">{user.name}</div>
                <div className="text-xs text-[#b0b0b0] truncate leading-tight">{user.email}</div>
              </div>
              <button onClick={onProfileClick} aria-label="Profile settings" className="ml-1 text-[#b0b0b0] hover:text-white focus:outline-none">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={onLogout} aria-label="Logout" className="ml-1 text-red-400 hover:text-red-300 focus:outline-none">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
} 