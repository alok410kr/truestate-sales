# ⚡ PostgreSQL Setup - Quick Steps

## 🎯 What You Need to Do in Railway Dashboard

### Step 1: Add PostgreSQL Database (2 minutes)

1. Go to https://railway.app/dashboard
2. Click on your **truestate-sales** project
3. Click **"+ New"** button
4. Select **"Database"**
5. Click **"Add PostgreSQL"**
6. Railway creates the database automatically ✅

### Step 2: Verify Database URL (30 seconds)

1. Click on the **PostgreSQL** service (purple database icon)
2. Go to **"Variables"** tab
3. You should see **`DATABASE_URL`** variable
4. **Copy this URL** (you'll need it for testing)

The URL looks like:
```
postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:7890/railway
```

### Step 3: Link Database to Backend (Railway does this automatically!)

Railway automatically shares `DATABASE_URL` between services in the same project.

**Verify:**
1. Click on your **backend service** (not the database)
2. Go to **"Variables"** tab
3. You should see `DATABASE_URL` there too ✅

If not, add it manually:
- Click **"New Variable"**
- **Reference**: Choose PostgreSQL → DATABASE_URL

### Step 4: Push Code & Deploy

That's it! Now push the code:

```powershell
git push
```

Railway will:
1. Detect the push
2. Start new deployment
3. Install dependencies (including `pg` package)
4. Run `node src/index.postgres.js`
5. Connect to PostgreSQL
6. Create tables with indexes
7. Import 10,000 records from CSV (first time only)
8. Start accepting requests

**This takes 2-3 minutes on first deploy** (CSV import)

### Step 5: Watch Deployment

In Railway dashboard:
1. Click on backend service
2. Go to **"Deployments"** tab
3. Watch the logs:

```
✓ Installing dependencies...
✓ Starting server...
✓ Connected to PostgreSQL database
✓ Sales table created successfully with indexes
Database is empty. Importing CSV data...
Imported 1000 records...
Imported 2000 records...
...
✓ CSV import completed! Total records: 10001
✓ Database initialized successfully
✓ Server running on port 5000
```

### Step 6: Test

Once deployment succeeds:

**Test Health:**
```
https://loyal-mindfulness-production-422f.up.railway.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "database": "PostgreSQL",
  "dataLoaded": true,
  "recordCount": 10001
}
```

If you see `"database": "PostgreSQL"` - **SUCCESS!** ✅

### Step 7: Test Your App

Open your Vercel app:
```
https://truestate-sales.vercel.app/
```

Should now work with PostgreSQL database! 🎉

---

## ⚡ Quick Checklist

- [ ] Added PostgreSQL database in Railway
- [ ] Verified `DATABASE_URL` exists in backend variables
- [ ] Pushed code: `git push`
- [ ] Watched deployment logs (2-3 mins)
- [ ] Tested `/api/health` endpoint
- [ ] Tested Vercel app

---

## 🎁 What You Get with PostgreSQL

✅ **Persistent Data** - Survives server restarts
✅ **Faster Queries** - 20-50ms (vs 100-300ms with CSV)
✅ **Less Memory** - 50MB (vs 500MB with CSV)
✅ **Production Ready** - Industry standard
✅ **Scalable** - Can handle millions of records
✅ **Indexed** - 8 indexes for fast filtering

---

## 🆘 Troubleshooting

**"Database is still initializing"**
- Wait 2-3 minutes for first-time CSV import
- Check Railway logs for progress

**Can't see DATABASE_URL in backend**
- Click backend service → Variables
- Click "New Variable" → "Reference"
- Select PostgreSQL service → DATABASE_URL

**Import stuck or taking too long**
- Check Railway logs in Deployments tab
- First import takes ~30 seconds for 10k records
- If stuck, click "Redeploy"

**Want to rollback to CSV?**
- Change railway.json start command back to:
  ```
  "startCommand": "cd backend && node --max-old-space-size=4096 src/index.js"
  ```
- Remove DATABASE_URL variable
- Push changes

---

## 💰 Cost

Railway PostgreSQL:
- **Free Tier**: 512MB RAM, 1GB storage
- **Your Data**: ~5MB (10k records)
- **Perfect for**: This assignment
- **Upgrade if needed**: $5/month for more

---

**Ready? Go to Railway dashboard and add PostgreSQL!** 🚀

Then push: `git push`

