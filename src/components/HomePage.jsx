import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Anime/Manga Explorer</h1>
        <p className="text-gray-600 mb-8">
          Discover your next favorite anime series with our powerful search tool.
        </p>
        <Link
          to="/search"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        >
          Start Searching
        </Link>

        {loading ? (
          <div className="text-center text-gray-600">Loading featured anime...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Anime</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredAnime.map((anime) => (
                <div key={anime.mal_id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                  <img
                    src={anime.images.jpg.small_image_url}
                    alt={anime.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 mb-1">{anime.title}</h3>
                    <div className="flex flex-col space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Rating:</span>
                        <span className="flex items-center">
                          {anime.score ? anime.score.toFixed(1) : 'N/A'} 
                          {anime.score && <span className="text-yellow-500 ml-1">★</span>}
                        </span>
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
                  </div>
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