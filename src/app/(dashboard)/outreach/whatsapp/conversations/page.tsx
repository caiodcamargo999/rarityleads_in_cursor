"use client"

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Video, 
  Image, 
  File,
  Smile,
  Paperclip,
  User,
  Check,
  Clock,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Conversation {
  id: string
  name: string
  phone: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'online' | 'offline' | 'typing'
  avatar?: string
}

interface Message {
  id: string
  text: string
  timestamp: string
  isFromMe: boolean
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file'
}

export default function WhatsAppConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  useEffect(() => {
    setConversations([
      {
        id: '1',
        name: 'John Smith',
        phone: '+1 (555) 123-4567',
        lastMessage: 'Thanks for the information!',
        lastMessageTime: '2 min ago',
        unreadCount: 2,
        status: 'online'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        phone: '+1 (555) 987-6543',
        lastMessage: 'When can we schedule a call?',
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
        status: 'offline'
      },
      {
        id: '3',
        name: 'Mike Wilson',
        phone: '+1 (555) 456-7890',
        lastMessage: 'I\'m interested in your services',
        lastMessageTime: '3 hours ago',
        unreadCount: 1,
        status: 'typing'
      }
    ])

    setMessages([
      {
        id: '1',
        text: 'Hi! I saw your company on LinkedIn and I\'m interested in your services.',
        timestamp: '10:30 AM',
        isFromMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        text: 'Hello! Thanks for reaching out. I\'d be happy to help you with our services.',
        timestamp: '10:32 AM',
        isFromMe: true,
        status: 'read',
        type: 'text'
      },
      {
        id: '3',
        text: 'Could you tell me more about your pricing?',
        timestamp: '10:35 AM',
        isFromMe: false,
        status: 'read',
        type: 'text'
      },
      {
        id: '4',
        text: 'Of course! Here\'s our pricing guide with all the details.',
        timestamp: '10:37 AM',
        isFromMe: true,
        status: 'delivered',
        type: 'text'
      }
    ])
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
      status: 'sent',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    
    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.phone.includes(searchQuery)
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400'
      case 'offline': return 'text-gray-400'
      case 'typing': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="w-3 h-3" />
      case 'delivered': return <Check className="w-3 h-3" />
      case 'read': return <Check className="w-3 h-3 text-blue-400" />
      default: return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-[#18181c] border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-normal text-white">Conversations</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#232336' }}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-[#232336]' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#18181c] ${getStatusColor(conversation.status)}`}>
                    <div className={`w-full h-full rounded-full ${conversation.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-normal text-white truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-400">{conversation.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{conversation.unreadCount}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-[#18181c] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-normal">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-400">{selectedConversation.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isFromMe 
                      ? 'bg-[#8b5cf6] text-white' 
                      : 'bg-[#232336] text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      message.isFromMe ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.isFromMe && getMessageStatusIcon(message.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800 bg-[#18181c]">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <File className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-4 pr-12 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  variant="primary"
                  size="sm"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-normal text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 