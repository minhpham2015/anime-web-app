import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage
    const loadWishlist = () => {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
      setLoading(false);
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.mal_id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const convertRatingToStars = (rating) => {
    if (!rating) return 0;
    // Convert 10-point scale to 5-point scale
    return (rating / 2);
  };

  const renderStars = (rating) => {
    const stars = convertRatingToStars(rating);
    const starElements = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(stars)) {
        // Full star
        starElements.push(
          <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i - 0.5 <= stars) {
        // Half star
        starElements.push(
          <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-gradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="url(#half-gradient)" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-600">Loading wishlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My Wishlist</h1>
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Back to Search
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">Your wishlist is empty</p>
            <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
              Browse anime and manga
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.mal_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={item.images.jpg.large_image_url}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                  <div className="flex flex-col space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Rating:</span>
                      <div className="flex items-center">
                        {item.score ? (
                          <div className="flex">
                            {renderStars(item.score)}
                            <span className="ml-2 text-sm">({item.score.toFixed(1)})</span>
                          </div>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Type:</span>
                      <span>{item.type || 'N/A'}</span>
                    </div>
                    {item.episodes ? (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Episodes:</span>
                        <span>{item.episodes || 'N/A'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Chapters:</span>
                        <span>{item.chapters || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-3 line-clamp-3">{item.synopsis}</p>
                  <button
                    onClick={() => removeFromWishlist(item.mal_id)}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage; 