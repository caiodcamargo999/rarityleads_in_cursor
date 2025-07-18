"use client"

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Plus,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const metrics = [
    {
      title: "Total Leads",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: Users,
      description: "from last week"
    },
    {
      title: "Active Conversations",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "from last week"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "from last week"
    },
    {
      title: "Campaigns Active",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: Target,
      description: "from last week"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "lead_added",
      title: "New lead added",
      description: "John Smith from TechCorp",
      time: "2 minutes ago",
      status: "pending"
    },
    {
      id: 2,
      type: "message_sent",
      title: "Message sent",
      description: "WhatsApp message to Sarah Johnson",
      time: "5 minutes ago",
      status: "sent"
    },
    {
      id: 3,
      type: "campaign_started",
      title: "Campaign started",
      description: "Q1 Outreach Campaign",
      time: "1 hour ago",
      status: "active"
    }
  ];

  const quickActions = [
    {
      title: "Add New Lead",
      description: "Manually add a lead to your pipeline",
      icon: Plus,
      href: "/prospecting/leads",
      color: "bg-blue-500"
    },
    {
      title: "Create Campaign",
      description: "Start a new outreach campaign",
      icon: Target,
      href: "/approaching/whatsapp",
      color: "bg-green-500"
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: TrendingUp,
      href: "/analytics",
      color: "bg-purple-500"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "active":
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-500/10 text-green-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "active":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Good morning. Ready to convert more leads today?
        </h1>
        <p className="text-[#b0b0b0]">
          You have <span className="text-[#8B5CF6] font-medium">0 new leads</span> this week.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
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
              <p className="text-xs text-[#b0b0b0]">
                <span className={metric.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                  {metric.change}
                </span>{" "}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="card hover:border-[#8B5CF6] transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-[#b0b0b0]">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Latest updates from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.title}</p>
                    <p className="text-sm text-[#b0b0b0]">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 text-xs text-[#b0b0b0]">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Tasks</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
                <p className="text-[#b0b0b0]">No upcoming tasks</p>
                <p className="text-sm text-[#b0b0b0] mt-2">
                  You're all caught up!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Campaign Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Campaign Performance</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Overview of your active campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-[#b0b0b0] mx-auto mb-4" />
              <p className="text-[#b0b0b0]">No active campaigns</p>
              <p className="text-sm text-[#b0b0b0] mt-2 mb-4">
                Start your first campaign to see performance metrics
              </p>
              <Link href="/approaching/whatsapp">
                <Button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 