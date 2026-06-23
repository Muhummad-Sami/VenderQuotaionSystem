import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle'; // 🆕 already imported

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900/90 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white hover:text-blue-400 transition" onClick={closeMobileMenu}>
            📋 Vendor System
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/admin/dashboard') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/vendors"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/admin/vendors') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Vendors
                    </Link>
                    <Link
                      to="/admin/requests"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/admin/requests') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Requests
                    </Link>
                    {/* 🆕 Activity Logs link (admin only) */}
                    <Link
                      to="/admin/logs"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/admin/logs') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Logs
                    </Link>
                  </>
                )}

                {user?.role === 'vendor' && (
                  <>
                    <Link
                      to="/vendor/dashboard"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/vendor/dashboard') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/vendor/requests"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/vendor/requests') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      My Requests
                    </Link>
                  </>
                )}

                {/* Compare - accessible to both */}
                <Link
                  to="/compare"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/compare') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Compare
                </Link>

                {/* 🆕 Theme Toggle in desktop navigation */}
                <ThemeToggle />

                {/* User info & logout (desktop) */}
                <span className="text-sm text-white/50 border-l border-white/10 pl-4 hidden lg:inline">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-all duration-200 border border-green-500/30 hover:border-green-500/50"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white/70 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (collapsible) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-2 bg-slate-900/95 backdrop-blur-sm border-t border-white/10">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive('/') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin/dashboard') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/vendors"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin/vendors') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Vendors
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin/requests') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Requests
                  </Link>
                  {/* 🆕 Activity Logs link (mobile) */}
                  <Link
                    to="/admin/logs"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin/logs') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Logs
                  </Link>
                </>
              )}

              {user?.role === 'vendor' && (
                <>
                  <Link
                    to="/vendor/dashboard"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/vendor/dashboard') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/vendor/requests"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/vendor/requests') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    My Requests
                  </Link>
                </>
              )}

              <Link
                to="/compare"
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/compare') ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
                onClick={closeMobileMenu}
              >
                Compare
              </Link>

              {/* 🆕 Mobile: User info + Theme Toggle + Logout in a single row */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/40 px-3 py-1">{user?.email}</p>
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30 hover:border-red-500/50 text-left"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-all duration-200 border border-green-500/30 hover:border-green-500/50"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;