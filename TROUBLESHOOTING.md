# Troubleshooting Guide

## Issue: Backend "Out of Memory" Error

### Error Message
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

### Cause
The CSV file (224MB, 1M+ records) exceeds Node.js default memory limit (around 2GB).

### Solution 1: Increase Heap Size (Applied)

The scripts have been updated to use 4GB heap:

```json
"start": "node --max-old-space-size=4096 src/index.js"
```

This should work for most systems with 8GB+ RAM.

### Solution 2: Run with Manual Heap Increase

```powershell
# Windows PowerShell
cd backend
node --max-old-space-size=4096 src/index.js
```

```bash
# Linux/Mac
cd backend
node --max-old-space-size=4096 src/index.js
```

### Solution 3: If Still Fails (Lower Memory Systems)

Use streaming approach (load data in chunks):

See `backend/src/services/dataService.streaming.js` for implementation.

---

## Issue: Frontend "Error: spawn UNKNOWN"

### Error Message
```
failed to load config from vite.config.js
Error: spawn UNKNOWN
```

### Cause
Windows-specific esbuild issue, often caused by:
- Antivirus interference
- File system permissions
- Corrupted node_modules

### Solution 1: Reinstall esbuild (Applied)

```powershell
cd frontend
Remove-Item -Path "node_modules/.vite" -Recurse -Force
npm install esbuild --force
```

### Solution 2: Run as Administrator

Right-click PowerShell → "Run as Administrator", then:
```powershell
cd C:\Users\alok4\Desktop\TruEstate
npm run dev
```

### Solution 3: Disable Antivirus Temporarily

Some antivirus software blocks esbuild. Temporarily disable and try again.

### Solution 4: Use Alternative Port

Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 3001, // Change from 3000
  // ...
}
```

### Solution 5: Clear All Caches

```powershell
# Clear npm cache
npm cache clean --force

# Reinstall everything
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "frontend/node_modules" -Recurse -Force
Remove-Item -Path "backend/node_modules" -Recurse -Force

npm run install-all
```

---

## Issue: Port Already in Use

### Error Message
```
Port 5000 is already in use
Port 3000 is already in use
```

### Solution

**Find and Kill Process (Windows)**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Find and Kill Process (Linux/Mac)**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**Or Change Ports**:

Backend (`backend/src/index.js`):
```javascript
const PORT = process.env.PORT || 5001; // Change to 5001
```

Frontend (`frontend/vite.config.js`):
```javascript
server: {
  port: 3001, // Change to 3001
}
```

---

## Issue: "Data is still loading" Message

### Cause
The 224MB CSV file takes 30-60 seconds to load into memory.

### Solution
**Wait!** This is expected behavior. Watch the backend console for:
```
Loaded 1000002 records
Server running on port 5000
```

---

## Issue: Module Not Found

### Error Message
```
Cannot find module 'express'
Cannot find module 'react'
```

### Solution

**Reinstall dependencies**:
```powershell
# Full reinstall
npm run install-all

# Or individually
cd backend
npm install

cd ../frontend
npm install
```

---

## Issue: Git Bash vs PowerShell Issues

### Problem
Scripts work in PowerShell but not Git Bash or vice versa.

### Solution

**Use PowerShell on Windows** (recommended):
- Scripts are optimized for PowerShell
- Better Windows compatibility

**For Git Bash**:
```bash
# Use Unix-style commands
cd backend
node --max-old-space-size=4096 src/index.js
```

---

## Issue: Frontend Shows Blank Page

### Causes & Solutions

1. **Backend not running**:
   - Check: http://localhost:5000/api/health
   - Solution: Start backend first

2. **CORS error**:
   - Check browser console (F12)
   - Solution: Verify `cors()` is enabled in `backend/src/index.js`

3. **API URL wrong**:
   - Check Network tab in DevTools
   - Solution: Verify Vite proxy config

4. **JavaScript error**:
   - Check browser console (F12)
   - Solution: Fix the error shown

---

## Issue: Slow Performance

### Solutions

1. **Reduce page size**:
   Edit `frontend/src/App.jsx`:
   ```javascript
   limit: 10 // Keep at 10 (requirement), or reduce to 5 for faster loading
   ```

2. **Add database** (production):
   - Migrate from CSV to PostgreSQL
   - Add indexes on filter columns
   - See DEPLOYMENT.md for details

3. **Enable caching**:
   - Cache filter options
   - Use Redis for frequent queries

---

## Issue: CSV File Not Found

### Error Message
```
ENOENT: no such file or directory, open '...truestate_assignment_dataset.csv'
```

### Solution

1. **Verify file exists**:
   ```powershell
   Get-Item truestate_assignment_dataset.csv
   ```

2. **Check file location**:
   File must be in project root (same level as `package.json`)

3. **Fix path** if needed:
   Edit `backend/src/services/dataService.js`:
   ```javascript
   const dataPath = path.join(__dirname, '..', '..', '..', 'truestate_assignment_dataset.csv');
   ```

---

## Quick Diagnostic Commands

```powershell
# Check Node version (should be 16+)
node --version

# Check npm version (should be 8+)
npm --version

# Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Check backend health
curl http://localhost:5000/api/health

# Check file exists
Get-Item truestate_assignment_dataset.csv

# Check directory structure
tree /F
```

---

## Still Having Issues?

1. **Check logs**: Look at both terminal outputs (backend and frontend)
2. **Browser console**: Press F12 and check Console and Network tabs
3. **Try separately**: Run backend and frontend in separate terminals
4. **Clean install**:
   ```powershell
   Remove-Item -Path "node_modules" -Recurse -Force
   Remove-Item -Path "package-lock.json" -Force
   npm run install-all
   ```

---

## System Requirements Check

Minimum requirements:
- ✅ Node.js v16+
- ✅ npm v8+
- ✅ 8GB RAM (for 4GB heap)
- ✅ 2GB free disk space
- ✅ Windows 10+ / macOS 10.14+ / Ubuntu 18.04+

Check your system:
```powershell
node --version    # Should show v16 or higher
npm --version     # Should show v8 or higher
systeminfo | findstr Memory  # Check available RAM
```

---

**Last Updated**: December 2025

