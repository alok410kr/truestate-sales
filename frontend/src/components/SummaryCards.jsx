import './SummaryCards.css'

function SummaryCards({ data }) {
  // Calculate summary statistics
  const totalUnits = data.reduce((sum, item) => sum + (parseInt(item['Quantity']) || 0), 0)
  const totalAmount = data.reduce((sum, item) => sum + (parseFloat(item['Total Amount']) || 0), 0)
  
  // Calculate total discount correctly
  const totalDiscount = data.reduce((sum, item) => {
    const totalAmt = parseFloat(item['Total Amount']) || 0
    const finalAmt = parseFloat(item['Final Amount']) || 0
    const discount = totalAmt - finalAmt
    return sum + discount
  }, 0)

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
  }

  const totalRecords = data.length

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Total units sold</span>
          <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="summary-value">{totalUnits}</div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Total Amount</span>
          <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="summary-value">{formatCurrency(totalAmount)} <span className="summary-count">({totalRecords} SRs)</span></div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <span className="summary-label">Total Discount</span>
          <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="summary-value">{formatCurrency(totalDiscount)} <span className="summary-count">({totalRecords} SRs)</span></div>
      </div>
    </div>
  )
}

export default SummaryCards

