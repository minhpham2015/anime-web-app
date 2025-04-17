import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import WishlistPage from './components/WishlistPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
}

export default App; 