'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export default function WhatsAppAccountsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [connectingSession, setConnectingSession] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)

  useEffect(() => {
    fetchSessions()
    connectWebSocket()

    return () => {
      if (window.ws) {
        window.ws.close()
      }
    }
  }, [])

  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL}/sessions/user/${user.id}`)
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3011')
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'qr' && data.sessionId === connectingSession) {
        setQrCode(data.qr)
      } else if (data.type === 'connected') {
        setShowQRModal(false)
        setConnectingSession(null)
        fetchSessions()
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setWsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setWsConnected(false)
      // Reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000)
    }

    window.ws = ws
  }

  const createSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL}/sessions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      const { sessionId } = await response.json()
      setConnectingSession(sessionId)
      setShowQRModal(true)
      
      // Start polling for QR code
      pollForQR(sessionId)
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  const pollForQR = async (sessionId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL}/sessions/${sessionId}/qr`)
        const data = await response.json()
        
        if (data.qr) {
          setQrCode(data.qr)
        }
        
        if (data.status === 'connected') {
          clearInterval(interval)
          setShowQRModal(false)
          fetchSessions()
        }
      } catch (error) {
        console.error('Error polling QR:', error)
      }
    }, 2000)

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(interval), 300000)
  }

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to disconnect this WhatsApp account?')) {
      return
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_SERVICE_URL}/sessions/${sessionId}`, {
        method: 'DELETE'
      })
      fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      connected: 'bg-green-500/20 text-green-400',
      qr_ready: 'bg-yellow-500/20 text-yellow-400',
      inactive: 'bg-red-500/20 text-red-400',
      initializing: 'bg-blue-500/20 text-blue-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-[#18181c] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-3xl font-medium text-white mb-2">WhatsApp Accounts</h1>
          <p className="text-[#b0b0b0]">Manage multiple WhatsApp Business accounts</p>
          {!wsConnected && (
            <div className="mt-2 text-yellow-500 text-sm">
              ⚠️ Real-time connection lost. Reconnecting...
            </div>
          )}
        </motion.div>

        {/* Add Account Button */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={createSession}
            className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add WhatsApp Account
          </button>
        </motion.div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
          </div>
        ) : sessions.length === 0 ? (
          <motion.div 
            className="bg-[#232336] rounded-xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-medium text-white mb-2">No WhatsApp accounts connected</h3>
            <p className="text-[#b0b0b0] mb-6">Connect your first WhatsApp Business account to start messaging</p>
            <button
              onClick={createSession}
              className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              Connect WhatsApp
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                className="bg-[#232336] rounded-xl p-6 border border-[#393552] hover:border-[#8B5CF6]/50 transition-colors"
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white text-xl">
                      W
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        {session.phone_number || 'Connecting...'}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(session.status)}`}>
                        {session.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-[#b0b0b0] hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#b0b0b0]">Created</span>
                    <span className="text-[#e0e0e0]">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#b0b0b0]">Last Active</span>
                    <span className="text-[#e0e0e0]">
                      {new Date(session.updated_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {session.status === 'connected' && (
                  <div className="mt-4 pt-4 border-t border-[#393552]">
                    <button
                      onClick={() => router.push(`/dashboard/whatsapp/messages?session=${session.id}`)}
                      className="w-full px-4 py-2 bg-[#232336] text-white rounded-lg hover:bg-[#2a2a3f] transition-colors border border-[#393552]"
                    >
                      Open Messages
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQRModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowQRModal(false)}
            >
              <motion.div
                className="bg-[#232336] rounded-xl p-8 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-medium text-white mb-4">Connect WhatsApp</h2>
                
                {qrCode ? (
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <img src={qrCode} alt="WhatsApp QR Code" className="w-full" />
                  </div>
                ) : (
                  <div className="bg-[#18181c] rounded-lg h-64 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
                      <p className="text-[#b0b0b0]">Generating QR Code...</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm text-[#b0b0b0]">
                  <p>1. Open WhatsApp on your phone</p>
                  <p>2. Go to Settings → Linked Devices</p>
                  <p>3. Tap "Link a Device"</p>
                  <p>4. Scan this QR code</p>
                </div>

                <button
                  onClick={() => setShowQRModal(false)}
                  className="w-full mt-6 px-4 py-2 bg-[#393552] text-white rounded-lg hover:bg-[#4a4665] transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}