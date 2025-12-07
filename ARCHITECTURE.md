# Architecture Document - TruEstate Sales Management System

## System Overview

The TruEstate Sales Management System is a full-stack web application designed to handle and visualize large-scale sales transaction data. The system processes 1M+ records efficiently through a client-server architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │           React Frontend (Vite)                   │  │
│  │  ┌────────────┐  ┌──────────────┐               │  │
│  │  │    App     │  │  Components  │               │  │
│  │  │  (State)   │  │  - SearchBar │               │  │
│  │  │            │  │  - FilterBar │               │  │
│  │  │            │  │  - DataTable │               │  │
│  │  │            │  │  - Pagination│               │  │
│  │  └────────────┘  └──────────────┘               │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│                    HTTP/REST API                         │
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Server Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Express.js API Server                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │         Route Handlers                      │  │  │
│  │  │  - GET /api/sales                          │  │  │
│  │  │  - GET /api/filter-options                 │  │  │
│  │  │  - GET /api/health                         │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │      Business Logic Layer                   │  │  │
│  │  │  - Filtering Engine                        │  │  │
│  │  │  - Sorting Engine                          │  │  │
│  │  │  - Search Engine                           │  │  │
│  │  │  - Pagination Logic                        │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                         │                                │
│                    CSV Parser                            │
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         In-Memory Data Store                      │  │
│  │  (Loaded on server start from CSV)               │  │
│  │  - 1M+ records                                    │  │
│  │  - Indexed for fast filtering                    │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │    truestate_assignment_dataset.csv              │  │
│  │    (224 MB, 1M+ rows, 26 columns)                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18.2.0**: Modern UI library with hooks
- **Vite 5.0.8**: Fast build tool and dev server
- **Axios 1.6.0**: HTTP client for API calls
- **CSS3**: Custom styling without frameworks for better control

### Backend
- **Node.js**: JavaScript runtime
- **Express 4.18.2**: Minimalist web framework
- **csv-parser 3.0.0**: Streaming CSV parser
- **cors 2.8.5**: Enable cross-origin requests

### Development Tools
- **concurrently**: Run multiple npm scripts simultaneously
- **nodemon**: Auto-restart server on file changes

## Data Flow

### 1. Initial Load
```
User Opens App
     ↓
React App Mounts
     ↓
Fetch Filter Options (/api/filter-options)
     ↓
Fetch Initial Data (/api/sales)
     ↓
Render UI with Data
```

### 2. Filter/Search/Sort Flow
```
User Interacts with UI
     ↓
Update Local State
     ↓
Debounce (for search)
     ↓
Build Query Parameters
     ↓
API Request to /api/sales
     ↓
Server Processes:
  - Apply Search Filter
  - Apply Multi-Select Filters
  - Apply Sorting
  - Apply Pagination
     ↓
Return Filtered/Sorted/Paginated Data
     ↓
Update UI with New Data
```

## Component Architecture

### App.jsx (Main Container)
- **Responsibilities**:
  - Application state management
  - API communication
  - State coordination between components
  - Error handling

- **State**:
  - `data`: Current page of sales records
  - `filters`: Active filter values
  - `sortBy`, `sortOrder`: Sorting configuration
  - `pagination`: Pagination state
  - `filterOptions`: Available filter values

### SearchBar Component
- **Responsibilities**:
  - Capture user search input
  - Debounce input changes (500ms)
  - Clear search functionality

- **Features**:
  - Search icon
  - Clear button (when text present)
  - Auto-debouncing

### FilterBar Component
- **Responsibilities**:
  - Render all filter dropdowns
  - Manage filter dropdown open/close state
  - Reset all filters functionality

- **Features**:
  - Reset button with active state indicator
  - Orchestrates multiple MultiSelectFilter components

### MultiSelectFilter Component
- **Responsibilities**:
  - Display filter dropdown
  - Handle multi-select logic
  - Manage dropdown open/close
  - Click-outside detection

- **Features**:
  - Custom checkbox styling
  - Badge showing count of selected items
  - Scrollable dropdown for many options
  - Support for single-select mode (date range)

### SortDropdown Component
- **Responsibilities**:
  - Display sort options
  - Handle sort field selection
  - Show current sort configuration

- **Features**:
  - Dropdown menu
  - Active state highlighting
  - Click-outside detection

### DataTable Component
- **Responsibilities**:
  - Render sales data in table format
  - Handle column sorting
  - Format data appropriately

- **Features**:
  - Sortable column headers
  - Formatted currency (₹ symbol)
  - Formatted phone numbers (+91 prefix)
  - Copy phone number button
  - Category badges
  - Loading state
  - Empty state
  - Responsive horizontal scroll

### Pagination Component
- **Responsibilities**:
  - Navigate between pages
  - Display current page and total pages
  - Smart page number display

- **Features**:
  - Previous/Next buttons
  - Ellipsis for large page counts
  - Disabled state for boundaries
  - Active page highlighting

