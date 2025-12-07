import { useState, useEffect } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, value }) {
  const [searchTerm, setSearchTerm] = useState(value || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm)
    }, 500) // Debounce search

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setSearchTerm(value || '')
  }, [value])

  return (
    <div className="search-bar">
      <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        type="text"
        placeholder="Name, Phone no."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button 
          className="clear-search"
          onClick={() => setSearchTerm('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar

