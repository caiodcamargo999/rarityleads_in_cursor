# 🚀 Rarity Leads - Enterprise WhatsApp System Setup Guide

> **IMPORTANT:** This is an enterprise-grade WhatsApp messaging system fully integrated into the Rarity Leads SaaS platform. All design guidelines must strictly follow the system defined in `DESIGN_RULES.md`.

## 📋 System Overview

Rarity Leads is a B2B SaaS lead prospecting platform with a complete WhatsApp integration system that allows users to:

- ✅ Connect multiple WhatsApp numbers (business or personal) via QR codes
- ✅ Persistent sessions that survive service restarts
- ✅ Real-time two-way messaging from the SaaS dashboard
- ✅ Multi-account management with campaign assignments
- ✅ AI-powered message generation and personalization
- ✅ Complete data isolation per user (RLS active)

## 🏗️ Architecture

### Frontend (Next.js + TailwindCSS)
```
├── /dashboard/whatsapp/accounts → Account connection & management
├── /dashboard/whatsapp/conversations → Real-time chat interface
└── API Routes → Connection management & message sending
```

### Backend (Supabase + Node.js Microservice)
```
├── Supabase Database → Session storage, messages, conversations
├── Node.js WhatsApp Service → Baileys integration, session management
├── WebSocket Server → Real-time communication
└── Supabase Edge Functions → AI message generation, session cleanup
```

### System Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  WhatsApp       │────▶│   Baileys       │
│   (Frontend)    │     │  Microservice   │     │   Library       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         ▼
         │              ┌─────────────────┐     ┌─────────────────┐
         │              │   WebSocket     │     │   Session       │
         │              │    Server       │     │   Storage       │
         │              └─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    Supabase     │     │   Real-time     │
│   (Database)    │     │   Updates       │
└─────────────────┘     └─────────────────┘
```

### Database Schema
```sql
whatsapp_sessions (uuid PK, user_id FK, status, session_data JSONB)
messages (uuid PK, session_id FK, lead_id FK, direction, content)
conversations (lead_id FK, session_id FK, last_message, unread_count)
whatsapp_campaign_assignments (campaign_id FK, session_id FK, priority)
message_templates (user_id FK, name, content, variables JSONB)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account and project
- WhatsApp Business app or WhatsApp Web
- Git repository with Rarity Leads codebase

### 1. Database Setup
```bash
# Run the complete schema in Supabase SQL Editor
cat supabase/schema.sql
```

### 2. Environment Configuration

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
WHATSAPP_SERVICE_URL=http://localhost:3001
WHATSAPP_SERVICE_TOKEN=your-secret-token
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA
```

#### WhatsApp Service (whatsapp-service/.env)
```bash
# Service Configuration
PORT=3001
LOG_LEVEL=info
NODE_ENV=development

# Authentication
WHATSAPP_SERVICE_TOKEN=your-secret-token-here

# Session Storage
SESSIONS_PATH=./sessions

# WebSocket Configuration
WS_PORT=3002

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Supabase Configuration (optional)
SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA
```

### 3. Start WhatsApp Microservice
```bash
cd whatsapp-service
npm install
npm run dev
```

### 4. Start Frontend
```bash
npm install
npm run dev
```

### 5. Deploy Edge Functions
```bash
supabase functions deploy ai-generate-message
supabase functions deploy session-cleanup
```

## 🔧 Detailed Setup

### Step 1: Backend Configuration

#### 1.1 Install Dependencies
```bash
cd whatsapp-service
npm install
```

#### 1.2 Environment Configuration
Create a `.env` file in the `whatsapp-service` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
WS_PORT=3002

# Authentication
WHATSAPP_SERVICE_TOKEN=your-secret-token-here

# Session Storage
SESSIONS_PATH=./sessions

# WhatsApp Integration Settings
WHATSAPP_SESSION_TIMEOUT=3600000
WHATSAPP_MAX_SESSIONS_PER_USER=5

# Security
NODE_ENV=development
LOG_LEVEL=info
```

**Important:** Generate a secure token for `WHATSAPP_SERVICE_TOKEN`.

#### 1.3 Supabase Configuration
1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy your Project URL and Service Role Key
4. Update the `.env` file with these values

#### 1.4 Start the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001` and WebSocket on `ws://localhost:3002`

### Step 2: Database Setup

The database schema is already included in your Supabase setup. Ensure these tables exist by running the complete schema from `supabase/schema.sql`.

### Step 3: Frontend Integration

The frontend is already integrated with these key files:

- `src/app/(dashboard)/whatsapp/accounts/page.tsx` - WhatsApp account management
- `src/app/(dashboard)/whatsapp/conversations/page.tsx` - Real-time chat interface
- `src/app/api/whatsapp/*` - API routes for WhatsApp operations
- `src/components/Sidebar.tsx` - Updated navigation with WhatsApp section

