import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState('anime'); // Default to anime
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter states
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  
  // Filter options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Movie' },
    { value: 'ova', label: 'OVA' },
    { value: 'ona', label: 'ONA' },
    { value: 'special', label: 'Special' },
    { value: 'manga', label: 'Manga' },
    { value: 'novel', label: 'Novel' },
    { value: 'one-shot', label: 'One-shot' },
    { value: 'doujin', label: 'Doujin' },
    { value: 'manhwa', label: 'Manhwa' },
    { value: 'manhua', label: 'Manhua' }
  ];
  
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'airing', label: 'Airing' },
    { value: 'complete', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'finished', label: 'Finished' },
    { value: 'publishing', label: 'Publishing' }
  ];
  
  const genreOptions = [
    { value: '', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'slice-of-life', label: 'Slice of Life' },
    { value: 'sports', label: 'Sports' },
    { value: 'supernatural', label: 'Supernatural' },
    { value: 'thriller', label: 'Thriller' }
  ];
  
  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: 'g', label: 'G - All Ages' },
    { value: 'pg', label: 'PG - Children' },
    { value: 'pg13', label: 'PG-13 - Teens 13 or older' },
    { value: 'r17', label: 'R - 17+ (violence & profanity)' },
    { value: 'r', label: 'R+ - Mild Nudity' },
    { value: 'rx', label: 'Rx - Hentai' }
  ];
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const observer = useRef();
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isLoadingMore]);

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
    // Update dark mode class on document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addToWishlist = (item) => {
    // Check if item is already in wishlist
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

  const searchContent = async (query, pageNum = 1) => {
    if (!query && pageNum === 1) return;
    
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    try {
      // Build the filter parameters
      let filterParams = `sfw&page=${pageNum}&limit=9`;
      
      if (selectedType) {
        filterParams += `&type=${selectedType}`;
      }
      
      if (selectedStatus) {
        filterParams += `&status=${selectedStatus}`;
      }
      
      if (selectedGenre) {
        filterParams += `&genres=${selectedGenre}`;
      }
      
      if (selectedRating) {
        filterParams += `&rating=${selectedRating}`;
      }
      
      const endpoint = contentType === 'anime' 
        ? `https://api.jikan.moe/v4/anime?q=${query}&${filterParams}`
        : `https://api.jikan.moe/v4/manga?q=${query}&${filterParams}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.data) {
        if (pageNum === 1) {
          setAnimeList(data.data);
        } else {
          setAnimeList(prev => [...prev, ...data.data]);
        }
        setHasMore(data.pagination.has_next_page);
      } else {
        if (pageNum === 1) {
          setAnimeList([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      setError(`Failed to fetch ${contentType} data`);
      if (pageNum === 1) {
        setAnimeList([]);
      }
      setHasMore(false);
    } finally {
      if (pageNum === 1) {
        setLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  // Load popular content when the component mounts or content type changes
  useEffect(() => {
    const fetchPopularContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build the filter parameters for popular content
        let filterParams = 'limit=9';
        
        if (selectedType) {
          filterParams += `&type=${selectedType}`;
        }
        
        if (selectedStatus) {
          filterParams += `&status=${selectedStatus}`;
        }
        
        if (selectedGenre) {
          filterParams += `&genres=${selectedGenre}`;
        }
        
        if (selectedRating) {
          filterParams += `&rating=${selectedRating}`;
        }
        
        const endpoint = contentType === 'anime' 
          ? `https://api.jikan.moe/v4/top/anime?${filterParams}`
          : `https://api.jikan.moe/v4/top/manga?${filterParams}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (data.data) {
          setAnimeList(data.data);
          setHasMore(data.pagination.has_next_page);
        } else {
          setAnimeList([]);
          setHasMore(false);
        }
      } catch (err) {
        setError(`Failed to fetch popular ${contentType}`);
        setAnimeList([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularContent();
  }, [contentType, selectedType, selectedStatus, selectedGenre, selectedRating]);

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
      searchContent(searchTerm, 1);
    }
  }, [searchTerm, contentType, selectedType, selectedStatus, selectedGenre, selectedRating]);

  useEffect(() => {
    if (page > 1) {
      searchContent(searchTerm, page);
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    searchContent(searchTerm, 1);
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
    setSearchTerm(''); // Clear search term when switching content type
    setPage(1);
  };

  const handleFilterChange = (e, setFilter) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const hasActiveFilters = selectedType || selectedStatus || selectedGenre || selectedRating;

  const clearAllFilters = () => {
    setSelectedType('');
    setSelectedStatus('');
    setSelectedGenre('');
    setSelectedRating('');
    setPage(1);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Discover Anime & Manga</h1>
          <div className="flex gap-4 items-center">
            <select
              value={contentType}
              onChange={handleContentTypeChange}
              className="w-1/4 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for anime or manga..."
              className="flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={selectedType}
              onChange={(e) => handleFilterChange(e, setSelectedType)}
              className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(e, setSelectedStatus)}
              className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedGenre}
              onChange={(e) => handleFilterChange(e, setSelectedGenre)}
              className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              {genreOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select
              value={selectedRating}
              onChange={(e) => handleFilterChange(e, setSelectedRating)}
              className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200"
            >
              {ratingOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="text-center text-red-500 dark:text-red-400 mb-4">{error}</div>
        )}

        {!loading && animeList.length === 0 && !error && (
          <div className="text-center py-8">
            <div className="text-2xl text-gray-600 dark:text-gray-400 mb-4">No results found</div>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeleton loading for initial load
            Array(9).fill(null).map((_, index) => (
              <SkeletonItem key={`skeleton-${index}`} />
            ))
          ) : (
            animeList.map((item, index) => (
              <div
                key={`${item.mal_id}-${index}`}
                ref={index === animeList.length - 1 ? lastItemRef : null}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200 relative"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isInWishlist(item.mal_id) ? removeFromWishlist(item.mal_id) : addToWishlist(item);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 ${
                    isInWishlist(item.mal_id)
                      ? 'text-red-500 hover:text-red-400'
                      : 'text-white hover:text-red-500'
                  }`}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill={isInWishlist(item.mal_id) ? "currentColor" : "none"} 
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
                <Link to={`/detail/${item.mal_id}`} className="block">
                  <img
                    src={item.images.jpg.large_image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
                      {item.title}
                    </h2>
                    <div className="flex flex-col space-y-1 text-sm text-gray-600 dark:text-gray-300">
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
                      {contentType === 'anime' ? (
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
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 line-clamp-3">{item.synopsis}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {isLoadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array(3).fill(null).map((_, index) => (
              <SkeletonItem key={`skeleton-more-${index}`} />
            ))}
          </div>
        )}

        {!hasMore && animeList.length > 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-4">No more items to load</div>
        )}
      </div>
    </div>
  );
}

export default SearchPage; 