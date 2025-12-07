# Deployment Guide - TruEstate Sales Management System

## Quick Deploy Links

### Recommended Platforms

**Frontend (Client)**:
- Vercel (Recommended) - Best for React/Vite apps
- Netlify
- AWS S3 + CloudFront

**Backend (Server)**:
- Railway (Recommended) - Easy Node.js deployment
- Heroku
- AWS EC2 / DigitalOcean

## Local Development Setup

### Prerequisites
- Node.js v16+ installed
- Git installed
- Terminal/Command Prompt access

### Step-by-Step Setup

1. **Clone/Download the repository**
```bash
cd TruEstate
```

2. **Install all dependencies** (one command)
```bash
npm run install-all
```

3. **Start the application**
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

The backend will automatically load the CSV data on first start (takes 30-60 seconds for 1M records).

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Backend Deployment (Railway)

1. **Create Railway account** at https://railway.app

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or "Empty Project")

3. **Configure settings**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Port: `5000` (Railway auto-detects)

4. **Add environment variables**:
   ```
   NODE_ENV=production
   PORT=5000
   ```

5. **Upload CSV file**:
   - Railway doesn't support large files in Git
   - Use Railway volumes or host CSV on cloud storage (S3)
   - Update path in `server/index.js` accordingly

6. **Deploy**: Railway will provide a public URL like `https://your-app.railway.app`

#### Frontend Deployment (Vercel)

1. **Update API URL** in `client/src/App.jsx`:
```javascript
// Change axios base URL
axios.defaults.baseURL = 'https://your-railway-app.railway.app';
```

2. **Build the application**:
```bash
cd client
npm run build
```

3. **Deploy to Vercel**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel --prod
```

Or use Vercel's GitHub integration for automatic deployments.

### Option 2: Deploy to Heroku (Full Stack)

#### Backend on Heroku

1. **Create Heroku app**:
```bash
heroku create truestate-sales-api
```

2. **Configure buildpack**:
```bash
heroku buildpacks:set heroku/nodejs
```

3. **Set environment variables**:
```bash
heroku config:set NODE_ENV=production
```

4. **For large CSV file**, use:
   - Amazon S3 (upload CSV, access via AWS SDK)
   - Heroku Postgres (import CSV to database)

5. **Deploy**:
```bash
git subtree push --prefix server heroku main
```

#### Frontend on Netlify

1. **Build the frontend**:
```bash
cd client
npm run build
```

2. **Deploy via Netlify CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: Docker Deployment

Create `Dockerfile` for backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
COPY truestate_assignment_dataset.csv ./
EXPOSE 5000
CMD ["node", "index.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./truestate_assignment_dataset.csv:/app/truestate_assignment_dataset.csv

  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    depends_on:
      - backend
```

Deploy to:
- AWS ECS
- Google Cloud Run
- DigitalOcean App Platform

## Environment Configuration

### Development
```env
# server/.env
PORT=5000
NODE_ENV=development
```

### Production
```env
# server/.env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Database Migration (Production Recommendation)

For production, migrate from CSV to a database:

### PostgreSQL Setup

1. **Create database**:
```sql
CREATE DATABASE truestate_sales;
```

2. **Create table**:
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(50),
  date DATE,
  customer_id VARCHAR(50),
  customer_name VARCHAR(100),
  phone_number VARCHAR(20),
  gender VARCHAR(10),
  age INT,
  customer_region VARCHAR(50),
  customer_type VARCHAR(50),
  product_id VARCHAR(50),
  product_name VARCHAR(200),
  brand VARCHAR(100),
  product_category VARCHAR(50),
  tags TEXT,
  quantity INT,
  price_per_unit DECIMAL(10,2),
  discount_percentage DECIMAL(5,2),
  total_amount DECIMAL(10,2),
  final_amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  order_status VARCHAR(50),
  delivery_type VARCHAR(50),
  store_id VARCHAR(50),
  store_location VARCHAR(100),
  salesperson_id VARCHAR(50),
  employee_name VARCHAR(100)
);
```

3. **Import CSV**:
```sql
COPY transactions FROM '/path/to/truestate_assignment_dataset.csv' 
DELIMITER ',' 
CSV HEADER;
```

4. **Create indexes for performance**:
```sql
CREATE INDEX idx_customer_name ON transactions(customer_name);
CREATE INDEX idx_phone_number ON transactions(phone_number);
CREATE INDEX idx_customer_region ON transactions(customer_region);
CREATE INDEX idx_product_category ON transactions(product_category);
CREATE INDEX idx_date ON transactions(date);
```

5. **Update server code** to use PostgreSQL with `pg` library.

## Performance Optimization

### Frontend
- Enable Gzip compression
- Minify CSS/JS (Vite handles this)
- Lazy load components if needed
- Add service worker for caching

### Backend
- Enable response compression
```javascript
const compression = require('compression');
app.use(compression());
```

- Add Redis caching for frequent queries
- Rate limiting to prevent abuse
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
```

## Monitoring

### Application Health
- Use `/api/health` endpoint for health checks
- Set up uptime monitoring (UptimeRobot, StatusCake)

### Performance
- Monitor API response times
- Track error rates
- Monitor memory usage

### Logs
- Use centralized logging (LogDNA, Papertrail)
- Log levels: ERROR, WARN, INFO, DEBUG

## Troubleshooting

### "Data is still loading" error
**Cause**: CSV file hasn't finished loading
**Solution**: Wait 30-60 seconds after server start

### High memory usage
**Cause**: 1M records in memory
**Solution**: Migrate to database or implement streaming

### Slow response times
**Cause**: Complex filter combinations on large dataset
**Solution**: Add database indexes, enable caching

### CORS errors
**Cause**: Frontend and backend on different domains
**Solution**: Configure CORS properly in server/index.js

## Backup Strategy

### Data Backup
- Original CSV file: Keep secure backups
- If using database: Daily automated backups
- Version control: All code in Git

### Disaster Recovery
- Document restoration process
- Test backups regularly
- Keep multiple backup copies

## Cost Estimation

### Free Tier Hosting
- **Vercel**: Free for frontend
- **Railway**: $5/month (500MB RAM)
- **Total**: ~$5/month

### Database Option
- **Railway PostgreSQL**: Included in $5 plan
- **AWS RDS**: $15-30/month
- **DigitalOcean Managed DB**: $15/month

## Checklist for Production

- [ ] Environment variables configured
- [ ] CORS origins restricted to production domain
- [ ] Error logging enabled
- [ ] Health check endpoint configured
- [ ] SSL/HTTPS enabled
- [ ] Compression enabled
- [ ] Rate limiting configured
- [ ] Database backups automated (if using DB)
- [ ] Monitoring set up
- [ ] Documentation updated with live URLs

## Support

For deployment issues, consult:
- Platform documentation (Vercel, Railway, etc.)
- This guide
- Application logs

---

**Last Updated**: December 2025

