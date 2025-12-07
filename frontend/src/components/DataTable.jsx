import './DataTable.css'

function DataTable({ data, loading, sortBy, sortOrder, onSort }) {
  const columns = [
    { key: 'Transaction ID', label: 'Transaction ID' },
    { key: 'Date', label: 'Date' },
    { key: 'Customer ID', label: 'Customer ID' },
    { key: 'Customer Name', label: 'Customer name' },
    { key: 'Phone Number', label: 'Phone Number' },
    { key: 'Gender', label: 'Gender' },
    { key: 'Age', label: 'Age' },
    { key: 'Product Category', label: 'Product Category' },
    { key: 'Quantity', label: 'Quantity' },
    { key: 'Total Amount', label: 'Total Amount' },
    { key: 'Customer Region', label: 'Customer region' },
    { key: 'Product ID', label: 'Product ID' },
    { key: 'Employee Name', label: 'Employee name' }
  ]

  const formatCurrency = (amount) => {
    return `₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    return `+91 ${phone}`
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="no-data">
        <p>No transactions found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th 
                key={column.key}
                onClick={() => onSort(column.key)}
                className={sortBy === column.key ? 'sortable active' : 'sortable'}
              >
                <div className="th-content">
                  {column.label}
                  {sortBy === column.key && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row['Transaction ID']}</td>
              <td>{row['Date']}</td>
              <td>{row['Customer ID']}</td>
              <td>{row['Customer Name']}</td>
              <td>
                {formatPhoneNumber(row['Phone Number'])}
                <button className="copy-icon" title="Copy phone number">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 10V3a1 1 0 0 1 1-1h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </td>
              <td>{row['Gender']}</td>
              <td>{row['Age']}</td>
              <td><span className="category-badge">{row['Product Category']}</span></td>
              <td>{String(row['Quantity']).padStart(2, '0')}</td>
              <td><strong>{formatCurrency(row['Total Amount'])}</strong></td>
              <td>{row['Customer Region']}</td>
              <td>{row['Product ID']}</td>
              <td>{row['Employee Name']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable

