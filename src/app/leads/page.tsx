"use client"

import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Star,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  score: number
  source: string
  lastContact: string
  notes: string
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Solutions',
      email: 'sarah.j@techcorp.com',
      phone: '+1 (555) 123-4567',
      status: 'qualified',
      score: 85,
      source: 'LinkedIn',
      lastContact: '2 hours ago',
      notes: 'Interested in AI automation solutions. Budget: $50k-100k'
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'Innovate Labs',
      email: 'mchen@innovatelabs.io',
      phone: '+1 (555) 987-6543',
      status: 'contacted',
      score: 72,
      source: 'Website',
      lastContact: '1 day ago',
      notes: 'Looking for lead generation tools. Decision maker.'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      company: 'Growth Dynamics',
      email: 'emily@growthdynamics.com',
      phone: '+1 (555) 456-7890',
      status: 'new',
      score: 65,
      source: 'Cold Outreach',
      lastContact: 'Never',
      notes: 'Startup founder. High growth potential.'
    }
  ])
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'qualified': return 'bg-green-500'
      case 'converted': return 'bg-purple-500'
      case 'lost': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'New'
      case 'contacted': return 'Contacted'
      case 'qualified': return 'Qualified'
      case 'converted': return 'Converted'
      case 'lost': return 'Lost'
      default: return 'Unknown'
    }
  }

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'text-blue-500' },
    { label: 'Qualified', value: leads.filter(l => l.status === 'qualified').length, icon: Target, color: 'text-green-500' },
    { label: 'Conversion Rate', value: '23%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Avg Response Time', value: '2.4h', icon: Clock, color: 'text-yellow-500' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen bg-dark-bg flex flex-col">
      <div className="w-full max-w-5xl mx-auto px-8 pt-8 pb-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-dark-text mb-1">
            Lead Management
          </h1>
          <p className="text-base text-dark-text-secondary mb-2">
            Manage and track your prospects with AI-powered insights
          </p>
        </motion.div>
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="bg-dark-bg-secondary border-dark-border p-3">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dark-text-muted">{stat.label}</p>
                    <p className="text-xl font-medium text-dark-text">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-4"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-text-muted" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:ring-2 focus:ring-rarity-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-rarity-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="primary" size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Leads Table */}
      <div className="w-full max-w-5xl mx-auto px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-dark-bg-secondary border-dark-border">
            <CardHeader>
              <CardTitle className="text-dark-text">Leads ({filteredLeads.length})</CardTitle>
              <CardDescription className="text-dark-text-secondary">
                Manage your prospect pipeline with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Lead</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Company</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Last Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-dark-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="border-b border-dark-border hover:bg-dark-bg-tertiary transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-dark-text">{lead.name}</p>
                            <p className="text-sm text-dark-text-secondary">{lead.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-dark-text">{lead.company}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)} text-white`}>
                            {getStatusText(lead.status)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-dark-bg rounded-full h-2">
                              <div 
                                className="bg-rarity-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-sm text-dark-text">{lead.score}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-dark-text-secondary">{lead.source}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-dark-text-secondary">{lead.lastContact}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 