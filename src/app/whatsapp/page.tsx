"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import FloatingProfilePanel from "@/components/FloatingProfilePanel";
import { getSupabase } from "@/lib/supabase";

interface WhatsAppSession {
  id: string;
  phone_number: string | null;
  status: string;
  created_at: string;
}

export default function WhatsAppPage() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newSession, setNewSession] = useState({ phone_number: "" });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndSessions = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      // Buscar sessões WhatsApp do usuário
      const { data, error } = await supabase
        .from("whatsapp_sessions")
        .select("id, phone_number, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) setSessions(data);
      setLoading(false);
    };
    fetchUserAndSessions();
  }, [router]);

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase || !user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("whatsapp_sessions")
      .insert({ 
        user_id: user.id, 
        phone_number: newSession.phone_number,
        status: "inactive"
      })
      .select();
    if (!error && data) setSessions([data[0], ...sessions]);
    setShowAdd(false);
    setNewSession({ phone_number: "" });
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
      <Sidebar user={user} onProfileClick={() => {}} />
      <main className="flex-1 lg:ml-64 p-6">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-medium text-primary-text">WhatsApp</h1>
          <button
            className="btn"
            onClick={() => setShowAdd(true)}
          >
            + Nova Sessão
          </button>
        </header>
        {showAdd && (
          <form
            onSubmit={handleAddSession}
            className="bg-card-bg border border-border rounded-card p-6 mb-8 flex flex-col gap-4 max-w-md"
          >
            <input
              className="bg-main-bg border border-border rounded-btn px-4 py-2 text-primary-text"
              placeholder="Número do WhatsApp (ex: 5511999999999)"
              value={newSession.phone_number}
              onChange={e => setNewSession({ phone_number: e.target.value })}
              required
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
          ) : sessions.length === 0 ? (
            <div className="text-secondary-text">Nenhuma sessão WhatsApp configurada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(session => (
                <div key={session.id} className="bg-card-bg border border-border rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium text-primary-text">
                      {session.phone_number || "(Número não informado)"}
                    </div>
                    <div className={`text-sm ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </div>
                  </div>
                  <div className="text-xs text-secondary-text mb-4">
                    Criado em: {new Date(session.created_at).toLocaleString()}
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
      <FloatingProfilePanel user={user} />
    </div>
  );
} 