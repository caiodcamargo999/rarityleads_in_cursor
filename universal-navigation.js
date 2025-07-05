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
        // Always inject the universal sidebar if the sidebar is present
        const sidebarPlaceholder = document.querySelector('aside.sidebar');
        if (sidebarPlaceholder) {
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
                <nav class="sidebar-nav" style="flex:1; overflow-y:auto;">
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
                                <span class="nav-icon">${this.getSvgIcon('whatsapp')}</span>
                                <span data-i18n="nav.whatsapp">WhatsApp</span>
                            </a>
                        </li>
                        <li>
                            <a href="approaching-linkedin.html" data-i18n="nav.linkedin" data-page="linkedin">
                                <span class="nav-icon">${this.getSvgIcon('linkedin')}</span>
                                <span data-i18n="nav.linkedin">LinkedIn</span>
                            </a>
                        </li>
                        <li>
                            <a href="approaching-instagram.html" data-i18n="nav.instagram" data-page="instagram">
                                <span class="nav-icon">${this.getSvgIcon('instagram')}</span>
                                <span data-i18n="nav.instagram">Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="approaching-facebook.html" data-i18n="nav.facebook" data-page="facebook">
                                <span class="nav-icon">${this.getSvgIcon('facebook')}</span>
                                <span data-i18n="nav.facebook">Facebook</span>
                            </a>
                        </li>
                        <li>
                            <a href="approaching-x.html" data-i18n="nav.x" data-page="x">
                                <span class="nav-icon">${this.getSvgIcon('x')}</span>
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
                <div class="sidebar-bottom" id="sidebar-avatar-trigger" style="display: flex; justify-content: center; align-items: center; padding: 2em 0 2.5em 0; border-top: 1px solid var(--logout-separator); background: var(--sidebar-bg);">
                    <button id="sidebar-avatar-btn" aria-label="Open profile panel" style="width: 44px; height: 44px; border-radius: 50%; background: var(--sidebar-bg, #101014); display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 1.1em; color: var(--primary-text); border: 1.5px solid var(--border); box-shadow: 0 2px 8px rgba(0,0,0,0.10); cursor: pointer; transition: box-shadow 0.18s, border 0.18s;">
                        <span id="sidebar-avatar-initial">?</span>
                    </button>
                </div>
            `;
            // After rendering, wire up the avatar button to open the floating panel
            setTimeout(() => {
                const avatarBtn = document.getElementById('sidebar-avatar-btn');
                if (avatarBtn && window.LanguageThemePanel) {
                    avatarBtn.onclick = function(e) {
                        e.stopPropagation();
                        // Open the floating profile panel (bottom left)
                        const panelContainer = document.getElementById('floating-profile-panel');
                        if (panelContainer && panelContainer.firstChild) {
                            // Toggle panel visibility
                            const panel = panelContainer.querySelector('div[style*="position: fixed"]');
                            if (panel) {
                                if (panel.style.visibility === 'visible') {
                                    panel.style.visibility = 'hidden';
                                    panel.style.opacity = '0';
                                    panel.style.pointerEvents = 'none';
                                } else {
                                    panel.style.visibility = 'visible';
                                    panel.style.opacity = '1';
                                    panel.style.pointerEvents = 'auto';
                                }
                            }
                        }
                    };
                }
            }, 100);
        }
    }

    getSvgIcon(name) {
        switch (name) {
            case 'whatsapp':
                return `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.364L4 29l7.818-2.236A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 22c-1.98 0-3.85-.577-5.418-1.57l-.386-.24-4.65 1.33 1.33-4.65-.24-.386A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10Zm5.29-7.71c-.29-.145-1.71-.844-1.974-.94-.264-.097-.456-.145-.648.145-.193.29-.744.94-.912 1.133-.168.193-.336.217-.626.072-.29-.145-1.225-.452-2.334-1.44-.863-.77-1.445-1.72-1.615-2.01-.168-.29-.018-.447.127-.592.13-.13.29-.336.435-.504.145-.168.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.145-.648-1.566-.888-2.146-.234-.563-.472-.486-.648-.495-.168-.007-.362-.009-.555-.009-.193 0-.507.073-.773.362-.264.29-1.01.99-1.01 2.415 0 1.425 1.034 2.803 1.178 2.997.145.193 2.04 3.12 5.04 4.253.705.242 1.254.387 1.683.495.707.18 1.35.155 1.86.094.567-.067 1.71-.698 1.953-1.372.242-.674.242-1.252.168-1.372-.072-.12-.264-.193-.555-.338Z" fill="currentColor"/></svg>`;
            case 'linkedin':
                return `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27 27h-4.5v-7c0-1.1-.9-2-2-2s-2 .9-2 2v7H9V12h4.5v2.1c.7-1.2 2.1-2.1 3.5-2.1 2.5 0 4.5 2 4.5 4.5v10.5ZM7 10.5A2.5 2.5 0 1 1 7 5a2.5 2.5 0 0 1 0 5Zm2.25 16.5H4.75V12h4.5v15ZM27 3H5C3.9 3 3 3.9 3 5v22c0 1.1.9 2 2 2h22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" fill="currentColor"/></svg>`;
            case 'instagram':
                return `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="20" height="20" rx="6" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="5" stroke="currentColor" stroke-width="2"/><circle cx="23" cy="9" r="1" fill="currentColor"/></svg>`;
            case 'facebook':
                return `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.48 4.84 11.82 11 12.82V20.5h-3v-3h3v-2.5c0-3.03 1.79-4.7 4.52-4.7 1.31 0 2.68.24 2.68.24v3h-1.51c-1.49 0-1.95.93-1.95 1.88V17.5h3.32l-.53 3h-2.79v8.32C24.16 27.82 29 22.48 29 16Z" fill="currentColor"/></svg>`;
            case 'x':
                return `<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.5 7h-3.1l-5.1 6.6L12.1 7H6.5l7.1 9.2L6 25h3.1l5.3-6.9 5.3 6.9h5.6l-7.6-9.8L25.5 7Zm-4.2 15.2-3.2-4.2-3.2 4.2H8.9l5.1-6.7-7.1-9.2h3.1l5.1 6.6 5.1-6.6h3.1l-7.1 9.2 5.1 6.7h-3.1Z" fill="currentColor"/></svg>`;
            default:
                return '';
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
                
                // Load profile data from user_profiles table
                const { data: profile } = await this.supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('user_id', user.id)
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
