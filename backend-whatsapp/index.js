const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createSession, sessions } = require('./sessionManager');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// REST endpoint to start a WhatsApp session and get QR code
app.post('/api/start-session', async (req, res) => {
  const { userId, sessionId } = req.body;
  let qrCode = null;

  await createSession(
    userId,
    sessionId,
    (qr) => { qrCode = qr; },
    (sock) => { /* session ready */ }
  );

  // Wait a moment for QR to be generated
  setTimeout(() => {
    if (qrCode) {
      res.json({ qr: qrCode });
    } else {
      res.status(500).json({ error: 'QR not generated' });
    }
  }, 1000);
});

// REST endpoint to send a WhatsApp message
app.post('/api/send-message', async (req, res) => {
  const { sessionId, to, message } = req.body;
  const sock = sessions[sessionId];
  if (!sock) return res.status(404).json({ error: 'Session not found' });
  try {
    await sock.sendMessage(to, { text: message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WebSocket for real-time events (QR, messages, status)
wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    // Handle incoming messages from frontend if needed
  });
  // You can push QR codes, status, and messages to the client here
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend WhatsApp service running on port ${PORT}`);
});