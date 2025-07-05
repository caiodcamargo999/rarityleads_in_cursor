// Configuration file for WhatsApp Integration Backend
// Copy this file to config.js and fill in your actual values

module.exports = {
  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL || 'your_supabase_project_url',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || 'your_supabase_service_role_key'
  },

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Server Configuration
  port: process.env.PORT || 3001,

  // Session Encryption (generate a secure 32-character key)
  sessionEncryptionKey: process.env.SESSION_ENCRYPTION_KEY || 'your-secret-key-32-chars-long!!',

  // WhatsApp Integration Settings
  whatsapp: {
    sessionTimeout: parseInt(process.env.WHATSAPP_SESSION_TIMEOUT) || 3600000, // 1 hour
    maxSessionsPerUser: parseInt(process.env.WHATSAPP_MAX_SESSIONS_PER_USER) || 5
  },

  // Security
  nodeEnv: process.env.NODE_ENV || 'development'
}; 