"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  MessageSquare, 
  Instagram, 
  Linkedin, 
  Facebook, 
  Twitter,
  BarChart3, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Prospecting",
      items: [
        {
          title: "Leads",
          href: "/prospecting/leads",
          icon: Users,
        },
        {
          title: "Companies",
          href: "/prospecting/companies",
          icon: Building2,
        },
      ],
    },
    {
      title: "Approaching",
      items: [
        {
          title: "WhatsApp",
          href: "/approaching/whatsapp",
          icon: MessageSquare,
        },
        {
          title: "Instagram",
          href: "/approaching/instagram",
          icon: Instagram,
        },
        {
          title: "LinkedIn",
          href: "/approaching/linkedin",
          icon: Linkedin,
        },
        {
          title: "Facebook",
          href: "/approaching/facebook",
          icon: Facebook,
        },
        {
          title: "X (Twitter)",
          href: "/approaching/x",
          icon: Twitter,
        },
      ],
    },
    {
      title: "Analytics & Support",
      items: [
        {
          title: "Analytics",
          href: "/analytics",
          icon: BarChart3,
        },
        {
          title: "Support",
          href: "/support",
          icon: HelpCircle,
        },
      ],
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 64 }
  };

  const mobileVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-card border border-border"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 lg:block"
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ display: isMobileOpen ? 'block' : 'none' }}
        className="lg:block"
      >
        <motion.div
          variants={mobileVariants}
          initial="closed"
          animate={isMobileOpen ? "open" : "closed"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full flex flex-col"
        >
          {/* Logo */}
          <motion.div 
            className="p-6 border-b border-sidebar-border"
            layout
          >
            <Link href="/dashboard" className="flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </motion.div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h1
                    key="logo-text"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-xl gradient-text"
                  >
                    Rarity Leads
                  </motion.h1>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navigation.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      key="section-title"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="nav-section-title"
                    >
                      {section.title}
                    </motion.div>
                  )}
                </AnimatePresence>
                {section.items.map((item, itemIndex) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={`sidebar-nav-link ${isActive ? 'active' : ''} ${
                          isCollapsed ? 'justify-center px-3' : 'px-4'
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.span
                              key="nav-text"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="truncate"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary"
                            layoutId="activeTab"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <motion.div 
            className="sidebar-logout"
            layout
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    key="user-info"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-sidebar-foreground/50 truncate">
                      {user?.email}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent ${
                  isCollapsed ? 'justify-center px-2' : 'px-3'
                }`}
              >
                <Settings className="h-4 w-4" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      key="settings-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-2"
                    >
                      Settings
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={`w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent ${
                  isCollapsed ? 'justify-center px-2' : 'px-3'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      key="logout-text"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-2"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </motion.div>

          {/* Collapse Toggle - Desktop Only */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-sidebar-accent border border-sidebar-border hover:bg-sidebar-accent/80 p-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
} 