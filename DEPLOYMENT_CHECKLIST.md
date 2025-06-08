# 🚀 Deployment & Auth Configuration Checklist

## ✅ **PART 1: GitHub → Netlify Auto Deploy**

### **1.1 Verify Netlify Configuration**
- [ ] **Netlify project linked to correct GitHub repo**
- [ ] **Branch**: `main` or `master` (check which one you're using)
- [ ] **Build command**: `npm run build` (configured in netlify.toml)
- [ ] **Publish directory**: `.` (root directory)
- [ ] **Auto deploy**: Enabled from GitHub

### **1.2 Test Auto Deploy**
```bash
# Make a small change and push to test
echo "<!-- Deploy test -->" >> index.html
git add .
git commit -m "test: verify auto deploy"
git push origin main
```

### **1.3 Check Netlify Dashboard**
- [ ] **Site overview**: Shows latest deploy
- [ ] **Deploy status**: Success (green)
- [ ] **Deploy time**: Recent timestamp
- [ ] **Build logs**: No errors

---

## 🔐 **PART 2: Supabase + Google OAuth Configuration**

### **2.1 Supabase Project Setup**
- [ ] **Project created**: `rarity-leads`
- [ ] **Database schema**: Execute `schema_new.sql` in SQL Editor
- [ ] **URL configured**: `https://yejheyrdsucgzpzwxuxs.supabase.co`
- [ ] **Anon key**: Configured in auth.html

### **2.2 Google Cloud Console Setup**
1. **Create OAuth 2.0 Client ID**:
   - [ ] **Application type**: Web application
   - [ ] **Name**: Rarity Leads
   - [ ] **Authorized JavaScript origins**: 
     - `https://rarityleads.netlify.app`
   - [ ] **Authorized redirect URIs**: 
     - `https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback`

2. **Copy credentials**:
   - [ ] **Client ID**: Copy from Google Cloud Console
   - [ ] **Client Secret**: Copy from Google Cloud Console

### **2.3 Supabase Authentication Setup**
1. **Go to Authentication > Providers**:
   - [ ] **Enable Google provider**
   - [ ] **Paste Client ID** from Google Cloud Console
   - [ ] **Paste Client Secret** from Google Cloud Console
   - [ ] **Save configuration**

2. **Go to Authentication > URL Configuration**:
   - [ ] **Site URL**: `https://rarityleads.netlify.app`
   - [ ] **Redirect URLs**: 
     - `https://rarityleads.netlify.app/dashboard.html`
     - `https://rarityleads.netlify.app/auth.html`

---

## 🧪 **PART 3: Testing Authentication Flow**

### **3.1 Test Complete User Journey**
1. **Homepage → Auth**:
   - [ ] Visit: `https://rarityleads.netlify.app`
   - [ ] Click "Get Started" → Should go to `/auth.html`

2. **Google OAuth Flow**:
   - [ ] Click "Continue with Google"
   - [ ] **Console logs**: Check for detailed debug info
   - [ ] **Google popup**: Should open for login
   - [ ] **After login**: Should redirect to `/dashboard.html`

3. **Dashboard Protection**:
   - [ ] **Authenticated users**: Can access dashboard
   - [ ] **Unauthenticated users**: Redirected to auth
   - [ ] **Sign out**: Works and redirects to homepage

### **3.2 Debug Console Logs**
**Expected logs for successful flow**:
```
🚀 Auth page loaded with Supabase SDK
✅ Google button found and ready
🔗 Google button clicked
🔧 Calling supabase.auth.signInWithOAuth...
📊 OAuth result: {data: {url: "https://accounts.google.com/..."}}
✅ OAuth call successful!
🔄 Redirecting to Google URL: https://accounts.google.com/...
```

**After Google login**:
```
🔄 Auth state changed: SIGNED_IN
✅ User signed in successfully: user@example.com
🚀 Redirecting to: /dashboard.html
```

**Dashboard access**:
```
🏠 Dashboard: Checking authentication...
✅ Dashboard: Access granted
📊 Dashboard: Initializing...
```

---

## 🚨 **PART 4: Common Issues & Solutions**

### **Issue 1: "Goes directly to dashboard without Google login"**
**Cause**: Google OAuth not configured in Supabase
**Solution**: 
- [ ] Enable Google provider in Supabase
- [ ] Add Client ID/Secret from Google Cloud Console

### **Issue 2: "OAuth error" or "Invalid client"**
**Cause**: Incorrect Google Cloud Console configuration
**Solution**:
- [ ] Check authorized JavaScript origins
- [ ] Verify redirect URI exactly matches Supabase callback

### **Issue 3: "Redirect URI mismatch"**
**Cause**: Wrong callback URL in Google Cloud Console
**Solution**:
- [ ] Use exact URL: `https://yejheyrdsucgzpzwxuxs.supabase.co/auth/v1/callback`

### **Issue 4: "Auto deploy not working"**
**Cause**: Netlify not properly linked to GitHub
**Solution**:
- [ ] Check Netlify site settings
- [ ] Verify GitHub integration
- [ ] Check build & deploy settings

---

## 🎯 **PART 5: Final Verification**

### **5.1 Complete Flow Test**
1. **Open incognito window**
2. **Visit**: `https://rarityleads.netlify.app`
3. **Click "Get Started"**
4. **Click "Continue with Google"**
5. **Complete Google login**
6. **Verify dashboard access**
7. **Test sign out**

### **5.2 Success Criteria**
- [ ] ✅ Auto deploy works on git push
- [ ] ✅ Homepage loads correctly
- [ ] ✅ "Get Started" → auth.html
- [ ] ✅ Google OAuth opens popup
- [ ] ✅ After login → dashboard.html
- [ ] ✅ Dashboard protected from unauthenticated users
- [ ] ✅ Sign out works and redirects home

---

## 📞 **Need Help?**

**If something doesn't work**:
1. **Check browser console** (F12) for error messages
2. **Check Netlify deploy logs** for build errors
3. **Check Supabase logs** in Authentication section
4. **Verify all URLs** match exactly (no trailing slashes, etc.)

**Common commands**:
```bash
# Test local development
npm run dev

# Check git status
git status

# Push changes
git add .
git commit -m "fix: auth configuration"
git push origin main
```

**You're almost there! 🎉**
