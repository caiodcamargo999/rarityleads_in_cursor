/**
 * Universal Navigation System for Rarity Leads
 * Handles sidebar navigation, active states, and page routing
 */

class UniversalNavigation {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.supabase = null;
        this.init();
    }

    async init() {
        await this.initializeSupabase();
        this.setupSidebar();
        this.setupActiveStates();
        this.setupLogout();
        this.loadUserProfile();
        this.setupResponsive();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const pageMap = {
            '/dashboard.html': 'dashboard',
            '/prospecting-leads.html': 'leads',
            '/prospecting-companies.html': 'companies',
            '/approaching-whatsapp.html': 'whatsapp',
            '/approaching-linkedin.html': 'linkedin',
            '/approaching-instagram.html': 'instagram',
            '/approaching-facebook.html': 'facebook',
            '/approaching-x.html': 'x',
            '/analytics.html': 'analytics',
            '/support.html': 'support'
        };
        return pageMap[path] || 'dashboard';
    }

    async initializeSupabase() {
        if (window.AppUtils) {
            this.supabase = window.AppUtils.initSupabase();
        } else if (window.supabase) {
            this.supabase = window.supabase;
        }
    }

    setupSidebar() {
        // Replace placeholder sidebar with universal sidebar
        const sidebarPlaceholder = document.querySelector('aside.sidebar');
        if (sidebarPlaceholder && sidebarPlaceholder.innerHTML.includes('<!-- Insert the new sidebar HTML')) {
            this.injectUniversalSidebar();
        }
    }

    injectUniversalSidebar() {
        const sidebar = document.querySelector('aside.sidebar');
        if (sidebar) {
            sidebar.innerHTML = `
                <div class="sidebar-header">
                    <img src="rarity-logo.jpg" alt="Rarity Leads Logo" class="sidebar-logo">
                </div>
                
                <nav class="sidebar-nav">
                    <ul>
                        <li>
                            <a href="dashboard.html" data-i18n="nav.dashboard" data-page="dashboard">
                                <i class="nav-icon" data-feather="home"></i>
                                <span data-i18n="nav.dashboard">Dashboard</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="prospecting-leads.html" data-i18n="nav.leads" data-page="leads">
                                <i class="nav-icon" data-feather="users"></i>
                                <span data-i18n="nav.leads">Leads</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="prospecting-companies.html" data-i18n="nav.companies" data-page="companies">
                                <i class="nav-icon" data-feather="briefcase"></i>
                                <span data-i18n="nav.companies">Companies</span>
                            </a>
                        </li>
                        
                        <li class="nav-section">
                            <span class="nav-section-title" data-i18n="nav.outreach">Outreach</span>
                        </li>
                        
                        <li>
                            <a href="approaching-whatsapp.html" data-i18n="nav.whatsapp" data-page="whatsapp">
                                <i class="nav-icon" data-feather="message-circle"></i>
                                <span data-i18n="nav.whatsapp">WhatsApp</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="approaching-linkedin.html" data-i18n="nav.linkedin" data-page="linkedin">
                                <i class="nav-icon" data-feather="linkedin"></i>
                                <span data-i18n="nav.linkedin">LinkedIn</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="approaching-instagram.html" data-i18n="nav.instagram" data-page="instagram">
                                <i class="nav-icon" data-feather="instagram"></i>
                                <span data-i18n="nav.instagram">Instagram</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="approaching-facebook.html" data-i18n="nav.facebook" data-page="facebook">
                                <i class="nav-icon" data-feather="facebook"></i>
                                <span data-i18n="nav.facebook">Facebook</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="approaching-x.html" data-i18n="nav.x" data-page="x">
                                <i class="nav-icon" data-feather="twitter"></i>
                                <span data-i18n="nav.x">X (Twitter)</span>
                            </a>
                        </li>
                        
                        <li class="nav-section">
                            <span class="nav-section-title" data-i18n="nav.analyticsSupport">Analytics & Support</span>
                        </li>
                        
                        <li>
                            <a href="analytics.html" data-i18n="nav.analytics" data-page="analytics">
                                <i class="nav-icon" data-feather="bar-chart-2"></i>
                                <span data-i18n="nav.analytics">Analytics</span>
                            </a>
                        </li>
                        
                        <li>
                            <a href="support.html" data-i18n="nav.support" data-page="support">
                                <i class="nav-icon" data-feather="help-circle"></i>
                                <span data-i18n="nav.support">Support</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <div class="sidebar-logout">
                    <div class="user-profile" style="display: flex; align-items: center; gap: 0.75em; margin-bottom: 1em;">
                        <i data-feather="user" style="color: var(--sidebar-text-secondary); width: 1.5em; height: 1.5em;"></i>
                        <div style="flex: 1; min-width: 0;">
                            <span id="user-name" style="display: block; font-weight: 500; font-size: 0.875rem; color: var(--sidebar-text); margin-bottom: 0.25rem;">Loading...</span>
                            <span id="user-email" style="display: block; font-size: 0.75rem; color: var(--sidebar-text-secondary);">loading@example.com</span>
                        </div>
                    </div>
                    <button class="sidebar-logout-btn" id="logout-btn" data-i18n="common.logout">Logout</button>
                </div>
            `;
        }
    }

    setupActiveStates() {
        // Set active state for current page
        const currentLink = document.querySelector(`[data-page="${this.currentPage}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }

        // Remove active class from all other links
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            if (link.getAttribute('data-page') !== this.currentPage) {
                link.classList.remove('active');
            }
        });
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    if (this.supabase) {
                        await this.supabase.auth.signOut();
                    }
                    window.location.href = '/index.html';
                } catch (error) {
                    console.error('Logout failed:', error);
                    window.location.href = '/index.html';
                }
            });
        }
    }

    async loadUserProfile() {
        if (!this.supabase) return;

        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            if (user) {
                this.updateUserDisplay(user);
                
                // Load profile data from profiles table
                const { data: profile } = await this.supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    this.updateUserDisplay(user, profile);
                }
            }
        } catch (error) {
            console.warn('Failed to load user profile:', error);
        }
    }

    updateUserDisplay(user, profile = null) {
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');

        if (userName) {
            userName.textContent = profile?.full_name || user.email || 'User';
        }

        if (userEmail) {
            userEmail.textContent = user.email || 'user@example.com';
        }
    }

    setupResponsive() {
        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');

        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('sidebar-open');
                mainContent.classList.toggle('sidebar-open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                        sidebar.classList.remove('sidebar-open');
                        mainContent.classList.remove('sidebar-open');
                    }
                }
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) {
                sidebar?.classList.remove('sidebar-open');
                mainContent?.classList.remove('sidebar-open');
            }
        });
    }

    // Utility methods
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
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialize universal navigation
    window.UniversalNavigation = new UniversalNavigation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalNavigation;
}

console.log('✅ Universal Navigation system loaded');
