import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookMarked, BarChart3, Sun, Moon, Library, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../app/hooks';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBookIds.length);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Library className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Mini Library</span>
            <span className="brand-subtitle">Thư viện Khoa Chuyên ngành</span>
          </div>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <BookMarked className="nav-icon" />
            <span>Tra cứu & Mượn sách</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <BarChart3 className="nav-icon" />
            <span>Thống kê</span>
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <div
            className={`borrow-badge ${borrowedCount === 3 ? 'borrow-badge--max' : ''}`}
            title="Mỗi sinh viên được mượn tối đa 3 cuốn sách"
          >
            <Layers className="borrow-badge-icon" />
            <span className="borrow-badge-text">
              Đang mượn: <strong>{borrowedCount}/3</strong>
            </span>
          </div>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Chuyển sang giao diện ${theme === 'light' ? 'tối' : 'sáng'}`}
            title={`Chuyển sang chế độ ${theme === 'light' ? 'Tối' : 'Sáng'}`}
          >
            {theme === 'light' ? (
              <Moon className="theme-icon moon-icon" />
            ) : (
              <Sun className="theme-icon sun-icon" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
