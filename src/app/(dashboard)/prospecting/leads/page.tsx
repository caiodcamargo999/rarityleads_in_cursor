"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Users, 
  Building2, 
  Mail, 
  Phone,
  Linkedin,
  Target,
  Star
} from 'lucide-react';

interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  industry: string | null;
  company_size: string | null;
  location: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  ai_score: number | null;
  created_at: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Leads', count: 0 },
    { value: 'new', label: 'New', count: 0 },
    { value: 'contacted', label: 'Contacted', count: 0 },
    { value: 'qualified', label: 'Qualified', count: 0 },
    { value: 'converted', label: 'Converted', count: 0 },
    { value: 'lost', label: 'Lost', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/10 text-blue-500';
      case 'contacted':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'qualified':
        return 'bg-green-500/10 text-green-500';
      case 'converted':
        return 'bg-purple-500/10 text-purple-500';
      case 'lost':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const addLead = () => {
    // TODO: Implement add lead modal
    console.log('Add lead');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Lead Prospecting
        </h1>
        <p className="text-[#b0b0b0]">
          Discover and manage your leads with AI-powered intelligence.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">Find Leads</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              Search for companies and contacts using AI-powered discovery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="company" className="text-[#e0e0e0]">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Enter company name..."
                  className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="text-[#e0e0e0]">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g., Technology, Finance..."
                  className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-[#e0e0e0]">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., United States, Europe..."
                  className="bg-[#232336] border-[#232336] text-white placeholder:text-[#b0b0b0] focus:border-[#8B5CF6]"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <Search className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Leads
                  </>
                )}
              </Button>
              <Button 
                onClick={addLead}
                variant="outline"
                className="btn-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedStatus === option.value
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white'
                  : 'border-[#232336] text-[#b0b0b0] hover:border-[#8B5CF6]'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <Badge className="ml-2 bg-[#232336] text-[#b0b0b0]">
                  {option.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Leads List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Your Leads</CardTitle>
                <CardDescription className="text-[#b0b0b0]">
                  {leads.length} leads found
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="btn-secondary">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-[#b0b0b0] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No leads found</h3>
                <p className="text-[#b0b0b0] mb-4">
                  Start by searching for companies or adding leads manually
                </p>
                <Button onClick={addLead} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Lead
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-4 border border-[#232336] rounded-lg hover:border-[#8B5CF6] transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-[#232336] rounded-lg">
                        <Building2 className="h-5 w-5 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{lead.company_name}</h3>
                        <p className="text-sm text-[#b0b0b0]">{lead.contact_name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          {lead.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-[#b0b0b0]" />
                              <span className="text-xs text-[#b0b0b0]">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3 text-[#b0b0b0]" />
                              <span className="text-xs text-[#b0b0b0]">{lead.phone}</span>
                            </div>
                          )}
                          {lead.linkedin_url && (
                            <div className="flex items-center space-x-1">
                              <Linkedin className="h-3 w-3 text-[#b0b0b0]" />
                              <span className="text-xs text-[#b0b0b0]">LinkedIn</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-[#8B5CF6]" />
                          <span className={`text-sm font-medium ${getScoreColor(lead.ai_score || 0)}`}>
                            {lead.ai_score || 0}
                          </span>
                        </div>
                        <p className="text-xs text-[#b0b0b0]">AI Score</p>
                      </div>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="card">
          <CardHeader>
            <CardTitle className="text-white">AI Insights</CardTitle>
            <CardDescription className="text-[#b0b0b0]">
              AI-powered recommendations for your lead strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-[#232336] rounded-lg">
                <Target className="h-8 w-8 text-[#8B5CF6] mx-auto mb-2" />
                <h3 className="font-medium text-white mb-1">Best Time to Contact</h3>
                <p className="text-sm text-[#b0b0b0]">Tuesday 10 AM - 2 PM</p>
              </div>
              <div className="text-center p-4 border border-[#232336] rounded-lg">
                <Users className="h-8 w-8 text-[#8B5CF6] mx-auto mb-2" />
                <h3 className="font-medium text-white mb-1">Recommended Channels</h3>
                <p className="text-sm text-[#b0b0b0]">LinkedIn + Email</p>
              </div>
              <div className="text-center p-4 border border-[#232336] rounded-lg">
                <Star className="h-8 w-8 text-[#8B5CF6] mx-auto mb-2" />
                <h3 className="font-medium text-white mb-1">High-Value Prospects</h3>
                <p className="text-sm text-[#b0b0b0]">12 leads identified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 