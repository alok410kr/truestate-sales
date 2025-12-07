# Contributing to TruEstate Sales Management System

## Development Guidelines

### Code Style

#### JavaScript/JSX
- Use functional components with hooks
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic
- Use const/let instead of var

#### CSS
- Use component-scoped CSS files
- Follow BEM-like naming conventions
- Keep selectors specific to component
- Use CSS variables for shared values

### Component Structure

```javascript
import { useState, useEffect } from 'react'
import './ComponentName.css'

function ComponentName({ prop1, prop2 }) {
  // State declarations
  const [state, setState] = useState(initialValue)

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies])

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  }

  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

### Adding a New Filter

1. **Add filter option to backend** (`server/index.js`):
```javascript
if (newFilter) {
  const values = newFilter.split(',').filter(v => v);
  if (values.length > 0) {
    filtered = filtered.filter(item =>
      values.includes(item['FieldName'])
    );
  }
}
```

2. **Add filter to frontend state** (`App.jsx`):
```javascript
const [filters, setFilters] = useState({
  // ... existing filters
  newFilter: []
})
```

3. **Add to FilterBar** (`FilterBar.jsx`):
```jsx
<MultiSelectFilter
  label="New Filter"
  options={filterOptions.newFilterOptions}
  selected={filters.newFilter}
  onChange={(values) => onFilterChange('newFilter', values)}
  isOpen={openFilter === 'newFilter'}
  onToggle={() => setOpenFilter(openFilter === 'newFilter' ? null : 'newFilter')}
  onClose={() => setOpenFilter(null)}
/>
```

4. **Add options endpoint** (`server/index.js`):
```javascript
const newFilterOptions = [...new Set(salesData.map(item => item['FieldName']))];
```

### Git Workflow

1. Create a feature branch
```bash
git checkout -b feature/new-feature-name
```

2. Make changes and commit
```bash
git add .
git commit -m "Add: descriptive commit message"
```

3. Push and create pull request
```bash
git push origin feature/new-feature-name
```

### Commit Message Format

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes
- `Style:` for formatting changes

Examples:
- `Add: multi-select filter for payment method`
- `Fix: pagination not resetting on filter change`
- `Update: increase search debounce to 500ms`

## Testing Your Changes

### Manual Testing Checklist

- [ ] Search works with various inputs
- [ ] All filters work independently
- [ ] Multiple filters work together
- [ ] Sorting works for all columns
- [ ] Pagination works correctly
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] No memory leaks
- [ ] Performance is acceptable

### Performance Testing

```bash
# Monitor backend performance
# Check memory usage
# Windows
tasklist /FI "IMAGENAME eq node.exe"

# Mac/Linux
ps aux | grep node
```

## Code Review Checklist

Before submitting:
- [ ] Code follows style guidelines
- [ ] No console.log() statements (use proper logging)
- [ ] No commented-out code
- [ ] CSS is organized and minimal
- [ ] No duplicate code
- [ ] Error handling implemented
- [ ] Edge cases considered
- [ ] Documentation updated

## Project-Specific Guidelines

### State Management
- Use useState for component-local state
- Lift state to App.jsx for shared state
- Pass callbacks for state updates

### API Calls
- Always handle loading states
- Always handle error states
- Use try-catch blocks
- Show user-friendly error messages

### Styling
- Use relative units (rem, em, %)
- Mobile-first approach
- Test on multiple screen sizes
- Ensure accessibility (contrast, focus states)

## Questions?

If you're unsure about anything:
1. Check existing code for examples
2. Read the ARCHITECTURE.md document
3. Test thoroughly before committing

---

Happy coding! 🚀

