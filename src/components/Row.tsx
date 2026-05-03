import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Media } from '../api/tmdb';
import MovieCard from './MovieCard';

interface RowProps {
  title: string;
  movies: Media[];
  mediaType?: 'movie' | 'tv';
}

export default function Row({ title, movies, mediaType = 'movie' }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-16 relative group bg-[#050505]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-3 text-white">
          {title}
          <div className="w-24 h-[1px] bg-white/10"></div>
        </h2>
        <a href="#" className="text-[#00F5FF] text-xs font-semibold hover:underline">View All</a>
      </div>
      
      <div className="relative">
        {/* Left Arrow Controls */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-0 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={rowRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-8 pt-4 px-2 -mx-2 snap-x"
        >
          {movies.map((movie, idx) => (
            <div key={`${movie.id}-${idx}`} className="snap-start">
              <MovieCard movie={movie} index={idx} mediaType={mediaType} />
            </div>
          ))}
        </div>

        {/* Right Arrow Controls */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-0 z-10 w-10 h-10 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
