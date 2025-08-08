'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { AVAILABLE_MODELS, type ModelId } from '@/lib/openrouter';

interface Filters {
  annualRevenue: string;
  companySize: string;
  countryCity: string;
  leadRole: string;
  contactChannel: string;
  businessNeeds: string[];
}

export function LeadInputForm() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelId>('anthropic/claude-2');
  const [filters, setFilters] = useState<Filters>({
    annualRevenue: '',
    companySize: '',
    countryCity: '',
    leadRole: '',
    contactChannel: '',
    businessNeeds: []
  });

  const handleGenerateLeads = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/generate-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          filters,
          model: selectedModel
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate leads');
      }

      const data = await response.json();
      console.log('Generated leads:', data);
      // Handle the generated leads data
      
    } catch (error) {
      console.error('Error generating leads:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Describe your ideal client (industry, role, location, budget, contact method, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full mb-4"
        />

        {/* LLM Model Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Model</label>
          <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelId)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose AI Model" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AVAILABLE_MODELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Annual Revenue Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Revenue</label>
              <Select value={filters.annualRevenue} onValueChange={(value) => setFilters({ ...filters, annualRevenue: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                  <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                  <SelectItem value="10m-plus">$10M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Size Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Size</label>
              <Select value={filters.companySize} onValueChange={(value) => setFilters({ ...filters, companySize: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-plus">201+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country/City Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={filters.countryCity} onValueChange={(value) => setFilters({ ...filters, countryCity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="br">Brazil</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Lead Role</label>
              <Select value={filters.leadRole} onValueChange={(value) => setFilters({ ...filters, leadRole: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="cto">CTO</SelectItem>
                  <SelectItem value="cmo">CMO</SelectItem>
                  <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                  <SelectItem value="sales-director">Sales Director</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Contact Channel Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Channel</label>
              <Select value={filters.contactChannel} onValueChange={(value) => setFilters({ ...filters, contactChannel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="any">Any Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Needs Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Needs</label>
              <Select 
                value={filters.businessNeeds.join(',')} 
                onValueChange={(value) => setFilters({ ...filters, businessNeeds: value ? value.split(',').filter(Boolean) : [] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select needs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid-ads">Paid Ads</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="web-design">Web Design</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleGenerateLeads}
        disabled={!description || loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Generating leads with AI...' : 'Generate Leads'}
      </Button>
    </Card>
  );
}