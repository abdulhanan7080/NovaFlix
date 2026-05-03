import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="min-h-screen pt-32 px-4 md:px-16 max-w-7xl mx-auto w-full pb-20">
      <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
        <div className="w-12 h-12 rounded-lg glass flex items-center justify-center text-[#00F5FF]">
          <BookmarkIcon className="w-6 h-6 fill-current" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white">My List</h1>
        <span className="glass text-white py-1 px-3 rounded text-sm font-medium ml-auto">
          {watchlist.length} {watchlist.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {watchlist.map((movie, idx) => (
            <div key={movie.id} className="w-full">
              <MovieCard movie={movie} index={idx} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center glass rounded-lg border-dashed">
          <BookmarkIcon className="w-20 h-20 text-white/20 mb-6" />
          <h2 className="text-2xl font-medium text-white mb-2">My List is empty</h2>
          <p className="text-slate-400 max-w-md">Add movies and shows to your list to easily find them later and keep track of what you want to watch.</p>
        </div>
      )}
    </div>
  );
}
