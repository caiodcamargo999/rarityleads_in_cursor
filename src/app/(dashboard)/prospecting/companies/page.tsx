"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  ArrowRight,
  Users,
  MapPin,
  Globe,
  Target,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CompaniesPage() {
  const companiesRef = useRef(null)
  const companiesInView = useInView(companiesRef, { once: true })
  const [searchTerm, setSearchTerm] = useState('')

  const companies: Array<{
    id: string;
    name: string;
    industry: string;
    size: string;
    location: string;
    website: string;
    leads: number;
    status: string;
  }> = [
    // Empty for now - will be populated with real data
  ]

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div ref={companiesRef} className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={companiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-normal text-white mb-4">
            Company Prospecting
          </h1>
          <p className="text-xl text-gray-400">
            Discover and target companies that match your ideal customer profile.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={companiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Button variant="primary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Plus className="w-6 h-6" />
            <span>Add Company</span>
            <span className="text-sm opacity-80">Manual entry</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Upload className="w-6 h-6" />
            <span>Import CSV</span>
            <span className="text-sm opacity-80">Bulk import</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Target className="w-6 h-6" />
            <span>Find Companies</span>
            <span className="text-sm opacity-80">AI discovery</span>
          </Button>
          
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium">
            <Download className="w-6 h-6" />
            <span>Export Data</span>
            <span className="text-sm opacity-80">Download companies</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={companiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies by name, industry, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  />
                </div>
                <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium bg-[#232336] text-white border border-[#8b5cf6]">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Companies List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={companiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-normal text-white">All Companies</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredCompanies.length} companies found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCompanies.length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-xl font-normal text-white mb-4">
                    {searchTerm ? 'No companies found' : 'No companies yet'}
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters.'
                      : 'Start by adding your first company or importing a list.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium">
                      <Plus className="w-5 h-5" />
                      <span>Add Your First Company</span>
                    </Button>
                    <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium">
                      <Upload className="w-5 h-5" />
                      <span>Import CSV</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 p-6 bg-[#0a0a0a]/50 rounded-lg hover:bg-[#0a0a0a]/70 transition-all duration-300 border border-gray-800/50"
                    >
                      <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-normal text-white truncate">{company.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-normal ${
                            company.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            company.status === 'Prospecting' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span className="truncate">{company.industry}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{company.size}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{company.location}</span>
                          </div>
                          {company.website && (
                            <div className="flex items-center space-x-1">
                              <Globe className="w-4 h-4" />
                              <span className="truncate">{company.website}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Leads</div>
                          <div className="text-lg font-normal text-[#8b5cf6]">{company.leads}</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
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