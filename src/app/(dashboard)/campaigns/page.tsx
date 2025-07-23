"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Download, Trash2, MoreHorizontal } from "lucide-react";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: "draft" | "active" | "paused" | "completed";
  leads: number;
  created_at: string;
  last_run: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Spring SaaS Push",
    channel: "Email",
    status: "active",
    leads: 120,
    created_at: "2024-04-01",
    last_run: "2024-04-10",
  },
  {
    id: "2",
    name: "LinkedIn Outreach Q2",
    channel: "LinkedIn",
    status: "paused",
    leads: 80,
    created_at: "2024-03-15",
    last_run: "2024-04-08",
  },
  {
    id: "3",
    name: "WhatsApp Blitz",
    channel: "WhatsApp",
    status: "completed",
    leads: 200,
    created_at: "2024-02-20",
    last_run: "2024-03-01",
  },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [detailsCampaign, setDetailsCampaign] = useState<Campaign | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editing, setEditing] = useState(false);

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
    if (!window.confirm("Are you sure you want to delete the selected campaigns?")) return;
    setCampaigns((prev) => prev.filter((c) => !selectedCampaigns.includes(c.id)));
    toast({ title: "Campaigns deleted", description: `${selectedCampaigns.length} campaigns deleted.` });
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
      toast({ title: "Exported", description: "Campaigns exported as JSON." });
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
      toast({ title: "Exported", description: "Campaigns exported as CSV." });
    }
    setSelectedCampaigns([]);
  };

  // Analytics
  const statusCounts = ["draft", "active", "paused", "completed"].map(
    (status) => campaigns.filter((c) => c.status === status).length
  );
  const chartData = {
    labels: ["Draft", "Active", "Paused", "Completed"],
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

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center pt-8">
        <div className="text-lg text-primary-text font-medium">Total Campaigns: {campaigns.length}</div>
        <div className="text-sm text-secondary-text">Selected: {selectedCampaigns.length}</div>
        <div className="flex-1 min-w-[220px]">
          <Bar data={chartData} options={chartOptions} height={80} />
        </div>
      </motion.div>
      <AnimatePresence>
        {selectedCampaigns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card-bg border border-dark-border rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center"
          >
            <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected campaigns">Delete</Button>
            <Button variant="secondary" onClick={() => handleBulkExport("csv")} aria-label="Export selected campaigns as CSV">Export CSV</Button>
            <Button variant="secondary" onClick={() => handleBulkExport("json")} aria-label="Export selected campaigns as JSON">Export JSON</Button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-5xl mx-auto px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-dark-bg-secondary border border-dark-border rounded-xl p-4 flex flex-col gap-2 hover:border-rarity-600 transition-all duration-200">
                <div className="flex items-center mb-2">
                  <input type="checkbox" checked={selectedCampaigns.includes(campaign.id)} onChange={e => { e.stopPropagation(); toggleSelect(campaign.id); }} aria-label={`Select campaign ${campaign.name}`} />
                  <div className="flex-1 cursor-pointer" onClick={() => { setDetailsCampaign(campaign); setEditCampaign(campaign); }}>
                    <div className="text-lg font-medium text-white">{campaign.name}</div>
                    <div className="text-xs text-secondary-text">{campaign.channel} • {campaign.leads} leads</div>
                    <div className="text-xs text-secondary-text">Status: {campaign.status}</div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="More actions"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
                <div className="flex justify-between text-xs text-secondary-text">
                  <span>Created: {campaign.created_at}</span>
                  <span>Last Run: {campaign.last_run}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {/* Details Modal */}
        <AnimatePresence>
          {detailsCampaign && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setDetailsCampaign(null)}
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
                <button className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsCampaign(null)}>&times;</button>
                <div className="text-lg font-medium text-white mb-4">Campaign Details</div>
                <form onSubmit={e => { e.preventDefault(); setCampaigns(prev => prev.map(c => c.id === editCampaign.id ? { ...editCampaign } : c)); setDetailsCampaign(editCampaign); toast({ title: 'Campaign updated', description: 'Campaign details updated.' }); }} className="flex flex-col gap-2">
                  <label className="text-xs text-secondary-text">Name</label>
                  <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.name ?? ''} onChange={e => setEditCampaign(c => c ? { ...c, name: e.target.value } : c)} />
                  <label className="text-xs text-secondary-text">Channel</label>
                  <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.channel ?? ''} onChange={e => setEditCampaign(c => c ? { ...c, channel: e.target.value } : c)} />
                  <label className="text-xs text-secondary-text">Status</label>
                  <select className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.status ?? ''} onChange={e => setEditCampaign(c => c ? { ...c, status: e.target.value as Campaign["status"] } : c)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                  <label className="text-xs text-secondary-text">Leads</label>
                  <input type="number" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.leads ?? 0} onChange={e => setEditCampaign(c => c ? { ...c, leads: Number(e.target.value) } : c)} />
                  <label className="text-xs text-secondary-text">Created At</label>
                  <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.created_at ?? ''} onChange={e => setEditCampaign(c => c ? { ...c, created_at: e.target.value } : c)} />
                  <label className="text-xs text-secondary-text">Last Run</label>
                  <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editCampaign?.last_run ?? ''} onChange={e => setEditCampaign(c => c ? { ...c, last_run: e.target.value } : c)} />
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">Save</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditCampaign(detailsCampaign)} aria-label="Cancel edit">Cancel</Button>
                    <Button type="button" variant="danger" onClick={() => { setCampaigns(prev => prev.filter(c => c.id !== detailsCampaign.id)); setDetailsCampaign(null); toast({ title: 'Campaign deleted', description: 'Campaign deleted.' }); }} aria-label="Delete campaign">Delete</Button>
                    <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export campaign as JSON">Export JSON</Button>
                    <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export campaign as CSV">Export CSV</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 