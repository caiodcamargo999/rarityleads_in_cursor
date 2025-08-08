"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Building, 
  Users, 
  MapPin,
  Globe,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { ClientOnly } from '@/components/ClientOnly'
import CompanyModal from '@/components/companies/CompanyModal'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'

interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  website: string
  phone?: string
  email?: string
  founded: string
  revenue: string
  employees: number
  leads: number
  status: 'active' | 'prospect' | 'customer' | 'inactive'
  tags: string[]
  lastContact: string
  notes?: string
  keyContacts?: Array<{
    name: string
    role: string
    email: string
    phone?: string
  }>
}

export default function CompaniesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle deep linking - open modal if company ID is in URL
  useEffect(() => {
    const companyId = searchParams?.get('id')
    if (companyId && companies.length > 0) {
      const company = companies.find(c => c.id === companyId)
      if (company) {
        setSelectedCompany(company)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, companies])

  // Load companies from Supabase
  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Try to load from Supabase leads table
          const { data: leads, error } = await supabase
            .from('leads')
            .select('*')
            .eq('user_id', user.id)

          if (!error && leads) {
            // Convert leads to companies format
            const companiesFromLeads = leads.map(lead => ({
              id: lead.id,
              name: lead.company_name || 'Unknown Company',
              industry: lead.industry || 'Unknown',
              size: lead.company_size || 'Unknown',
              location: lead.location || 'Unknown',
              website: lead.website || '',
              phone: lead.phone || '',
              email: lead.email || '',
              founded: '',
              revenue: '',
              employees: 0,
              leads: 1,
              status: 'prospect' as const,
              tags: lead.tags || [],
              lastContact: lead.last_contacted_at || new Date().toISOString(),
              notes: lead.notes || ''
            }))

            // Group by company name to avoid duplicates
            const uniqueCompanies = companiesFromLeads.reduce((acc, company) => {
              const existing = acc.find(c => c.name === company.name)
              if (existing) {
                existing.leads += 1
                return acc
              }
              return [...acc, company]
            }, [] as Company[])

            setCompanies(uniqueCompanies)
          } else {
            setCompanies([])
          }
        } else {
          // Not logged in, use localStorage
          const storedCompanies = localStorage.getItem('companies')
          if (storedCompanies) {
            setCompanies(JSON.parse(storedCompanies))
          } else {
            setCompanies([])
          }
        }
      } catch (error) {
        console.error('Error loading companies:', error)
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    }
    loadCompanies()
  }, [])

  const handleAddCompany = async (newCompany: Company) => {
    const updatedCompanies = [...companies, newCompany]
    setCompanies(updatedCompanies)
    
    // Save to localStorage as backup
    localStorage.setItem('companies', JSON.stringify(updatedCompanies))
    
    // Try to save to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('leads').insert({
          user_id: user.id,
          company_name: newCompany.name,
          contact_name: newCompany.keyContacts?.[0]?.name || '',
          email: newCompany.email,
          phone: newCompany.phone,
          website: newCompany.website,
          industry: newCompany.industry,
          company_size: newCompany.size,
          location: newCompany.location,
          tags: newCompany.tags,
          notes: newCompany.notes
        })
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error)
    }
    
    toast({
      title: t('companies.companyAdded'),
      description: `${newCompany.name} has been added successfully.`
    })
  }

  const handleUpdateCompany = (updatedCompany: Company) => {
    const updatedCompanies = companies.map(c => 
      c.id === updatedCompany.id ? updatedCompany : c
    )
    setCompanies(updatedCompanies)
    localStorage.setItem('companies', JSON.stringify(updatedCompanies))
    toast({
      title: t('companies.companyUpdated'),
      description: `${updatedCompany.name} has been updated.`
    })
  }

  const handleDeleteCompany = (companyId: string) => {
    const updatedCompanies = companies.filter(c => c.id !== companyId)
    setCompanies(updatedCompanies)
    localStorage.setItem('companies', JSON.stringify(updatedCompanies))
    toast({
      title: t('companies.companyDeleted'),
      description: 'Company has been deleted.'
    })
  }

  // Filter companies based on search and filter
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || company.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  // Calculate real stats from actual data
  const stats = [
    { label: t('companies.totalCompanies'), value: companies.length, icon: Building },
    { label: t('companies.activeCustomers'), value: companies.filter(c => c.status === 'customer').length, icon: Users },
    { label: t('companies.prospects'), value: companies.filter(c => c.status === 'prospect').length, icon: TrendingUp },
    { label: t('companies.totalLeads'), value: companies.reduce((acc, c) => acc + (c.leads || 0), 0), icon: Calendar }
  ]

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
    // Update URL without navigation
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('id', company.id)
    window.history.pushState({}, '', newUrl)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCompany(null)
    // Remove ID from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('id')
    window.history.pushState({}, '', newUrl)
  }

  const handleModalSave = (updatedCompany: Company) => {
    if (companies.find(c => c.id === updatedCompany.id)) {
      handleUpdateCompany(updatedCompany)
    } else {
      handleAddCompany(updatedCompany)
    }
    handleModalClose()
  }

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-medium text-white mb-2">
                <ClientOnly fallback="Companies">
                  {t('companies.title')}
                </ClientOnly>
              </h1>
              <p className="text-gray-400">
                <ClientOnly fallback="Manage your company relationships">
                  {t('companies.subtitle')}
                </ClientOnly>
              </p>
            </div>
            <Button 
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => {
                const newCompany: Company = {
                  id: Date.now().toString(),
                  name: '',
                  industry: '',
                  size: '',
                  location: '',
                  website: '',
                  founded: new Date().getFullYear().toString(),
                  revenue: '',
                  employees: 0,
                  leads: 0,
                  status: 'prospect',
                  tags: [],
                  lastContact: new Date().toISOString().split('T')[0]
                }
                setSelectedCompany(newCompany)
                setIsModalOpen(true)
              }}
            >
              <Plus className="w-4 h-4" />
              <ClientOnly fallback="Add Company">
                {t('companies.addCompany')}
              </ClientOnly>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-dark-card border-dark-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          <ClientOnly fallback={stat.label}>
                            {stat.label}
                          </ClientOnly>
                        </p>
                        <p className="text-2xl font-medium text-white mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('companies.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-dark-card border-dark-border text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'customer', 'prospect', 'active', 'inactive'].map(filter => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  <ClientOnly fallback={filter}>
                    {t(`companies.filter.${filter}`)}
                  </ClientOnly>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Companies List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm ? 'No companies found' : 'No companies yet'}
              </h3>
              <p className="text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search or filters'
                  : 'Start by adding your first company or generating leads'}
              </p>
              {!searchTerm && (
                <Button 
                  variant="primary"
                  onClick={() => {
                    const newCompany: Company = {
                      id: Date.now().toString(),
                      name: '',
                      industry: '',
                      size: '',
                      location: '',
                      website: '',
                      founded: new Date().getFullYear().toString(),
                      revenue: '',
                      employees: 0,
                      leads: 0,
                      status: 'prospect',
                      tags: [],
                      lastContact: new Date().toISOString().split('T')[0]
                    }
                    setSelectedCompany(newCompany)
                    setIsModalOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Company
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="bg-dark-card border-dark-border hover:border-purple-600/50 transition-all cursor-pointer"
                  onClick={() => handleCompanyClick(company)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-white mb-1">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-400">{company.industry}</p>
                      </div>
                      <Badge
                        variant={
                          company.status === 'customer' ? 'default' :
                          company.status === 'active' ? 'default' :
                          company.status === 'prospect' ? 'secondary' :
                          'outline'
                        }
                      >
                        {company.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{company.size || 'Size unknown'}</span>
                      </div>
                      {company.website && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Globe className="w-3 h-3" />
                          <a 
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dark-border">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-400">Leads:</span>
                        <span className="text-sm font-medium text-white">{company.leads}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {new Date(company.lastContact).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Company Modal */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleModalSave}
          onDelete={handleDeleteCompany}
        />
      )}
    </div>
  )
}