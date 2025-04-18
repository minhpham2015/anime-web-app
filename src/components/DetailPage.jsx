import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [studios, setStudios] = useState([]);
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

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
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch main details
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        const data = await response.json();
        
        if (data.data) {
          setItem(data.data);
          setStudios(data.data.studios || []);
        } else {
          setError('Failed to fetch details');
        }
        
        // Fetch characters
        const charactersResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
        const charactersData = await charactersResponse.json();
        
        if (charactersData.data) {
          setCharacters(charactersData.data);
        }
      } catch (err) {
        setError('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const addToWishlist = () => {
    if (wishlist.some(wishlistItem => wishlistItem.mal_id === item.mal_id)) {
      return;
    }

    const updatedWishlist = [...wishlist, item];
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = () => {
    const updatedWishlist = wishlist.filter(wishlistItem => wishlistItem.mal_id !== item.mal_id);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = () => {
    return wishlist.some(wishlistItem => wishlistItem.mal_id === item.mal_id);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-red-500 dark:text-red-400">
            {error || 'Item not found'}
          </div>
          <div className="text-center mt-4">
            <Link to="/search" className="text-blue-500 dark:text-blue-400 hover:underline">
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/search" className="text-blue-500 dark:text-blue-400 hover:underline">
            ← Back to Search
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Feature Image */}
          <div className="relative">
            <img
              src={item.images.jpg.large_image_url}
              alt={item.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {item.title}
            </h1>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Rating:</span>
              <div className="flex items-center">
                {item.score ? (
                  <>
                    <div className="flex">{renderStars(item.score)}</div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      ({item.score.toFixed(1)})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <span className="text-gray-600 dark:text-gray-400">{item.type || 'N/A'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Episodes:</span>
              <span className="text-gray-600 dark:text-gray-400">{item.episodes || 'N/A'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
              <span className="text-gray-600 dark:text-gray-400">{item.status || 'N/A'}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Aired:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {item.aired?.string || 'N/A'}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Synopsis</h2>
              <p className={`text-gray-600 dark:text-gray-400 ${!showFullSynopsis && 'line-clamp-4'}`}>
                {item.synopsis}
              </p>
              {item.synopsis && item.synopsis.length > 200 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="text-blue-500 dark:text-blue-400 hover:underline text-sm"
                >
                  {showFullSynopsis ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            {studios.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {studios.map((studio) => (
                    <span
                      key={studio.mal_id}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <button
                onClick={isInWishlist() ? removeFromWishlist : addToWishlist}
                className={`w-full px-4 py-2 rounded-lg ${
                  isInWishlist()
                    ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                }`}
              >
                {isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>

              {item.trailer?.url && (
                <a
                  href={item.trailer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg text-center"
                >
                  Watch Trailer
                </a>
              )}

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-lg text-center"
              >
                View on {item.type === 'TV' || item.type === 'Movie' || item.type === 'OVA' || item.type === 'ONA' || item.type === 'Special' ? 'Anime' : 'Manga'}
              </a>
            </div>
          </div>
        </div>

        {/* Characters Section */}
        {characters.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Characters</h2>
            <div className="flex flex-wrap gap-2">
              {characters.slice(0, 5).map((character) => (
                <span
                  key={character.character.mal_id}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  {character.character.name}
                </span>
              ))}
              {characters.length > 5 && (
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  +{characters.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage; 