const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const supabase = require('./supabaseClient');
const fs = require('fs');
const path = require('path');

const sessions = {};

async function createSession(userId, sessionId, onQr, onReady) {
  const sessionDir = path.join(__dirname, 'sessions', sessionId);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, qr } = update;
    if (qr) onQr(qr);
    if (connection === 'open') {
      onReady(sock);
      // Save session data to Supabase
      const sessionData = fs.readFileSync(path.join(sessionDir, 'creds.json'), 'utf-8');
      await supabase
        .from('whatsapp_sessions')
        .upsert([{
          id: sessionId,
          user_id: userId,
          session_data: JSON.parse(sessionData),
          status: 'connected'
        }], { onConflict: 'id' });
    }
    if (connection === 'close') {
      await supabase
        .from('whatsapp_sessions')
        .update({ status: 'disconnected' })
        .eq('id', sessionId);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sessions[sessionId] = sock;
  return sock;
}

module.exports = { createSession, sessions };