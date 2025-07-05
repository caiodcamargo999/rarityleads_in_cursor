// WhatsApp Management JavaScript
class WhatsAppManager {
    constructor() {
        this.ws = null;
        this.sessions = [];
        this.currentSession = null;
        this.isConnecting = false;
        
        this.init();
    }

    async init() {
        // Check authentication
        await this.checkAuth();
        
        // Initialize WebSocket connection
        this.initWebSocket();
        
        // Load initial data
        this.loadSessions();
        this.loadMessages();
        this.loadLeads();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    async checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = 'auth.html';
            return;
        }
        this.user = session.user;
    }

    initWebSocket() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const wsUrl = `ws://localhost:3001?token=${session.access_token}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.updateConnectionStatus('connected');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.updateConnectionStatus('disconnected');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.initWebSocket(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.updateConnectionStatus('error');
        };
    }

    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'sessions_update':
                this.sessions = data.data;
                this.renderSessions();
                break;
                
            case 'qr_code':
                this.showQRCode(data.qr, data.sessionId);
                break;
                
            case 'session_ready':
                this.handleSessionReady(data.sessionId, data.phoneNumber);
                break;
                
            case 'message_received':
                this.handleMessageReceived(data.sessionId, data.message);
                break;
                
            case 'status_update':
                this.handleStatusUpdate(data.sessionId, data.status, data.phoneNumber);
                break;
                
            case 'message_sent':
                this.handleMessageSent(data.messageId);
                break;
                
            case 'session_disconnected':
                this.handleSessionDisconnected(data.sessionId);
                break;
                
            case 'error':
                this.showError(data.message);
                break;
        }
    }

    async loadSessions() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('http://localhost:3001/api/sessions', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.sessions = data.sessions;
                this.renderSessions();
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
            this.showError('Failed to load WhatsApp sessions');
        }
    }

    renderSessions() {
        const container = document.getElementById('whatsapp-sessions');
        
        if (this.sessions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fab fa-whatsapp"></i>
                    <h3>No WhatsApp accounts connected</h3>
                    <p>Connect your first WhatsApp account to start messaging leads</p>
                    <button class="btn btn-primary" onclick="whatsappManager.connectWhatsApp()">
                        <i class="fab fa-whatsapp"></i>
                        Connect WhatsApp
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.sessions.map(session => `
            <div class="session-card ${session.status}" data-session-id="${session.id}">
                <div class="session-header">
                    <div class="session-info">
                        <i class="fab fa-whatsapp"></i>
                        <div class="session-details">
                            <h4>${session.phone_number || 'Unknown Number'}</h4>
                            <span class="session-status ${session.status}">
                                ${this.getStatusText(session.status)}
                            </span>
                        </div>
                    </div>
                    <div class="session-actions">
                        ${session.status === 'connected' ? `
                            <button class="btn btn-sm btn-secondary" onclick="whatsappManager.selectSession('${session.id}')">
                                <i class="fas fa-check"></i>
                                Use
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-danger" onclick="whatsappManager.disconnectSession('${session.id}')">
                            <i class="fas fa-times"></i>
                            Disconnect
                        </button>
                    </div>
                </div>
                <div class="session-footer">
                    <span class="session-date">
                        Connected: ${new Date(session.created_at).toLocaleDateString()}
                    </span>
                    ${session.status === 'disconnected' || session.status === 'logged_out' ? `
                        <button class="btn btn-sm btn-primary" onclick="whatsappManager.reconnectSession('${session.id}')">
                            <i class="fas fa-redo"></i>
                            Reconnect
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'connecting': 'Connecting...',
            'connected': 'Connected',
            'reconnecting': 'Reconnecting...',
            'disconnected': 'Disconnected',
            'logged_out': 'Logged Out',
            'error': 'Error'
        };
        return statusMap[status] || status;
    }

    async connectWhatsApp() {
        if (this.isConnecting) return;
        
        this.isConnecting = true;
        this.showQRModal();
        
        try {
            this.ws.send(JSON.stringify({
                type: 'create_session'
            }));
        } catch (error) {
            console.error('Error creating session:', error);
            this.showError('Failed to create WhatsApp session');
            this.isConnecting = false;
        }
    }

    showQRModal() {
        document.getElementById('qr-modal').classList.add('active');
        document.getElementById('qr-code-container').innerHTML = `
            <div class="qr-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Generating QR code...</span>
            </div>
        `;
    }

    showQRCode(qrData, sessionId) {
        const container = document.getElementById('qr-code-container');
        container.innerHTML = `
            <img src="${qrData}" alt="WhatsApp QR Code" class="qr-code">
        `;
        
        document.getElementById('qr-status').innerHTML = `
            <span class="status-text">Scan the QR code with your WhatsApp app</span>
        `;
    }

    handleSessionReady(sessionId, phoneNumber) {
        this.isConnecting = false;
        this.closeQRModal();
        
        // Update session in list
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.status = 'connected';
            session.phone_number = phoneNumber;
            this.renderSessions();
        }
        
        this.showSuccess(`WhatsApp connected successfully as ${phoneNumber}`);
    }

    handleStatusUpdate(sessionId, status, phoneNumber) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.status = status;
            if (phoneNumber) session.phone_number = phoneNumber;
            this.renderSessions();
        }
    }

    async disconnectSession(sessionId) {
        if (!confirm('Are you sure you want to disconnect this WhatsApp account?')) {
            return;
        }

        try {
            this.ws.send(JSON.stringify({
                type: 'disconnect_session',
                sessionId: sessionId
            }));
        } catch (error) {
            console.error('Error disconnecting session:', error);
            this.showError('Failed to disconnect session');
        }
    }

    async reconnectSession(sessionId) {
        this.connectWhatsApp();
    }

    selectSession(sessionId) {
        this.currentSession = sessionId;
        this.updateSelectedSession();
    }

    updateSelectedSession() {
        // Remove previous selection
        document.querySelectorAll('.session-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to current session
        if (this.currentSession) {
            const card = document.querySelector(`[data-session-id="${this.currentSession}"]`);
            if (card) {
                card.classList.add('selected');
            }
        }
    }

    async loadMessages() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('http://localhost:3001/api/messages', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.renderMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    renderMessages(messages) {
        const container = document.getElementById('messages-container');
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h3>No messages yet</h3>
                    <p>Start messaging your leads to see conversations here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = messages.map(message => `
            <div class="message-card ${message.direction}">
                <div class="message-header">
                    <span class="message-from">${message.content.from || message.content.to}</span>
                    <span class="message-time">${new Date(message.timestamp).toLocaleString()}</span>
                </div>
                <div class="message-content">
                    ${message.content.content?.text || 'Message content'}
                </div>
                <div class="message-status">
                    <span class="status ${message.status}">${message.status}</span>
                </div>
            </div>
        `).join('');
    }

    async loadLeads() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('http://localhost:3001/api/leads', {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.leads = data.leads;
            }
        } catch (error) {
            console.error('Error loading leads:', error);
        }
    }

    handleMessageReceived(sessionId, messageData) {
        // Add message to UI
        this.loadMessages();
        
        // Show notification
        this.showNotification(`New message from ${messageData.from}`);
    }

    handleMessageSent(messageId) {
        this.showSuccess('Message sent successfully');
        this.loadMessages();
    }

    handleSessionDisconnected(sessionId) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (session) {
            session.status = 'disconnected';
            this.renderSessions();
        }
        
        this.showInfo('WhatsApp session disconnected');
    }

    async sendMessage(to, message) {
        if (!this.currentSession) {
            this.showError('Please select a WhatsApp account first');
            return;
        }

        try {
            this.ws.send(JSON.stringify({
                type: 'send_message',
                sessionId: this.currentSession,
                to: to,
                message: message
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            this.showError('Failed to send message');
        }
    }

    setupEventListeners() {
        // Connect WhatsApp button
        document.getElementById('connect-whatsapp-btn').addEventListener('click', () => {
            this.connectWhatsApp();
        });

        // Add lead form
        document.getElementById('add-lead-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addLead();
        });

        // Bulk message form
        document.getElementById('bulk-message-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.sendBulkMessages();
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'auth.html';
        });
    }

    async addLead() {
        const form = document.getElementById('add-lead-form');
        const formData = new FormData(form);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch('http://localhost:3001/api/leads', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    company: formData.get('company'),
                    notes: formData.get('notes')
                })
            });

            if (response.ok) {
                this.showSuccess('Lead added successfully');
                this.closeAddLeadModal();
                form.reset();
                this.loadLeads();
            } else {
                this.showError('Failed to add lead');
            }
        } catch (error) {
            console.error('Error adding lead:', error);
            this.showError('Failed to add lead');
        }
    }

    async sendBulkMessages() {
        const form = document.getElementById('bulk-message-form');
        const formData = new FormData(form);
        
        const sessionId = formData.get('sessionId');
        const message = formData.get('message');
        const selectedLeads = Array.from(document.querySelectorAll('#leads-selector input:checked')).map(input => input.value);
        
        if (!sessionId || !message || selectedLeads.length === 0) {
            this.showError('Please fill in all fields and select at least one lead');
            return;
        }

        try {
            for (const leadId of selectedLeads) {
                const lead = this.leads.find(l => l.id === leadId);
                if (lead && lead.phone) {
                    await this.sendMessage(lead.phone, message);
                    // Add delay between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            this.showSuccess(`Sent messages to ${selectedLeads.length} leads`);
            this.closeBulkMessageModal();
        } catch (error) {
            console.error('Error sending bulk messages:', error);
            this.showError('Failed to send bulk messages');
        }
    }

    // Modal functions
    closeQRModal() {
        document.getElementById('qr-modal').classList.remove('active');
        this.isConnecting = false;
    }

    openAddLeadModal() {
        document.getElementById('add-lead-modal').classList.add('active');
    }

    closeAddLeadModal() {
        document.getElementById('add-lead-modal').classList.remove('active');
    }

    openBulkMessageModal() {
        document.getElementById('bulk-message-modal').classList.add('active');
        this.populateBulkMessageForm();
    }

    closeBulkMessageModal() {
        document.getElementById('bulk-message-modal').classList.remove('active');
    }

    populateBulkMessageForm() {
        // Populate session selector
        const sessionSelect = document.getElementById('bulk-session');
        sessionSelect.innerHTML = '<option value="">Select WhatsApp account</option>';
        
        this.sessions.filter(s => s.status === 'connected').forEach(session => {
            sessionSelect.innerHTML += `
                <option value="${session.id}">${session.phone_number}</option>
            `;
        });

        // Populate leads selector
        const leadsSelector = document.getElementById('leads-selector');
        leadsSelector.innerHTML = this.leads.map(lead => `
            <label class="lead-checkbox">
                <input type="checkbox" value="${lead.id}">
                <span>${lead.name} (${lead.phone})</span>
            </label>
        `).join('');
    }

    // Utility functions
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status ${status}`;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions for modal controls
function closeQRModal() {
    whatsappManager.closeQRModal();
}

function openAddLeadModal() {
    whatsappManager.openAddLeadModal();
}

function closeAddLeadModal() {
    whatsappManager.closeAddLeadModal();
}

function openBulkMessageModal() {
    whatsappManager.openBulkMessageModal();
}

function closeBulkMessageModal() {
    whatsappManager.closeBulkMessageModal();
}

// Initialize WhatsApp Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.whatsappManager = new WhatsAppManager();
}); 