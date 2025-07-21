# 🚨 Rarity Leads - Troubleshooting Guide

## Quick Fix (Windows)

1. **Double-click `fix-project.bat`** in your project folder
2. This will automatically:
   - Check Node.js version
   - Clear cache
   - Reinstall dependencies
   - Start the development server

## Manual Fix Steps

### 1. Check Node.js Version
```bash
node --version
```
**Required:** Node.js 18.17 or later

### 2. Clear Everything and Reinstall
```bash
# Windows
if exist .next rmdir /s /q .next
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm install --legacy-peer-deps

# Mac/Linux
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
```

### 3. Start Development Server
```bash
npm run dev
```

## Common Issues & Solutions

### Issue: "npm run dev" not working
**Solution:**
1. Run the fix script: `fix-project.bat`
2. Or manually clear cache and reinstall

### Issue: Port 3000 already in use
**Solution:**
```bash
npm run dev -- -p 3001
```

### Issue: Import errors
**Solution:**
1. Clear cache: `rm -rf .next`
2. Restart development server

### Issue: Dependencies not found
**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: TypeScript errors
**Solution:**
```bash
npm run type-check
```

## Alternative: Use Bun

If npm continues to have issues, try using Bun:

```bash
# Install Bun (if not installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Start development server
bun run dev
```

## Project Structure

```
rarityleads_in_cursor_current_one/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   └── lib/                    # Utilities
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── fix-project.bat            # Windows fix script
```

## Getting Help

If you're still having issues:

1. Check the console for specific error messages
2. Make sure you're in the correct directory
3. Try running as administrator (Windows)
4. Check if antivirus is blocking Node.js
5. Try a different port: `npm run dev -- -p 3001`

## Success Indicators

When everything is working correctly, you should see:
- ✅ Development server starts on http://localhost:3000
- ✅ No error messages in terminal
- ✅ Homepage loads with Rarity Leads branding
- ✅ Navigation works between pages
- ✅ All components render properly 