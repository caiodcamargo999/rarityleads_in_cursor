
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Target, Users, TrendingUp, Zap, BarChart3, CheckCircle, ArrowRight, Play, Sparkles, Bot, Calendar, MessageSquare, Star, Award, Clock, Shield } from 'lucide-react';

const Index = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMetric, setActiveMetric] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const metrics = [
    { label: "Lead Quality Score", value: "94%", change: "+23%" },
    { label: "Conversion Rate", value: "31.2%", change: "+187%" },
    { label: "Cost Per Lead", value: "$12", change: "-68%" },
    { label: "Response Time", value: "< 2min", change: "24/7" }
  ];

  const heroFeatures = [
    { icon: Target, label: "Market Domination" },
    { icon: Users, label: "Qualified Leads Only" },
    { icon: TrendingUp, label: "43% More Leads" },
    { icon: BarChart3, label: "Data-Driven Growth" },
    { icon: Zap, label: "Lightning Fast" },
    { icon: Bot, label: "AI-Powered" }
  ];

  const systemFeatures = [
    {
      icon: Target,
      title: "Competitive Intelligence",
      description: "Deep market analysis and competitor insights that reveal untapped opportunities and positioning advantages in your industry."
    },
    {
      icon: Users,
      title: "Buyer Psychology Map",
      description: "Understanding your ideal customer's decision-making process, pain points, and triggers for maximum conversion optimization."
    },
    {
      icon: TrendingUp,
      title: "Lead Scoring Matrix",
      description: "Advanced algorithms that identify and prioritize your highest-value prospects based on behavior and engagement patterns."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Real-time tracking and optimization of your acquisition funnel with actionable insights for continuous improvement."
    },
    {
      icon: Zap,
      title: "Automated Nurturing",
      description: "Intelligent follow-up sequences that build relationships and guide prospects through your sales process automatically."
    },
    {
      icon: Bot,
      title: "AI Qualification",
      description: "Smart chatbots that qualify leads 24/7, ensuring only high-intent prospects reach your sales team."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Silva",
      role: "CEO, Solar Energy Solutions",
      content: "Rarity Leads transformed our business. We achieved 237% growth in just 90 days with their system.",
      avatar: "MS",
      rating: 5,
      results: "237% Growth"
    },
    {
      name: "Dr. Ana Costa",
      role: "Dental Clinic Owner",
      content: "The AI system handles patient inquiries perfectly. Our booking rate increased 280% without hiring more staff.",
      avatar: "AC",
      rating: 5,
      results: "280% More Bookings"
    },
    {
      name: "Roberto Mendes",
      role: "Real Estate Agency",
      content: "Finally, a system that delivers qualified leads consistently. We stopped chasing and started attracting.",
      avatar: "RM",
      rating: 5,
      results: "43% More Qualified Leads"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Rarity Leads
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#success-stories" className="text-gray-300 hover:text-white transition-colors">Success Stories</a>
            <a href="#system" className="text-gray-300 hover:text-white transition-colors">The System</a>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/prospecting')}
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              Prospecting
            </button>
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {t('auth.signUp')}
            </button>
          </div>
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Outperform Your Competition</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Outperform Your{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  Competition
                </span>
              </h1>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-300">
                Without Hiring More Staff
              </h2>
              
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Get 43% more qualified leads with our proven client acquisition system. 
                Join 500+ businesses already dominating their markets with Rarity Leads.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Grow Your Business
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-white/20 hover:border-white/40 backdrop-blur-sm px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/10">
                  See Client Success Stories
                </button>
              </div>

              {/* Hero Features Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {heroFeatures.map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 group-hover:border-purple-400/50 transition-all duration-300 mb-3">
                      <feature.icon className="w-6 h-6 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-sm text-gray-300 font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Metrics Dashboard */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Live Performance</h3>
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {metrics.map((metric, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-2xl transition-all duration-500 ${
                        activeMetric === index 
                          ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50' 
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                      <div className="text-xs text-green-400 font-semibold">{metric.change}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Lead Quality</span>
                    <span className="font-semibold">Excellent</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full w-[94%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benchmark Section */}
      <section className="relative z-10 py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Reveal Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Growth Potential
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Discover hidden opportunities in your market and unlock competitive advantages 
            that your competitors don't even know exist.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">43%</div>
              <div className="text-lg font-semibold mb-2">More Qualified Leads</div>
              <div className="text-sm text-gray-400">Average increase within 90 days</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-pink-400 mb-2">237%</div>
              <div className="text-lg font-semibold mb-2">Revenue Growth</div>
              <div className="text-sm text-gray-400">Best performing client result</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Lead Generation</div>
              <div className="text-sm text-gray-400">Automated system works around the clock</div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Discover Your Potential
          </button>
        </div>
      </section>

      {/* Demo/Success Stories Section */}
      <section id="success-stories" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Client{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how businesses achieved 237% growth in 90 days using our proven system. 
              Real results from real companies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{testimonial.results}</div>
                    <div className="text-xs text-gray-400">in 90 days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features Section */}
      <section id="system" className="relative z-10 py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Client{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Acquisition System
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Six powerful components working together to identify, attract, and convert 
              your ideal customers automatically.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {systemFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:bg-white/10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Stop Chasing.{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Start Attracting.
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your business into a lead-generating machine. Get qualified prospects 
              coming to you automatically while you focus on closing deals.
            </p>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center whitespace-nowrap"
                >
                  Start Attracting
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Setup in 5 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-sm border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Rarity Leads
              </span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Rarity Agency. All rights reserved. Built for client acquisition excellence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
