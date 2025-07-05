#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting WhatsApp Integration Server...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  No .env file found. Creating from example...');
    
    const envExample = `# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

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
`;
    
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Created .env file. Please update it with your actual values.\n');
    console.log('📝 Required environment variables:');
    console.log('   - SUPABASE_URL: Your Supabase project URL');
    console.log('   - SUPABASE_SERVICE_KEY: Your Supabase service role key');
    console.log('   - SESSION_ENCRYPTION_KEY: A secure 32-character encryption key\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    
    const install = spawn('npm', ['install'], {
        stdio: 'inherit',
        cwd: __dirname
    });
    
    install.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Dependencies installed successfully.\n');
            startServer();
        } else {
            console.error('❌ Failed to install dependencies.');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🔧 Starting server...\n');
    
    const server = spawn('node', ['index.js'], {
        stdio: 'inherit',
        cwd: __dirname,
        env: {
            ...process.env,
            NODE_ENV: process.env.NODE_ENV || 'development'
        }
    });
    
    server.on('close', (code) => {
        if (code !== 0) {
            console.error(`\n❌ Server exited with code ${code}`);
            process.exit(code);
        }
    });
    
    server.on('error', (error) => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down server...');
        server.kill('SIGTERM');
    });
} 