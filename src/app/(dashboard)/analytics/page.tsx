"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const metrics = [
    {
      title: "Total Leads",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: Users,
      description: "from last period"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      changeType: "positive" as const,
      icon: Target,
      description: "from last period"
    },
    {
      title: "Messages Sent",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "from last period"
    },
    {
      title: "Response Rate",
      value: "0%",
      change: "+0%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "from last period"
    }
  ];

  const channelData = [
    { channel: "WhatsApp", leads: 0, conversions: 0, responseRate: 0 },
    { channel: "LinkedIn", leads: 0, conversions: 0, responseRate: 0 },
    { channel: "Email", leads: 0, conversions: 0, responseRate: 0 },
    { channel: "Instagram", leads: 0, conversions: 0, responseRate: 0 }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lead_converted",
      title: "Lead converted",
      description: "John Smith from TechCorp",
      time: "2 hours ago",
      value: "+$5,000"
    },
    {
      id: 2,
      type: "campaign_completed",
      title: "Campaign completed",
      description: "Q1 Outreach Campaign",
      time: "1 day ago",
      value: "85% success"
    },
    {
      id: 3,
      type: "new_lead",
      title: "New high-value lead",
      description: "Sarah Johnson from StartupXYZ",
      time: "2 days ago",
      value: "AI Score: 92"
    }
  ];

  const getChangeIcon = (changeType: string) => {
    return changeType === "positive" ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics & Insights
            </h1>
            <p className="text-[#b0b0b0]">
              Track your performance and optimize your lead generation strategy.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="btn-secondary">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="btn-secondary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex gap-2">
          {[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: '1y', label: 'Last year' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedPeriod === period.value
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                  : 'border-[#232336] text-[#b0b0b0] hover:border-[#8B5CF6]'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#b0b0b0]">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-[#8B5CF6]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                {getChangeIcon(metric.changeType)}
                <span className={`text-xs ${metric.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                  {metric.change}
                </span>
                <span className="text-xs text-[#b0b0b0]">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-[#232336]">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#8B5CF6]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="channels" className="data-[state=active]:bg-[#8B5CF6]">
            <MessageSquare className="h-4 w-4 mr-2" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-[#8B5CF6]">
            <Target className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">Performance Overview</CardTitle>
                <CardDescription className="text-[#b0b0b0]">
                  Lead generation and conversion trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#b0b0b0] mx-auto mb-4" />
                    <p className="text-[#b0b0b0]">No data available yet</p>
                    <p className="text-sm text-[#b0b0b0] mt-2">
                      Start generating leads to see performance metrics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-[#b0b0b0]">
                  Latest updates from your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
                    <p className="text-[#b0b0b0]">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 border border-[#232336] rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-[#232336] rounded-lg">
                            <BarChart3 className="h-5 w-5 text-[#8B5CF6]" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{activity.title}</p>
                            <p className="text-sm text-[#b0b0b0]">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{activity.value}</p>
                          <p className="text-xs text-[#b0b0b0]">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">Channel Performance</CardTitle>
                <CardDescription className="text-[#b0b0b0]">
                  Compare performance across different outreach channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {channelData.map((channel, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-[#232336] rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-[#232336] rounded-lg">
                          <MessageSquare className="h-5 w-5 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{channel.channel}</p>
                          <p className="text-sm text-[#b0b0b0]">
                            {channel.leads} leads • {channel.conversions} conversions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {channel.responseRate}% response rate
                        </p>
                        <Badge className="bg-[#232336] text-[#b0b0b0]">
                          {channel.leads > 0 ? 'Active' : 'No data'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card">
              <CardHeader>
                <CardTitle className="text-white">Campaign Analytics</CardTitle>
                <CardDescription className="text-[#b0b0b0]">
                  Detailed performance metrics for your campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-[#b0b0b0] mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No campaigns yet</h3>
                  <p className="text-[#b0b0b0] mb-4">
                    Create your first campaign to see detailed analytics
                  </p>
                  <Button className="btn-primary">
                    <Target className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">AI-Powered Insights</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Recommendations to improve your lead generation performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-[#232336] rounded-lg">
                <h3 className="font-medium text-white mb-2">Optimization Tips</h3>
                <ul className="space-y-2 text-sm text-[#b0b0b0]">
                  <li>• Send messages between 10 AM - 2 PM for better response rates</li>
                  <li>• Personalize your outreach with company-specific information</li>
                  <li>• Follow up within 24 hours for higher conversion rates</li>
                </ul>
              </div>
              <div className="p-4 border border-[#232336] rounded-lg">
                <h3 className="font-medium text-white mb-2">Next Actions</h3>
                <ul className="space-y-2 text-sm text-[#b0b0b0]">
                  <li>• 5 leads ready for follow-up</li>
                  <li>• 3 campaigns need optimization</li>
                  <li>• 12 new prospects identified</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 