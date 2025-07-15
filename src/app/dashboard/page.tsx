'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FloatingProfilePanel from '@/components/FloatingProfilePanel';
import { supabase, getCurrentUser, getLeads, getCampaigns, getAnalytics } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface Lead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  status: string;
  ai_score: number;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

interface Analytics {
  id: string;
  metric_type: string;
  metric_value: number;
  date: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth');
          return;
        }
        setUser(currentUser);
        await loadDashboardData(currentUser.id);
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/auth');
      }
    };
    checkUser();
  }, [router]);

  const loadDashboardData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Load leads
      const leadsData = await getLeads(userId);
      setLeads(leadsData || []);
      
      // Load campaigns
      const campaignsData = await getCampaigns(userId);
      setCampaigns(campaignsData || []);
      
      // Load analytics for the last 7 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const analyticsData = await getAnalytics(userId, { start: startDate, end: endDate });
      setAnalytics(analyticsData || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Calculate metrics from data
  const activeLeads = leads.filter(lead => lead.status === 'new' || lead.status === 'contacted').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'qualified').length;
  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'active').length;
  const totalLeads = leads.length;

  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;

  const metrics = [
    {
      title: 'Active Leads',
      value: activeLeads.toString(),
      change: '0%',
      icon: 'users',
      trend: 'neutral'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '0%',
      icon: 'target',
      trend: 'neutral'
    },
    {
      title: 'Active Campaigns',
      value: activeCampaigns.toString(),
      change: '0%',
      icon: 'bar-chart-2',
      trend: 'neutral'
    },
    {
      title: 'Total Leads',
      value: totalLeads.toString(),
      change: '0%',
      icon: 'dollar-sign',
      trend: 'neutral'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Lead',
      icon: 'user-plus',
      action: () => router.push('/dashboard/prospecting/leads/new')
    },
    {
      title: 'Create Campaign',
      icon: 'plus-circle',
      action: () => router.push('/dashboard/campaigns/new')
    },
    {
      title: 'Connect WhatsApp',
      icon: 'message-circle',
      action: () => router.push('/dashboard/whatsapp/accounts')
    },
    {
      title: 'View Analytics',
      icon: 'bar-chart',
      action: () => router.push('/dashboard/analytics')
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'target':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'bar-chart-2':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'dollar-sign':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'user-plus':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'plus-circle':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'message-circle':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'bar-chart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg flex items-center justify-center">
        <div className="text-primary-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar 
        user={user} 
        onProfileClick={() => setIsProfilePanelVisible(true)} 
      />
      
      <main className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-medium text-primary-text mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-secondary-text">
                Welcome back! Here&apos;s your overview.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex gap-1 bg-button-bg border border-border rounded-btn p-1">
                {['7d', '30d', '90d'].map((period) => (
                  <Button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    variant={timeFilter === period ? 'primary' : 'secondary'}
                    aria-label={`Select time filter for ${period}`}
                    className="px-3 py-1 text-sm font-medium rounded transition-colors"
                  >
                    {period.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Metrics Grid */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div 
                key={index} 
                className="bg-card-bg border border-border rounded-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sidebar-text-secondary">
                    {getIcon(metric.icon)}
                  </div>
                  <div className="flex items-center text-sm text-secondary-text">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    {metric.change}
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="text-2xl font-medium text-primary-text">{metric.value}</h3>
                  <p className="text-sm text-secondary-text">{metric.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-medium text-primary-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                onClick={action.action}
                className="bg-button-bg border border-border rounded-card p-4 text-left hover:bg-button-hover-bg transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sidebar-text-secondary">
                    {getIcon(action.icon)}
                  </div>
                  <span className="text-primary-text font-medium">{action.title}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Activity */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-medium text-primary-text mb-4">Recent Leads</h2>
          <div className="bg-card-bg border border-border rounded-card overflow-hidden">
            {leads.length === 0 ? (
              <div className="p-6 text-center text-secondary-text">
                No leads yet. Start by adding your first lead.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {leads.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="p-4 hover:bg-button-bg transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-primary-text font-medium">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <p className="text-sm text-secondary-text">{lead.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                          lead.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {lead.status}
                        </span>
                        <span className="text-xs text-secondary-text">
                          Score: {lead.ai_score}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </main>

      <FloatingProfilePanel
        isVisible={isProfilePanelVisible}
        onClose={() => setIsProfilePanelVisible(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
} 