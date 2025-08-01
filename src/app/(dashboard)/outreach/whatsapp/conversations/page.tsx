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
  Image as ImageIcon, 
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
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);
import { AnimatePresence } from 'framer-motion';

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

  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [detailsConversation, setDetailsConversation] = useState<Conversation | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editConversation, setEditConversation] = useState<Conversation | null>(null);
  const [editing, setEditing] = useState(false);

  // Remove mock data for demonstration
  useEffect(() => {
    setConversations([])
    setMessages([])
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

  const allIds = filteredConversations.map(c => c.id);
  const isAllSelected = selectedConversations.length === allIds.length && allIds.length > 0;
  const isIndeterminate = selectedConversations.length > 0 && selectedConversations.length < allIds.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedConversations([]);
    else setSelectedConversations(allIds);
  };
  const toggleSelect = (id: string) => {
    setSelectedConversations(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };
  const handleBulkDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the selected conversations?')) return;
    setConversations(prev => prev.filter(c => !selectedConversations.includes(c.id)));
    toast({ title: 'Conversations deleted', description: `${selectedConversations.length} conversations deleted.` });
    setSelectedConversations([]);
  };
  const handleBulkExport = (format: 'csv' | 'json') => {
    const allConvs = conversations.filter(c => selectedConversations.includes(c.id));
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(allConvs, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conversations.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Conversations exported as JSON.' });
    } else {
      const headers = ['id', 'name', 'phone', 'lastMessage', 'lastMessageTime', 'unreadCount', 'status'] as const;
      const csv = [headers.join(',')].concat(
        allConvs.map(c => headers.map(h => JSON.stringify((c as Record<string, any>)[h] ?? '')).join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conversations.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Conversations exported as CSV.' });
    }
    setSelectedConversations([]);
  };
  // Analytics
  const statusCounts = ['online', 'offline', 'typing'].map(status => conversations.filter(c => c.status === status).length);
  const chartData = {
    labels: ['Online', 'Offline', 'Typing'],
    datasets: [
      {
        label: 'Conversations per Status',
        data: statusCounts,
        backgroundColor: ['#8B5CF6', '#6366F1', '#F59E0B'],
        borderRadius: 8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#232336' }, beginAtZero: true } },
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-[#18181c] border-r border-gray-800 flex flex-col">
        {/* Analytics */}
        <motion.div className="w-full px-4 pt-4 pb-2 flex flex-col gap-2">
          <div className="text-sm text-primary-text font-medium">Total Conversations: {conversations.length}</div>
          <div className="text-xs text-secondary-text">Selected: {selectedConversations.length}</div>
          <div className="min-w-[180px]">
            <Bar data={chartData} options={chartOptions} height={60} />
          </div>
        </motion.div>
        <AnimatePresence>
          {selectedConversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card-bg border border-dark-border rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center"
            >
              <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected conversations">Delete</Button>
              <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export selected conversations as CSV">Export CSV</Button>
              <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export selected conversations as JSON">Export JSON</Button>
            </motion.div>
          )}
        </AnimatePresence>
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
          <div className="flex items-center px-4 py-2">
            <input type="checkbox" checked={isAllSelected} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={toggleSelectAll} aria-label="Select all conversations" className="mr-2" />
            <span className="text-xs text-secondary-text">Select All</span>
          </div>
          {filteredConversations.map((conversation) => (
            <motion.div
              key={conversation.id}
              whileHover={{ backgroundColor: '#232336' }}
              className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? 'bg-[#232336]' : ''}`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selectedConversations.includes(conversation.id)} onChange={e => { e.stopPropagation(); toggleSelect(conversation.id); }} aria-label={`Select conversation ${conversation.name}`} />
                <div className="flex-1 min-w-0" onClick={() => { setDetailsConversation(conversation); setEditConversation(conversation); }}>
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
                  <ImageIcon className="w-4 h-4" />
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
      {/* Details Modal */}
      <AnimatePresence>
        {detailsConversation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setDetailsConversation(null)}
          >
            <motion.div
              ref={detailsModalRef}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg rounded-xl border border-dark-border p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              <button className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsConversation(null)}>&times;</button>
              <div className="text-lg font-medium text-white mb-4">Conversation Details</div>
              <form onSubmit={e => { e.preventDefault(); if (editConversation) { setConversations(prev => prev.map(c => c.id === editConversation.id ? { ...editConversation } : c)); setDetailsConversation(editConversation); toast({ title: 'Conversation updated', description: 'Conversation details updated.' }); } }} className="flex flex-col gap-2">
                <label className="text-xs text-secondary-text">Name</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editConversation?.name ?? ''} onChange={e => setEditConversation(c => c ? { ...c, name: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Phone</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editConversation?.phone ?? ''} onChange={e => setEditConversation(c => c ? { ...c, phone: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Status</label>
                <select className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editConversation?.status ?? ''} onChange={e => setEditConversation(c => c ? { ...c, status: e.target.value as Conversation['status'] } : c)}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="typing">Typing</option>
                </select>
                <label className="text-xs text-secondary-text">Last Message</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editConversation?.lastMessage ?? ''} onChange={e => setEditConversation(c => c ? { ...c, lastMessage: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Unread Count</label>
                <input type="number" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editConversation?.unreadCount ?? 0} onChange={e => setEditConversation(c => c ? { ...c, unreadCount: Number(e.target.value) } : c)} />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditConversation(detailsConversation)} aria-label="Cancel edit">Cancel</Button>
                  <Button type="button" variant="danger" onClick={() => { setConversations(prev => prev.filter(c => c.id !== detailsConversation.id)); setDetailsConversation(null); toast({ title: 'Conversation deleted', description: 'Conversation deleted.' }); }} aria-label="Delete conversation">Delete</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export conversation as JSON">Export JSON</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export conversation as CSV">Export CSV</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 