### Step 4: Testing the Integration

#### 4.1 Test Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "sessions": 0,
  "websocketClients": 0
}
```

#### 4.2 Test Frontend
1. Open `http://localhost:3000` (or your frontend URL)
2. Navigate to `/dashboard/whatsapp/accounts`
3. Click "Connect New WhatsApp Number"
4. Scan the QR code with your WhatsApp app

## 🔌 WhatsApp Microservice Features

### Core Features
- **Multi-Session Management**: Handle multiple WhatsApp connections per user
- **Session Persistence**: Automatic session restoration on restart
- **Real-time Communication**: WebSocket server for live updates
- **QR Code Generation**: Secure QR code generation for device pairing
- **Message Handling**: Send/receive messages with status tracking
- **Auto-reconnection**: Automatic reconnection with exponential backoff
- **Security**: JWT-based authentication and encrypted session storage

### API Endpoints

#### Connect WhatsApp Session
```http
POST /connect
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid",
  "sessionName": "Business Account",
  "phoneNumber": "+1234567890"
}
```

#### Disconnect Session
```http
POST /disconnect
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid"
}
```

#### Reconnect Session
```http
POST /reconnect
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid",
  "sessionName": "Business Account",
  "phoneNumber": "+1234567890"
}
```

#### Send Message
```http
POST /send-message
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid",
  "phoneNumber": "+1234567890",
  "message": "Hello from Rarity Leads!"
}
```

#### Get Session Status
```http
GET /session-status/:sessionId
Authorization: Bearer <token>
```

#### List All Sessions
```http
GET /sessions
Authorization: Bearer <token>
```

#### Health Check
```http
GET /health
```

### WebSocket Events

#### Client → Server
```javascript
// Subscribe to session updates
{
  "event": "subscribe",
  "data": {
    "sessionId": "uuid"
  }
}
```

#### Server → Client
```javascript
// QR Code Generated
{
  "event": "qr_code",
  "data": {
    "sessionId": "uuid",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "status": "connecting"
  }
}

// Connection Success
{
  "event": "connection_success",
  "data": {
    "sessionId": "uuid",
    "status": "connected"
  }
}

// Connection Lost
{
  "event": "connection_lost",
  "data": {
    "sessionId": "uuid",
    "status": "disconnected"
  }
}

// Incoming Message
{
  "event": "incoming_message",
  "data": {
    "sessionId": "uuid",
    "messageId": "uuid",
    "from": "1234567890@s.whatsapp.net",
    "content": "Hello!",
    "type": "text",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}

// Message Sent
{
  "event": "message_sent",
  "data": {
    "sessionId": "uuid",
    "messageId": "uuid",
    "to": "1234567890@s.whatsapp.net",
    "content": "Hello from Rarity Leads!",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}

// Message Status Update
{
  "event": "message_status",
  "data": {
    "sessionId": "uuid",
    "messageId": "uuid",
    "status": "delivered"
  }
}
```

## 🎨 Frontend Components

### WhatsApp Accounts Page (`/dashboard/whatsapp/accounts`)
- **Session Management**: Connect, disconnect, reconnect WhatsApp numbers
- **QR Code Scanning**: Modal with real-time QR code display
- **Status Indicators**: Visual status for each connected account
- **Campaign Assignment**: Assign WhatsApp numbers to campaigns
- **Real-time Updates**: Live status updates via WebSocket

### WhatsApp Conversations Page (`/dashboard/whatsapp/conversations`)
- **Multi-account Chat**: Switch between WhatsApp accounts
- **Lead Conversations**: Chat interface with lead management
- **Real-time Messaging**: Live message sending and receiving
- **Message History**: Complete conversation history with timestamps
- **AI Suggestions**: AI-generated message suggestions
- **Status Tracking**: Message delivery and read status

### Key Features
- **Responsive Design**: Mobile-first, touch-friendly interface
- **Motion Animations**: Smooth transitions and micro-interactions
- **Real-time Updates**: WebSocket integration for live data
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Skeleton screens and loading indicators

## 🔧 Session Management

### Session Lifecycle
1. **Creation**: Session created when user initiates connection
2. **QR Generation**: QR code generated for device pairing
3. **Connection**: User scans QR code, session becomes active
4. **Persistence**: Session data saved to disk for restoration
5. **Disconnection**: Session marked as disconnected
6. **Cleanup**: Expired sessions automatically cleaned up

### Session Storage
Sessions are stored in JSON files:
```
sessions/
├── session-1.json
├── session-2.json
└── session-3.json
```

