// Script to update all outreach pages with standardized sidebar
const fs = require('fs');
const path = require('path');

const outreachPages = [
    'approaching-linkedin.html',
    'approaching-instagram.html', 
    'approaching-facebook.html',
    'approaching-x.html'
];

const standardizedSidebar = `        <aside class="sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
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
        </aside>`;

const pageActiveStates = {
    'approaching-linkedin.html': 'linkedin',
    'approaching-instagram.html': 'instagram', 
    'approaching-facebook.html': 'facebook',
    'approaching-x.html': 'x'
};

outreachPages.forEach(page => {
    const filePath = path.join(__dirname, page);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the old sidebar with the standardized one
    content = content.replace(
        /<aside class="sidebar"[^>]*>[\s\S]*?<!-- Insert the new sidebar HTML[\s\S]*?<\/aside>/,
        standardizedSidebar
    );
    
    // Set the active state for the current page
    const activePage = pageActiveStates[page];
    if (activePage) {
        content = content.replace(
            new RegExp(`href="${page}"([^>]*)>`),
            `href="${page}"$1 class="active">`
        );
    }
    
    // Add universal navigation script if not present
    if (!content.includes('universal-navigation.js')) {
        content = content.replace(
            /<script src="auth-guard\.js"><\/script>/,
            '<script src="auth-guard.js"></script>\n    <script src="universal-navigation.js"></script>'
        );
    }
    
    // Ensure dashboard-container class is used
    content = content.replace(/class="dashboard-layout"/g, 'class="dashboard-container"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${page}`);
});

console.log('🎉 All outreach pages updated with standardized sidebar!'); 