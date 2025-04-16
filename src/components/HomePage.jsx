import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Anime Explorer</h1>
        <p className="text-gray-600 mb-8">
          Discover your next favorite anime series with our powerful search tool.
        </p>
        <Link
          to="/search"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Start Searching
        </Link>
      </div>
    </div>
  );
}

export default HomePage; 