# Complete Deployment Guide - TruEstate Sales Management System

## 🚀 Quick Deploy (Recommended)

**Frontend**: Vercel (Free)  
**Backend**: Railway (Free with limits)  
**Time**: 15-20 minutes

---

## Step-by-Step Deployment

### Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Vercel account (sign up at https://vercel.com)

---

## Part 1: Prepare Your Code

### 1. Create GitHub Repository

```powershell
# Navigate to project
cd C:\Users\alok4\Desktop\TruEstate

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TruEstate Sales Management System"

# Create repository on GitHub.com (via website)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/truestate-sales.git
git branch -M main
git push -u origin main
```

### 2. Update Backend for Production

The backend is already configured with:

- ✅ Memory optimization (`--max-old-space-size=4096`)
- ✅ CORS enabled
- ✅ Environment variables support

### 3. Update Frontend API URL

**Create `.env` file in `frontend/` directory:**

```env
VITE_API_URL=https://your-backend-url.railway.app
```

**Update after deployment** with your actual Railway URL.

---

## Part 2: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `truestate-sales` repository

### Step 2: Configure Backend Service

1. **Set Root Directory:**

   - In Railway dashboard → Settings
   - Root Directory: `backend`

2. **Set Build Command:**

   ```
   npm install
   ```

3. **Set Start Command:**

   ```
   node --max-old-space-size=4096 src/index.js
   ```

4. **Add Environment Variables:**
   - Go to Variables tab
   - Add: `NODE_ENV` = `production`
   - Add: `PORT` = `5000`

### Step 3: Handle CSV File

**Problem**: Railway has file size limits, your CSV is 224MB.

**Solution Options:**

#### Option A: Use Cloud Storage (Recommended for Production)

1. **Upload CSV to Google Drive:**

   - Upload `truestate_assignment_dataset.csv`
   - Right-click → Get link → Make public
   - Get direct download link

2. **Update dataService.js:**

   ```javascript
   // Add download function
   const downloadCSV = async () => {
     const url = process.env.CSV_URL || "YOUR_GOOGLE_DRIVE_LINK";
     // Download and save to temp location
   };
   ```

3. **Add environment variable in Railway:**
   - `CSV_URL` = `your-google-drive-link`

#### Option B: Use Smaller Sample Dataset (For Demo)

```powershell
# Create 10,000 row sample
Get-Content truestate_assignment_dataset.csv -Head 10001 | Set-Content backend/sample_data.csv

# Commit and push
git add backend/sample_data.csv
git commit -m "Add sample dataset"
git push
```

Update `backend/src/services/dataService.js`:

```javascript
const dataPath = path.join(__dirname, "..", "..", "sample_data.csv");
```

#### Option C: Use Database (Best for Production)

See "Database Migration" section below.

### Step 4: Deploy

1. Railway will auto-deploy after push
2. Wait 2-3 minutes for build
3. Check logs for "Loaded X records"
4. Get your URL from Railway dashboard

### Step 5: Test Backend

```powershell
# Test health endpoint
curl https://your-app.railway.app/api/health

# Should return:
# {"status":"ok","dataLoaded":true,"recordCount":1000002}
```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Update API URL

1. Create `frontend/.env.production`:

   ```env
   VITE_API_URL=https://your-railway-app.railway.app
   ```

2. Commit changes:
   ```powershell
   git add .
   git commit -m "Update production API URL"
   git push
   ```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI (Fastest)**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Project name: truestate-sales
# - Root directory: ./
# - Build command: npm run build
# - Output directory: dist
```

**Option B: Vercel Dashboard (Easier)**

1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Configure:

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_URL`

5. Click **"Deploy"**

### Step 3: Get Your Live URL

Vercel will give you a URL like:

```
https://truestate-sales.vercel.app
```

---

## Part 4: Final Configuration

### Update CORS in Backend

Update `backend/src/index.js`:

```javascript
const cors = require("cors");

// Update CORS to allow your Vercel domain
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://truestate-sales.vercel.app", // Your Vercel URL
      "https://*.vercel.app", // All Vercel preview deployments
    ],
  })
);
```

