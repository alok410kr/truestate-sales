import { useState, useEffect } from 'react'
import axios from 'axios'
import config from './config'
import './styles/App.css'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import SearchBar from './components/SearchBar'
import FilterBar from './components/FilterBar'
import DataTable from './components/DataTable'
import Pagination from './components/Pagination'
import SortDropdown from './components/SortDropdown'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    customerRegion: [],
    gender: [],
    ageRange: [],
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateRange: ''
  })
  const [sortBy, setSortBy] = useState('Customer Name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10, // Changed to 10 as per assignment requirements
    total: 0,
    totalPages: 0
  })
  const [filterOptions, setFilterOptions] = useState({
    customerRegions: [],
    genders: [],
    ageRanges: [],
    productCategories: [],
    tags: [],
    paymentMethods: [],
    dateRanges: []
  })

  // Set axios base URL
  axios.defaults.baseURL = config.API_BASE_URL;

  // Load filter options on mount
  useEffect(() => {
    axios.get('/api/filter-options')
      .then(response => {
        setFilterOptions(response.data)
      })
      .catch(err => {
        console.error('Error loading filter options:', err)
      })
  }, [])

  // Fetch data whenever filters, sorting, or pagination change
  useEffect(() => {
    fetchData()
  }, [filters, sortBy, sortOrder, pagination.page])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        search: filters.search,
        customerRegion: filters.customerRegion.join(','),
        gender: filters.gender.join(','),
        ageRange: filters.ageRange.join(','),
        productCategory: filters.productCategory.join(','),
        tags: filters.tags.join(','),
        paymentMethod: filters.paymentMethod.join(','),
        dateRange: filters.dateRange,
        sortBy,
        sortOrder,
        page: pagination.page,
        limit: pagination.limit
      }

      const response = await axios.get('/api/sales', { params })
      setData(response.data.data)
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }))
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 on filter change
  }

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm
    }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      customerRegion: [],
      gender: [],
      ageRange: [],
      productCategory: [],
      tags: [],
      paymentMethod: [],
      dateRange: ''
    })
    setSortBy('Customer Name')
    setSortOrder('asc')
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="app">
      <Sidebar />
      
      <div className="main-content">
        <header className="app-header">
          <h1>Sales Management System</h1>
        </header>

        <div className="container">
        <SummaryCards data={data} />

        <div className="controls-section">
          <div className="search-sort-row">
            <SearchBar onSearch={handleSearch} value={filters.search} />
            <SortDropdown 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              onSortChange={handleSort}
              onOrderChange={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            />
          </div>

          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        <div className="results-info">
          Showing {data.length > 0 ? ((pagination.page - 1) * pagination.limit + 1) : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </div>

        <DataTable 
          data={data} 
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
        </div>
      </div>
    </div>
  )
}

export default App

