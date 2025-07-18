
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, TrendingUp, Target, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    {
      title: t('dashboard.totalLeads'),
      value: '0',
      icon: Users,
      description: 'Total leads in your pipeline'
    },
    {
      title: t('dashboard.activeLeads'),
      value: '0',
      icon: Target,
      description: 'Currently active prospects'
    },
    {
      title: t('dashboard.convertedLeads'),
      value: '0',
      icon: UserCheck,
      description: 'Successfully converted leads'
    },
    {
      title: t('dashboard.conversionRate'),
      value: '0%',
      icon: TrendingUp,
      description: 'Overall conversion rate'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('dashboard.title')}
              </h1>
              <p className="text-gray-300 text-lg">
                {t('dashboard.welcome')}, {user?.email?.split('@')[0]}! Ready to dominate your market?
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              <Link to="/prospecting" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {t('navigation.prospecting')}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card hover-lift border-white/10 bg-white/10 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <p className="text-xs text-gray-300">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-white">{t('dashboard.recentActivity')}</CardTitle>
                  <p className="text-sm text-gray-300 mt-1">Your latest prospecting activities</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-4">No recent activity</p>
                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Link to="/prospecting">Start prospecting</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 bg-white/10 backdrop-blur-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-white">{t('dashboard.upcomingTasks')}</CardTitle>
                  <p className="text-sm text-gray-300 mt-1">Scheduled follow-ups and reminders</p>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-sm mb-4">No upcoming tasks</p>
                <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Link to="/prospecting">Create campaign</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
