"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Download, Trash2, MoreHorizontal, Calendar, Users, Target, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { ClientOnly } from '@/components/ClientOnly';
import CampaignModal from '@/components/campaigns/CampaignModal';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "draft" | "active" | "paused" | "completed" | "archived";
  leads: number;
  created_at: string;
  last_run: string;
  description?: string;
  target_audience?: string;
  budget?: number;
  conversion_rate?: number;
}

export default function CampaignsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const allIds = campaigns.map((c) => c.id);
  const isAllSelected = selectedCampaigns.length === allIds.length && allIds.length > 0;
  const isIndeterminate = selectedCampaigns.length > 0 && selectedCampaigns.length < allIds.length;
  
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedCampaigns([]);
    else setSelectedCampaigns(allIds);
  };
  
  const toggleSelect = (id: string) => {
    setSelectedCampaigns((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  };
  
  const handleBulkDelete = async () => {
    if (!window.confirm(t('campaigns.confirmDelete'))) return;
    setCampaigns((prev) => prev.filter((c) => !selectedCampaigns.includes(c.id)));
    toast({ title: t('campaigns.campaignsDeleted'), description: `${selectedCampaigns.length} ${t('campaigns.campaignsDeleted').toLowerCase()}.` });
    setSelectedCampaigns([]);
  };
  
  const handleBulkExport = (format: "csv" | "json") => {
    const allCampaigns = campaigns.filter((c) => selectedCampaigns.includes(c.id));
    if (format === "json") {
      const blob = new Blob([JSON.stringify(allCampaigns, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaigns.json";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: t('campaigns.campaignsExported'), description: t('campaigns.exportJson') });
    } else {
      const headers = ["id", "name", "channel", "status", "leads", "created_at", "last_run"] as const;
      const csv = [headers.join(",")].concat(
        allCampaigns.map((c) => headers.map((h) => JSON.stringify((c as Record<string, any>)[h] ?? "")).join(","))
      ).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaigns.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: t('campaigns.campaignsExported'), description: t('campaigns.exportCsv') });
    }
    setSelectedCampaigns([]);
  };

  // Handle campaign card click
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsCampaignModalOpen(true);
  };

  // Handle action button click (prevent card click)
  const handleActionClick = (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    // TODO: Implement action
  };

  // Analytics
  const statusCounts = ["draft", "active", "paused", "completed"].map(
    (status) => campaigns.filter((c) => c.status === status).length
  );
  const chartData = {
    labels: [t('campaigns.draft'), t('campaigns.active'), t('campaigns.paused'), t('campaigns.completed')],
    datasets: [
      {
        label: "Campaigns per Status",
        data: statusCounts,
        backgroundColor: ["#8B5CF6", "#22D3EE", "#F59E0B", "#6366F1"],
        borderRadius: 8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: "#232336" }, beginAtZero: true } },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl lg:text-2xl font-medium text-foreground mb-6 px-4 pt-4"
      >
        <ClientOnly fallback="Campaigns">
          {t('campaigns.title')}
        </ClientOnly>
      </motion.h1>

      {/* Analytics summary */}
      <motion.div className="w-full max-w-7xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center px-4">
        <div className="text-lg text-foreground font-medium">
          <ClientOnly fallback="Total Campaigns">
            {t('campaigns.totalCampaigns')}
          </ClientOnly>
          : {campaigns.length}
        </div>
        <div className="text-sm text-muted-foreground">
          <ClientOnly fallback="Selected">
            {t('campaigns.selected')}
          </ClientOnly>
          : {selectedCampaigns.length}
        </div>
        <div className="flex-1 min-w-[220px] max-w-md">
          <Bar data={chartData} options={chartOptions} height={80} />
        </div>
      </motion.div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-sm px-6 py-3 flex gap-4 items-center"
          >
            <Button variant="danger" onClick={handleBulkDelete} aria-label={t('campaigns.deleteSelected')}>
              <ClientOnly fallback="Delete">
                {t('campaigns.delete')}
              </ClientOnly>
            </Button>
            <Button variant="outline" onClick={() => handleBulkExport('csv')} aria-label={t('campaigns.exportSelectedCsv')}>
              <ClientOnly fallback="Export CSV">
                {t('campaigns.exportCsv')}
              </ClientOnly>
            </Button>
            <Button variant="outline" onClick={() => handleBulkExport('json')} aria-label={t('campaigns.exportSelectedJson')}>
              <ClientOnly fallback="Export JSON">
                {t('campaigns.exportJson')}
              </ClientOnly>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaigns Grid */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <input 
            type="checkbox" 
            checked={isAllSelected} 
            ref={el => { if (el) el.indeterminate = isIndeterminate; }} 
            onChange={toggleSelectAll} 
            aria-label={t('campaigns.selectAll')} 
            className="mr-3" 
          />
          <div className="font-medium text-foreground">
            <ClientOnly fallback="All Campaigns">
              {t('campaigns.allCampaigns')}
            </ClientOnly>
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            <ClientOnly fallback="No campaigns yet.">
              {t('campaigns.noCampaigns')}
            </ClientOnly>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`group bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-all duration-200 cursor-pointer ${
                  selectedCampaigns.includes(campaign.id) ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-border/60'
                }`}
                onClick={() => handleCampaignClick(campaign)}
              >
                <div className="flex items-start justify-between mb-3">
                  <input 
                    type="checkbox" 
                    checked={selectedCampaigns.includes(campaign.id)} 
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(campaign.id);
                    }}
                    aria-label={`Select campaign ${campaign.name}`} 
                    className="mt-1"
                  />
                  <Badge variant="outline" className="text-xs">
                    {campaign.channel}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {/* Campaign Header */}
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      {campaign.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" />
                      {campaign.leads} {t('campaigns.leads')}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`}></div>
                    <Badge variant="outline" className="text-xs">
                      <ClientOnly fallback={campaign.status}>
                        {t(`campaigns.${campaign.status}`)}
                      </ClientOnly>
                    </Badge>
                  </div>

                  {/* Campaign Info */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                    {campaign.last_run && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        {new Date(campaign.last_run).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={(e) => handleActionClick(e, campaign)}
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      <ClientOnly fallback="View">
                        {t('campaigns.view')}
                      </ClientOnly>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={(e) => handleActionClick(e, campaign)}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      <CampaignModal
        campaign={selectedCampaign as any}
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSave={(updated) => {
          // Simple merge with type assertion for now
          setCampaigns(prev => prev.map(c => 
            c.id === updated.id ? { ...c, ...updated } as Campaign : c
          ));
          setSelectedCampaign({ ...selectedCampaign!, ...updated } as Campaign);
        }}
      />
    </div>
  );
} 