## API Design Decisions

### 1. Server-Side Processing
**Why**: With 1M+ records, client-side filtering would be:
- Memory intensive
- Slow initial load
- Poor user experience

**Implementation**: All data operations (filter, sort, search, paginate) happen on the server.

### 2. In-Memory Data Store
**Why**: 
- Faster than reading CSV on each request
- Enables complex filtering efficiently
- Trade-off: Higher memory usage (~500MB) for better performance

**Alternative**: Could use SQLite/PostgreSQL for production

### 3. Pagination Default: 50 Records
**Why**:
- Balance between data transfer and user convenience
- Typical screen can display 20-30 rows comfortably
- 50 provides buffer for larger screens

### 4. RESTful API
**Why**:
- Standard, well-understood pattern
- Easy to extend
- Good for CRUD operations
- Cacheable responses

## State Management

### React State (useState)
- Used for component-local state
- Filter open/close states
- Form inputs

### Lifted State (App.jsx)
- Filters, sorting, pagination
- Fetched data
- Loading and error states

**Why not Redux/Context?**
- Application complexity doesn't warrant it
- Props drilling is minimal
- Fewer dependencies
- Easier to understand for assignment review

## Performance Optimizations

### 1. Debounced Search
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(searchTerm)
  }, 500)
  return () => clearTimeout(timer)
}, [searchTerm])
```
- Reduces API calls during typing
- 500ms delay balances responsiveness and efficiency

### 2. Efficient Filtering
- Early exit on empty filters
- Array operations optimized
- No unnecessary iterations

### 3. Smart Pagination Display
- Only shows relevant page numbers
- Ellipsis for large page counts
- Prevents rendering thousands of buttons

### 4. Component Memoization Opportunity
- Could add `React.memo()` to prevent unnecessary re-renders
- Not critical for current scale but good for future

## Security Considerations

### Input Validation
- Server validates all query parameters
- Prevents injection attacks
- Sanitizes user inputs

### CORS Policy
- Configured to allow only necessary origins
- Can be restricted in production

### Data Exposure
- Only necessary fields sent to client
- No sensitive business logic in frontend

## Scalability Considerations

### Current Limitations
1. **Memory**: All data loaded in memory (~500MB)
2. **Single Process**: No horizontal scaling
3. **No Caching**: Each request processes from scratch

### Production Improvements
1. **Database**: Move to PostgreSQL/MongoDB
   - Indexed queries
   - Better memory management
   - ACID transactions

2. **Caching**: Redis for frequent queries
   - Cache filter options
   - Cache popular filter combinations
   - TTL-based invalidation

3. **Pagination**: Cursor-based instead of offset
   - Better performance for large offsets
   - More consistent results

4. **Load Balancing**: Multiple server instances
   - Handle more concurrent users
   - Fault tolerance

5. **API Rate Limiting**: Prevent abuse
   - Per-user/IP limits
   - Throttling

6. **CDN**: Serve static assets
   - Faster global access
   - Reduced server load

## Testing Strategy

### Unit Tests (Recommended)
- Component rendering
- Filter logic
- Sort logic
- Pagination calculations

### Integration Tests
- API endpoints
- Filter combinations
- Search functionality

### E2E Tests
- Full user workflows
- Filter + search + sort combinations
- Performance under load

## Deployment Strategy

### Development
```
Local: npm run dev
```

### Production

**Backend**:
- Deploy to: Heroku, Railway, or AWS EC2
- Environment variables for configuration
- Process manager (PM2) for reliability

**Frontend**:
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or AWS S3 + CloudFront
- Environment-specific API URLs

**Full Stack**:
- Docker containerization
- Docker Compose for local development
- Kubernetes for orchestration (enterprise)

## Monitoring & Logging

### Recommended Additions
1. **Application Logs**: Winston or Bunyan
2. **Error Tracking**: Sentry
3. **Performance Monitoring**: New Relic or DataDog
4. **Analytics**: Google Analytics for user behavior

## Code Organization Principles

### 1. Component Composition
- Small, single-responsibility components
- Reusable and testable
- Clear prop interfaces

### 2. Separation of Concerns
- Components handle UI
- App.jsx handles state and API
- Server handles data processing

### 3. Consistent Styling
- Component-scoped CSS
- Consistent naming (BEM-like)
- Shared design tokens possible via CSS variables

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Considerations

- Semantic HTML
- ARIA labels for icon buttons
- Keyboard navigation support
- Sufficient color contrast

## Performance Metrics (Expected)

- **Initial Load**: 2-3 seconds (includes CSV parsing)
- **Filter/Search Response**: < 500ms
- **Page Navigation**: < 300ms
- **Memory Usage**: ~500MB (server-side)

## Conclusion

This architecture provides a solid foundation for a sales management system that can handle large datasets efficiently. The separation between frontend and backend allows for independent scaling and deployment, while the component-based React architecture ensures maintainability and extensibility.