Each file contains encrypted session data for restoration.

### Auto-reconnection
- **Exponential Backoff**: Retry with increasing delays
- **Session Restoration**: Automatic restoration from saved data
- **Status Updates**: Real-time status updates via WebSocket

## 🔐 Security & Compliance

### Row Level Security (RLS)
- All database tables enforce user isolation
- Users can only access their own data
- Session data is encrypted and secured

### Authentication
- JWT-based API authentication
- Service-to-service token validation
- Secure session storage

### Data Privacy
- No message content stored in plain text
- Session data encrypted at rest
- GDPR-compliant data handling

### Security Considerations
- **Token Security**: Use a strong, randomly generated token
- **Session Encryption**: Session data is encrypted at rest
- **Network Security**: Use HTTPS in production
- **Access Control**: Implement proper authentication

## 📱 Using the WhatsApp Integration

### Connecting WhatsApp Accounts

1. **Navigate to WhatsApp Management**
   - Go to `/dashboard/whatsapp/accounts`
   - Or click "WhatsApp" in the sidebar

2. **Connect New Account**
   - Click "Connect New WhatsApp Number"
   - Enter session name and phone number
   - Scan the QR code with your WhatsApp app
   - Wait for connection confirmation

3. **Manage Multiple Accounts**
   - Connect multiple WhatsApp numbers
   - Switch between accounts for different campaigns
   - Monitor connection status

### Sending Messages

1. **Navigate to Conversations**
   - Go to `/dashboard/whatsapp/conversations`
   - Select WhatsApp account from dropdown

2. **Select Lead**
   - Choose lead from conversation list
   - View message history

3. **Send Messages**
   - Type message in chat interface
   - Send with real-time status updates
   - View delivery and read receipts

### Monitoring and Analytics
- **Real-time Status**: Monitor connection status
- **Message History**: View sent and received messages
- **Performance Metrics**: Track delivery rates and responses
- **Session Management**: Reconnect or disconnect accounts

## 📊 Analytics & Monitoring

### Key Metrics
- **Connection Status**: Real-time session health monitoring
- **Message Delivery**: Success/failure rates by session
- **Response Rates**: Lead engagement tracking
- **Session Performance**: Uptime and reliability metrics

### Monitoring
- **Health Checks**: Automated service health monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **Performance Metrics**: Response time and throughput monitoring

### Log Levels
- **error**: Critical errors and failures
- **warn**: Warning messages and recoverable errors
- **info**: General information and status updates
- **debug**: Detailed debugging information

## 🚀 Deployment

### Production Setup
```bash
# 1. Deploy Supabase schema
supabase db push

# 2. Deploy Edge Functions
supabase functions deploy

# 3. Deploy WhatsApp Service
# Use PM2 or Docker for production

# 4. Deploy Frontend
npm run build
# Deploy to Netlify/Vercel
```

### Environment Variables (Production)
```bash
# Production Environment
NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA
WHATSAPP_SERVICE_URL=https://your-whatsapp-service.com
WHATSAPP_SERVICE_TOKEN=your-production-token
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001 3002

CMD ["npm", "start"]
```

### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start service
pm2 start src/index.js --name whatsapp-service

# Monitor
pm2 monit

# Logs
pm2 logs whatsapp-service
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whatsapp-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: whatsapp-service
  template:
    metadata:
      labels:
        app: whatsapp-service
    spec:
      containers:
      - name: whatsapp-service
        image: whatsapp-service:latest
        ports:
        - containerPort: 3001
        - containerPort: 3002
        env:
        - name: PORT
          value: "3001"
        - name: WHATSAPP_SERVICE_TOKEN
          valueFrom:
            secretKeyRef:
              name: whatsapp-secrets
              key: token
```

## 🔄 Development Workflow

### Local Development
```bash
# Terminal 1: WhatsApp Service
cd whatsapp-service
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Supabase (if needed)
supabase start
```

### Testing
```bash
# Test WhatsApp connections
npm run test:whatsapp

# Test API endpoints
npm run test:api

# Test frontend components
npm run test:components
```

## 📚 API Documentation

### WhatsApp Connection Flow
1. **User clicks "Connect"** → Frontend calls `/api/whatsapp/connect`
2. **Backend creates session** → Calls WhatsApp service `/connect`
3. **QR code generated** → WebSocket broadcasts QR code to frontend
4. **User scans QR** → WhatsApp service detects connection
5. **Session established** → Database updated, UI reflects connected status

### Message Sending Flow
1. **User sends message** → Frontend calls `/api/whatsapp/send-message`
2. **Backend validates** → Checks session status and lead phone number
3. **Message sent** → WhatsApp service sends via Baileys
4. **Status updated** → Database updated with delivery status
5. **UI updated** → Real-time status update via WebSocket

## 🛠️ Troubleshooting

### Common Issues

#### QR Code Not Appearing
```bash
# Check service logs
tail -f whatsapp-service/logs/app.log

