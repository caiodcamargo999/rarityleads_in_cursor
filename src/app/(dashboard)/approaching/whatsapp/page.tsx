"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Phone,
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  BarChart3,
  Upload,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function WhatsAppPage() {
  const whatsappRef = useRef(null)
  const whatsappInView = useInView(whatsappRef, { once: true })
  const [searchTerm, setSearchTerm] = useState('')

  const conversations: Array<{
    id: string;
    contact: string;
    lastMessage: string;
    status: string;
    unread: number;
    lastActivity: string;
    leadScore: number;
  }> = [
    // Empty for now - will be populated with real data
  ]

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = [
    { title: "Active Conversations", value: "0", icon: MessageSquare },
    { title: "Messages Sent", value: "0", icon: Send },
    { title: "Response Rate", value: "0%", icon: BarChart3 },
    { title: "Connected Numbers", value: "0", icon: Phone }
  ]

  return (
    <div ref={whatsappRef} className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
            WhatsApp Outreach
          </h1>
          <p className="text-base text-gray-400">
            Connect with prospects through personalized WhatsApp conversations.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          <Button variant="primary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Plus className="w-6 h-6" />
            <span>New Campaign</span>
            <span className="text-sm opacity-80">Start outreach</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Phone className="w-6 h-6" />
            <span>Connect Number</span>
            <span className="text-sm opacity-80">Add WhatsApp</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Target className="w-6 h-6" />
            <span>Import Contacts</span>
            <span className="text-sm opacity-80">Add prospects</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <BarChart3 className="w-6 h-6" />
            <span>View Analytics</span>
            <span className="text-sm opacity-80">Track performance</span>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className="w-8 h-8 text-[#8b5cf6]" />
                  </div>
                  <div className="mb-2">
                    <p className="text-3xl font-normal text-white">{stat.value}</p>
                    <p className="text-lg font-normal text-white">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations by contact or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  />
                </div>
                <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={whatsappInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-normal text-white">Conversations</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredConversations.length} active conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredConversations.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-xl font-normal text-white mb-4">
                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters.'
                      : 'Start by creating your first WhatsApp campaign or connecting a number.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium">
                      <Plus className="w-5 h-5" />
                      <span>Create First Campaign</span>
                    </Button>
                    <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium">
                      <Phone className="w-5 h-5" />
                      <span>Connect WhatsApp</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 p-6 bg-[#0a0a0a]/50 rounded-lg hover:bg-[#0a0a0a]/70 transition-all duration-300 border border-gray-800/50"
                    >
                      <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-normal text-lg">{conversation.contact.charAt(0)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-normal text-white truncate">{conversation.contact}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-normal ${
                            conversation.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            conversation.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            conversation.status === 'Closed' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {conversation.status}
                          </span>
                          {conversation.unread > 0 && (
                            <span className="bg-[#8b5cf6] text-white text-xs px-2 py-1 rounded-full">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{conversation.lastActivity}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>Score: {conversation.leadScore}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="flex items-center justify-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 