'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FloatingProfilePanel from '@/components/FloatingProfilePanel';
import { getSupabase } from '@/lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(null);
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);
  const [timeFilter, setTimeFilter] = useState('7d');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/');
  };

  const metrics = [
    {
      title: 'Active Leads',
      value: '0',
      change: '0%',
      icon: 'users',
      trend: 'neutral'
    },
    {
      title: 'Conversion Rate',
      value: '0%',
      change: '0%',
      icon: 'target',
      trend: 'neutral'
    },
    {
      title: 'Active Campaigns',
      value: '0',
      change: '0%',
      icon: 'bar-chart-2',
      trend: 'neutral'
    },
    {
      title: 'Monthly Revenue',
      value: '$0',
      change: '0%',
      icon: 'dollar-sign',
      trend: 'neutral'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Lead',
      icon: 'user-plus',
      action: () => router.push('/leads/new')
    },
    {
      title: 'Create Campaign',
      icon: 'plus-circle',
      action: () => router.push('/campaigns/new')
    },
    {
      title: 'Export Data',
      icon: 'download',
      action: () => console.log('Export data')
    },
    {
      title: 'Schedule Meeting',
      icon: 'calendar',
      action: () => console.log('Schedule meeting')
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
      case 'download':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-main-bg flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar 
        user={user} 
        onProfileClick={() => setIsProfilePanelVisible(true)} 
      />
      
      <main className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <header className="mb-8">
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
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                      timeFilter === period
                        ? 'bg-main-bg text-primary-text'
                        : 'text-secondary-text hover:text-primary-text'
                    }`}
                  >
                    {period.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-card-bg border border-border rounded-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sidebar-text-secondary">
                    {getIcon(metric.icon)}
                  </div>
                  <div className="flex items-center text-sm text-secondary-text">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-primary-text mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-secondary-text">
                  {metric.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card-bg border border-border rounded-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary-text">
                  Lead Generation Trend
                </h3>
                <button className="text-sm text-primary-text hover:text-secondary-text transition-colors">
                  View All
                </button>
              </div>
              <div className="h-64 flex items-center justify-center text-secondary-text">
                Chart placeholder
              </div>
            </div>

            <div className="bg-card-bg border border-border rounded-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary-text">
                  Channel Performance
                </h3>
                <button className="text-sm text-primary-text hover:text-secondary-text transition-colors">
                  View All
                </button>
              </div>
              <div className="h-64 flex items-center justify-center text-secondary-text">
                Chart placeholder
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-medium text-primary-text mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-card-bg border border-border rounded-card p-4 hover:bg-button-bg hover:text-primary-text transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sidebar-text-secondary">
                    {getIcon(action.icon)}
                  </div>
                  <span className="text-sm font-medium text-secondary-text group-hover:text-primary-text">
                    {action.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Profile Panel */}
      <FloatingProfilePanel
        user={user}
        isVisible={isProfilePanelVisible}
        onClose={() => setIsProfilePanelVisible(false)}
        onLogout={handleLogout}
      />
    </div>
  );
} 