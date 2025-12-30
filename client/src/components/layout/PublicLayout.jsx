import { Link } from 'react-router-dom';
import { LogIn, Moon, Sun, UserPlus } from 'lucide-react';
import './PublicLayout.css';
import { useTheme } from '../../context/ThemeContext.jsx';

const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="public-header">
      <div className="container">
        <Link to="/" className="logo-text">
          Mini Event Platform
        </Link>
        <nav className="public-nav">
          <button
            type="button"
            className="nav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="btn btn-icon">
            <LogIn size={20} />
            <span className="btn-text">Sign in</span>
          </Link>
          <Link to="/register" className="btn btn-outline btn-icon">
            <UserPlus size={20} />
            <span className="btn-text">Get started</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

const PublicFooter = () => (
  <footer className="public-footer">
    <div className="container">
      <p>&copy; {new Date().getFullYear()} Mini Event Platform. All rights reserved.</p>
    </div>
  </footer>
);

const PublicLayout = ({ children }) => (
  <div className="public-layout">
    <PublicHeader />
    <main className="public-main">{children}</main>
    <PublicFooter />
  </div>
);

export default PublicLayout;
