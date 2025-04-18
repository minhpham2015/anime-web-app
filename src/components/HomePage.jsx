import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    };

    loadWishlist();
  }, []);

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing');
        const data = await response.json();
        
        if (data.data) {
          // Get only the first 3 anime for the featured section
          setFeaturedAnime(data.data.slice(0, 3));
        } else {
          setFeaturedAnime([]);
        }
      } catch (err) {
        setError('Failed to fetch featured anime');
        setFeaturedAnime([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAnime();
  }, []);

  const addToWishlist = (item) => {
    if (wishlist.some(wishlistItem => wishlistItem.mal_id === item.mal_id)) {
      return;
    }

    const updatedWishlist = [...wishlist, item];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.mal_id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (id) => {
    return wishlist.some(item => item.mal_id === id);
  };

  const SkeletonItem = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
      </div>
    </div>
  );

  const renderStars = (rating) => {
    const starElements = [];
    const numStars = rating ? rating / 2 : 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numStars) {
        // Filled star
        starElements.push(
          <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        // Empty star
        starElements.push(
          <svg key={`star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return starElements;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center transition-colors duration-200">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Anime/Manga Explorer</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Discover your next favorite anime series with our powerful search tool.
        </p>
        <Link
          to="/search"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8 transition-colors duration-200"
        >
          Start Searching
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            { Array(3).fill(null).map((_, index) => (
                <SkeletonItem key={`skeleton-${index}`} />
              )) }
          </div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Featured Anime</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAnime.map((anime) => (
                <div key={anime.mal_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200 relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      isInWishlist(anime.mal_id) ? removeFromWishlist(anime.mal_id) : addToWishlist(anime);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 ${
                      isInWishlist(anime.mal_id)
                        ? 'text-red-500 hover:text-red-400'
                        : 'text-white hover:text-red-500'
                    }`}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill={isInWishlist(anime.mal_id) ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </button>
                  <Link to={`/detail/${anime.mal_id}`} className="block">
                    <img
                      src={anime.images.jpg.large_image_url}
                      alt={anime.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                        {anime.title}
                      </h2>
                      <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Rating:</span>
                          <div className="flex items-center">
                            {anime.score ? (
                              <div className="flex">
                                {renderStars(anime.score)}
                                <span className="ml-2 text-sm">({anime.score.toFixed(1)})</span>
                              </div>
                            ) : (
                              <span>N/A</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Type:</span>
                          <span>{anime.type || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Episodes:</span>
                          <span>{anime.episodes || 'N/A'}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 line-clamp-3">{anime.synopsis}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage; 