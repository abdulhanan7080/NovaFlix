import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Media, tmdb } from '../api/tmdb';

interface HeroProps {
  movies: Media[];
}

export default function Hero({ movies }: HeroProps) {
  const [movie, setMovie] = useState<Media | null>(null);

  useEffect(() => {
    if (movies && movies.length > 0) {
      // Pick a random movie from trending to feature
      const randomIndex = Math.floor(Math.random() * Math.min(10, movies.length));
      setMovie(movies[randomIndex]);
    }
  }, [movies]);

  if (!movie) {
    return <div className="h-[70vh] w-full bg-slate-900 animate-pulse"></div>;
  }

  const backdropUrl = tmdb.getImageUrl(movie.backdrop_path, 'original');
  const type = movie.media_type || 'movie';
  const title = movie.title || movie.name;

  return (
    <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backdropUrl} 
          alt={title}
          className="w-full h-full object-cover object-top"
          style={{ filter: 'brightness(0.6)' }}
        />
        {/* Gradients to fade into background & UI */}
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-16 flex flex-col justify-end h-full pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {(movie.release_date || movie.first_air_date) && (
            <span className="inline-block py-1 px-3 rounded text-[10px] uppercase tracking-widest font-bold text-[#00F5FF] border border-[#00F5FF]/40 glass mb-4">
              Trending ({type === 'tv' ? 'TV Series' : 'Movie'})
            </span>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4 drop-shadow-2xl leading-tight text-white">
            {title}
          </h1>
          
          <p className="text-slate-300 text-sm md:text-lg mb-8 max-w-xl leading-relaxed drop-shadow-md line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              to={`/watch/${type}/${movie.id}`}
              className="flex items-center gap-2 bg-[#00F5FF] text-black px-8 py-3 rounded-md font-bold transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Now
            </Link>
            <Link 
              to={`/watch/${type}/${movie.id}`}
              className="flex items-center gap-2 glass px-8 py-3 rounded-md font-bold transition-all border-white/20 hover:border-white/40"
            >
              <Plus className="w-5 h-5" /> My List
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
