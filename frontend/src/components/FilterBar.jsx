import { useState } from 'react'
import './FilterBar.css'
import MultiSelectFilter from './MultiSelectFilter'

function FilterBar({ filters, filterOptions, onFilterChange, onReset }) {
  const [openFilter, setOpenFilter] = useState(null)

  const hasActiveFilters = 
    filters.customerRegion.length > 0 ||
    filters.gender.length > 0 ||
    filters.ageRange.length > 0 ||
    filters.productCategory.length > 0 ||
    filters.tags.length > 0 ||
    filters.paymentMethod.length > 0 ||
    filters.dateRange

  return (
    <div className="filter-bar">
      <button 
        className={`reset-button ${hasActiveFilters ? 'active' : ''}`}
        onClick={onReset}
        title="Refresh / Reset all filters"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="filters-row">
        <MultiSelectFilter
          label="Customer Region"
          options={filterOptions.customerRegions}
          selected={filters.customerRegion}
          onChange={(values) => onFilterChange('customerRegion', values)}
          isOpen={openFilter === 'customerRegion'}
          onToggle={() => setOpenFilter(openFilter === 'customerRegion' ? null : 'customerRegion')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Gender"
          options={filterOptions.genders}
          selected={filters.gender}
          onChange={(values) => onFilterChange('gender', values)}
          isOpen={openFilter === 'gender'}
          onToggle={() => setOpenFilter(openFilter === 'gender' ? null : 'gender')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Age Range"
          options={filterOptions.ageRanges}
          selected={filters.ageRange}
          onChange={(values) => onFilterChange('ageRange', values)}
          isOpen={openFilter === 'ageRange'}
          onToggle={() => setOpenFilter(openFilter === 'ageRange' ? null : 'ageRange')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Product Category"
          options={filterOptions.productCategories}
          selected={filters.productCategory}
          onChange={(values) => onFilterChange('productCategory', values)}
          isOpen={openFilter === 'productCategory'}
          onToggle={() => setOpenFilter(openFilter === 'productCategory' ? null : 'productCategory')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Tags"
          options={filterOptions.tags}
          selected={filters.tags}
          onChange={(values) => onFilterChange('tags', values)}
          isOpen={openFilter === 'tags'}
          onToggle={() => setOpenFilter(openFilter === 'tags' ? null : 'tags')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Payment Method"
          options={filterOptions.paymentMethods}
          selected={filters.paymentMethod}
          onChange={(values) => onFilterChange('paymentMethod', values)}
          isOpen={openFilter === 'paymentMethod'}
          onToggle={() => setOpenFilter(openFilter === 'paymentMethod' ? null : 'paymentMethod')}
          onClose={() => setOpenFilter(null)}
        />

        <MultiSelectFilter
          label="Date"
          options={filterOptions.dateRanges.map(d => d.value)}
          optionLabels={filterOptions.dateRanges}
          selected={filters.dateRange ? [filters.dateRange] : []}
          onChange={(values) => onFilterChange('dateRange', values[0] || '')}
          isOpen={openFilter === 'dateRange'}
          onToggle={() => setOpenFilter(openFilter === 'dateRange' ? null : 'dateRange')}
          onClose={() => setOpenFilter(null)}
          singleSelect
        />
      </div>
    </div>
  )
}

export default FilterBar

