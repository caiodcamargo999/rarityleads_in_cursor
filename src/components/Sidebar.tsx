"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
  ChevronRight
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

  return (
    <motion.aside
      className={`sidebar ${isCollapsed ? 'w-16' : 'w-64'}`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-nav">
        {/* Logo */}
        <div className="p-6 border-b border-[#232336]">
          <Link href="/dashboard" className="flex items-center">
            <h1 className={`font-bold gradient-text ${isCollapsed ? 'text-lg' : 'text-xl'}`}>
              {isCollapsed ? 'RL' : 'Rarity Leads'}
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navigation.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {!isCollapsed && (
                <div className="nav-section-title">
                  {section.title}
                </div>
              )}
              {section.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className={`sidebar-nav-link ${isActive ? 'active' : ''} ${
                      isCollapsed ? 'justify-center px-4' : 'px-6'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="sidebar-logout">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-[#232336] text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-[#b0b0b0] truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start text-[#b0b0b0] hover:text-white hover:bg-[#232336] ${
                isCollapsed ? 'justify-center px-2' : 'px-3'
              }`}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={`w-full justify-start text-[#b0b0b0] hover:text-white hover:bg-[#232336] ${
                isCollapsed ? 'justify-center px-2' : 'px-3'
              }`}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-[#232336] border border-[#232336] hover:bg-[#232136] p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
} 