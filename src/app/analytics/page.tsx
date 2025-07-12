'use client';

import { useState, useEffect } from 'react';
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [metrics, setMetrics] = useState({
    leadsGenerated: 0,
    conversionRate: 0,
    activeCampaigns: 0,
    revenue: 0
  });

  useEffect(() => {
    // Simulate loading metrics data
    const loadMetrics = async () => {
      // In a real app, this would fetch from your API
      setTimeout(() => {
        setMetrics({
          leadsGenerated: 1247,
          conversionRate: 12.5,
          activeCampaigns: 8,
          revenue: 45600
        });
      }, 1000);
    };

    loadMetrics();
  }, []);

  const handleExport = () => {
    // Implement export functionality
    alert('Export feature coming soon!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-main-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Performance & campaign insights
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Leads Generated
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {metrics.leadsGenerated.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              {getTrendIcon(12)}
              +12% from last month
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Conversion Rate
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {metrics.conversionRate}%
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              {getTrendIcon(5)}
              +5% from last month
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Active Campaigns
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {metrics.activeCampaigns}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              {getTrendIcon(0)}
              No variation
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Revenue
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatCurrency(metrics.revenue)}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              {getTrendIcon(18)}
              +18% from last month
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'funnel', label: 'Funnel' },
                { id: 'sources', label: 'Sources' },
                { id: 'revenue', label: 'Revenue' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="flex gap-2 mb-6">
                  {[7, 30, 90].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {period}d
                    </button>
                  ))}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    Chart placeholder for {selectedPeriod}-day overview
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Integration with Chart.js or similar library would go here
                  </p>
                </div>
              </div>
            )}

            {/* Funnel Tab */}
            {activeTab === 'funnel' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Acquisition Funnel
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Track your lead journey from first touch to conversion
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    Funnel chart placeholder
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Funnel visualization would be implemented here
                  </p>
                </div>
              </div>
            )}

            {/* Sources Tab */}
            {activeTab === 'sources' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Lead Sources
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Identify your most effective lead generation channels
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    Sources chart placeholder
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Pie chart or bar chart showing lead sources would go here
                  </p>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Revenue Trends
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Monitor your revenue growth and patterns
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 mb-2">
                    Revenue chart placeholder
                  </div>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Line chart showing revenue trends over time would go here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 