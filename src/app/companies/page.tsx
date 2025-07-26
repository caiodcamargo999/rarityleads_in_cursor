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
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);
import { AnimatePresence } from 'framer-motion';

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
  const [companies, setCompanies] = useState<Company[]>([])
  
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
    { label: 'Total Companies', value: 0, icon: Building2, color: 'text-blue-500' },
    { label: 'Active Prospects', value: 0, icon: Users, color: 'text-green-500' },
    { label: 'Avg Company Size', value: '0', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Total Leads', value: 0, icon: Star, color: 'text-yellow-500' }
  ]

  const industries = ['Technology', 'SaaS', 'Marketing', 'Finance', 'Healthcare', 'Education']
  const sizes = ['1-10', '10-50', '50-200', '200-500', '500+']

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [detailsCompany, setDetailsCompany] = useState<Company | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [editing, setEditing] = useState(false);

  const allIds = filteredCompanies.map(c => c.id);
  const isAllSelected = selectedCompanies.length === allIds.length && allIds.length > 0;
  const isIndeterminate = selectedCompanies.length > 0 && selectedCompanies.length < allIds.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedCompanies([]);
    else setSelectedCompanies(allIds);
  };
  const toggleSelect = (id: string) => {
    setSelectedCompanies(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };
  const handleBulkDelete = async () => {
    if (!window.confirm('Are you sure you want to delete the selected companies?')) return;
    setCompanies(prev => prev.filter(c => !selectedCompanies.includes(c.id)));
    toast({ title: 'Companies deleted', description: `${selectedCompanies.length} companies deleted.` });
    setSelectedCompanies([]);
  };
  const handleBulkExport = (format: 'csv' | 'json') => {
    const allCompanies = companies.filter(c => selectedCompanies.includes(c.id));
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(allCompanies, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'companies.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Companies exported as JSON.' });
    } else {
      const headers = ['id', 'name', 'industry', 'size', 'location', 'website', 'phone', 'email', 'leads', 'status', 'revenue', 'lastContact'] as const;
      const csv = [headers.join(',')].concat(
        allCompanies.map(c => headers.map(h => JSON.stringify((c as Record<string, any>)[h] ?? '')).join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'companies.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Companies exported as CSV.' });
    }
    setSelectedCompanies([]);
  };
  // Analytics
  const industryCounts = industries.map(ind => companies.filter(c => c.industry === ind).length);
  const chartData = {
    labels: industries,
    datasets: [
      {
        label: 'Companies per Industry',
        data: industryCounts,
        backgroundColor: ['#8B5CF6', '#6366F1', '#818CF8', '#22D3EE', '#F59E0B', '#EC4899'],
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
    <div ref={pageRef} className="min-h-screen bg-dark-bg w-full overflow-x-hidden">
      <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 pt-4 lg:pt-8 pb-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-xl lg:text-2xl font-medium text-dark-text mb-1">
            Company Directory
          </h1>
          <p className="text-sm lg:text-base text-dark-text-secondary mb-2">
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
        <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="text-lg text-primary-text font-medium">Total Companies: {companies.length}</div>
          <div className="text-sm text-secondary-text">Selected: {selectedCompanies.length}</div>
          <div className="flex-1 min-w-[220px]">
            <Bar data={chartData} options={chartOptions} height={80} />
          </div>
        </motion.div>
        <AnimatePresence>
          {selectedCompanies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card-bg border border-dark-border rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center"
            >
              <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected companies">Delete</Button>
              <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export selected companies as CSV">Export CSV</Button>
              <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export selected companies as JSON">Export JSON</Button>
            </motion.div>
          )}
        </AnimatePresence>
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
                      <CardTitle className="text-dark-text">{company.name}</CardTitle>
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
      {/* Company Details Modal */}
      <AnimatePresence>
        {detailsCompany && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setDetailsCompany(null)}
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
              <button className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsCompany(null)}>&times;</button>
              <div className="text-lg font-medium text-white mb-4">Company Details</div>
              <form onSubmit={e => { e.preventDefault(); setCompanies(prev => prev.map(c => c.id === editCompany.id ? { ...editCompany } : c)); setDetailsCompany(editCompany); toast({ title: 'Company updated', description: 'Company details updated.' }); }} className="flex flex-col gap-2">
                <label className="text-xs text-secondary-text">Name</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.name ?? ''} onChange={e => setEditCompany(c => c ? { ...c, name: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Industry</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.industry ?? ''} onChange={e => setEditCompany(c => c ? { ...c, industry: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Size</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.size ?? ''} onChange={e => setEditCompany(c => c ? { ...c, size: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Location</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.location ?? ''} onChange={e => setEditCompany(c => c ? { ...c, location: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Website</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.website ?? ''} onChange={e => setEditCompany(c => c ? { ...c, website: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Phone</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.phone ?? ''} onChange={e => setEditCompany(c => c ? { ...c, phone: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Email</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.email ?? ''} onChange={e => setEditCompany(c => c ? { ...c, email: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Revenue</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.revenue ?? ''} onChange={e => setEditCompany(c => c ? { ...c, revenue: e.target.value } : c)} />
                <label className="text-xs text-secondary-text">Last Contact</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCompany?.lastContact ?? ''} onChange={e => setEditCompany(c => c ? { ...c, lastContact: e.target.value } : c)} />
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditCompany(detailsCompany)} aria-label="Cancel edit">Cancel</Button>
                  <Button type="button" variant="danger" onClick={() => { setCompanies(prev => prev.filter(c => c.id !== detailsCompany.id)); setDetailsCompany(null); toast({ title: 'Company deleted', description: 'Company deleted.' }); }} aria-label="Delete company">Delete</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export company as JSON">Export JSON</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export company as CSV">Export CSV</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 