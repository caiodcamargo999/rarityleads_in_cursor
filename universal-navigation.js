/**
 * Universal Navigation System for Rarity Leads
 * Handles sidebar navigation, active states, and page routing
 */

class UniversalNavigation {
    constructor() {
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        console.log('🧭 Universal Navigation: Initializing...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupNavigation();
            });
        } else {
            this.setupNavigation();
        }
    }

    setupNavigation() {
        this.setupSidebarToggle();
        this.setupSubmenuToggles();
        this.setupNavigationLinks();
        this.setActiveMenuItem();
        this.setupQuickActions();
        
        console.log('✅ Universal Navigation: Setup complete');
    }

    setupSidebarToggle() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                document.body.classList.toggle('sidebar-collapsed');
                
                // Save state to localStorage
                localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
            });

            // Restore sidebar state
            const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
            }
        }
    }

    setupSubmenuToggles() {
        document.querySelectorAll('.submenu-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const parentItem = toggle.closest('.nav-item.has-submenu');
                const submenu = parentItem.querySelector('.submenu');
                const arrow = toggle.querySelector('.submenu-arrow');
                
                // Close other open submenus
                document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
                    if (item !== parentItem && item.classList.contains('open')) {
                        this.closeSubmenu(item);
                    }
                });

                // Toggle current submenu
                if (parentItem.classList.contains('open')) {
                    this.closeSubmenu(parentItem);
                } else {
                    this.openSubmenu(parentItem);
                }
            });
        });
    }

    openSubmenu(parentItem) {
        const submenu = parentItem.querySelector('.submenu');
        const arrow = parentItem.querySelector('.submenu-arrow');
        
        parentItem.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        if (submenu) submenu.style.maxHeight = submenu.scrollHeight + 'px';
    }

    closeSubmenu(parentItem) {
        const submenu = parentItem.querySelector('.submenu');
        const arrow = parentItem.querySelector('.submenu-arrow');
        
        parentItem.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        if (submenu) submenu.style.maxHeight = '0';
    }

    setupNavigationLinks() {
        document.querySelectorAll('.nav-link:not(.submenu-toggle)').forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                link.addEventListener('click', (e) => {
                    // Add loading state
                    this.showNavigationLoading(link);
                    
                    console.log('🔗 Navigating to:', href);
                    
                    // Let the browser handle navigation naturally
                    // The loading state will be cleared when the new page loads
                });
            }
        });
    }

    showNavigationLoading(link) {
        const originalContent = link.innerHTML;
        const icon = link.querySelector('i');
        
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
        
        // Reset after a short delay (in case navigation is instant)
        setTimeout(() => {
            if (link.innerHTML === originalContent) {
                // Navigation didn't happen, reset
                this.resetNavigationLoading(link, originalContent);
            }
        }, 100);
    }

    resetNavigationLoading(link, originalContent) {
        link.innerHTML = originalContent;
    }

    setActiveMenuItem() {
        console.log('🎯 Setting active menu for path:', this.currentPath);

        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Find and activate the correct menu item
        let activeItemFound = false;

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');

            if (href && href !== '#') {
                // Handle both relative and absolute paths
                const normalizedHref = href.startsWith('/') ? href : '/' + href;
                const normalizedPath = this.currentPath.endsWith('/') ? this.currentPath.slice(0, -1) : this.currentPath;

                if (normalizedHref === normalizedPath || href === this.currentPath.split('/').pop()) {
                    const navItem = link.closest('.nav-item');
                    navItem.classList.add('active');
                    activeItemFound = true;

                    // If it's a submenu item, open the parent submenu
                    const parentSubmenu = link.closest('.submenu');
                    if (parentSubmenu) {
                        const parentNavItem = parentSubmenu.closest('.nav-item.has-submenu');
                        this.openSubmenu(parentNavItem);
                    }

                    console.log('✅ Activated menu item for:', href);
                }
            }
        });

        if (!activeItemFound) {
            console.log('⚠️ No exact match found, trying partial matches...');
            this.setActiveMenuItemPartial();
        }
    }

    setActiveMenuItemPartial() {
        // Try partial matches for dynamic routes
        const pathSegments = this.currentPath.split('/').filter(segment => segment);
        
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href !== '#') {
                const hrefSegments = href.split('/').filter(segment => segment);
                
                // Check if the main segment matches
                if (hrefSegments.length > 0 && pathSegments.length > 0) {
                    const mainSegment = hrefSegments[hrefSegments.length - 1].replace('.html', '');
                    const currentSegment = pathSegments[pathSegments.length - 1].replace('.html', '');
                    
                    if (mainSegment === currentSegment) {
                        const navItem = link.closest('.nav-item');
                        navItem.classList.add('active');
                        
                        // If it's a submenu item, open the parent submenu
                        const parentSubmenu = link.closest('.submenu');
                        if (parentSubmenu) {
                            const parentNavItem = parentSubmenu.closest('.nav-item.has-submenu');
                            this.openSubmenu(parentNavItem);
                        }
                        
                        console.log('✅ Activated menu item (partial match):', href);
                    }
                }
            }
        });
    }

    setupQuickActions() {
        // Setup quick action buttons if they exist
        const quickActions = {
            'create-campaign-btn': () => this.navigateTo('campaigns.html'),
            'create-sequence-btn': () => this.navigateTo('sequences.html'),
            'connect-linkedin-btn': () => this.navigateTo('approaching-linkedin.html'),
            'connect-claude-btn': () => this.showConnectClaude(),
            'view-all-campaigns': () => this.navigateTo('campaigns.html'),
            'filter-leads-btn': () => this.showLeadsFilter()
        };

        Object.entries(quickActions).forEach(([buttonId, handler]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }

    navigateTo(path) {
        console.log('🔄 Navigating to:', path);
        window.location.href = path;
    }

    showConnectClaude() {
        alert('Claude AI integration coming soon! This will allow you to use AI for lead qualification and message generation.');
    }

    showLeadsFilter() {
        alert('Advanced lead filtering coming soon! You\'ll be able to filter by score, status, source, and more.');
    }

    // Public method to update active menu (useful for SPA-like behavior)
    updateActiveMenu(newPath) {
        this.currentPath = newPath;
        this.setActiveMenuItem();
    }

    // Public method to open a specific submenu
    openSubmenuByName(submenuName) {
        const submenuToggle = document.querySelector(`#submenu-${submenuName}`);
        if (submenuToggle) {
            const parentItem = submenuToggle.closest('.nav-item.has-submenu');
            this.openSubmenu(parentItem);
        }
    }

    // Public method to navigate programmatically
    navigate(path, options = {}) {
        if (options.newTab) {
            window.open(path, '_blank');
        } else {
            this.navigateTo(path);
        }
    }
}

// Initialize Universal Navigation
window.UniversalNavigation = new UniversalNavigation();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalNavigation;
}

console.log('✅ Universal Navigation system loaded');
