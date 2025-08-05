"use client"

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  QrCode, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Trash2,
  Settings,
  Smartphone,
  Wifi,
  WifiOff,
  AlertCircle,
  Copy,
  ExternalLink,
  MoreHorizontal,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { ClientOnly } from '@/components/ClientOnly'

interface WhatsAppAccount {
  id: string
  name: string
  phone: string
  status: 'connected' | 'disconnected' | 'connecting' | 'error'
  lastSeen: string
  messageCount: number
  leadCount: number
  sessionId: string
  qrCode?: string
  errorMessage?: string
  isDefault?: boolean
  createdAt: string
  lastActivity: string
}

interface QRCodeData {
  sessionId: string
  qrCode: string
  expiresAt: string
}

export default function WhatsAppAccountsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<WhatsAppAccount | null>(null)
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null)
  const [newAccountName, setNewAccountName] = useState('')
  const [newAccountPhone, setNewAccountPhone] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  
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
        lastSeen: '2024-01-15T10:30:00Z',
        messageCount: 245,
        leadCount: 12,
        sessionId: 'session_1',
        isDefault: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastActivity: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Support Account',
        phone: '+1 (555) 987-6543',
        status: 'disconnected',
        lastSeen: '2024-01-14T15:45:00Z',
        messageCount: 89,
        leadCount: 5,
        sessionId: 'session_2',
        createdAt: '2024-01-05T00:00:00Z',
        lastActivity: '2024-01-14T15:45:00Z'
      }
    ])
  }, [])

  const handleAddAccount = () => {
    setShowQRModal(true)
    setNewAccountName('')
    setNewAccountPhone('')
    setQrCodeData(null)
    setConnectionStatus('')
  }

  const generateQRCode = async () => {
    if (!newAccountName.trim() || !newAccountPhone.trim()) {
      toast({
        title: t('whatsapp.validationError'),
        description: t('whatsapp.fillAllFields'),
        variant: 'destructive'
      })
      return
    }

    setIsConnecting(true)
    setConnectionStatus(t('whatsapp.generatingQR'))

    try {
      // Simulate API call to generate QR code
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockQRData: QRCodeData = {
        sessionId: `session_${Date.now()}`,
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
      }
      
      setQrCodeData(mockQRData)
      setConnectionStatus(t('whatsapp.scanQRCode'))
      
      // Start polling for connection status
      pollConnectionStatus(mockQRData.sessionId)
      
    } catch (error) {
      toast({
        title: t('whatsapp.connectionError'),
        description: t('whatsapp.qrGenerationFailed'),
        variant: 'destructive'
      })
      setConnectionStatus('')
    } finally {
      setIsConnecting(false)
    }
  }

  const pollConnectionStatus = async (sessionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Simulate checking connection status
        const isConnected = Math.random() > 0.7 // 30% chance of connection
        
        if (isConnected) {
          clearInterval(pollInterval)
          
          // Add new account
          const newAccount: WhatsAppAccount = {
            id: Date.now().toString(),
            name: newAccountName,
            phone: newAccountPhone,
            status: 'connected',
            lastSeen: new Date().toISOString(),
            messageCount: 0,
            leadCount: 0,
            sessionId,
            createdAt: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          }
          
          setAccounts(prev => [...prev, newAccount])
          setShowQRModal(false)
          setQrCodeData(null)
          setConnectionStatus('')
          
          toast({
            title: t('whatsapp.connectionSuccess'),
            description: t('whatsapp.accountConnected')
          })
        }
      } catch (error) {
        console.error('Error polling connection status:', error)
      }
    }, 3000) // Poll every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (qrCodeData) {
        setConnectionStatus(t('whatsapp.qrExpired'))
      }
    }, 5 * 60 * 1000)
  }

  const handleConnectAccount = async () => {
    if (!qrCodeData) {
      await generateQRCode()
    }
  }

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, status: 'disconnected' as const }
          : acc
      ))
      
      toast({
        title: t('whatsapp.disconnected'),
        description: t('whatsapp.accountDisconnected')
      })
    } catch (error) {
      toast({
        title: t('whatsapp.error'),
        description: t('whatsapp.disconnectFailed'),
        variant: 'destructive'
      })
    }
  }

  const handleReconnectAccount = async (accountId: string) => {
    try {
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { ...acc, status: 'connecting' as const }
          : acc
      ))
      
      // Simulate reconnection
      setTimeout(() => {
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId 
            ? { ...acc, status: 'connected' as const, lastActivity: new Date().toISOString() }
            : acc
        ))
        
        toast({
          title: t('whatsapp.reconnected'),
          description: t('whatsapp.accountReconnected')
        })
      }, 3000)
      
    } catch (error) {
      toast({
        title: t('whatsapp.error'),
        description: t('whatsapp.reconnectFailed'),
        variant: 'destructive'
      })
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (confirm(t('whatsapp.confirmDelete'))) {
      try {
        setAccounts(prev => prev.filter(acc => acc.id !== accountId))
        
        toast({
          title: t('whatsapp.deleted'),
          description: t('whatsapp.accountDeleted')
        })
      } catch (error) {
        toast({
          title: t('whatsapp.error'),
          description: t('whatsapp.deleteFailed'),
          variant: 'destructive'
        })
      }
    }
  }

  const handleSetDefault = async (accountId: string) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId
    })))
    
    toast({
      title: t('whatsapp.defaultSet'),
      description: t('whatsapp.defaultAccountUpdated')
    })
  }

  const copyPhoneNumber = (phone: string) => {
    navigator.clipboard.writeText(phone)
    toast({
      title: t('whatsapp.copied'),
      description: t('whatsapp.phoneCopied')
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-red-400'
      case 'connecting': return 'text-yellow-400'
      case 'error': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <XCircle className="w-4 h-4" />
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected': return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
      case 'disconnected': return <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30">Disconnected</Badge>
      case 'connecting': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Connecting</Badge>
             case 'error': return <Badge variant="destructive">Error</Badge>
      default: return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div ref={pageRef} className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-medium text-foreground">
            <ClientOnly fallback="WhatsApp Accounts">
              {t('whatsapp.accounts.title')}
            </ClientOnly>
          </h1>
          <p className="text-muted-foreground mt-1">
            <ClientOnly fallback="Manage your WhatsApp accounts and connections">
              {t('whatsapp.accounts.description')}
            </ClientOnly>
          </p>
        </div>
        <Button onClick={handleAddAccount} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <ClientOnly fallback="Add Account">
            {t('whatsapp.accounts.addAccount')}
          </ClientOnly>
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                <ClientOnly fallback="Total Accounts">
                  {t('whatsapp.accounts.totalAccounts')}
                </ClientOnly>
              </p>
              <p className="text-2xl font-medium text-foreground">{accounts.length}</p>
            </div>
            <Smartphone className="w-8 h-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                <ClientOnly fallback="Connected">
                  {t('whatsapp.accounts.connected')}
                </ClientOnly>
              </p>
              <p className="text-2xl font-medium text-foreground">
                {accounts.filter(acc => acc.status === 'connected').length}
              </p>
            </div>
            <Wifi className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                <ClientOnly fallback="Total Messages">
                  {t('whatsapp.accounts.totalMessages')}
                </ClientOnly>
              </p>
              <p className="text-2xl font-medium text-foreground">
                {accounts.reduce((sum, acc) => sum + acc.messageCount, 0)}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                <ClientOnly fallback="Total Leads">
                  {t('whatsapp.accounts.totalLeads')}
                </ClientOnly>
              </p>
              <p className="text-2xl font-medium text-foreground">
                {accounts.reduce((sum, acc) => sum + acc.leadCount, 0)}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {accounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={pageInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="h-full hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      {account.isDefault && (
                        <Badge variant="outline" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(account.status)}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(account.lastActivity)}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/outreach/whatsapp/conversations?account=${account.id}`)}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <ClientOnly fallback="View Conversations">
                          {t('whatsapp.accounts.viewConversations')}
                        </ClientOnly>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyPhoneNumber(account.phone)}>
                        <Copy className="w-4 h-4 mr-2" />
                        <ClientOnly fallback="Copy Phone">
                          {t('whatsapp.accounts.copyPhone')}
                        </ClientOnly>
                      </DropdownMenuItem>
                      {!account.isDefault && (
                        <DropdownMenuItem onClick={() => handleSetDefault(account.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          <ClientOnly fallback="Set as Default">
                            {t('whatsapp.accounts.setDefault')}
                          </ClientOnly>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/outreach/whatsapp/accounts/${account.id}/settings`)}>
                        <Settings className="w-4 h-4 mr-2" />
                        <ClientOnly fallback="Settings">
                          {t('whatsapp.accounts.settings')}
                        </ClientOnly>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone Number */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{account.phone}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyPhoneNumber(account.phone)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-medium text-foreground">{account.messageCount}</p>
                    <p className="text-xs text-muted-foreground">
                      <ClientOnly fallback="Messages">
                        {t('whatsapp.accounts.messages')}
                      </ClientOnly>
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-medium text-foreground">{account.leadCount}</p>
                    <p className="text-xs text-muted-foreground">
                      <ClientOnly fallback="Leads">
                        {t('whatsapp.accounts.leads')}
                      </ClientOnly>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {account.status === 'connected' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDisconnectAccount(account.id)}
                    >
                      <WifiOff className="w-3 h-3 mr-1" />
                      <ClientOnly fallback="Disconnect">
                        {t('whatsapp.accounts.disconnect')}
                      </ClientOnly>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleReconnectAccount(account.id)}
                      disabled={account.status === 'connecting'}
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${account.status === 'connecting' ? 'animate-spin' : ''}`} />
                      <ClientOnly fallback="Reconnect">
                        {t('whatsapp.accounts.reconnect')}
                      </ClientOnly>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/outreach/whatsapp/conversations?account=${account.id}`)}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                                     <Button
                     variant="danger"
                     size="sm"
                     onClick={() => handleDeleteAccount(account.id)}
                   >
                    <Trash2 className="w-3 h-3" />
                  </Button>
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
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            <ClientOnly fallback="No WhatsApp accounts connected">
              {t('whatsapp.accounts.noAccounts')}
            </ClientOnly>
          </h3>
          <p className="text-muted-foreground mb-6">
            <ClientOnly fallback="Connect your first WhatsApp account to start sending messages">
              {t('whatsapp.accounts.noAccountsDescription')}
            </ClientOnly>
          </p>
          <Button
            onClick={handleAddAccount}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <ClientOnly fallback="Add Your First Account">
              {t('whatsapp.accounts.addFirstAccount')}
            </ClientOnly>
          </Button>
        </motion.div>
      )}

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
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <QrCode className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                <ClientOnly fallback="Connect WhatsApp Account">
                  {t('whatsapp.accounts.connectAccount')}
                </ClientOnly>
              </h3>
              
              {!qrCodeData ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    <ClientOnly fallback="Enter account details to generate QR code">
                      {t('whatsapp.accounts.enterDetails')}
                    </ClientOnly>
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <Input
                      placeholder={t('whatsapp.accounts.accountName')}
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                    />
                    <Input
                      placeholder={t('whatsapp.accounts.phoneNumber')}
                      value={newAccountPhone}
                      onChange={(e) => setNewAccountPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowQRModal(false)}
                      className="flex-1"
                    >
                      <ClientOnly fallback="Cancel">
                        {t('common.cancel')}
                      </ClientOnly>
                    </Button>
                    <Button
                      onClick={handleConnectAccount}
                      disabled={isConnecting}
                      className="flex-1"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          <ClientOnly fallback="Generating...">
                            {t('whatsapp.accounts.generating')}
                          </ClientOnly>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          <ClientOnly fallback="Generate QR Code">
                            {t('whatsapp.accounts.generateQR')}
                          </ClientOnly>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    <ClientOnly fallback="Scan the QR code with your WhatsApp mobile app">
                      {t('whatsapp.accounts.scanQR')}
                    </ClientOnly>
                  </p>
                  
                  {connectionStatus && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-foreground">{connectionStatus}</p>
                    </div>
                  )}
                  
                  {/* QR Code */}
                  <div className="w-48 h-48 bg-white border border-border rounded-lg mx-auto mb-6 flex items-center justify-center">
                    {qrCodeData.qrCode ? (
                      <img 
                        src={qrCodeData.qrCode} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowQRModal(false)}
                      className="flex-1"
                    >
                      <ClientOnly fallback="Cancel">
                        {t('common.cancel')}
                      </ClientOnly>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setQrCodeData(null)
                        setConnectionStatus('')
                      }}
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      <ClientOnly fallback="Refresh">
                        {t('whatsapp.accounts.refresh')}
                      </ClientOnly>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 