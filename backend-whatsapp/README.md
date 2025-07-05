# WhatsApp Integration Backend

A production-ready WhatsApp integration backend for Rarity Leads, supporting multi-account sessions, QR code authentication, and real-time messaging.

## Features

- 🔐 **Secure Multi-Account Sessions**: Support multiple WhatsApp accounts per user
- 📱 **QR Code Authentication**: Easy connection via WhatsApp Web/Business app
- 🔄 **Persistent Sessions**: Auto-login without rescanning QR codes
- 💬 **Real-time Messaging**: WebSocket-based bi-directional messaging
- 🛡️ **Security**: Encrypted session storage, authentication, rate limiting
- 📊 **Database Integration**: Full Supabase integration for data persistence
- 🚀 **Production Ready**: Error handling, logging, graceful shutdown

## Prerequisites

- Node.js 18+ 
- Supabase account and project
- WhatsApp Business app or WhatsApp Web

## Installation

1. **Install dependencies:**
   ```bash
   cd backend-whatsapp
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp config.example.js config.js
   # Edit config.js with your actual values
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   SESSION_ENCRYPTION_KEY=your-secret-key-32-chars-long!!
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints

### Authentication
All endpoints require a valid Supabase JWT token in the Authorization header:
```
Authorization: Bearer <supabase_jwt_token>
```

### REST API

#### Health Check
```http
GET /api/health
```

#### Sessions Management
```http
GET /api/sessions                    # Get user's WhatsApp sessions
POST /api/sessions                   # Create new WhatsApp session
GET /api/sessions/:id/status         # Get session status
DELETE /api/sessions/:id             # Disconnect session
```

#### Messaging
```http
POST /api/sessions/:id/messages      # Send message
GET /api/sessions/:id/messages       # Get session messages
```

#### Leads Management
```http
GET /api/leads                       # Get user's leads
POST /api/leads                      # Create new lead
```

### WebSocket API

Connect to WebSocket with authentication:
```javascript
const ws = new WebSocket('ws://localhost:3001?token=your_jwt_token');
```

#### WebSocket Events

**From Client:**
```javascript
// Create new session
ws.send(JSON.stringify({
  type: 'create_session'
}));

// Send message
ws.send(JSON.stringify({
  type: 'send_message',
  sessionId: 'session_id',
  to: '5511999999999',
  message: 'Hello!'
}));

// Disconnect session
ws.send(JSON.stringify({
  type: 'disconnect_session',
  sessionId: 'session_id'
}));
```

**From Server:**
```javascript
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'qr_code':
      // Display QR code for scanning
      console.log('QR Code:', data.qr);
      break;
      
    case 'session_ready':
      // Session connected successfully
      console.log('Connected as:', data.phoneNumber);
      break;
      
    case 'message_received':
      // New message received
      console.log('Message from:', data.message.from);
      break;
      
    case 'status_update':
      // Session status changed
      console.log('Status:', data.status);
      break;
  }
};
```

## Database Schema

The backend uses the following Supabase tables:

### whatsapp_sessions
- `id` (UUID): Session identifier
- `user_id` (UUID): User who owns the session
- `phone_number` (TEXT): Connected WhatsApp number
- `session_data` (JSONB): Encrypted session data
- `status` (TEXT): Session status (connecting, connected, disconnected, etc.)
- `created_at` (TIMESTAMP): Session creation time
- `updated_at` (TIMESTAMP): Last update time

### messages
- `id` (UUID): Message identifier
- `user_id` (UUID): User who owns the message
- `whatsapp_session_id` (UUID): Session that sent/received the message
- `direction` (TEXT): 'sent' or 'received'
- `content` (JSONB): Message content and metadata
- `status` (TEXT): Message status
- `timestamp` (TIMESTAMP): Message timestamp

## Security Features

- **Authentication**: All endpoints require valid Supabase JWT
- **Session Encryption**: Session data encrypted with AES-256-CBC
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured for specific frontend origins
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Comprehensive error handling and logging

## Session Management

### Session States
- `connecting`: QR code generated, waiting for scan
- `connected`: Successfully connected and ready
- `reconnecting`: Connection lost, attempting to reconnect
- `disconnected`: Manually disconnected
- `logged_out`: Logged out from WhatsApp
- `error`: Error occurred during connection

### Session Persistence
Sessions are automatically saved to Supabase and restored on server restart. Users don't need to rescan QR codes unless they log out from WhatsApp.

## Usage Examples

### Frontend Integration

```javascript
// Connect to WebSocket
const ws = new WebSocket(`ws://localhost:3001?token=${supabaseToken}`);

// Create new WhatsApp session
ws.send(JSON.stringify({ type: 'create_session' }));

// Handle QR code
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'qr_code') {
    // Display QR code image
    document.getElementById('qr-code').src = data.qr;
  }
  
  if (data.type === 'session_ready') {
    // Session connected
    console.log(`Connected as ${data.phoneNumber}`);
  }
};
```

### REST API Usage

```javascript
// Get user sessions
const response = await fetch('/api/sessions', {
  headers: {
    'Authorization': `Bearer ${supabaseToken}`
  }
});
const { sessions } = await response.json();

// Send message
const response = await fetch(`/api/sessions/${sessionId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '5511999999999',
    message: 'Hello from Rarity Leads!'
  })
});
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `SESSION_ENCRYPTION_KEY`
- Configure proper `FRONTEND_URL`
- Set up SSL/TLS for secure WebSocket connections

## Troubleshooting

### Common Issues

1. **QR Code Not Generating**
   - Check if Baileys is properly installed
   - Verify session directory permissions
   - Check server logs for errors

2. **Session Not Connecting**
   - Ensure WhatsApp app is up to date
   - Check internet connection
   - Verify phone number format

3. **Messages Not Sending**
   - Check session status
   - Verify phone number format (should include country code)
   - Check rate limiting

4. **WebSocket Connection Issues**
   - Verify authentication token
   - Check CORS configuration
   - Ensure WebSocket server is running

### Logs
The server provides detailed logging for debugging:
- Connection events
- Message events
- Error details
- Session status changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 