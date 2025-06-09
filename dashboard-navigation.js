/**
 * Dashboard Navigation Manager
 * Handles navigation state, active menu items, and responsive behavior
 */

class DashboardNavigation {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        this.sidebar = null;
        this.sidebarToggle = null;
        this.init();
    }

    init() {
        console.log('🧭 Initializing Dashboard Navigation...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.sidebar = document.getElementById('dashboard-sidebar');
        this.sidebarToggle = document.querySelector('.sidebar-toggle');
        
        this.setActiveNavItem();
        this.setupEventListeners();
        this.setupResponsiveBehavior();
        
        console.log('✅ Dashboard Navigation initialized');
    }

    // Set active navigation item based on current page
    setActiveNavItem() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Map pages to nav item IDs
        const pageToNavMap = {
            'dashboard.html': 'menu-dashboard',
            'prospecting-leads.html': 'menu-leads',
            'prospecting-companies.html': 'menu-companies',
            'approaching-whatsapp.html': 'menu-whatsapp',
            'approaching-linkedin.html': 'menu-linkedin',
            'approaching-instagram.html': 'menu-instagram',
            'approaching-facebook.html': 'menu-facebook',
            'approaching-x.html': 'menu-x',
            'analytics.html': 'menu-analytics',
            'support.html': 'menu-support'
        };

        const navId = pageToNavMap[this.currentPage];
        if (navId) {
            const navLink = document.getElementById(navId);
            if (navLink) {
                navLink.closest('.nav-item').classList.add('active');
                console.log(`✅ Set active nav item: ${navId}`);
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Sidebar toggle for mobile
        if (this.sidebarToggle && this.sidebar) {
            this.sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    console.log(`🔗 Navigating to: ${href}`);
                    
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth <= 1024) {
                        this.closeSidebar();
                    }
                }
            });
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024 && 
                this.sidebar &&
                !this.sidebar.contains(e.target) && 
                !this.sidebarToggle?.contains(e.target) &&
                this.sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // Setup responsive behavior
    setupResponsiveBehavior() {
        this.handleResize();
    }

    // Toggle sidebar visibility
    toggleSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.toggle('open');
            console.log('📱 Sidebar toggled');
        }
    }

    // Close sidebar
    closeSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.remove('open');
        }
    }

    // Open sidebar
    openSidebar() {
        if (this.sidebar) {
            this.sidebar.classList.add('open');
        }
    }

    // Handle window resize
    handleResize() {
        if (window.innerWidth > 1024) {
            // Desktop: ensure sidebar is visible
            this.closeSidebar();
        }
    }

    // Navigate to a specific page
    navigateTo(page) {
        console.log(`🔗 Navigating to: ${page}`);
        window.location.href = page;
    }

    // Get current page
    getCurrentPage() {
        return this.currentPage;
    }

    // Check if current page matches
    isCurrentPage(page) {
        return this.currentPage === page;
    }
}

// Initialize navigation when script loads
window.DashboardNavigation = new DashboardNavigation();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardNavigation;
}
