import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. Import these!

const Navbar = () => {
  const location = useLocation(); // 2. Get current URL path

  const navLinks = [
    { name: 'Sprints', path: '/' },
    { name: 'Employees', path: '/employee' },
    { name: 'Reports', path: '/report' },
    { name: 'Settings', path: '/setting' },
  ];

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom border-light px-4 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left: Logo Section */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-dark m-0" to="/">
          <div 
            className="rounded-circle me-2" 
            style={{ width: '20px', height: '20px', backgroundColor: '#1e14df' }} 
          />
          <span>SprintOS</span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav gap-4">
            {navLinks.map((link) => {
              // 3. Check if this link's path matches the current URL
              const isActive = location.pathname === link.path;
              
              return (
                <li key={link.name} className="nav-item">
                  <Link 
                    className={`nav-link px-0 pb-1 fw-medium ${isActive ? 'text-primary' : 'text-secondary'}`} 
                    to={link.path}
                    style={isActive ? { borderBottom: '2px solid #4F46E5' } : {}}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Workspace & Profile */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <div className="text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>PAS</div>
            <div className="text-dark fw-medium" style={{ fontSize: '12px', marginTop: '-4px' }}>workspace</div>
          </div>
          
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
            style={{ width: '35px', height: '35px', backgroundColor: '#E0E7FF', color: '#4F46E5', fontSize: '13px' }}>
            AK
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
