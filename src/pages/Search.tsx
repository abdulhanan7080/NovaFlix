import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { Media, tmdb } from '../api/tmdb';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const data = await tmdb.searchMulti(query);
          // Filter out results without posters for a cleaner look and remove persons
          setResults(data.results.filter(m => m.poster_path && m.media_type !== 'person')); 
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="min-h-screen pt-32 px-4 md:px-16 max-w-7xl mx-auto w-full pb-20">
      <div className="relative mb-12">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
        <input 
          ref={inputRef}
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, tv shows, etc..." 
          className="w-full glass focus:border-[#00F5FF] rounded-lg py-6 pl-20 pr-16 text-xl md:text-3xl text-white placeholder-white/30 shadow-[0_0_20px_rgba(0,0,0,0.5)] outline-none transition-all"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#00F5FF] animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div>
          <h2 className="text-xl font-medium text-slate-300 mb-8">
            Results for <span className="text-white font-bold">"{query}"</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((movie, idx) => (
              <div key={movie.id} className="w-full">
                <MovieCard movie={movie} index={idx} mediaType={movie.media_type} />
              </div>
            ))}
          </div>
        </div>
      ) : query.trim() ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-medium text-slate-400 mb-2">No results found</h2>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
          <SearchIcon className="w-24 h-24 text-slate-500 mb-6" />
          <p className="text-2xl font-display font-medium text-slate-400">Discover your next favorite show or movie</p>
        </div>
      )}
    </div>
  );
}
