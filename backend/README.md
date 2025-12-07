# TruEstate Backend

## Architecture

The backend follows a clean, layered architecture:

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── index.js        # Entry point
└── package.json
```

### Layers

1. **Routes** (`routes/`): Define API endpoints
2. **Controllers** (`controllers/`): Handle HTTP requests/responses
3. **Services** (`services/`): Contain business logic
4. **Utils** (`utils/`): Reusable utility functions

### Data Flow

```
Request → Routes → Controllers → Services → Data → Response
```

## API Endpoints

### GET `/api/sales`
Get sales data with filtering, sorting, and pagination.

**Query Parameters:**
- `search` - Search term (name or phone)
- `customerRegion` - Comma-separated regions
- `gender` - Comma-separated genders
- `ageRange` - Comma-separated age ranges
- `productCategory` - Comma-separated categories
- `tags` - Comma-separated tags
- `paymentMethod` - Comma-separated payment methods
- `dateRange` - Date range filter
- `sortBy` - Field to sort by
- `sortOrder` - Sort direction (asc/desc)
- `page` - Page number
- `limit` - Results per page

### GET `/api/filter-options`
Get available filter options.

### GET `/api/health`
Health check endpoint.

## Setup

```bash
npm install
npm start
```

## Environment Variables

```
PORT=5000
NODE_ENV=development
```

