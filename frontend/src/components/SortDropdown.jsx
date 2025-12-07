import { useState, useEffect, useRef } from 'react'
import './SortDropdown.css'

function SortDropdown({ sortBy, sortOrder, onSortChange, onOrderChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { value: 'Customer Name', label: 'Customer Name (A-Z)' },
    { value: 'Date', label: 'Date' },
    { value: 'Total Amount', label: 'Total Amount' },
    { value: 'Age', label: 'Age' },
    { value: 'Transaction ID', label: 'Transaction ID' }
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getCurrentLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy)
    return option ? option.label : sortBy
  }

  const handleSelect = (value) => {
    onSortChange(value)
    setIsOpen(false)
  }

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <button 
        className="sort-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sort-label">Sort by: {getCurrentLabel()}</span>
        <svg 
          className={`dropdown-icon ${isOpen ? 'open' : ''}`} 
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="sort-dropdown-menu">
          {sortOptions.map(option => (
            <button
              key={option.value}
              className={`sort-option ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown

