// Language & Theme Toggle Component
window.LanguageThemeToggle = {
  init: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Outer pill container
    const pill = document.createElement('div');
    pill.style.display = 'flex';
    pill.style.alignItems = 'center';
    pill.style.gap = '0.7em';
    pill.style.background = 'var(--card-bg, #18181c)';
    pill.style.border = '1.5px solid var(--border)';
    pill.style.borderRadius = '999px';
    pill.style.padding = '0.18em 1.1em 0.18em 1.1em';
    pill.style.boxShadow = 'none';
    pill.style.minHeight = '2.4em';
    pill.style.userSelect = 'none';
    pill.style.transition = 'border 0.2s, background 0.2s';
    pill.style.maxWidth = '100vw';

    // Language Dropdown
    const langs = window.AppConfig.languages.supported;
    let currentLang = localStorage.getItem('rarity-leads-language') || window.AppConfig.languages.default;
    const langBtn = document.createElement('button');
    langBtn.className = 'lang-btn';
    langBtn.style.padding = '0.4em 1.2em';
    langBtn.style.borderRadius = '999px';
    langBtn.style.border = '1.5px solid var(--border)';
    langBtn.style.background = 'transparent';
    langBtn.style.color = 'var(--primary-text)';
    langBtn.style.fontWeight = '500';
    langBtn.style.cursor = 'pointer';
    langBtn.style.fontSize = '1em';
    langBtn.style.height = '2.1em';
    langBtn.style.display = 'flex';
    langBtn.style.alignItems = 'center';
    langBtn.style.transition = 'background 0.2s, color 0.2s, border 0.2s';
    langBtn.textContent = langs[currentLang].name;
    langBtn.onmouseenter = () => langBtn.style.background = 'var(--sidebar-bg-hover, #232136)';
    langBtn.onmouseleave = () => langBtn.style.background = 'transparent';
    // Dropdown
    const dropdown = document.createElement('ul');
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.right = '0';
    dropdown.style.top = '110%';
    dropdown.style.background = 'var(--card-bg, #18181c)';
    dropdown.style.border = '1.5px solid var(--border)';
    dropdown.style.borderRadius = '12px';
    dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
    dropdown.style.minWidth = '140px';
    dropdown.style.zIndex = '1000';
    dropdown.style.padding = '0.3em 0';
    dropdown.style.margin = '0';
    dropdown.style.listStyle = 'none';
    dropdown.style.transition = 'opacity 0.2s, transform 0.2s';
    Object.entries(langs).forEach(([code, lang]) => {
      const li = document.createElement('li');
      li.textContent = lang.name;
      li.style.padding = '0.6em 1.5em';
      li.style.cursor = 'pointer';
      li.style.color = 'var(--primary-text)';
      li.style.fontWeight = code === currentLang ? '500' : '400';
      li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.style.transition = 'background 0.18s, color 0.18s';
      li.onmouseenter = () => li.style.background = 'var(--sidebar-bg-hover, #232136)';
      li.onmouseleave = () => li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.addEventListener('click', function(e) {
        e.stopPropagation();
        localStorage.setItem('rarity-leads-language', code);
        langBtn.textContent = lang.name;
        dropdown.style.display = 'none';
        if (window.i18n) window.i18n.switchLanguage(code);
      });
      dropdown.appendChild(li);
    });
    // Dropdown logic
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      dropdown.style.opacity = dropdown.style.display === 'block' ? '1' : '0';
      dropdown.style.transform = dropdown.style.display === 'block' ? 'translateY(0)' : 'translateY(-8px)';
    });
    document.addEventListener('click', function() {
      dropdown.style.display = 'none';
    });
    // Wrap for dropdown positioning
    const langWrap = document.createElement('div');
    langWrap.style.position = 'relative';
    langWrap.appendChild(langBtn);
    langWrap.appendChild(dropdown);
    pill.appendChild(langWrap);

    // Theme Toggle (row, high contrast ball)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle-btn';
    themeToggle.style.background = 'none';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2em';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.width = '2.2em';
    themeToggle.style.height = '2.2em';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.boxShadow = 'none';
    themeToggle.style.transition = 'box-shadow 0.18s';
    themeToggle.style.marginLeft = '0.2em';
    const icon = document.createElement('span');
    function setThemeIcon() {
      if (document.body.classList.contains('light-theme')) {
        // Light theme: white ball, dark border
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#fff" stroke="#232136" stroke-width="2"/></svg>';
        themeLabel.textContent = 'Light Theme';
      } else {
        // Dark theme: dark ball, white border
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#232136" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#232136" stroke="#fff" stroke-width="2"/></svg>';
        themeLabel.textContent = 'Dark Theme';
      }
    }
    themeToggle.appendChild(icon);
    const themeLabel = document.createElement('span');
    themeLabel.style.fontSize = '0.8em';
    themeLabel.style.fontWeight = '400';
    themeLabel.style.color = 'var(--secondary-text)';
    themeLabel.style.marginLeft = '0.5em';
    themeLabel.style.marginTop = '0';
    themeLabel.style.textAlign = 'center';
    themeLabel.style.userSelect = 'none';
    themeToggle.appendChild(themeLabel);
    setThemeIcon();
    themeToggle.onclick = () => {
      document.body.classList.toggle('light-theme');
      localStorage.setItem('rl_theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
      setThemeIcon();
    };
    // On load, set theme
    const savedTheme = localStorage.getItem('rl_theme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    pill.appendChild(themeToggle);

    container.appendChild(pill);
  }
};

