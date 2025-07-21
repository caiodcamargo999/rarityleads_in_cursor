import { default as makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import express from 'express'
import { WebSocketServer } from 'ws'
import { createClient } from 'redis'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import Queue from 'bull'
import QRCode from 'qrcode'
import winston from 'winston'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'whatsapp-service' },
  transports: [
    new winston.transports.File({ filename: 'logs/whatsapp-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/whatsapp-combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

// Initialize Redis
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redis.on('error', (err) => logger.error('Redis Client Error', err))
await redis.connect()

// Initialize Supabase
const supabase = createSupabaseClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Initialize Express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize WebSocket server
const wss = new WebSocketServer({ port: 3001 })

// Initialize Bull queues
const messageQueue = new Queue('whatsapp-messages', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
})

const sessionQueue = new Queue('whatsapp-sessions', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
})

// Bull Board for monitoring
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [
    new BullAdapter(messageQueue),
    new BullAdapter(sessionQueue)
  ],
  serverAdapter
})

app.use('/admin/queues', serverAdapter.getRouter())

// Store active sessions
const activeSessions = new Map()

// WhatsApp session manager
class WhatsAppSession {
  constructor(userId, phoneNumber, sessionId) {
    this.userId = userId
    this.phoneNumber = phoneNumber
    this.sessionId = sessionId
    this.sock = null
    this.qrCode = null
    this.status = 'connecting'
    this.lastActivity = new Date()
  }

  async initialize() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(`sessions/${this.sessionId}`)
      
      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: logger
      })

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
          this.qrCode = await QRCode.toDataURL(qr)
          this.status = 'qr_ready'
          await this.updateSessionStatus('qr_ready', this.qrCode)
          this.broadcastToUser('qr_ready', { qrCode: this.qrCode })
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
          
          if (shouldReconnect) {
            this.status = 'reconnecting'
            await this.updateSessionStatus('reconnecting')
            this.broadcastToUser('reconnecting')
            setTimeout(() => this.initialize(), 5000)
          } else {
            this.status = 'disconnected'
            await this.updateSessionStatus('disconnected')
            this.broadcastToUser('disconnected')
          }
        }

        if (connection === 'open') {
          this.status = 'connected'
          this.qrCode = null
          await this.updateSessionStatus('connected')
          this.broadcastToUser('connected')
          logger.info(`WhatsApp session ${this.sessionId} connected`)
        }
      })

      this.sock.ev.on('creds.update', saveCreds)

      this.sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.key.fromMe && m.type === 'notify') {
          await this.handleIncomingMessage(msg)
        }
      })

      this.sock.ev.on('messages.update', async (m) => {
        for (const msg of m) {
          await this.handleMessageUpdate(msg)
        }
      })

    } catch (error) {
      logger.error('Error initializing WhatsApp session:', error)
      this.status = 'error'
      await this.updateSessionStatus('error')
      this.broadcastToUser('error', { error: error.message })
    }
  }

  async sendMessage(to, content, type = 'text') {
    try {
      if (!this.sock || this.status !== 'connected') {
        throw new Error('Session not connected')
      }

      let message
      switch (type) {
        case 'text':
          message = { text: content }
          break
        case 'image':
          message = { image: { url: content } }
          break
        case 'video':
          message = { video: { url: content } }
          break
        case 'audio':
          message = { audio: { url: content } }
          break
        case 'document':
          message = { document: { url: content } }
          break
        default:
          message = { text: content }
      }

      const result = await this.sock.sendMessage(to, message)
      
      // Store message in database
      await this.storeMessage(to, content, 'outbound', 'sent', result.key.id)
      
      this.lastActivity = new Date()
      return result

    } catch (error) {
      logger.error('Error sending WhatsApp message:', error)
      await this.storeMessage(to, content, 'outbound', 'failed')
      throw error
    }
  }

  async handleIncomingMessage(msg) {
    try {
      const from = msg.key.remoteJid
      const content = msg.message?.conversation || 
                     msg.message?.extendedTextMessage?.text ||
                     msg.message?.imageMessage?.caption ||
                     ''

      // Store incoming message
      await this.storeMessage(from, content, 'inbound', 'received', msg.key.id)

      // Update conversation
      await this.updateConversation(from, content)

      // Broadcast to user
      this.broadcastToUser('message_received', {
        from,
        content,
        timestamp: new Date().toISOString()
      })

      // Process with AI if needed
      await this.processWithAI(from, content)

    } catch (error) {
      logger.error('Error handling incoming message:', error)
    }
  }

  async handleMessageUpdate(msg) {
    try {
      const { key, update } = msg
      let status = 'sent'

      if (update.status) {
        status = update.status
      }

      await this.updateMessageStatus(key.id, status)

    } catch (error) {
      logger.error('Error handling message update:', error)
    }
  }

  async storeMessage(to, content, direction, status, externalId = null) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: await this.getConversationId(to),
          user_id: this.userId,
          direction,
          content,
          status,
          external_id: externalId,
          metadata: { session_id: this.sessionId }
        })

      if (error) throw error
      return data

    } catch (error) {
      logger.error('Error storing message:', error)
    }
  }

  async updateMessageStatus(externalId, status) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('external_id', externalId)

      if (error) throw error

    } catch (error) {
      logger.error('Error updating message status:', error)
    }
  }

  async getConversationId(contactId) {
    try {
      let { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', this.userId)
        .eq('contact_identifier', contactId)
        .eq('channel', 'whatsapp')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (!data) {
        const { data: newConversation, error: insertError } = await supabase
          .from('conversations')
          .insert({
            user_id: this.userId,
            channel: 'whatsapp',
            contact_identifier: contactId,
            contact_name: contactId.split('@')[0]
          })
          .select()
          .single()

        if (insertError) throw insertError
        return newConversation.id
      }

      return data.id

    } catch (error) {
      logger.error('Error getting conversation ID:', error)
      return null
    }
  }

  async updateConversation(contactId, lastMessage) {
    try {
      const conversationId = await this.getConversationId(contactId)
      if (!conversationId) return

      const { error } = await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          unread_count: supabase.sql`unread_count + 1`
        })
        .eq('id', conversationId)

      if (error) throw error

    } catch (error) {
      logger.error('Error updating conversation:', error)
    }
  }

  async updateSessionStatus(status, qrCode = null) {
    try {
      const { error } = await supabase
        .from('whatsapp_sessions')
        .update({
          status,
          qr_code: qrCode,
          last_activity: new Date().toISOString()
        })
        .eq('id', this.sessionId)

      if (error) throw error

    } catch (error) {
      logger.error('Error updating session status:', error)
    }
  }

  async processWithAI(contactId, content) {
    try {
      // Add AI processing logic here
      // This could include intent detection, response suggestions, etc.
      logger.info(`Processing message with AI: ${content}`)
    } catch (error) {
      logger.error('Error processing with AI:', error)
    }
  }

  broadcastToUser(event, data) {
    wss.clients.forEach((client) => {
      if (client.userId === this.userId && client.readyState === 1) {
        client.send(JSON.stringify({
          event,
          sessionId: this.sessionId,
          data
        }))
      }
    })
  }

  disconnect() {
    if (this.sock) {
      this.sock.end()
    }
    this.status = 'disconnected'
    activeSessions.delete(this.sessionId)
  }
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const userId = req.headers['user-id']
  ws.userId = userId

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      handleWebSocketMessage(ws, data)
    } catch (error) {
      logger.error('Error parsing WebSocket message:', error)
    }
  })

  ws.on('close', () => {
    logger.info(`WebSocket connection closed for user ${userId}`)
  })
})

