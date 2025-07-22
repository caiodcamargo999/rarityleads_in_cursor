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
  Building2,
  Users,
  TrendingUp,
  Globe,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  MoreHorizontal,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  website: string
  phone: string
  email: string
  leads: number
  status: 'prospecting' | 'contacted' | 'qualified' | 'converted' | 'lost'
  revenue: string
  lastContact: string
}

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState<string>('all')
  const [sizeFilter, setSizeFilter] = useState<string>('all')
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      industry: 'Technology',
      size: '50-200',
      location: 'San Francisco, CA',
      website: 'techcorp.com',
      phone: '+1 (555) 123-4567',
      email: 'contact@techcorp.com',
      leads: 12,
      status: 'qualified',
      revenue: '$5M - $10M',
      lastContact: '2 hours ago'
    },
    {
      id: '2',
      name: 'Innovate Labs',
      industry: 'SaaS',
      size: '10-50',
      location: 'Austin, TX',
      website: 'innovatelabs.io',
      phone: '+1 (555) 987-6543',
      email: 'hello@innovatelabs.io',
      leads: 8,
      status: 'contacted',
      revenue: '$1M - $5M',
      lastContact: '1 day ago'
    },
    {
      id: '3',
      name: 'Growth Dynamics',
      industry: 'Marketing',
      size: '200-500',
      location: 'New York, NY',
      website: 'growthdynamics.com',
      phone: '+1 (555) 456-7890',
      email: 'info@growthdynamics.com',
      leads: 25,
      status: 'prospecting',
      revenue: '$10M - $50M',
      lastContact: 'Never'
    }
  ])
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter
    const matchesSize = sizeFilter === 'all' || company.size === sizeFilter
    return matchesSearch && matchesIndustry && matchesSize
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospecting': return 'bg-blue-500'
      case 'contacted': return 'bg-yellow-500'
      case 'qualified': return 'bg-green-500'
      case 'converted': return 'bg-purple-500'
      case 'lost': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'prospecting': return 'Prospecting'
      case 'contacted': return 'Contacted'
      case 'qualified': return 'Qualified'
      case 'converted': return 'Converted'
      case 'lost': return 'Lost'
      default: return 'Unknown'
    }
  }

  const stats = [
    { label: 'Total Companies', value: companies.length, icon: Building2, color: 'text-blue-500' },
    { label: 'Active Prospects', value: companies.filter(c => c.status === 'prospecting').length, icon: Users, color: 'text-green-500' },
    { label: 'Avg Company Size', value: '150', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Total Leads', value: companies.reduce((sum, c) => sum + c.leads, 0), icon: Star, color: 'text-yellow-500' }
  ]

  const industries = ['Technology', 'SaaS', 'Marketing', 'Finance', 'Healthcare', 'Education']
  const sizes = ['1-10', '10-50', '50-200', '200-500', '500+']

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
            Company Directory
          </h1>
          <p className="text-base text-dark-text-secondary mb-2">
            Manage your target companies and track engagement
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
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text placeholder-dark-text-muted focus:ring-2 focus:ring-rarity-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-rarity-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="px-3 py-2 bg-dark-bg-secondary border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-rarity-500 focus:border-transparent transition-all duration-200 text-sm"
            >
              <option value="all">All Sizes</option>
              {sizes.map(size => (
                <option key={size} value={size}>{size} employees</option>
              ))}
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
              Add Company
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Companies Grid */}
      <div className="w-full max-w-5xl mx-auto px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
            >
              <Card className="bg-dark-bg-secondary border-dark-border hover:border-dark-border-secondary transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-dark-text text-lg">{company.name}</CardTitle>
                      <CardDescription className="text-dark-text-secondary">
                        {company.industry} • {company.size} employees
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Company Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={`https://${company.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-rarity-500 hover:text-rarity-400 transition-colors"
                      >
                        {company.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                      <TrendingUp className="w-4 h-4" />
                      {company.revenue}
                    </div>
                  </div>
                  {/* Status and Metrics */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(company.status)} text-white`}>
                      {getStatusText(company.status)}
                    </span>
                    <div className="text-sm text-dark-text-secondary">
                      {company.leads} leads
                    </div>
                  </div>
                  {/* Contact Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-dark-border">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  {/* Last Contact */}
                  <div className="text-xs text-dark-text-muted">
                    Last contact: {company.lastContact}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-text mb-2">No companies found</h3>
            <p className="text-dark-text-secondary mb-6">Try adjusting your search terms or filters</p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setIndustryFilter('all')
                setSizeFilter('all')
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
} 