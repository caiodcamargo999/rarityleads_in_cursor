# WhatsApp Integration Setup Guide

This guide will walk you through setting up the complete WhatsApp integration system for Rarity Leads, including the backend server, frontend interface, and database configuration.

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend-whatsapp

# Run the setup script (installs dependencies and creates .env)
npm run setup

# Edit the .env file with your actual values
# Then start the server
npm start
```

### 2. Frontend Setup

The frontend is already integrated into your existing Rarity Leads application. Simply navigate to the WhatsApp Management page:

- Go to `whatsapp-management.html` in your browser
- Or click "Manage WhatsApp" from the main WhatsApp page

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account and project
- WhatsApp Business app or WhatsApp Web
- Git repository with Rarity Leads codebase

## 🔧 Detailed Setup

### Step 1: Backend Configuration

#### 1.1 Install Dependencies

```bash
cd backend-whatsapp
npm install
```

#### 1.2 Environment Configuration

Create a `.env` file in the `backend-whatsapp` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001

# Session Encryption (generate a secure 32-character key)
SESSION_ENCRYPTION_KEY=your-secret-key-32-chars-long!!

# WhatsApp Integration Settings
WHATSAPP_SESSION_TIMEOUT=3600000
WHATSAPP_MAX_SESSIONS_PER_USER=5

# Security
NODE_ENV=development
```

**Important:** Generate a secure 32-character encryption key for `SESSION_ENCRYPTION_KEY`.

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

The server will start on `http://localhost:3001`

### Step 2: Database Setup

The database schema is already included in your Supabase setup. Ensure these tables exist:

#### whatsapp_sessions
```sql
CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  phone_number text,
  session_data jsonb,
  status text DEFAULT 'inactive',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

#### messages
```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users NOT NULL,
  lead_id uuid REFERENCES public.leads,
  whatsapp_session_id uuid REFERENCES public.whatsapp_sessions,
  direction text NOT NULL,
  content jsonb NOT NULL,
  status text DEFAULT 'delivered',
  timestamp timestamp with time zone DEFAULT now()
);
```

### Step 3: Frontend Integration

The frontend is already integrated. The key files are:

- `whatsapp-management.html` - Main management interface
- `whatsapp-management.js` - JavaScript functionality
- `whatsapp-management.css` - Styling

### Step 4: Testing the Integration

#### 4.1 Test Backend Health

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "activeSessions": 0
}
```

#### 4.2 Test Frontend

1. Open `http://localhost:3000` (or your frontend URL)
2. Navigate to WhatsApp Management
3. Click "Connect WhatsApp"
4. Scan the QR code with your WhatsApp app

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique encryption keys
- Rotate keys regularly in production

### Session Security
- Sessions are encrypted before storage
- Each user can only access their own sessions
- Sessions are automatically cleaned up on logout

### API Security
- All endpoints require authentication
- Rate limiting is enabled (100 requests per 15 minutes)
- CORS is configured for specific origins

## 📱 Using the WhatsApp Integration

### Connecting WhatsApp Accounts

1. **Navigate to WhatsApp Management**
   - Go to `whatsapp-management.html`
   - Or click "Manage WhatsApp" from the main WhatsApp page

2. **Connect New Account**
   - Click "Connect WhatsApp"
   - Scan the QR code with your WhatsApp app
   - Wait for connection confirmation

3. **Manage Multiple Accounts**
   - Connect multiple WhatsApp numbers
   - Switch between accounts for different campaigns
   - Monitor connection status

### Sending Messages

1. **Select WhatsApp Account**
   - Choose which account to use for messaging
   - Verify the account is connected

2. **Send Individual Messages**
   - Use the messaging interface
   - Select recipient and compose message
   - Send with real-time status updates

3. **Bulk Messaging**
   - Create campaigns for multiple leads
   - Select target audience
   - Send personalized messages at scale

### Monitoring and Analytics

- **Real-time Status**: Monitor connection status
- **Message History**: View sent and received messages
- **Performance Metrics**: Track delivery rates and responses
- **Session Management**: Reconnect or disconnect accounts

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port is in use
lsof -i :3001

# Check Node.js version
node --version  # Should be 18+

# Check dependencies
npm list
```

#### QR Code Not Generating
- Ensure WhatsApp app is up to date
- Check internet connection
- Verify backend is running
- Check browser console for errors

#### Messages Not Sending
- Verify WhatsApp account is connected
- Check phone number format (include country code)
- Ensure session is active
- Check rate limiting

#### WebSocket Connection Issues
- Verify authentication token
- Check CORS configuration
- Ensure WebSocket server is running
- Check browser console for errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=whatsapp:*
```

### Logs

Check server logs for detailed error information:
```bash
# View real-time logs
tail -f backend-whatsapp/logs/app.log

# Check for errors
grep ERROR backend-whatsapp/logs/app.log
```

## 🔄 Production Deployment

### Backend Deployment

1. **Environment Setup**
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://your-domain.com
   SESSION_ENCRYPTION_KEY=your-production-key
   ```

2. **Process Management**
   ```bash
   # Using PM2
   npm install -g pm2
   pm2 start backend-whatsapp/index.js --name whatsapp-backend
   pm2 startup
   pm2 save
   ```

3. **SSL/TLS Setup**
   - Configure SSL certificates
   - Update WebSocket URL to `wss://`
   - Update CORS origins

### Frontend Deployment

1. **Update Configuration**
   - Update WebSocket URL in `whatsapp-management.js`
   - Configure API endpoints
   - Set production environment

2. **Build and Deploy**
   ```bash
   # Build for production
   npm run build

   # Deploy to your hosting platform
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
curl http://localhost:3001/api/health

# View active sessions
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/sessions

# Test WebSocket connection
wscat -c "ws://localhost:3001?token=YOUR_TOKEN"
```

## 🎯 Next Steps

After successful setup:

1. **Test with Real Numbers**: Connect your actual WhatsApp accounts
2. **Create Campaigns**: Set up your first outreach campaigns
3. **Monitor Performance**: Track message delivery and response rates
4. **Scale Up**: Add more accounts and campaigns as needed
5. **Optimize**: Fine-tune messaging strategies based on analytics

---

**Need help?** Check the troubleshooting section or contact support with specific error messages and logs. 