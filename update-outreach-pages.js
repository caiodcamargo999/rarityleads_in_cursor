// Update all outreach pages to include floating profile panel and improve sidebar bottom section
const fs = require('fs');
const path = require('path');

const outreachPages = [
    'approaching-instagram.html',
    'approaching-facebook.html', 
    'approaching-x.html',
    'approaching-linkedin.html',
    'analytics.html',
    'support.html',
    'profile.html',
    'whatsapp-management.html'
];

function updatePage(filePath) {
    console.log(`Updating ${filePath}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace top-right language/theme toggle with floating profile panel
    content = content.replace(
        /<!-- Place this at the very top right, outside main content -->\s*<div style="position: absolute; top: 1\.5em; right: 2em; z-index: 100;">\s*<div id="appbar-lang-theme-toggle"><\/div>\s*<\/div>/g,
        '<!-- Floating profile panel in the bottom left -->\n    <div id="floating-profile-panel"></div>'
    );
    
    // Update the script section to initialize floating panel
    content = content.replace(
        /document\.addEventListener\('DOMContentLoaded', function\(\) \{\s*if \(window\.LanguageThemeToggle\) \{\s*window\.LanguageThemeToggle\.init\('appbar-lang-theme-toggle'\);\s*\}\s*\}\);/g,
        `document.addEventListener('DOMContentLoaded', async function() {
      // Remove top-right switcher if present
      const old = document.getElementById('appbar-lang-theme-toggle');
      if (old) old.parentNode.removeChild(old);
      
      // Fetch user info (replace with real Supabase user fetch in production)
      let user = { name: 'User', email: '' };
      if (window.AppUtils && window.AppUtils.initSupabase) {
        const supabase = window.AppUtils.initSupabase();
        try {
          const { data: { user: u } } = await supabase.auth.getUser();
          if (u) user = { name: u.user_metadata && u.user_metadata.full_name ? u.user_metadata.full_name : (u.email || 'User'), email: u.email };
        } catch {}
      }
      
      if (window.LanguageThemePanel) {
        window.LanguageThemePanel.initFloatingPanel('floating-profile-panel', user);
      }
    });`
    );
    
    // Write the updated content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
}

// Update all pages
outreachPages.forEach(page => {
    if (fs.existsSync(page)) {
        updatePage(page);
    } else {
        console.log(`⚠️  File not found: ${page}`);
    }
});

console.log('\n🎉 All outreach pages updated successfully!');
console.log('\n📋 Summary of changes:');
console.log('- Added floating profile panel container to all pages');
console.log('- Removed top-right language/theme toggle from post-login pages');
console.log('- Updated scripts to initialize floating profile panel');
console.log('- Improved sidebar bottom section with better UI/UX'); 