Commit and push:

```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy.

---

## Alternative: Deploy Everything to Render

Render offers free hosting for full-stack apps.

### Backend on Render

1. Go to https://render.com/
2. Create **"New Web Service"**
3. Connect GitHub repo
4. Configure:

   - Name: `truestate-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node --max-old-space-size=4096 src/index.js`
   - Instance Type: Free

5. Add Environment Variables:
   - `NODE_ENV=production`

### Frontend on Render

1. Create **"New Static Site"**
2. Configure:
   - Name: `truestate-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

---

## Database Migration (Optional but Recommended)

For production, migrate from CSV to PostgreSQL:

### Option 1: Railway PostgreSQL

1. In Railway, add **"New Service" → "PostgreSQL"**
2. Railway will provide connection string
3. Update backend to use PostgreSQL instead of CSV

### Option 2: Supabase (Free PostgreSQL)

1. Create account at https://supabase.com/
2. Create new project
3. Import CSV data via Supabase dashboard
4. Update backend with connection string

---

## Environment Variables Summary

### Backend (Railway)

```env
NODE_ENV=production
PORT=5000
CSV_URL=your-csv-download-link (if using cloud storage)
DATABASE_URL=postgresql://... (if using database)
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend.railway.app
```

---

## Testing Your Deployment

1. **Test Backend:**

   ```
   https://your-backend.railway.app/api/health
   https://your-backend.railway.app/api/filter-options
   ```

2. **Test Frontend:**

   ```
   https://your-frontend.vercel.app
   ```

3. **Test Features:**
   - Search functionality
   - All filters working
   - Sorting columns
   - Pagination
   - Summary cards updating

---

## Troubleshooting

### Backend Issues

**Out of Memory:**

- Increase memory in Railway settings
- Use database instead of in-memory CSV
- Reduce dataset size

**CSV Not Loading:**

- Check file path in dataService.js
- Verify file is in repository or accessible URL
- Check Railway logs for errors

**CORS Errors:**

- Update CORS origin in backend
- Verify frontend URL matches CORS config

### Frontend Issues

**API Not Connecting:**

- Check VITE_API_URL environment variable
- Verify backend is running (test /api/health)
- Check browser console for errors

**Build Fails:**

- Clear node_modules and reinstall
- Check package.json for correct dependencies
- Verify Vite config is correct

---

## Cost Breakdown

### Free Tier (Sufficient for Demo/Assignment)

- **Railway**: Free with limits (500 hours/month)
- **Vercel**: Free unlimited
- **Total**: $0/month

### Recommended Paid (Production)

- **Railway Pro**: $20/month (more memory, no time limits)
- **Vercel Pro**: $20/month (more bandwidth)
- **PostgreSQL**: $15/month (managed database)
- **Total**: ~$55/month

---

## Quick Commands Reference

```powershell
# Local development
npm run dev

# Build frontend
cd frontend && npm run build

# Test production build locally
cd frontend && npm run preview

# Deploy to Vercel
vercel --prod

# Check Railway logs
railway logs

# Push updates
git add .
git commit -m "Update message"
git push
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible and loading data
- [ ] Frontend loads and displays correctly
- [ ] Search functionality works
- [ ] All filters work independently and together
- [ ] Sorting works on all columns
- [ ] Pagination navigates correctly
- [ ] Summary cards calculate correctly
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)
- [ ] Update README with live URLs

---

## Support & Monitoring

### Railway Monitoring

- View logs: Railway Dashboard → Deployments → Logs
- Monitor memory: Railway Dashboard → Metrics
- Set up alerts for downtime

### Vercel Monitoring

- Analytics: Vercel Dashboard → Analytics
- View deployments: Vercel Dashboard → Deployments
- Check build logs for errors

---

**Your Live URLs (Update After Deployment):**

- **Frontend**: https://truestate-sales.vercel.app
- **Backend API**: https://truestate-backend.railway.app
- **GitHub Repo**: https://github.com/YOUR_USERNAME/truestate-sales

---

**Last Updated**: December 2025
