import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Anime Explorer
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-blue-200 px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/search" className="hover:text-blue-200 px-3 py-2 rounded-md">
              Search
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 