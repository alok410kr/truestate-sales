# Architecture Documentation

## System Overview

TruEstate Sales Management System is built with a client-server architecture, handling 1M+ sales records with efficient filtering, sorting, and pagination.

## High-Level Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                   │
│  ┌────────────────────────────────────────┐ │
│  │  Components (UI Layer)                 │ │
│  │  - SearchBar, FilterBar, DataTable     │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │  State Management (App.jsx)            │ │
│  └────────────────────────────────────────┘ │
└──────────────┬──────────────────────────────┘
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────────────┐
│           Backend (Node.js/Express)          │
│  ┌────────────────────────────────────────┐ │
│  │  Routes Layer                          │ │
│  └──────────────┬─────────────────────────┘ │
│  ┌──────────────▼─────────────────────────┐ │
│  │  Controllers Layer                     │ │
│  └──────────────┬─────────────────────────┘ │
│  ┌──────────────▼─────────────────────────┐ │
│  │  Services Layer (Business Logic)      │ │
│  │  - DataService, FilterService,        │ │
│  │    SortService                         │ │
│  └──────────────┬─────────────────────────┘ │
│  ┌──────────────▼─────────────────────────┐ │
│  │  Data Layer (In-Memory CSV)            │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Backend Architecture

### Separation of Concerns

1. **Routes** (`routes/salesRoutes.js`)
   - Define API endpoints
   - Map URLs to controller functions

2. **Controllers** (`controllers/salesController.js`)
   - Handle HTTP requests
   - Validate input
   - Format responses
   - Error handling

3. **Services** (`services/`)
   - **dataService**: CSV loading and data access
   - **filterService**: Filter logic implementation
   - **sortService**: Sorting algorithms

4. **Utils** (`utils/paginationUtil.js`)
   - Reusable helper functions
   - Pagination logic

### Data Flow

```
Client Request
    ↓
Routes (salesRoutes.js)
    ↓
Controllers (salesController.js)
    ↓
Services (filterService, sortService)
    ↓
Data (dataService)
    ↓
Response back to Client
```

### Key Design Decisions

#### 1. In-Memory Data Store
**Why**: 
- Fast query performance for complex filters
- Avoids repeated CSV parsing
- Acceptable memory usage (~500MB for 1M records)

**Trade-off**: 
- Data resets on server restart
- Not suitable for data updates

**Production Alternative**: PostgreSQL with proper indexing

#### 2. Server-Side Processing
**Why**:
- Client can't handle 1M records
- Reduces network transfer
- Consistent performance

**Implementation**:
- All filtering on backend
- All sorting on backend
- Only paginated results sent to client

#### 3. Modular Service Layer
**Why**:
- Single responsibility principle
- Easier testing
- Maintainable code
- Clear separation of concerns

**Benefits**:
- Each service can be modified independently
- Easy to add new filters/sorts
- Business logic separated from HTTP layer

## Frontend Architecture

### Component Hierarchy

```
App (State Management)
├── SearchBar (Search functionality)
├── FilterBar (Filter orchestration)
│   └── MultiSelectFilter × 7 (Individual filters)
├── SortDropdown (Sort options)
├── DataTable (Data display)
└── Pagination (Page navigation)
```

### State Management

**Approach**: Lifted state in App.jsx

**Why not Redux/Context?**
- Application complexity doesn't warrant it
- Minimal props drilling
- Easier to understand
- Fewer dependencies

**State Structure**:
```javascript
{
  data: [],              // Current page data
  filters: {},           // Active filter values
  sortBy: '',           // Sort field
  sortOrder: '',        // asc/desc
  pagination: {},       // Page info
  filterOptions: {},    // Available options
  loading: false,       // Loading state
  error: null           // Error state
}
```

### Component Communication

```
User Interaction
    ↓
Component Event Handler
    ↓
Parent State Update (App.jsx)
    ↓
API Call with New Parameters
    ↓
Update State with Response
    ↓
Re-render Affected Components
```

## API Design

### RESTful Endpoints

#### GET `/api/sales`
**Purpose**: Fetch sales data with filters/sort/pagination

**Query Parameters**:
- Filter params: customerRegion, gender, ageRange, etc.
- Sort params: sortBy, sortOrder
- Pagination params: page, limit

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "total": 1000000,
    "page": 1,
    "limit": 10,
    "totalPages": 100000
  }
}
```

#### GET `/api/filter-options`
**Purpose**: Get available filter values

**Response**:
```json
{
  "customerRegions": [...],
  "genders": [...],
  "productCategories": [...],
  ...
}
```

## Module Responsibilities

### Backend Modules

**dataService.js**
- Load CSV on server start
- Provide data access methods
- Generate unique filter values

**filterService.js**
- Apply search filter
- Apply multi-select filters
- Apply age range logic
- Apply date range logic

**sortService.js**
- Handle different data types (string, number, date)
- Apply sort direction

**salesController.js**
- Coordinate services
- Build response objects
- Handle errors

**paginationUtil.js**
- Calculate page offsets
- Slice data arrays
- Build pagination metadata

### Frontend Modules

**App.jsx**
- Central state management
- API communication
- State coordination

**SearchBar.jsx**
- Capture search input
- Debounce changes (500ms)

**FilterBar.jsx**
- Manage filter dropdown states
- Reset functionality

**MultiSelectFilter.jsx**
- Dropdown UI
- Checkbox selection
- Click-outside detection

**DataTable.jsx**
- Render tabular data
- Sortable headers
- Format currency/phone

**Pagination.jsx**
- Page navigation
- Smart page number display

## Folder Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── services/
│   │   │   ├── dataService.js
│   │   │   ├── filterService.js
│   │   │   └── sortService.js
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   ├── utils/
│   │   │   └── paginationUtil.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── MultiSelectFilter.jsx
│   │   │   ├── SortDropdown.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── *.css
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
├── package.json
└── README.md
```

## Performance Optimizations

### Backend

1. **In-Memory Data**: Fast access without I/O
2. **Efficient Filtering**: Early exits, no unnecessary iterations
3. **Indexed Arrays**: Quick lookups for filter options

### Frontend

1. **Debounced Search**: Reduces API calls (500ms delay)
2. **Component-Scoped CSS**: Faster rendering
3. **Pagination**: Only render 10 items at a time
4. **Conditional Rendering**: Loading/error states

## Security Considerations

1. **Input Validation**: All query params validated
2. **CORS**: Configured for specific origins
3. **Error Handling**: No sensitive data in error messages
4. **No SQL Injection**: Using in-memory data (CSV)

## Scalability

### Current Limitations
- Single server instance
- Data in memory
- No caching
- No database

### Production Recommendations
1. **Database**: PostgreSQL with indexes
2. **Caching**: Redis for filter options
3. **Load Balancing**: Multiple server instances
4. **CDN**: Serve static frontend files
5. **API Rate Limiting**: Prevent abuse

## Testing Strategy

### Unit Tests
- Filter logic functions
- Sort logic functions
- Pagination calculations
- Component rendering

### Integration Tests
- API endpoints
- Filter combinations
- Error handling

### E2E Tests
- User workflows
- Performance under load

---

This architecture provides a solid foundation that's maintainable, testable, and can be scaled for production use.

