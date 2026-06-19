import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, name, avatar }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo-area">
          <div className="logo-icon">C</div>
          <span className="logo-text">ATLAN HUB</span>
        </div>
        <nav>
          <ul className="nav-links">
            <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('dashboard')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Dashboard</span>
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('profile')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile & Gear</span>
              </button>
            </li>
            <li className={`nav-item ${activeTab === 'characters' ? 'active' : ''}`}>
              <button onClick={() => setActiveTab('characters')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Characters (Alts)</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-badge">
          <img src={avatar} alt="Avatar" className="user-avatar" />
          <div className="user-info">
            <div className="username">{name}</div>
            <div className="user-title">Elite Explorer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
