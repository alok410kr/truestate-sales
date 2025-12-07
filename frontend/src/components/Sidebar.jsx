import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="user-profile">
          <div className="user-avatar">V</div>
          <div className="user-info">
            <div className="user-name">Vault</div>
            <div className="user-subtitle">Anurag Yadav</div>
          </div>
          <svg className="dropdown-icon" width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a href="#" className="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Dashboard</span>
        </a>

        <a href="#" className="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6M5.636 5.636l4.243 4.243m4.242 4.242l4.243 4.243"/>
          </svg>
          <span>Nexus</span>
        </a>

        <a href="#" className="nav-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Intake</span>
        </a>

        <div className="nav-item expandable">
          <div className="nav-item-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <span>Services</span>
            <svg className="expand-icon" width="12" height="12" viewBox="0 0 12 12">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="nav-subitems">
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Pre-active</span>
            </a>
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Active</span>
            </a>
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Blocked</span>
            </a>
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span>Closed</span>
            </a>
          </div>
        </div>

        <div className="nav-item expandable">
          <div className="nav-item-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span>Invoices</span>
            <svg className="expand-icon" width="12" height="12" viewBox="0 0 12 12">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <div className="nav-subitems">
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              </svg>
              <span>Proforma Invoices</span>
            </a>
            <a href="#" className="nav-subitem">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              </svg>
              <span>Final Invoices</span>
            </a>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar

