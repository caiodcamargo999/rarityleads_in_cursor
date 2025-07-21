"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  Phone,
  Video,
  User,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    avatar: "SJ",
    lastMessage: "Hi! I'm interested in learning more about your services.",
    time: "2 min ago",
    unread: 2,
    status: "online",
    messages: [
      { id: 1, text: "Hi! I'm interested in learning more about your services.", sender: "them", time: "2:30 PM", status: "read" },
      { id: 2, text: "Great! I'd be happy to help. What specific challenges are you facing?", sender: "me", time: "2:32 PM", status: "read" },
      { id: 3, text: "We're looking to scale our sales process and improve lead qualification.", sender: "them", time: "2:35 PM", status: "read" },
      { id: 4, text: "Perfect! Our AI-powered platform can help with exactly that.", sender: "me", time: "2:37 PM", status: "sent" }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Innovate Labs",
    avatar: "MC",
    lastMessage: "Thanks for the demo yesterday. Very impressive!",
    time: "1 hour ago",
    unread: 0,
    status: "offline",
    messages: [
      { id: 1, text: "Thanks for the demo yesterday. Very impressive!", sender: "them", time: "1:15 PM", status: "read" },
      { id: 2, text: "Thank you! I'm glad you found it valuable.", sender: "me", time: "1:20 PM", status: "read" }
    ]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Growth Solutions",
    avatar: "ER",
    lastMessage: "Can we schedule a follow-up call?",
    time: "3 hours ago",
    unread: 1,
    status: "away",
    messages: [
      { id: 1, text: "Can we schedule a follow-up call?", sender: "them", time: "11:30 AM", status: "read" }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3 text-muted-foreground" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    case "read":
      return <CheckCheck className="w-3 h-3 text-green-500" />;
    default:
      return <Clock className="w-3 h-3 text-muted-foreground" />;
  }
};

export default function WhatsAppConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send the message via API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-background">
      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-r border-border flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-border cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id 
                    ? 'bg-accent/50' 
                    : 'hover:bg-accent/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{conversation.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      conversation.status === 'online' ? 'bg-green-500' :
                      conversation.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.company}</p>
                    <p className="text-sm text-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground font-medium">{conversation.unread}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{selectedConversation.avatar}</span>
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedConversation.company}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {selectedConversation.messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === 'me' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border border-border'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center justify-end space-x-1 mt-1 ${
                        msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        <span className="text-xs">{msg.time}</span>
                        {msg.sender === 'me' && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full pl-4 pr-12 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
} 