import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import './AppShell.css';
import { useEffect, useState } from 'react';

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };

  return (
    <div className="app-shell">
      <header className={`app-header card ${open ? 'menu-open' : ''}`}>
        <div className="branding">
          <Link to="/" className="logo-text">
            Mini Event Platform
          </Link>
        </div>
        <div className="desktop-nav">
          <nav id="primary-navigation" className="shell-nav" aria-label="Primary">
            <NavLink to="/app" end onClick={closeMenu}>
              Events
            </NavLink>
            <NavLink to="/app/create" onClick={closeMenu}>
              Create
            </NavLink>
            <NavLink to="/app/profile" onClick={closeMenu}>
              Dashboard
            </NavLink>
          </nav>
          <div className="header-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="user-pill">
              <span>{user?.name || 'User'}</span>
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <button
          type="button"
          className="icon-btn menu-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Menu size={22} />
        </button>
      </header>
      <div className={`mobile-menu ${open ? 'open' : ''}`} id="mobile-menu" onClick={closeMenu}>
        <nav aria-label="Mobile primary" onClick={(event) => event.stopPropagation()}>
          <NavLink to="/app" end onClick={closeMenu}>
            Events
          </NavLink>
          <NavLink to="/app/create" onClick={closeMenu}>
            Create
          </NavLink>
          <NavLink to="/app/profile" onClick={closeMenu}>
            Dashboard
          </NavLink>
        </nav>
        <div className="mobile-actions" onClick={(event) => event.stopPropagation()}>
          <button
            className="icon-btn"
            onClick={() => {
              toggleTheme();
              closeMenu();
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="user-pill">
            <span>{user?.name || 'User'}</span>
          </div>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <div>
          <p className="footer-title">Mini Event Platform</p>
          <p className="footer-copy">Plan, promote, and protect memorable experiences.</p>
        </div>
        <div className="footer-links" aria-label="Footer links">
          <Link to="/app">Events</Link>
          <Link to="/app/create">Create</Link>
          <Link to="/app/profile">Dashboard</Link>
        </div>
        <div className="footer-meta">
          <span>&copy; {new Date().getFullYear()} Mini Event Platform</span>
          <span className="status-dot">●</span>
          <span>All systems operational</span>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
