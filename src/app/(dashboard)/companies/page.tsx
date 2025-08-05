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

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Mock data for demonstration
      setCompanies([
        {
          id: '1',
          name: 'TechCorp Inc',
          industry: 'Technology',
          size: '50-200',
          location: 'San Francisco, CA',
          website: 'https://techcorp.com',
          phone: '+1 (555) 123-4567',
          email: 'contact@techcorp.com',
          founded: '2018',
          revenue: '$5M - $10M',
          employees: 150,
          leads: 3,
          status: 'prospect',
          tags: ['SaaS', 'B2B', 'AI'],
          lastContact: '2024-01-15',
          notes: 'High potential SaaS company looking for growth marketing services.',
          keyContacts: [
            {
              name: 'Sarah Johnson',
              role: 'CEO',
              email: 'sarah@techcorp.com',
              phone: '+1 (555) 123-4567'
            }
          ]
        },
        {
          id: '2',
          name: 'Digital Solutions',
          industry: 'Marketing',
          size: '10-50',
          location: 'New York, NY',
          website: 'https://digitalsolutions.com',
          phone: '+1 (555) 987-6543',
          email: 'hello@digitalsolutions.com',
          founded: '2020',
          revenue: '$1M - $5M',
          employees: 25,
          leads: 1,
          status: 'active',
          tags: ['Agency', 'Digital Marketing'],
          lastContact: '2024-01-14',
          notes: 'Digital marketing agency with strong client base.',
          keyContacts: [
            {
              name: 'Michael Chen',
              role: 'Founder',
              email: 'michael@digitalsolutions.com',
              phone: '+1 (555) 987-6543'
            }
          ]
        },
        {
          id: '3',
          name: 'StartupXYZ',
          industry: 'Technology',
          size: '5-10',
          location: 'Austin, TX',
          website: 'https://startupxyz.com',
          email: 'team@startupxyz.com',
          founded: '2023',
          revenue: '$100K - $500K',
          employees: 8,
          leads: 2,
          status: 'customer',
          tags: ['Startup', 'Fintech'],
          lastContact: '2024-01-10'
        },
        {
          id: '4',
          name: 'Growth Partners',
          industry: 'Consulting',
          size: '200-500',
          location: 'Miami, FL',
          website: 'https://growthpartners.com',
          phone: '+1 (555) 456-7890',
          email: 'info@growthpartners.com',
          founded: '2015',
          revenue: '$10M - $50M',
          employees: 300,
          leads: 5,
          status: 'active',
          tags: ['Consulting', 'B2B'],
          lastContact: '2024-01-12'
        }
      ])
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const statusColors = {
    active: 'bg-green-500',
    prospect: 'bg-blue-500',
    customer: 'bg-purple-500',
    inactive: 'bg-gray-500'
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || company.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return t('companies.active')
      case 'prospect': return t('companies.prospect')
      case 'customer': return t('companies.customer')
      case 'inactive': return t('companies.inactive')
      default: return status
    }
  }

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedCompany(null)
  }

  const handleCompanySave = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c))
    setSelectedCompany(updatedCompany)
  }

  const handleCompanyDelete = (companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId))
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
                  ))}
      </div>

      {/* Company Modal */}
      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleCompanySave}
        onDelete={handleCompanyDelete}
      />
    </div>
  )
}

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-foreground">
            <ClientOnly fallback="Companies">
              {t('companies.title')}
            </ClientOnly>
          </h1>
          <p className="text-muted-foreground">
            <ClientOnly fallback="Manage your company directory and track relationships">
              {t('companies.description')}
            </ClientOnly>
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <ClientOnly fallback="Add Company">
            {t('companies.addCompany')}
          </ClientOnly>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('companies.searchCompanies')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <ClientOnly fallback="Filter">
              {t('companies.filter')}
            </ClientOnly>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('companies.totalCompanies')}</p>
                <p className="text-2xl font-medium">{companies.length}</p>
              </div>
              <Building className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('companies.activeLeads')}</p>
                <p className="text-2xl font-medium">{companies.reduce((sum, c) => sum + c.leads, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('companies.customers')}</p>
                <p className="text-2xl font-medium">{companies.filter(c => c.status === 'customer').length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('companies.prospects')}</p>
                <p className="text-2xl font-medium">{companies.filter(c => c.status === 'prospect').length}</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="hover:shadow-md transition-all duration-200 border-border cursor-pointer group"
              onClick={() => handleCompanyClick(company)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-rarity-500 transition-colors">{company.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="w-3 h-3" />
                      {company.industry}
                    </CardDescription>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${statusColors[company.status]}`}></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {company.location}
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('companies.size')}</p>
                    <p className="font-medium">{company.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('companies.revenue')}</p>
                    <p className="font-medium">{company.revenue}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('companies.employees')}</p>
                    <p className="font-medium">{company.employees}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('companies.leads')}</p>
                    <p className="font-medium">{company.leads}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {company.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  {company.website && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(company.website, '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  {company.email && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${company.email}`, '_blank');
                      }}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  {company.phone && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${company.phone}`, '_blank');
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  <div className="ml-auto">
                    <Badge variant="secondary" className="text-xs">
                      {getStatusLabel(company.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Company Modal */}
      <CompanyModal
        company={selectedCompany}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleCompanySave}
        onDelete={handleCompanyDelete}
      />
    </div>
  )
} 