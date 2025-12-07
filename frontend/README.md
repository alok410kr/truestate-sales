# TruEstate Frontend

React-based frontend for the Sales Management System.

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling

## Folder Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── styles/         # CSS files
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── index.html          # HTML template
└── package.json        # Dependencies
```

## Components

- **SearchBar**: Search input with debouncing
- **FilterBar**: Container for all filters
- **MultiSelectFilter**: Reusable multi-select dropdown
- **SortDropdown**: Sort options dropdown
- **DataTable**: Data display with sortable columns
- **Pagination**: Page navigation controls

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output will be in `dist/` directory.

