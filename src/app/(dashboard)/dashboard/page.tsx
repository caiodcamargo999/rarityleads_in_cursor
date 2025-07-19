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
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function DashboardPage() {
  const metrics = [
    {
      title: "Total Leads",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: Users,
      description: "from last week",
      color: "text-blue-500"
    },
    {
      title: "Active Conversations",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "from last week",
      color: "text-green-500"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "from last week",
      color: "text-purple-500"
    },
    {
      title: "Campaigns Active",
      value: "0",
      change: "+0%",
      changeType: "positive" as const,
      icon: Target,
      description: "from last week",
      color: "text-orange-500"
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
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Create Campaign",
      description: "Start a new outreach campaign",
      icon: Target,
      href: "/approaching/whatsapp",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "View Analytics",
      description: "Check your performance metrics",
      icon: TrendingUp,
      href: "/analytics",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
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
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "active":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning. Ready to convert more leads today?
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          You have <span className="text-primary font-medium">0 new leads</span> this week.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="metric-card group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <motion.div
                  className={`p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors`}
                  whileHover={{ rotate: 5 }}
                >
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={metric.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                    {metric.change}
                  </span>{" "}
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={action.href}>
                <Card className="card group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`p-3 rounded-lg ${action.color} shadow-lg`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity & Upcoming Tasks */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest updates from your campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge className={`${getStatusColor(activity.status)} text-xs`}>
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card">
          <CardHeader>
            <CardTitle className="text-foreground">Upcoming Tasks</CardTitle>
            <CardDescription className="text-muted-foreground">
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming tasks</p>
                <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 