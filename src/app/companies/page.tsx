"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import { getSupabase } from "@/lib/supabase";

interface CompanyData {
  industry?: string;
  website?: string;
}

interface Company {
  id: string;
  name: string;
  data: CompanyData;
  created_at: string;
}

interface User { id: string; name?: string; email?: string; }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCompany, setNewCompany] = useState<{ industry?: string; website?: string }>({ industry: "", website: "" });
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCompanies = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user as User);
      // Buscar empresas do usuário
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, data, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setCompanies(
          (data as unknown[]).map((item) => {
            const obj = item as { id: string; name: string; data: CompanyData; created_at: string };
            return {
              id: String(obj.id),
              name: String(obj.name),
              data: obj.data,
              created_at: String(obj.created_at),
            };
          })
        );
      }
      setLoading(false);
    };
    fetchUserAndCompanies();
  }, [router]);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("companies")
      .insert({ 
        user_id: user.id, 
        name: newCompany.industry, 
        data: { industry: newCompany.industry, website: newCompany.website } 
      })
      .select();
    if (!error && data) setCompanies([data[0] as Company, ...companies]);
    setShowAdd(false);
    setNewCompany({ industry: "", website: "" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar user={user ?? undefined} onProfileClick={() => {}} />
      <main className="flex-1 lg:ml-64 p-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-primary-text">Empresas</h1>
          <button
            className="btn"
            onClick={() => setShowAdd(true)}
          >
            + Nova Empresa
          </button>
        </header>
        {showAdd && (
          <form
            onSubmit={handleAddCompany}
            className="bg-card-bg border border-border rounded-card p-6 mb-8 flex flex-col gap-4 max-w-md"
          >
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Nome da empresa"
              value={newCompany.industry}
              onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })}
              required
            />
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Indústria"
              value={newCompany.industry}
              onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })}
            />
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Website"
              type="url"
              value={newCompany.website}
              onChange={e => setNewCompany({ ...newCompany, website: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn">Salvar</button>
              <button type="button" className="btn" onClick={() => setShowAdd(false)}>Cancelar</button>
            </div>
          </form>
        )}
        <section>
          {loading ? (
            <div className="text-secondary-text">Carregando...</div>
          ) : companies.length === 0 ? (
            <div className="text-secondary-text">Nenhuma empresa cadastrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map(company => (
                <div key={company.id} className="bg-card-bg border border-border rounded-card p-6">
                  <div className="font-medium text-primary-text mb-2">{company.name}</div>
                  <div className="text-secondary-text text-sm mb-1">
                    {company.data?.industry || "(Indústria não informada)"}
                  </div>
                  <div className="text-secondary-text text-sm mb-2">
                    {company.data?.website || "(Website não informado)"}
                  </div>
                  <div className="text-xs text-secondary-text">
                    Criado em: {new Date(company.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <FloatingProfilePanel user={user ?? undefined} isVisible={true} onClose={() => {}} onLogout={() => {}} />
    </div>
  );
} 