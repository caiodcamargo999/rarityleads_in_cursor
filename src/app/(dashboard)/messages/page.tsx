"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { ClientOnly } from '@/components/ClientOnly'
import { 
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  User,
  Search,
  Send
} from 'lucide-react'

type Conversation = {
  id: string
  lead_id: string | null
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'linkedin' | 'email'
  contact_name?: string | null
  contact_identifier: string
  last_message_at: string
  unread_count: number
}

type Message = {
  id: string
  conversation_id: string
  direction: 'inbound' | 'outbound'
  content: string
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  created_at: string
}

export default function MessagesPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [composer, setComposer] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: convs } = await supabase
        .from('conversations')
        .select('id, lead_id, channel, contact_name, contact_identifier, last_message_at, unread_count')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false })
      setConversations(convs || [])
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    const id = searchParams?.get('conversationId')
    if (id) setActiveConversationId(id)
  }, [searchParams])

  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversationId) return
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, conversation_id, direction, content, status, created_at')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])
    }
    loadMessages()

    // Realtime updates
    const channel = supabase
      .channel(`messages_${activeConversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` }, (payload: any) => {
        const m = payload.new as Message
        setMessages(prev => [...prev, m])
      })
      .subscribe()
    return () => { try { supabase.removeChannel(channel) } catch {} }
  }, [activeConversationId])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(c =>
      (c.contact_name || '').toLowerCase().includes(q) ||
      c.contact_identifier.toLowerCase().includes(q)
    )
  }, [conversations, search])

  const sendMessage = async () => {
    if (!composer.trim() || !activeConversationId) return
    const text = composer.trim()
    setComposer('')
    const temp: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConversationId,
      direction: 'outbound',
      content: text,
      status: 'sending',
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, temp])
    // Persist
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('messages').insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      direction: 'outbound',
      content: text,
      status: 'sent'
    }).select('id, conversation_id, direction, content, status, created_at').single()
    if (error) {
      setMessages(prev => prev.map(m => m.id === temp.id ? { ...m, status: 'failed' } : m))
    } else if (data) {
      setMessages(prev => prev.map(m => m.id === temp.id ? { ...data } as Message : m))
    }
  }

  const channelBadge = (c: Conversation) => {
    const label = c.channel.toUpperCase()
    return <Badge variant="outline" className="text-xs">{label}</Badge>
  }

  return (
    <div className="min-h-screen bg-background w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 pt-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-medium text-foreground mb-2">
              <ClientOnly fallback="Messages Hub">{t('messages.title', { defaultValue: 'Messages Hub' })}</ClientOnly>
            </h1>
            <p className="text-muted-foreground text-sm">
              Unified multichannel communication center
            </p>
          </div>
        </div>
        
        {/* Channel Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            All Channels
            <Badge variant="secondary" className="ml-1">{conversations.length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            📱 WhatsApp
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'whatsapp').length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            💼 LinkedIn
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'linkedin').length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            📸 Instagram
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'instagram').length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            📘 Facebook
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'facebook').length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            🐦 X/Twitter
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'x').length}</Badge>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            ✉️ Email
            <Badge variant="secondary">{conversations.filter(c => c.channel === 'email').length}</Badge>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 pb-4">
        {/* Conversations list */}
        <Card className="lg:col-span-1 h-[calc(100vh-140px)] overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('messages.inbox', { defaultValue: 'Inbox' })}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 h-full flex flex-col">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" placeholder={t('messages.search', { defaultValue: 'Search' }) as string} />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-sm text-muted-foreground p-4">{t('common.loading', { defaultValue: 'Loading...' })}</div>
              ) : filtered.length === 0 ? (
                <div className="text-sm text-muted-foreground p-4">{t('messages.noConversations', { defaultValue: 'No conversations' })}</div>
              ) : (
                filtered.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setActiveConversationId(c.id)}
                    className={`p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/60 ${activeConversationId === c.id ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-foreground font-medium">{c.contact_name || c.contact_identifier}</div>
                          <div className="text-xs text-muted-foreground">{new Date(c.last_message_at).toLocaleString()}</div>
                        </div>
                      </div>
                      {channelBadge(c)}
                    </div>
                    {c.unread_count > 0 && (
                      <div className="mt-1 text-xs text-primary">{c.unread_count} {t('messages.unread', { defaultValue: 'unread' })}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversation panel */}
        <Card className="lg:col-span-2 h-[calc(100vh-140px)] overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('messages.conversation', { defaultValue: 'Conversation' })}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 p-2">
              {activeConversationId ? (
                messages.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-4">{t('messages.noMessages', { defaultValue: 'No messages yet' })}</div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`max-w-[80%] p-2 rounded-lg text-sm ${m.direction === 'outbound' ? 'ml-auto bg-primary/10' : 'mr-auto bg-muted'}`}>
                      {m.content}
                      <div className="text-[10px] text-muted-foreground mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
                    </div>
                  ))
                )
              ) : (
                <div className="text-sm text-muted-foreground p-4">{t('messages.selectConversation', { defaultValue: 'Select a conversation' })}</div>
              )}
            </div>
            <div className="border-t border-border p-2">
              {/* Message Templates */}
              <div className="mb-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                💡 Quick templates: @name (lead name), @company (company), @service (suggested service)
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="px-2">
                  📎
                </Button>
                <Button variant="ghost" size="sm" className="px-2">
                  🎤
                </Button>
                <Button variant="ghost" size="sm" className="px-2">
                  📞
                </Button>
                <Input
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  placeholder="Type a message or use @ for variables..."
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  className="flex-1"
                />
                <Button onClick={sendMessage} aria-label={t('messages.send', { defaultValue: 'Send' })}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