// Optional: auto-init if container exists
if (document.getElementById('language-theme-toggle')) {
  window.LanguageThemeToggle.init('language-theme-toggle');
}

// Language & Theme Toggle + Profile Panel Component
window.LanguageThemePanel = {
  // Anthropic-style floating panel for post-login pages
  initFloatingPanel: function(containerId, user) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Avatar button (always visible, bottom left)
    const avatarBtn = document.createElement('button');
    avatarBtn.setAttribute('aria-label', 'Open profile panel');
    avatarBtn.style.position = 'fixed';
    avatarBtn.style.left = '2em';
    avatarBtn.style.bottom = '2em';
    avatarBtn.style.zIndex = '1001';
    avatarBtn.style.width = '44px';
    avatarBtn.style.height = '44px';
    avatarBtn.style.borderRadius = '50%';
    avatarBtn.style.background = 'var(--sidebar-bg, #101014)';
    avatarBtn.style.display = 'flex';
    avatarBtn.style.alignItems = 'center';
    avatarBtn.style.justifyContent = 'center';
    avatarBtn.style.fontWeight = '500';
    avatarBtn.style.fontSize = '1.1em';
    avatarBtn.style.color = 'var(--primary-text)';
    avatarBtn.style.border = '1.5px solid var(--border)';
    avatarBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    avatarBtn.style.cursor = 'pointer';
    avatarBtn.style.transition = 'box-shadow 0.18s, border 0.18s';
    avatarBtn.textContent = user && user.name ? user.name[0].toUpperCase() : '?';

    // Panel (hidden by default)
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = '2em';
    panel.style.bottom = '4.5em';
    panel.style.zIndex = '1002';
    panel.style.background = 'var(--card-bg, #18181c)';
    panel.style.border = '1.5px solid var(--border)';
    panel.style.borderRadius = '16px';
    panel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
    panel.style.padding = '1.1em 1.3em 1.1em 1.3em';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.alignItems = 'flex-start';
    panel.style.gap = '1em';
    panel.style.minWidth = '220px';
    panel.style.maxWidth = '320px';
    panel.style.visibility = 'hidden';
    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
    panel.style.transition = 'opacity 0.18s, visibility 0.18s';

    // User info row
    const userRow = document.createElement('div');
    userRow.style.display = 'flex';
    userRow.style.alignItems = 'center';
    userRow.style.gap = '0.9em';
    // Avatar in panel
    const avatar = document.createElement('div');
    avatar.style.width = '38px';
    avatar.style.height = '38px';
    avatar.style.borderRadius = '50%';
    avatar.style.background = 'var(--sidebar-bg, #101014)';
    avatar.style.display = 'flex';
    avatar.style.alignItems = 'center';
    avatar.style.justifyContent = 'center';
    avatar.style.fontWeight = '500';
    avatar.style.fontSize = '1.1em';
    avatar.style.color = 'var(--primary-text)';
    avatar.textContent = user && user.name ? user.name[0].toUpperCase() : '?';
    userRow.appendChild(avatar);
    // Name/email
    const userInfo = document.createElement('div');
    userInfo.style.display = 'flex';
    userInfo.style.flexDirection = 'column';
    userInfo.style.gap = '0.1em';
    const name = document.createElement('span');
    name.textContent = user && user.name ? user.name : 'User';
    name.style.fontWeight = '500';
    name.style.fontSize = '1em';
    name.style.color = 'var(--primary-text)';
    const email = document.createElement('span');
    email.textContent = user && user.email ? user.email : '';
    email.style.fontWeight = '400';
    email.style.fontSize = '0.93em';
    email.style.color = 'var(--secondary-text)';
    userInfo.appendChild(name);
    if (user && user.email) userInfo.appendChild(email);
    userRow.appendChild(userInfo);
    panel.appendChild(userRow);

    // Profile/settings link
    const profileLink = document.createElement('a');
    profileLink.href = 'profile.html';
    profileLink.textContent = 'Profile & Settings';
    profileLink.className = 'btn';
    profileLink.style.width = '100%';
    profileLink.style.marginTop = '0.2em';
    profileLink.style.marginBottom = '0.2em';
    profileLink.style.textAlign = 'left';
    panel.appendChild(profileLink);

    // Language/Theme row (Anthropic style)
    const pill = document.createElement('div');
    pill.style.display = 'flex';
    pill.style.alignItems = 'center';
    pill.style.gap = '0.7em';
    pill.style.background = 'var(--card-bg, #18181c)';
    pill.style.border = '1.5px solid var(--border)';
    pill.style.borderRadius = '999px';
    pill.style.padding = '0.18em 1.1em 0.18em 1.1em';
    pill.style.boxShadow = 'none';
    pill.style.minHeight = '2.4em';
    pill.style.userSelect = 'none';
    pill.style.transition = 'border 0.2s, background 0.2s';
    pill.style.maxWidth = '100vw';

    // Language Dropdown
    const langs = window.AppConfig.languages.supported;
    let currentLang = localStorage.getItem('rarity-leads-language') || window.AppConfig.languages.default;
    const langBtn = document.createElement('button');
    langBtn.className = 'lang-btn';
    langBtn.style.padding = '0.4em 1.2em';
    langBtn.style.borderRadius = '999px';
    langBtn.style.border = '1.5px solid var(--border)';
    langBtn.style.background = 'transparent';
    langBtn.style.color = 'var(--primary-text)';
    langBtn.style.fontWeight = '500';
    langBtn.style.cursor = 'pointer';
    langBtn.style.fontSize = '1em';
    langBtn.style.height = '2.1em';
    langBtn.style.display = 'flex';
    langBtn.style.alignItems = 'center';
    langBtn.style.transition = 'background 0.2s, color 0.2s, border 0.2s';
    langBtn.textContent = langs[currentLang].name;
    langBtn.onmouseenter = () => langBtn.style.background = 'var(--sidebar-bg-hover, #232136)';
    langBtn.onmouseleave = () => langBtn.style.background = 'transparent';
    // Dropdown
    const dropdown = document.createElement('ul');
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.right = '0';
    dropdown.style.top = '110%';
    dropdown.style.background = 'var(--card-bg, #18181c)';
    dropdown.style.border = '1.5px solid var(--border)';
    dropdown.style.borderRadius = '12px';
    dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
    dropdown.style.minWidth = '140px';
    dropdown.style.zIndex = '1000';
    dropdown.style.padding = '0.3em 0';
    dropdown.style.margin = '0';
    dropdown.style.listStyle = 'none';
    dropdown.style.transition = 'opacity 0.2s, transform 0.2s';
    Object.entries(langs).forEach(([code, lang]) => {
      const li = document.createElement('li');
      li.textContent = lang.name;
      li.style.padding = '0.6em 1.5em';
      li.style.cursor = 'pointer';
      li.style.color = 'var(--primary-text)';
      li.style.fontWeight = code === currentLang ? '500' : '400';
      li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.style.transition = 'background 0.18s, color 0.18s';
      li.onmouseenter = () => li.style.background = 'var(--sidebar-bg-hover, #232136)';
      li.onmouseleave = () => li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.addEventListener('click', function(e) {
        e.stopPropagation();
        localStorage.setItem('rarity-leads-language', code);
        langBtn.textContent = lang.name;
        dropdown.style.display = 'none';
        if (window.i18n) window.i18n.switchLanguage(code);
      });
      dropdown.appendChild(li);
    });
    // Dropdown logic
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      dropdown.style.opacity = dropdown.style.display === 'block' ? '1' : '0';
      dropdown.style.transform = dropdown.style.display === 'block' ? 'translateY(0)' : 'translateY(-8px)';
    });
    document.addEventListener('click', function() {
      dropdown.style.display = 'none';
    });
    // Wrap for dropdown positioning
    const langWrap = document.createElement('div');
    langWrap.style.position = 'relative';
    langWrap.appendChild(langBtn);
    langWrap.appendChild(dropdown);
    pill.appendChild(langWrap);

    // Theme Toggle (row, high contrast ball)
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle-btn';
    themeToggle.style.background = 'none';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2em';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.width = '2.2em';
    themeToggle.style.height = '2.2em';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.boxShadow = 'none';
    themeToggle.style.transition = 'box-shadow 0.18s';
    themeToggle.style.marginLeft = '0.2em';
    const icon = document.createElement('span');
    function setThemeIcon() {
      if (document.body.classList.contains('light-theme')) {
        // Light theme: white ball, dark border
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#fff" stroke="#232136" stroke-width="2"/></svg>';
        themeLabel.textContent = 'Light Theme';
      } else {
        // Dark theme: dark ball, white border
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#232136" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#232136" stroke="#fff" stroke-width="2"/></svg>';
        themeLabel.textContent = 'Dark Theme';
      }
    }
    themeToggle.appendChild(icon);
    const themeLabel = document.createElement('span');
    themeLabel.style.fontSize = '0.8em';
    themeLabel.style.fontWeight = '400';
    themeLabel.style.color = 'var(--secondary-text)';
    themeLabel.style.marginLeft = '0.5em';
    themeLabel.style.marginTop = '0';
    themeLabel.style.textAlign = 'center';
    themeLabel.style.userSelect = 'none';
    themeToggle.appendChild(themeLabel);
    setThemeIcon();
    themeToggle.onclick = () => {
      document.body.classList.toggle('light-theme');
      localStorage.setItem('rl_theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
      setThemeIcon();
    };
    // On load, set theme
    const savedTheme = localStorage.getItem('rl_theme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    pill.appendChild(themeToggle);

    panel.appendChild(pill);

    // Logout button
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.width = '100%';
    logoutBtn.style.marginTop = '0.2em';
    logoutBtn.style.textAlign = 'left';
    logoutBtn.onclick = function() {
      if (window.AppUtils && window.AppUtils.navigateTo) {
        window.AppUtils.navigateTo('/auth.html');
      } else {
        window.location.href = '/auth.html';
      }
    };
    panel.appendChild(logoutBtn);

    // Show/hide logic
    function openPanel() {
      panel.style.visibility = 'visible';
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
    }
    function closePanel() {
      panel.style.visibility = 'hidden';
      panel.style.opacity = '0';
      panel.style.pointerEvents = 'none';
    }
    avatarBtn.onclick = function(e) {
      e.stopPropagation();
      if (panel.style.visibility === 'visible') {
        closePanel();
      } else {
        openPanel();
      }
    };
    document.addEventListener('click', function(e) {
      if (!panel.contains(e.target) && e.target !== avatarBtn) {
        closePanel();
      }
    });

    // Add to DOM
    container.appendChild(avatarBtn);
    container.appendChild(panel);
  },
  // Add a top-right panel for pre-login pages (index, auth)
  initTopRightPanel: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Panel wrapper
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '1.5em';
    panel.style.right = '2em';
    panel.style.zIndex = '1000';
    panel.style.background = 'var(--card-bg, #18181c)';
    panel.style.border = '1.5px solid var(--border)';
    panel.style.borderRadius = '999px';
    panel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
    panel.style.padding = '0.3em 1.1em 0.3em 1.1em';
    panel.style.display = 'flex';
    panel.style.alignItems = 'center';
    panel.style.gap = '0.7em';

    // Language Dropdown
    const langs = window.AppConfig.languages.supported;
    let currentLang = localStorage.getItem('rarity-leads-language') || window.AppConfig.languages.default;
    const langBtn = document.createElement('button');
    langBtn.className = 'lang-btn';
    langBtn.style.padding = '0.5em 1.4em';
    langBtn.style.borderRadius = '999px';
    langBtn.style.border = '1.5px solid var(--border)';
    langBtn.style.background = 'var(--button-bg)';
    langBtn.style.color = 'var(--primary-text)';
    langBtn.style.fontWeight = '500';
    langBtn.style.cursor = 'pointer';
    langBtn.style.fontSize = '1em';
    langBtn.style.height = '2.4em';
    langBtn.style.display = 'flex';
    langBtn.style.alignItems = 'center';
    langBtn.style.transition = 'background 0.2s, color 0.2s, border 0.2s';
    langBtn.textContent = langs[currentLang].name;
    langBtn.onmouseenter = () => langBtn.style.background = 'var(--sidebar-bg-hover, #232136)';
    langBtn.onmouseleave = () => langBtn.style.background = 'var(--button-bg)';
    const dropdown = document.createElement('ul');
    dropdown.style.display = 'none';
    dropdown.style.position = 'absolute';
    dropdown.style.right = '0';
    dropdown.style.top = '110%';
    dropdown.style.background = 'var(--card-bg, #18181c)';
    dropdown.style.border = '1.5px solid var(--border)';
    dropdown.style.borderRadius = '12px';
    dropdown.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
    dropdown.style.minWidth = '140px';
    dropdown.style.zIndex = '1000';
    dropdown.style.padding = '0.3em 0';
    dropdown.style.margin = '0';
    dropdown.style.listStyle = 'none';
    dropdown.style.transition = 'opacity 0.2s, transform 0.2s';
    Object.entries(langs).forEach(([code, lang]) => {
      const li = document.createElement('li');
      li.textContent = lang.name;
      li.style.padding = '0.6em 1.5em';
      li.style.cursor = 'pointer';
      li.style.color = 'var(--primary-text)';
      li.style.fontWeight = code === currentLang ? '600' : '400';
      li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.style.transition = 'background 0.18s, color 0.18s';
      li.onmouseenter = () => li.style.background = 'var(--sidebar-bg-hover, #232136)';
      li.onmouseleave = () => li.style.background = code === currentLang ? 'var(--button-bg)' : 'transparent';
      li.addEventListener('click', function(e) {
        e.stopPropagation();
        localStorage.setItem('rarity-leads-language', code);
        langBtn.textContent = lang.name;
        dropdown.style.display = 'none';
        if (window.i18n) window.i18n.switchLanguage(code);
      });
      dropdown.appendChild(li);
    });
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      dropdown.style.opacity = dropdown.style.display === 'block' ? '1' : '0';
      dropdown.style.transform = dropdown.style.display === 'block' ? 'translateY(0)' : 'translateY(-8px)';
    });
    document.addEventListener('click', function() {
      dropdown.style.display = 'none';
    });
    // Wrap for dropdown positioning
    const langWrap = document.createElement('div');
    langWrap.style.position = 'relative';
    langWrap.appendChild(langBtn);
    langWrap.appendChild(dropdown);
    panel.appendChild(langWrap);

    // Theme Toggle
    const themeToggleWrap = document.createElement('div');
    themeToggleWrap.style.display = 'flex';
    themeToggleWrap.style.flexDirection = 'column';
    themeToggleWrap.style.alignItems = 'center';
    themeToggleWrap.style.gap = '0.05em';
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle-btn';
    themeToggle.style.background = 'none';
    themeToggle.style.border = 'none';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.fontSize = '1.2em';
    themeToggle.style.display = 'flex';
    themeToggle.style.alignItems = 'center';
    themeToggle.style.justifyContent = 'center';
    themeToggle.style.width = '2.4em';
    themeToggle.style.height = '2.4em';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    themeToggle.style.transition = 'box-shadow 0.18s';
    themeToggle.onmouseenter = () => themeToggle.style.boxShadow = '0 4px 16px rgba(0,0,0,0.16)';
    themeToggle.onmouseleave = () => themeToggle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    const icon = document.createElement('span');
    function setThemeIcon() {
      if (document.body.classList.contains('light-theme')) {
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#fff" stroke="#232136" stroke-width="2"/></svg>';
        themeLabel.textContent = 'Light Theme';
      } else {
        icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="#232136" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" fill="#232136"/></svg>';
        themeLabel.textContent = 'Dark Theme';
      }
    }
    themeToggle.appendChild(icon);
    const themeLabel = document.createElement('span');
    themeLabel.style.fontSize = '0.7em';
    themeLabel.style.fontWeight = '400';
    themeLabel.style.color = 'var(--secondary-text)';
    themeLabel.style.marginTop = '0.05em';
    themeLabel.style.textAlign = 'center';
    themeToggleWrap.appendChild(themeToggle);
    themeToggleWrap.appendChild(themeLabel);
    setThemeIcon();
    themeToggle.onclick = () => {
      document.body.classList.toggle('light-theme');
      localStorage.setItem('rl_theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
      setThemeIcon();
    };
    // On load, set theme
    const savedTheme = localStorage.getItem('rl_theme');
    if (savedTheme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    panel.appendChild(themeToggleWrap);

    container.appendChild(panel);
  }
}; 