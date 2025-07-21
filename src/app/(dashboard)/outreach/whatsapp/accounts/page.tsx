"use client"

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Plus, 
  QrCode, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trash2,
  Settings,
  Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface WhatsAppAccount {
  id: string
  name: string
  phone: string
  status: 'connected' | 'disconnected' | 'connecting'
  lastSeen: string
  messageCount: number
  leadCount: number
}

export default function WhatsAppAccountsPage() {
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null)
  
  const pageRef = useRef(null)
  const pageInView = useInView(pageRef, { once: true })

  // Mock data for demonstration
  useEffect(() => {
    setAccounts([
      {
        id: '1',
        name: 'Business Account',
        phone: '+1 (555) 123-4567',
        status: 'connected',
        lastSeen: '2 minutes ago',
        messageCount: 156,
        leadCount: 23
      },
      {
        id: '2',
        name: 'Personal Account',
        phone: '+1 (555) 987-6543',
        status: 'disconnected',
        lastSeen: '1 hour ago',
        messageCount: 89,
        leadCount: 12
      }
    ])
  }, [])

  const handleAddAccount = () => {
    setShowQRModal(true)
  }

  const handleConnectAccount = async () => {
    setLoading(true)
    // Simulate connection process
    setTimeout(() => {
      setLoading(false)
      setShowQRModal(false)
      // Add new account logic here
    }, 2000)
  }

  const handleDisconnectAccount = async (accountId: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId 
        ? { ...acc, status: 'disconnected' as const }
        : acc
    ))
  }

  const handleDeleteAccount = async (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-red-400'
      case 'connecting': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <XCircle className="w-4 h-4" />
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
                WhatsApp Accounts
              </h1>
              <p className="text-base text-gray-400">
                Manage your WhatsApp accounts for multi-channel outreach
              </p>
            </div>
            <Button
              onClick={handleAddAccount}
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </Button>
          </div>
        </motion.div>

        {/* Accounts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-[#18181c] border border-gray-800 hover:border-gray-700 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-normal text-white">
                          {account.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-400">
                          {account.phone}
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(account.status)}`}>
                      {getStatusIcon(account.status)}
                      <span className="text-xs capitalize">{account.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Last seen:</span>
                      <span className="text-white">{account.lastSeen}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Messages:</span>
                      <span className="text-white">{account.messageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Leads:</span>
                      <span className="text-white">{account.leadCount}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDisconnectAccount(account.id)}
                        disabled={account.status === 'disconnected'}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reconnect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Settings
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-normal text-white mb-2">No WhatsApp accounts connected</h3>
            <p className="text-gray-400 mb-6">Connect your first WhatsApp account to start sending messages</p>
            <Button
              onClick={handleAddAccount}
              variant="primary"
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Account
            </Button>
          </motion.div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowQRModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#18181c] border border-gray-800 rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <QrCode className="w-16 h-16 text-[#8b5cf6] mx-auto mb-4" />
              <h3 className="text-lg font-normal text-white mb-2">Connect WhatsApp Account</h3>
              <p className="text-gray-400 mb-6">
                Scan the QR code with your WhatsApp mobile app to connect your account
              </p>
              
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 bg-gray-800 border border-gray-700 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-600" />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowQRModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConnectAccount}
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Connecting...' : 'Connect Account'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 