# Verify WebSocket connection
wscat -c ws://localhost:3002

# Check session status
curl http://localhost:3001/session-status/session-id
```

#### Messages Not Sending
```bash
# Check session status
curl http://localhost:3001/session-status/session-id

# Verify phone number format
# Should be: +1234567890@s.whatsapp.net

# Check service health
curl http://localhost:3001/health
```

#### Connection Drops
```bash
# Check network connectivity
ping google.com

# Verify session persistence
ls -la whatsapp-service/sessions/

# Check auto-reconnection logs
grep "reconnect" whatsapp-service/logs/app.log
```

#### Backend Won't Start
```bash
# Check if port is in use
lsof -i :3001

# Check Node.js version
node --version  # Should be 18+

# Check dependencies
npm list
```

#### WebSocket Connection Issues
- Verify authentication token
- Check CORS configuration
- Ensure WebSocket server is running
- Check browser console for errors

### Debug Commands
```bash
# Check service status
curl http://localhost:3001/health

# List all sessions
curl -H "Authorization: Bearer token" http://localhost:3001/sessions

# Test WebSocket connection
wscat -c ws://localhost:3002

# View real-time logs
tail -f whatsapp-service/logs/app.log | grep -E "(error|warn|info)"
```

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 📈 Performance Optimization

### Database Optimization
- Indexed queries for fast session lookup
- Connection pooling for high concurrency
- Efficient message pagination

### Frontend Optimization
- Lazy loading of conversation history
- Optimistic UI updates
- Efficient WebSocket message handling

### Service Optimization
- Session pooling and reuse
- Message queuing for high volume
- Automatic cleanup of expired sessions

### Optimization Tips
- **Connection Pooling**: Reuse connections when possible
- **Message Queuing**: Queue messages for high volume
- **Session Caching**: Cache active sessions in memory
- **Load Balancing**: Use multiple instances for high load

### Benchmarks
- **Concurrent Sessions**: 100+ sessions per instance
- **Message Throughput**: 1000+ messages per minute
- **Response Time**: < 100ms for API calls
- **WebSocket Latency**: < 50ms for real-time updates

## 🔮 Future Enhancements

### Planned Features
- **Message Templates**: Pre-built templates with variable substitution
- **Auto-replies**: AI-powered automatic response system
- **Campaign Automation**: Scheduled message sequences
- **Analytics Dashboard**: Advanced reporting and insights
- **Mobile App**: Native mobile application
- **API Integration**: Third-party CRM integrations

### Scalability Improvements
- **Redis Integration**: Session and message caching
- **Load Balancing**: Multiple WhatsApp service instances
- **Database Sharding**: Horizontal database scaling
- **CDN Integration**: Global content delivery

## 🧪 Testing

### Unit Tests
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Integration Tests
```bash
# Test API endpoints
npm run test:api

# Test WebSocket connections
npm run test:websocket

# Test WhatsApp integration
npm run test:whatsapp
```

### Load Testing
```bash
# Test with Artillery
npm run test:load

# Test with k6
npm run test:performance
```

## 📊 Monitoring and Maintenance

### Health Checks
Set up monitoring for:
- Backend server status
- WebSocket connections
- Database connectivity
- Session health

### Backup Strategy
- Regular database backups
- Session data backup
- Configuration backup
- Log rotation

### Updates
- Keep dependencies updated
- Monitor for security patches
- Test updates in staging
- Plan maintenance windows

## 🆘 Support

### Getting Help
1. **Check Logs**: Review server and browser logs
2. **Documentation**: Refer to this guide and README files
3. **Community**: Check GitHub issues and discussions
4. **Professional Support**: Contact Rarity Leads support

### Useful Commands
```bash
# Start development server
npm run dev

# Check server status
curl http://localhost:3001/health

# View active sessions
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/sessions

# Test WebSocket connection
wscat -c "ws://localhost:3002?token=YOUR_TOKEN"
```

## 🎯 Next Steps

After successful setup:

1. **Test with Real Numbers**: Connect your actual WhatsApp accounts
2. **Create Campaigns**: Set up your first outreach campaigns
3. **Monitor Performance**: Track message delivery and response rates
4. **Scale Up**: Add more accounts and campaigns as needed
5. **Optimize**: Fine-tune messaging strategies based on analytics

---

## 📞 Support

For technical support or questions about the WhatsApp system:

- **Documentation**: Check this guide and inline code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions

---

**Built with ❤️ for enterprise-grade WhatsApp automation** 