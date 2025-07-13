"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import { getSupabase } from "@/lib/supabase";
import Button from '@/components/ui/Button';

interface LeadData {
  name?: string;
  email?: string;
}
interface Lead {
  id: string;
  data: LeadData;
  status: string | null;
  created_at: string;
}

interface User { id: string; name?: string; email?: string; }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "" });
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);

  useEffect(() => {
    const fetchUserAndLeads = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      // Buscar leads do usuário
      const { data, error } = await supabase
        .from("leads")
        .select("id, data, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setLeads(
          (data as unknown[]).map((item) => {
            const obj = item as { id: string; data: LeadData; status: string | null; created_at: string };
            return {
              id: String(obj.id),
              data: obj.data,
              status: obj.status,
              created_at: String(obj.created_at),
            };
          })
        );
      }
      setLoading(false);
    };
    fetchUserAndLeads();
  }, [router]);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .insert({ user_id: user.id, data: newLead, status: "new" })
      .select();
    if (!error && data) {
      setLeads([data[0] as unknown as Lead, ...leads]);
    }
    setShowAdd(false);
    setNewLead({ name: "", email: "" });
    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar user={user ?? undefined} onProfileClick={() => setIsProfilePanelVisible(true)} />
      <main className="flex-1 lg:ml-64 p-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-primary-text">Leads</h1>
          <Button variant="primary" aria-label="Add new lead" onClick={() => setShowAdd(true)}>+ Add Lead</Button>
        </header>
        {showAdd && (
          <form
            onSubmit={handleAddLead}
            className="bg-card-bg border border-border rounded-card p-6 mb-8 flex flex-col gap-4 max-w-md"
          >
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Name"
              value={newLead.name}
              onChange={e => setNewLead({ ...newLead, name: e.target.value })}
              required
            />
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Email"
              type="email"
              value={newLead.email}
              onChange={e => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" variant="primary" aria-label="Save lead">Save</Button>
              <Button type="button" variant="secondary" aria-label="Cancel" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </form>
        )}
        <section>
          {loading ? (
            <div className="text-secondary-text">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="text-secondary-text">No leads found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map(lead => (
                <div key={lead.id} className="bg-card-bg border border-border rounded-card p-6">
                  <div className="font-medium text-primary-text mb-2">{lead.data?.name || "(No name)"}</div>
                  <div className="text-secondary-text text-sm mb-1">{lead.data?.email || "(No email)"}</div>
                  <div className="text-xs text-secondary-text">Status: {lead.status || "new"}</div>
                  <div className="text-xs text-secondary-text mt-2">Created: {new Date(lead.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingProfilePanel
        user={user ?? undefined}
        isVisible={isProfilePanelVisible}
        onClose={() => setIsProfilePanelVisible(false)}
        onLogout={handleLogout}
      />
    </div>
  );
} 