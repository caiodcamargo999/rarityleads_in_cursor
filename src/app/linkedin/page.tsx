"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import { getSupabase } from "@/lib/supabase";

interface LinkedInConfigData {
  profile_url?: string;
  api_key?: string;
  message_template?: string;
}
interface LinkedInConfig {
  id: string;
  user_id: string;
  data: LinkedInConfigData;
  status: string;
  created_at: string;
}

interface User { id: string; name?: string; email?: string; }

export default function LinkedInPage() {
  const [configs, setConfigs] = useState<LinkedInConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newConfig, setNewConfig] = useState({ 
    profile_url: "", 
    api_key: "", 
    message_template: "" 
  });
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndConfigs = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      // Buscar configurações LinkedIn do usuário (simulado)
      setConfigs([]);
      setLoading(false);
    };
    fetchUserAndConfigs();
  }, [router]);

  const handleAddConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setLoading(true);
    
    // Simular criação de configuração
    const newConfigItem = {
      id: Date.now().toString(),
      user_id: (user as { id: string }).id,
      data: newConfig,
      status: "inactive",
      created_at: new Date().toISOString()
    };
    setConfigs([newConfigItem, ...configs]);
    setShowAdd(false);
    setNewConfig({ profile_url: "", api_key: "", message_template: "" });
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-500";
      case "inactive": return "text-red-500";
      case "connecting": return "text-yellow-500";
      default: return "text-secondary-text";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Conectado";
      case "inactive": return "Desconectado";
      case "connecting": return "Conectando...";
      default: return "Desconhecido";
    }
  };

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar user={user ?? undefined} onProfileClick={() => {}} />
      <main className="flex-1 lg:ml-64 p-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-primary-text">LinkedIn</h1>
          <button
            className="btn"
            onClick={() => setShowAdd(true)}
          >
            + Nova Configuração
          </button>
        </header>
        {showAdd && (
          <form
            onSubmit={handleAddConfig}
            className="bg-card-bg border border-border rounded-card p-6 mb-8 flex flex-col gap-4 max-w-md"
          >
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="URL do perfil LinkedIn"
              value={newConfig.profile_url}
              onChange={e => setNewConfig({ ...newConfig, profile_url: e.target.value })}
              required
            />
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="API Key"
              value={newConfig.api_key}
              onChange={e => setNewConfig({ ...newConfig, api_key: e.target.value })}
            />
            <textarea
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Template de mensagem"
              rows={3}
              value={newConfig.message_template}
              onChange={e => setNewConfig({ ...newConfig, message_template: e.target.value })}
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
          ) : configs.length === 0 ? (
            <div className="text-secondary-text">Nenhuma configuração LinkedIn encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configs.map(config => (
                <div key={config.id} className="bg-card-bg border border-border rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium text-primary-text">
                      {config.data?.profile_url || "(URL não informada)"}
                    </div>
                    <div className={`text-sm ${getStatusColor(config.status)}`}>
                      {getStatusText(config.status)}
                    </div>
                  </div>
                  <div className="text-xs text-secondary-text mb-4">
                    Criado em: {new Date(config.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn text-sm">Conectar</button>
                    <button className="btn text-sm">Configurar</button>
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