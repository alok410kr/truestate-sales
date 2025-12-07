# ⚡ Quick 15-Minute Deployment Guide

## What You'll Deploy

- **Frontend**: Vercel (Free, instant)
- **Backend**: Railway (Free, 5 mins)

---

## 🎯 Step 1: Push to GitHub (2 minutes)

```powershell
cd C:\Users\alok4\Desktop\TruEstate

git init
git add .
git commit -m "TruEstate Sales Management System"

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/truestate-sales.git
git branch -M main
git push -u origin main
```

---

## 🚂 Step 2: Deploy Backend to Railway (5 minutes)

1. **Go to**: https://railway.app/
2. **Sign in** with GitHub
3. **New Project** → Deploy from GitHub
4. **Select** your `truestate-sales` repo
5. **Configure**:
   - Root Directory: `backend`
   - Start Command: `node --max-old-space-size=4096 src/index.js`
6. **Add Variables**:
   - `NODE_ENV` = `production`
7. **Wait** for deployment (~3 mins)
8. **Copy** your Railway URL (e.g., `https://xxx.railway.app`)

### ⚠️ CSV File Issue

Your CSV (224MB) is too large for Railway. Choose one:

**Option A: Use Sample Data (Quick)**

```powershell
# Create 10k row sample
Get-Content truestate_assignment_dataset.csv -Head 10001 > backend/sample_data.csv

# Update backend/src/services/dataService.js line 9:
# Change: 'truestate_assignment_dataset.csv'
# To: 'sample_data.csv'

git add .
git commit -m "Add sample data"
git push
```

**Option B: Upload to Google Drive**

1. Upload CSV to Google Drive
2. Make it public, get link
3. Add Railway variable: `CSV_URL=your-link`

---

## 🌐 Step 3: Deploy Frontend to Vercel (3 minutes)

### Update API URL First:

Edit `frontend/src/config.js`:

```javascript
const API_BASE_URL = "https://YOUR-RAILWAY-URL.railway.app";
```

```powershell
git add .
git commit -m "Update API URL"
git push
```

### Deploy:

1. **Go to**: https://vercel.com/
2. **Import Project** from GitHub
3. **Select** your `truestate-sales` repo
4. **Configure**:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable**:
   - `VITE_API_URL` = `https://YOUR-RAILWAY-URL.railway.app`
6. **Deploy** (wait 2 mins)
7. **Get** your Vercel URL

---

## 🔧 Step 4: Update CORS (2 minutes)

Edit `backend/src/index.js` line 5:

```javascript
app.use(
  cors({
    origin: ["http://localhost:3000", "https://YOUR-VERCEL-URL.vercel.app"],
  })
);
```

```powershell
git add .
git commit -m "Update CORS"
git push
```

Railway will auto-redeploy.

---

## ✅ Step 5: Test Your Deployment (3 minutes)

1. **Backend Health**:

   ```
   https://YOUR-RAILWAY-URL.railway.app/api/health
   ```

   Should show: `{"status":"ok","dataLoaded":true}`

2. **Frontend**:

   ```
   https://YOUR-VERCEL-URL.vercel.app
   ```

   Should load the app

3. **Test Features**:
   - ✓ Search works
   - ✓ Filters apply
   - ✓ Sorting works
   - ✓ Pagination works

---

## 🎉 Done!

Your app is live:

- **Frontend**: `https://YOUR-VERCEL-URL.vercel.app`
- **Backend**: `https://YOUR-RAILWAY-URL.railway.app`

---

## 🆘 Quick Fixes

**"Data is still loading" forever:**

- Check Railway logs for memory errors
- Use sample data (see Option A above)

**Frontend shows blank:**

- Check browser console (F12)
- Verify VITE_API_URL in Vercel settings

**CORS error:**

- Update backend CORS (Step 4)
- Redeploy backend

**Build fails:**

- Check Railway/Vercel logs
- Ensure dependencies are correct

---

## 📝 Update README

Add to your README:

```markdown
## Live Demo

- **Application**: https://YOUR-VERCEL-URL.vercel.app
- **API**: https://YOUR-RAILWAY-URL.railway.app
- **GitHub**: https://github.com/YOUR_USERNAME/truestate-sales
```

---

**Total Time**: 15 minutes  
**Cost**: $0 (Free tier)

Good luck! 🚀
