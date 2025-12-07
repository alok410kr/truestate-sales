# Quick Start Guide

Get the TruEstate Sales Management System running in 3 simple steps!

## Step 1: Install Dependencies

### Windows
Double-click `install.bat` or run in PowerShell:
```powershell
.\install.bat
```

### Linux/Mac
```bash
chmod +x install.sh
./install.sh
```

### Alternative (all platforms)
```bash
npm run install-all
```

## Step 2: Start the Application

### Windows
```powershell
npm run dev
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

## Step 3: Open in Browser

Navigate to: **http://localhost:3000**

⚠️ **Wait 30-60 seconds** for the backend to load the CSV data (you'll see "Loaded 1000002 records" in the console).

## Test the Features

1. **Search**: Type "Neha" in the search box
2. **Filter**: Select "South" in Customer Region
3. **Sort**: Click on "Total Amount" column header
4. **Paginate**: Click page numbers at the bottom

## Verify Everything Works

✅ Backend running: http://localhost:5000/api/health  
✅ Frontend running: http://localhost:3000  
✅ No errors in browser console (F12)  
✅ Data loads in the table  
✅ Filters, search, and sorting work  

## Troubleshooting

**"Data is still loading"**
→ Wait 30-60 seconds for CSV to load

**Port already in use**
→ Change port in `backend/src/index.js` (line 6) and `frontend/vite.config.js` (line 7)

**Module not found**
→ Run `npm run install-all` again

## What's Next?

- Read `README.md` for detailed documentation
- Check `docs/architecture.md` for technical details
- Explore the code in `backend/src/` and `frontend/src/`

---

**Need Help?** Check the full README.md or SETUP.md files.

