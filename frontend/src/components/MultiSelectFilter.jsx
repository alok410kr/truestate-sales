import { useEffect, useRef } from 'react'
import './MultiSelectFilter.css'

function MultiSelectFilter({ 
  label, 
  options, 
  optionLabels = null,
  selected, 
  onChange, 
  isOpen, 
  onToggle, 
  onClose,
  singleSelect = false 
}) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleToggle = (value) => {
    if (singleSelect) {
      onChange(selected.includes(value) ? [] : [value])
      onClose()
    } else {
      if (selected.includes(value)) {
        onChange(selected.filter(item => item !== value))
      } else {
        onChange([...selected, value])
      }
    }
  }

  const getDisplayLabel = (value) => {
    if (optionLabels && Array.isArray(optionLabels)) {
      const option = optionLabels.find(opt => opt.value === value)
      return option ? option.label : value
    }
    return value
  }

  return (
    <div className="multi-select-filter" ref={dropdownRef}>
      <button 
        className={`filter-button ${selected.length > 0 ? 'active' : ''}`}
        onClick={onToggle}
      >
        <span className="filter-label">{label}</span>
        {selected.length > 0 && (
          <span className="filter-badge">{selected.length}</span>
        )}
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
        <div className="filter-dropdown">
          <div className="filter-options">
            {options.map(option => (
              <label key={option} className="filter-option">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleToggle(option)}
                />
                <span className="checkbox-custom"></span>
                <span className="option-label">{getDisplayLabel(option)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiSelectFilter

