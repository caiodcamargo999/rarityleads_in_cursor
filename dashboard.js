// Dashboard JavaScript - Phase 2 Enhanced Functionality
class Dashboard {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.charts = {};
        this.metrics = {};
        this.realTimeSubscription = null;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Dashboard: Initializing Phase 2...');
            
            // Initialize Supabase
            this.supabase = window.AppUtils?.initSupabase();
            if (!this.supabase) {
                throw new Error('Supabase not available');
            }

            // Get current user
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;

            this.initializeElements();
            this.setupEventListeners();
            this.initializeCharts();
            this.setupAnimations();
            this.loadUserData();
            this.updateWelcomeMessage();
            this.loadMetrics();
            this.startRealTimeUpdates();
            
            console.log('✅ Dashboard: Phase 2 initialization complete');
        } catch (error) {
            console.error('❌ Dashboard: Initialization failed:', error);
            this.showNotification('Failed to initialize dashboard', 'error');
        }
    }

    initializeElements() {
        // Sidebar elements
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebar-overlay');
        this.menuBtn = document.getElementById('menu-toggle-btn');
        this.sidebarClose = document.getElementById('sidebar-close');
        
        // Time filters
        this.timeFilters = document.querySelectorAll('.time-filter');
        
        // Charts
        this.leadsChart = document.getElementById('leadsChart');
        this.channelsChart = document.getElementById('channelsChart');
        
        // User elements
        this.userName = document.getElementById('user-name');
        this.userEmail = document.getElementById('user-email');
        this.welcomeSubtitle = document.getElementById('welcome-subtitle');
        
        // Metrics
        this.metricElements = {
            leadsCount: document.getElementById('leads-count'),
            conversionRate: document.getElementById('conversion-rate'),
            activeCampaigns: document.getElementById('active-campaigns'),
            monthlyRevenue: document.getElementById('monthly-revenue')
        };
        
        // Action buttons
        this.actionButtons = document.querySelectorAll('.action-btn');
        this.chartActionButtons = document.querySelectorAll('.btn[data-chart]');
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    setupEventListeners() {
        // Sidebar navigation
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', () => this.toggleSidebar());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }
        
        if (this.sidebarClose) {
            this.sidebarClose.addEventListener('click', () => this.closeSidebar());
        }

        // Time filters
        this.timeFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handleTimeFilter(e));
        });

        // Action buttons
        this.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleActionButton(e));
        });
        
        // Chart action buttons
        this.chartActionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleChartAction(e));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await this.handleLogout();
            });
        }

        // User settings button
        const settingsBtn = document.querySelector('.user-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.handleSettings());
        }
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        if (this.overlay) {
            this.overlay.classList.toggle('active');
        }
        document.body.style.overflow = this.sidebar.classList.contains('open') ? 'hidden' : '';
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    handleTimeFilter(e) {
        const clickedFilter = e.target;
        const period = clickedFilter.dataset.period;
        
        // Remove active class from all filters
        this.timeFilters.forEach(filter => filter.classList.remove('active'));
        
        // Add active class to clicked filter
        clickedFilter.classList.add('active');
        
        // Update chart data based on period
        this.updateChartData(period);
    }

    async updateChartData(period) {
        try {
            // Show loading state
            const chartContainers = document.querySelectorAll('[style*="height: 300px"]');
            chartContainers.forEach(container => container.classList.add('loading'));
            
            // Fetch new data based on period
            const data = await this.fetchChartData(period);
            
            // Update charts
            this.updateLeadsChart(data.leads);
            this.updateChannelsChart(data.channels);
            
            // Remove loading state
            setTimeout(() => {
                chartContainers.forEach(container => container.classList.remove('loading'));
            }, 500);
            
        } catch (error) {
            console.error('❌ Dashboard: Failed to update chart data:', error);
            this.showNotification('Failed to update charts', 'error');
        }
    }

    async fetchChartData(period) {
        // Simulate API call - replace with actual Supabase queries
        const mockData = {
            leads: {
                labels: this.getLabelsForPeriod(period),
                data: this.generateMockData(period, 50, 100)
            },
            channels: {
                labels: ['WhatsApp', 'LinkedIn', 'Instagram', 'Facebook', 'X'],
                data: [35, 25, 20, 15, 5]
            }
        };
        
        return mockData;
    }

    getLabelsForPeriod(period) {
        const now = new Date();
        const labels = [];
        
        switch (period) {
            case '7d':
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                }
                break;
            case '30d':
                for (let i = 29; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    labels.push(date.getDate().toString());
                }
                break;
            case '90d':
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - (i * 7));
                    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                }
                break;
        }
        
        return labels;
    }

    generateMockData(period, min, max) {
        const length = period === '7d' ? 7 : period === '30d' ? 30 : 12;
        return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }

    initializeCharts() {
        if (this.leadsChart) {
            this.createLeadsChart();
        }
        
        if (this.channelsChart) {
            this.createChannelsChart();
        }
    }

    createLeadsChart() {
        const ctx = this.leadsChart.getContext('2d');
        
        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Leads Generated',
                data: [0, 0, 0, 0, 0, 0, 0],
                borderColor: '#e0e0e0',
                backgroundColor: 'rgba(224, 224, 224, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#e0e0e0',
                pointBorderColor: '#18181c',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(24, 24, 28, 0.95)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#b0b0b0',
                        borderColor: '#232336',
                        borderWidth: 1,
                        cornerRadius: 6,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `${context.parsed.y} leads`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(35, 35, 54, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b0b0',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(35, 35, 54, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#b0b0b0',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };

        this.charts.leads = new Chart(ctx, config);
    }

    createChannelsChart() {
        const ctx = this.channelsChart.getContext('2d');
        
        const data = {
            labels: ['WhatsApp', 'LinkedIn', 'Instagram', 'Facebook', 'X'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#25D366',
                    '#0077B5',
                    '#E4405F',
                    '#1877F2',
                    '#000000'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#b0b0b0',
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(24, 24, 28, 0.95)',
                        titleColor: '#e0e0e0',
                        bodyColor: '#b0b0b0',
                        borderColor: '#232336',
                        borderWidth: 1,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.channels = new Chart(ctx, config);
    }



    updateLeadsChart(data) {
        if (this.charts.leads) {
            this.charts.leads.data.labels = data.labels;
            this.charts.leads.data.datasets[0].data = data.data;
            this.charts.leads.update('active');
        }
    }

    updateChannelsChart(data) {
        if (this.charts.channels) {
            this.charts.channels.data.labels = data.labels;
            this.charts.channels.data.datasets[0].data = data.data;
            this.charts.channels.update('active');
        }
    }



    setupAnimations() {
        // Add entrance animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe metric cards
        document.querySelectorAll('.metric-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Observe chart cards
        document.querySelectorAll('.chart-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
            observer.observe(card);
        });
    }

    async loadUserData() {
        try {
            if (!this.currentUser) return;

            // Load user profile from Supabase
            const { data: profile, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                console.warn('⚠️ Dashboard: No profile found, using default data');
                this.updateUserDisplay(this.currentUser.email, this.currentUser.email);
            } else {
                this.updateUserDisplay(profile.full_name || 'User', this.currentUser.email);
            }

        } catch (error) {
            console.error('❌ Dashboard: Failed to load user data:', error);
            this.updateUserDisplay('User', this.currentUser?.email || 'user@example.com');
        }
    }

    updateUserDisplay(name, email) {
        if (this.userName) {
            this.userName.textContent = name;
        }
        if (this.userEmail) {
            this.userEmail.textContent = email;
        }
    }

    updateWelcomeMessage(email = null) {
        if (!this.welcomeSubtitle) return;

        const userEmail = email || this.currentUser?.email || 'there';
        const hour = new Date().getHours();
        let greeting = 'Good morning';

        if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17) {
            greeting = 'Good evening';
        }

        this.welcomeSubtitle.textContent = `${greeting}! Welcome back to your dashboard.`;
    }

    async loadMetrics() {
        try {
            // Load metrics from Supabase
            const metrics = await this.fetchMetrics();
            this.updateMetricsDisplay(metrics);
        } catch (error) {
            console.error('❌ Dashboard: Failed to load metrics:', error);
            // Use zero data as fallback
            this.updateMetricsDisplay({
                leadsCount: 0,
                conversionRate: 0,
                activeCampaigns: 0,
                monthlyRevenue: 0
            });
        }
    }

    async fetchMetrics() {
        // Simulate API call - replace with actual Supabase queries
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    leadsCount: 0,
                    conversionRate: 0,
                    activeCampaigns: 0,
                    monthlyRevenue: 0
                });
            }, 1000);
        });
    }

    updateMetricsDisplay(metrics) {
        // Animate metric values
        Object.keys(metrics).forEach(key => {
            const element = this.metricElements[key];
            if (element) {
                const value = metrics[key];
                this.animateNumber(element, 0, value, key === 'monthlyRevenue' ? '$' : '', key === 'conversionRate' ? '%' : '');
            }
        });
    }

    animateNumber(element, start, end, prefix = '', suffix = '') {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = `${prefix}${this.formatNumber(current)}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    startRealTimeUpdates() {
        // Set up real-time subscriptions for metrics updates
        if (this.supabase) {
            this.realTimeSubscription = this.supabase
                .channel('dashboard-metrics')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'leads'
                }, (payload) => {
                    console.log('🔄 Dashboard: Real-time update received:', payload);
                    this.handleRealTimeUpdate(payload);
                })
                .subscribe();
        }
    }

    handleRealTimeUpdate(payload) {
        // Handle real-time updates
        this.showNotification('New lead added!', 'success');
        this.loadMetrics(); // Refresh metrics
    }

    handleActionButton(e) {
        const action = e.currentTarget.dataset.action;
        
        switch (action) {
            case 'new-lead':
                window.location.href = '/prospecting-leads.html?action=new';
                break;
            case 'new-campaign':
                window.location.href = '/approaching-whatsapp.html?action=new-campaign';
                break;
            case 'export-data':
                this.exportData();
                break;
            case 'schedule-meeting':
                this.scheduleMeeting();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleChartAction(e) {
        const chart = e.currentTarget.dataset.chart;
        
        switch (chart) {
            case 'leads':
                window.location.href = '/analytics.html?tab=leads';
                break;
            case 'channels':
                window.location.href = '/analytics.html?tab=channels';
                break;
            default:
                console.log('Unknown chart action:', chart);
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showNotification('Search functionality coming soon!', 'info');
        }
        
        // Ctrl/Cmd + N for new lead
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            window.location.href = '/prospecting-leads.html?action=new';
        }
    }

    async handleLogout() {
        try {
            if (this.realTimeSubscription) {
                await this.supabase.removeChannel(this.realTimeSubscription);
            }
            
            await this.supabase.auth.signOut();
            window.location.href = '/index.html';
        } catch (error) {
            console.error('❌ Dashboard: Logout failed:', error);
            this.showNotification('Logout failed', 'error');
        }
    }

    handleSettings() {
        this.showNotification('Settings page coming soon!', 'info');
    }

    async exportData() {
        try {
            this.showNotification('Preparing export...', 'info');
            
            // Simulate export process
            setTimeout(() => {
                this.showNotification('Data exported successfully!', 'success');
            }, 2000);
        } catch (error) {
            console.error('❌ Dashboard: Export failed:', error);
            this.showNotification('Export failed', 'error');
        }
    }

    scheduleMeeting() {
        this.showNotification('Meeting scheduler coming soon!', 'info');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.style.cssText = `
            padding: 1rem 1.5rem;
            border-radius: 6px;
            background: var(--card-bg);
            border: 1px solid var(--border);
            color: var(--primary-text);
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
        
        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i data-feather="${icon}" style="width: 1rem; height: 1rem; color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'warning' ? '#F59E0B' : '#b0b0b0'};"></i>
            <span>${message}</span>
        `;

        container.appendChild(notification);

        // Replace Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    }

    // Cleanup method
    destroy() {
        if (this.realTimeSubscription) {
            this.supabase.removeChannel(this.realTimeSubscription);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.Dashboard = new Dashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.Dashboard) {
        window.Dashboard.destroy();
    }
}); 