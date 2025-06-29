// Dashboard JavaScript - Enhanced Functionality
class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeCharts();
        this.setupAnimations();
        this.loadUserData();
        this.updateWelcomeMessage();
        this.startRealTimeUpdates();
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
        
        // User elements
        this.userEmail = document.getElementById('user-email');
        this.welcomeSubtitle = document.getElementById('welcome-subtitle');
        
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
        this.setupActionButtons();
        
        // Lead actions
        this.setupLeadActions();
        
        // Campaign actions
        this.setupCampaignActions();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        this.overlay.classList.toggle('active');
        document.body.style.overflow = this.sidebar.classList.contains('open') ? 'hidden' : '';
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
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

    updateChartData(period) {
        // Simulate loading state
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.classList.add('loading');
        
        setTimeout(() => {
            // Update chart with new data
            this.updateLeadsChart(period);
            chartContainer.classList.remove('loading');
        }, 500);
    }

    initializeCharts() {
        if (this.leadsChart) {
            this.createLeadsChart();
        }
    }

    createLeadsChart() {
        const ctx = this.leadsChart.getContext('2d');
        
        // Sample data for 7 days
        const data = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Leads Generated',
                data: [45, 52, 38, 67, 89, 34, 56],
                borderColor: '#D50057',
                backgroundColor: 'rgba(213, 0, 87, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#D50057',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
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
                        backgroundColor: 'rgba(26, 26, 46, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#a1a1aa',
                        borderColor: '#2d2d3a',
                        borderWidth: 1,
                        cornerRadius: 8,
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
                            color: 'rgba(45, 45, 58, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(45, 45, 58, 0.3)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a1a1aa',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + ' leads';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        this.chart = new Chart(ctx, config);
    }

    updateLeadsChart(period) {
        if (!this.chart) return;

        // Sample data for different periods
        const dataSets = {
            '7d': {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [45, 52, 38, 67, 89, 34, 56]
            },
            '30d': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [234, 289, 312, 267]
            },
            '90d': {
                labels: ['Jan', 'Feb', 'Mar'],
                data: [892, 1023, 1156]
            }
        };

        const newData = dataSets[period] || dataSets['7d'];
        
        this.chart.data.labels = newData.labels;
        this.chart.data.datasets[0].data = newData.data;
        this.chart.update('active');
    }

    setupActionButtons() {
        // Quick action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleActionButton(btn);
            });
        });

        // View all buttons
        const viewAllButtons = document.querySelectorAll('.view-all-btn');
        viewAllButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleViewAll(btn);
            });
        });
    }

    handleActionButton(btn) {
        const action = btn.textContent.trim();
        
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        // Handle different actions
        if (action.includes('Campaign')) {
            this.showNotification('Creating new campaign...', 'info');
            // Navigate to campaign creation page
            setTimeout(() => {
                window.location.href = 'prospecting-leads.html';
            }, 1000);
        } else if (action.includes('Connect')) {
            this.showNotification('Connecting to LinkedIn...', 'info');
            // Simulate connection process
            setTimeout(() => {
                this.showNotification('LinkedIn connected successfully!', 'success');
            }, 2000);
        }
    }

    handleViewAll(btn) {
        const section = btn.closest('section');
        const sectionType = section.classList.contains('activity-feed') ? 'activity' : 
                           section.classList.contains('recent-leads') ? 'leads' : 'campaigns';
        
        // Navigate to respective pages
        const pages = {
            'activity': 'analytics.html',
            'leads': 'prospecting-leads.html',
            'campaigns': 'analytics.html'
        };
        
        if (pages[sectionType]) {
            window.location.href = pages[sectionType];
        }
    }

    setupLeadActions() {
        const leadActions = document.querySelectorAll('.lead-actions .action-icon');
        leadActions.forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleLeadAction(action);
            });
        });
    }

    handleLeadAction(action) {
        const actionType = action.getAttribute('title');
        const leadItem = action.closest('.lead-item');
        const leadName = leadItem.querySelector('.lead-name').textContent;
        
        if (actionType.includes('Email')) {
            this.showNotification(`Opening email composer for ${leadName}...`, 'info');
        } else if (actionType.includes('Call')) {
            this.showNotification(`Initiating call to ${leadName}...`, 'info');
        }
    }

    setupCampaignActions() {
        const campaignCards = document.querySelectorAll('.campaign-card');
        campaignCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.campaign-status')) {
                    this.handleCampaignClick(card);
                }
            });
        });
    }

    handleCampaignClick(card) {
        const campaignName = card.querySelector('h4').textContent;
        this.showNotification(`Opening campaign: ${campaignName}`, 'info');
        // Navigate to campaign details
        setTimeout(() => {
            window.location.href = 'analytics.html';
        }, 500);
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSidebar();
        }
        
        // Escape to close sidebar
        if (e.key === 'Escape') {
            this.closeSidebar();
        }
    }

    setupAnimations() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.metric-card, .action-card, .chart-card, .funnel-card, .activity-feed, .recent-leads, .campaign-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => {
            observer.observe(card);
        });

        // Add pulse animation to notification badge
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            notificationBadge.classList.add('pulse');
        }
    }

    async loadUserData() {
        try {
            if (window.AppUtils && window.AppUtils.initSupabase) {
                const supabase = window.AppUtils.initSupabase();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session && session.user) {
                    this.userEmail.textContent = session.user.email;
                    this.updateWelcomeMessage(session.user.email);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Fallback to default user
            this.userEmail.textContent = 'user@rarityleads.com';
        }
    }

    updateWelcomeMessage(email = null) {
        const hour = new Date().getHours();
        let greeting = 'Good morning';
        
        if (hour >= 12 && hour < 17) {
            greeting = 'Good afternoon';
        } else if (hour >= 17) {
            greeting = 'Good evening';
        }
        
        if (this.welcomeSubtitle) {
            this.welcomeSubtitle.textContent = `${greeting} ✨ Ready to convert more leads today?`;
        }
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);
    }

    updateMetrics() {
        // Update metric values with subtle animations
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach(metric => {
            const currentValue = parseInt(metric.textContent.replace(/[^0-9]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 5);
            
            // Animate the number change
            this.animateNumber(metric, currentValue, newValue);
        });
    }

    animateNumber(element, start, end) {
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = this.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i data-feather="${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i data-feather="x"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--background-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 8px 32px var(--shadow-color);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Replace icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'alert-circle',
            'warning': 'alert-triangle',
            'info': 'info'
        };
        return icons[type] || 'info';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard only
    window.dashboard = new Dashboard();
});

// Handle page visibility changes for real-time updates
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.dashboard) {
        window.dashboard.updateMetrics();
    }
});

// Export for global access
window.Dashboard = Dashboard; 