import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Media, tmdb } from '../api/tmdb';

interface MovieCardProps {
  movie: Media;
  index: number;
  mediaType?: 'movie' | 'tv';
}

export default function MovieCard({ movie, index, mediaType }: MovieCardProps) {
  const imageUrl = tmdb.getImageUrl(movie.poster_path);
  const type = movie.media_type || mediaType || 'movie';
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group movie-card w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] rounded-lg overflow-hidden glass cursor-pointer relative shrink-0 border border-white/5"
    >
      <Link to={`/watch/${type}/${movie.id}`} className="block w-full h-full">
        {/* Fallback pattern if no image */}
        <div className="absolute inset-0 bg-slate-800 -z-10" />
        
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-bold text-xs sm:text-sm truncate mb-1">
            {title}
          </p>
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{movie.vote_average?.toFixed(1)}</span>
            </div>
            <span className="opacity-60 text-white truncate">
              {date ? new Date(date).getFullYear() : 'N/A'} {type === 'tv' && '• TV'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
