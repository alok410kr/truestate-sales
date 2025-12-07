# Setup Guide - TruEstate Sales Management System

## Quick Start (5 minutes)

### Windows

1. **Open PowerShell in the project directory**

2. **Run the installation script**:
```powershell
npm run install-all
```

3. **Start the application**:
```powershell
npm run dev
```

4. **Open your browser**:
Navigate to http://localhost:3000

### Linux/Mac

1. **Open Terminal in the project directory**

2. **Run the installation script**:
```bash
npm run install-all
```

3. **Start the application**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to http://localhost:3000

## Detailed Setup Instructions

### Step 1: Install Node.js

If you don't have Node.js installed:

**Windows**:
- Download from https://nodejs.org/ (v16 LTS or higher)
- Run the installer
- Verify: `node --version` and `npm --version`

**Mac** (using Homebrew):
```bash
brew install node
```

**Linux** (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Verify Prerequisites

```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version (should be 8+)
npm --version

# Verify you're in the correct directory
# You should see: package.json, server/, client/, and truestate_assignment_dataset.csv
dir  # Windows
ls   # Mac/Linux
```

### Step 3: Install Dependencies

#### Option A: All at Once (Recommended)
```bash
npm run install-all
```

#### Option B: Manual Installation
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 4: Verify Installation

Check that these folders exist:
- `node_modules/` (root)
- `server/node_modules/`
- `client/node_modules/`

### Step 5: Start the Application

#### Option A: Run Both (Recommended)
```bash
npm run dev
```

This starts both frontend and backend servers concurrently.

#### Option B: Run Separately

**Terminal 1 - Backend**:
```bash
cd server
npm start
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
```

### Step 6: Access the Application

1. **Wait for the backend to load the CSV** (30-60 seconds)
   - You'll see: "Loaded 1000002 records" in the console

2. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Troubleshooting

### Problem: "Cannot find module 'express'"

**Solution**:
```bash
cd server
npm install
```

### Problem: "Cannot find module 'react'"

**Solution**:
```bash
cd client
npm install
```

### Problem: Port 3000 or 5000 already in use

**Solution**:

**Windows**:
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux**:
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>
```

Or change the port in `server/index.js`:
```javascript
const PORT = process.env.PORT || 5001; // Change to 5001
```

### Problem: "ENOENT: no such file or directory, open '...truestate_assignment_dataset.csv'"

**Solution**: Make sure the CSV file is in the project root directory (same level as README.md).

### Problem: Application loads but shows "Data is still loading"

**Solution**: Wait! The CSV file is large (224MB). It takes 30-60 seconds to load all 1M records into memory. Check the server console for progress.

### Problem: White screen or blank page

**Solution**:
1. Check browser console for errors (F12)
2. Verify backend is running: http://localhost:5000/api/health
3. Clear browser cache and reload
4. Check firewall settings

### Problem: Filters not working

**Solution**:
1. Check Network tab in browser DevTools
2. Verify API calls are succeeding
3. Check server console for errors
4. Ensure data is loaded (check /api/health endpoint)

## Development Workflow

### Making Changes

**Frontend changes**:
1. Edit files in `client/src/`
2. Vite will auto-reload the browser
3. See changes instantly

**Backend changes**:
1. Edit files in `server/`
2. For auto-reload, use nodemon:
```bash
cd server
npm install -D nodemon
npm run dev
```

### Testing Filters

Test with these combinations:
1. Search: "Neha"
2. Customer Region: North, South
3. Gender: Female
4. Age Range: 18-25
5. Product Category: Clothing
6. Sort by: Total Amount (Descending)

### Building for Production

**Frontend**:
```bash
cd client
npm run build
```

Output will be in `client/dist/`

**Backend**:
No build needed - Node.js runs the source files directly.

## System Requirements

### Development
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 2GB free space
- **CPU**: Any modern processor
- **OS**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

### Production
- **RAM**: 1GB minimum (server needs to load 1M records)
- **Storage**: 500MB minimum
- **Bandwidth**: Depends on user count

## File Structure Verification

After setup, your directory should look like this:

```
TruEstate/
├── node_modules/           ✓
├── client/
│   ├── node_modules/       ✓
│   ├── src/                ✓
│   ├── index.html          ✓
│   ├── package.json        ✓
│   └── vite.config.js      ✓
├── server/
│   ├── node_modules/       ✓
│   ├── index.js            ✓
│   └── package.json        ✓
├── truestate_assignment_dataset.csv  ✓
├── package.json            ✓
├── README.md               ✓
├── ARCHITECTURE.md         ✓
└── DEPLOYMENT.md           ✓
```

## Next Steps

1. ✅ Verify application is running
2. ✅ Test all filters
3. ✅ Test search functionality
4. ✅ Test sorting
5. ✅ Test pagination
6. ✅ Review code in `server/` and `client/src/`
7. ✅ Read ARCHITECTURE.md for technical details
8. ✅ Deploy to production (see above)

## Getting Help

### Common Commands

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Start only backend
npm run server

# Start only frontend
npm run client

# Build frontend for production
cd client && npm run build

# Check backend API health
curl http://localhost:5000/api/health
```

### Useful Links

- React Documentation: https://react.dev
- Express Documentation: https://expressjs.com
- Vite Documentation: https://vitejs.dev
- Axios Documentation: https://axios-http.com

## Security Notes

### Development
- CORS is enabled for localhost
- No authentication required

### Production
- Update CORS to allow only your frontend domain
- Add authentication/authorization
- Use HTTPS
- Add rate limiting
- Validate all inputs

## Performance Tips

### If the application is slow:

1. **Reduce pagination limit**:
   - Change `limit: 50` to `limit: 20` in `App.jsx`

2. **Add database indexing** (if migrated to DB)

3. **Enable caching**:
   - Cache filter options (they rarely change)
   - Cache popular filter combinations

4. **Optimize CSV loading**:
   - Use streaming instead of loading all at once
   - Consider chunked loading

## FAQ

**Q: Why does the server take so long to start?**
A: The CSV file (224MB, 1M records) is loaded into memory. This takes 30-60 seconds.

**Q: Can I reduce memory usage?**
A: Yes, migrate to a database (PostgreSQL recommended). See ARCHITECTURE.md for details.

**Q: How do I change the number of results per page?**
A: Edit `pagination.limit` in `client/src/App.jsx` (default is 50).

**Q: Can I add more filters?**
A: Yes! Add to `FilterBar.jsx` and update the backend filtering logic in `server/index.js`.

**Q: Is the data real?**
A: This is sample/generated data for the assignment.

**Q: Can I export the filtered data?**
A: Not implemented yet, but you can add an export feature using a library like `json2csv`.

---

**Setup Complete!** 🎉 

You should now have a fully functional Sales Management System running locally.

