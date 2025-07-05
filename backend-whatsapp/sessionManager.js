const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const supabase = require('./supabaseClient');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

// In-memory session storage (will be persisted to Supabase)
const sessions = {};
const sessionStatus = {};

// Encryption key (should be in environment variables in production)
const ENCRYPTION_KEY = process.env.SESSION_ENCRYPTION_KEY || 'your-secret-key-32-chars-long!!';

// Encrypt session data
function encryptSessionData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    data: encrypted
  };
}

// Decrypt session data
function decryptSessionData(encryptedData) {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

// Update session status in Supabase
async function updateSessionStatus(sessionId, status, phoneNumber = null) {
  try {
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };
    
    if (phoneNumber) {
      updateData.phone_number = phoneNumber;
    }

    const { error } = await supabase
      .from('whatsapp_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session status:', error);
    }
  } catch (error) {
    console.error('Error updating session status:', error);
  }
}

// Save session data to Supabase
async function saveSessionData(sessionId, userId, sessionData, phoneNumber = null) {
  try {
    const encryptedData = encryptSessionData(sessionData);
    
    const { error } = await supabase
      .from('whatsapp_sessions')
      .upsert([{
        id: sessionId,
        user_id: userId,
        phone_number: phoneNumber,
        session_data: encryptedData,
        status: 'connected',
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });

    if (error) {
      console.error('Error saving session data:', error);
    }
  } catch (error) {
    console.error('Error saving session data:', error);
  }
}

// Create a new WhatsApp session
async function createSession(userId, sessionId, onQr, onReady, onMessage, onStatusChange) {
  try {
    // Create session directory
    const sessionDir = path.join(__dirname, 'sessions', sessionId);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    // Update status to 'connecting'
    sessionStatus[sessionId] = 'connecting';
    await updateSessionStatus(sessionId, 'connecting');

    // Use multi-file auth state for session persistence
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    // Create WhatsApp socket
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      defaultQueryTimeoutMs: 60000,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
    });

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        // Generate QR code image
        try {
          const qrImage = await QRCode.toDataURL(qr);
          onQr(qrImage, sessionId);
        } catch (error) {
          console.error('Error generating QR code:', error);
          onQr(qr, sessionId); // Send raw QR if image generation fails
        }
      }

      if (connection === 'open') {
        console.log(`Session ${sessionId} connected successfully`);
        sessionStatus[sessionId] = 'connected';
        sessions[sessionId] = sock;
        
        // Get phone number
        const phoneNumber = sock.user?.id?.split('@')[0] || null;
        
        // Save session data
        const sessionData = {
          creds: state.creds,
          keys: state.keys
        };
        await saveSessionData(sessionId, userId, sessionData, phoneNumber);
        
        // Update status
        await updateSessionStatus(sessionId, 'connected', phoneNumber);
        
        // Notify frontend
        onReady(sessionId, phoneNumber);
        onStatusChange(sessionId, 'connected', phoneNumber);
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          console.log(`Session ${sessionId} disconnected, attempting to reconnect...`);
          sessionStatus[sessionId] = 'reconnecting';
          await updateSessionStatus(sessionId, 'reconnecting');
          onStatusChange(sessionId, 'reconnecting');
        } else {
          console.log(`Session ${sessionId} logged out`);
          sessionStatus[sessionId] = 'logged_out';
          await updateSessionStatus(sessionId, 'logged_out');
          onStatusChange(sessionId, 'logged_out');
          delete sessions[sessionId];
        }
      }
    });

    // Handle credentials update
    sock.ev.on('creds.update', saveCreds);

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {
        const messageData = {
          from: msg.key.remoteJid,
          content: msg.message,
          timestamp: new Date().toISOString(),
          sessionId: sessionId
        };
        
        // Save message to Supabase
        try {
          const { error } = await supabase
            .from('messages')
            .insert([{
              user_id: userId,
              whatsapp_session_id: sessionId,
              direction: 'received',
              content: messageData,
              status: 'delivered',
              timestamp: new Date().toISOString()
            }]);

          if (error) {
            console.error('Error saving received message:', error);
          }
        } catch (error) {
          console.error('Error saving received message:', error);
        }

        // Notify frontend
        onMessage(sessionId, messageData);
      }
    });

    return sock;
  } catch (error) {
    console.error('Error creating session:', error);
    sessionStatus[sessionId] = 'error';
    await updateSessionStatus(sessionId, 'error');
    throw error;
  }
}

// Send message via WhatsApp
async function sendMessage(sessionId, to, message, userId) {
  try {
    const sock = sessions[sessionId];
    if (!sock) {
      throw new Error('Session not found or not connected');
    }

    // Format phone number if needed
    let formattedNumber = to;
    if (!to.includes('@s.whatsapp.net')) {
      formattedNumber = to.replace(/\D/g, '') + '@s.whatsapp.net';
    }

    // Send message
    const result = await sock.sendMessage(formattedNumber, { text: message });

    // Save message to Supabase
    const messageData = {
      to: formattedNumber,
      content: message,
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      messageId: result.key.id
    };

    const { error } = await supabase
      .from('messages')
      .insert([{
        user_id: userId,
        whatsapp_session_id: sessionId,
        direction: 'sent',
        content: messageData,
        status: 'sent',
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving sent message:', error);
    }

    return { success: true, messageId: result.key.id };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Get session status
function getSessionStatus(sessionId) {
  return sessionStatus[sessionId] || 'unknown';
}

// Get all sessions for a user
async function getUserSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    return [];
  }
}

// Disconnect session
async function disconnectSession(sessionId) {
  try {
    const sock = sessions[sessionId];
    if (sock) {
      await sock.logout();
      delete sessions[sessionId];
    }
    
    sessionStatus[sessionId] = 'disconnected';
    await updateSessionStatus(sessionId, 'disconnected');
    
    return { success: true };
  } catch (error) {
    console.error('Error disconnecting session:', error);
    throw error;
  }
}

// Restore sessions from Supabase on startup
async function restoreSessions() {
  try {
    const { data, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('status', 'connected');

    if (error) {
      console.error('Error restoring sessions:', error);
      return;
    }

    console.log(`Found ${data.length} sessions to restore`);
    
    // Note: In a production environment, you might want to restore sessions
    // based on user activity or other criteria, rather than all at once
  } catch (error) {
    console.error('Error restoring sessions:', error);
  }
}

module.exports = {
  createSession,
  sendMessage,
  getSessionStatus,
  getUserSessions,
  disconnectSession,
  restoreSessions,
  sessions,
  sessionStatus
};