async function handleWebSocketMessage(ws, data) {
  const { action, sessionId, ...payload } = data

  switch (action) {
    case 'send_message':
      await handleSendMessage(ws.userId, sessionId, payload)
      break
    case 'get_session_status':
      await handleGetSessionStatus(ws.userId, sessionId)
      break
    default:
      logger.warn(`Unknown WebSocket action: ${action}`)
  }
}

async function handleSendMessage(userId, sessionId, { to, content, type }) {
  try {
    const session = activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const result = await session.sendMessage(to, content, type)
    
    // Send confirmation to WebSocket client
    ws.send(JSON.stringify({
      event: 'message_sent',
      sessionId,
      data: { to, content, type, result }
    }))

  } catch (error) {
    logger.error('Error handling send message:', error)
    ws.send(JSON.stringify({
      event: 'error',
      sessionId,
      data: { error: error.message }
    }))
  }
}

async function handleGetSessionStatus(userId, sessionId) {
  try {
    const session = activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    ws.send(JSON.stringify({
      event: 'session_status',
      sessionId,
      data: {
        status: session.status,
        qrCode: session.qrCode,
        lastActivity: session.lastActivity
      }
    }))

  } catch (error) {
    logger.error('Error handling get session status:', error)
  }
}

// API Routes
app.post('/api/sessions', async (req, res) => {
  try {
    const { userId, phoneNumber, accountName } = req.body

    const sessionId = `whatsapp_${userId}_${Date.now()}`
    
    // Create session in database
    const { data, error } = await supabase
      .from('whatsapp_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        phone_number: phoneNumber,
        account_name: accountName,
        status: 'connecting'
      })
      .select()
      .single()

    if (error) throw error

    // Initialize WhatsApp session
    const session = new WhatsAppSession(userId, phoneNumber, sessionId)
    activeSessions.set(sessionId, session)
    await session.initialize()

    res.json({ success: true, sessionId, data })

  } catch (error) {
    logger.error('Error creating session:', error)
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = activeSessions.get(sessionId)
    if (session) {
      session.disconnect()
    }

    // Update database
    const { error } = await supabase
      .from('whatsapp_sessions')
      .update({ status: 'disconnected' })
      .eq('id', sessionId)

    if (error) throw error

    res.json({ success: true })

  } catch (error) {
    logger.error('Error deleting session:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/sessions/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params
    const { to, content, type = 'text' } = req.body

    const session = activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    const result = await session.sendMessage(to, content, type)
    res.json({ success: true, result })

  } catch (error) {
    logger.error('Error sending message:', error)
    res.status(500).json({ error: error.message })
  }
})

// Message queue processor
messageQueue.process(async (job) => {
  try {
    const { sessionId, to, content, type } = job.data
    
    const session = activeSessions.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }

    await session.sendMessage(to, content, type)
    
  } catch (error) {
    logger.error('Error processing message queue:', error)
    throw error
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: activeSessions.size,
    timestamp: new Date().toISOString()
  })
})

// Start server
const PORT = process.env.WHATSAPP_SERVICE_PORT || 3001
app.listen(PORT, () => {
  logger.info(`WhatsApp service running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully')
  
  // Disconnect all sessions
  for (const session of activeSessions.values()) {
    session.disconnect()
  }
  
  // Close Redis connection
  await redis.quit()
  
  process.exit(0)
})

export default app 