import React, { useState } from 'react';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchAnime = async (query) => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&sfw`);
      const data = await response.json();
      
      if (data.data) {
        setAnimeList(data.data);
      } else {
        setAnimeList([]);
      }
    } catch (err) {
      setError('Failed to fetch anime data');
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAnime(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Anime Search</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for anime..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center text-gray-600">Loading...</div>
        )}

        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animeList.map((anime) => (
            <div key={anime.mal_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{anime.title}</h2>
                <p className="text-gray-600 text-sm mb-2">
                  Score: {anime.score} • Episodes: {anime.episodes}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">{anime.synopsis}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage; 