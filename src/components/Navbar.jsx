import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white text-xl font-bold">
            AnimeApp
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden ml-4 p-2 text-white hover:text-blue-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <div className={`md:hidden ${isMobileMenuOpen ? 'fixed inset-0 bg-blue-500 z-50 flex flex-col justify-center items-center' : 'hidden'}`}>
          <button
            onClick={toggleMobileMenu}
            className="absolute top-4 right-4 p-2 text-white hover:text-blue-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/search" className="text-white hover:text-blue-200 px-3 py-2 rounded-md" onClick={toggleMobileMenu}>
            Search
          </Link>
          <Link to="/wishlist" className="text-white hover:text-blue-200 px-3 py-2 rounded-md" onClick={toggleMobileMenu}>
            Wishlist
          </Link>
        </div>
        <div className="hidden md:flex md:items-center space-x-4">
          <Link to="/" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">
            Home
          </Link>
          <Link to="/search" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">
            Search
          </Link>
          <Link to="/wishlist" className="text-white hover:text-blue-200 px-3 py-2 rounded-md">
            Wishlist
          </Link>
        </div>
        <button
          onClick={toggleDarkMode}
          className="text-white hover:text-blue-200 px-3 py-2 rounded-md flex items-center space-x-2"
        >
          {isMobileMenuOpen ? null : (
            isDarkMode ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark Mode</span>
              </>
            )
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar; 