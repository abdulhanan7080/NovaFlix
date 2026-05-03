import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft, Download, Tv } from 'lucide-react';
import { motion } from 'motion/react';
import { tmdb, MediaDetail } from '../api/tmdb';
import { useWatchlist } from '../hooks/useWatchlist';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface DownloadLink {
  quality: string;
  server: string;
  url: string;
}

export default function Watch() {
  const { id, mediaType } = useParams<{ id: string; mediaType: string }>();
  const [movie, setMovie] = useState<MediaDetail | null>(null);
  const [downloads, setDownloads] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { user, login } = useAuth();
  const type = (mediaType as 'movie' | 'tv') || 'movie';

  useEffect(() => {
    if (!id) return;
    
    window.scrollTo(0, 0);
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getDetails(id, type);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, type]);

  useEffect(() => {
    if (!id) return;
    // Listen for download links from admin panel
    const unsubscribe = onSnapshot(doc(db, 'media', id), (docObj) => {
      if (docObj.exists()) {
        const data = docObj.data();
        if (data.downloads) setDownloads(data.downloads);
      } else {
        setDownloads([]);
      }
    });
    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-16 animate-pulse">
        <div className="h-[40vh] w-full bg-[#050505] rounded-3xl mb-8"></div>
        <div className="h-8 w-1/3 bg-[#050505] rounded mb-4"></div>
        <div className="h-4 w-2/3 bg-[#050505] rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-[#050505] rounded mb-8"></div>
      </div>
    );
  }

  if (!movie) {
    return <div className="min-h-screen pt-32 text-center text-white">Content not found</div>;
  }

  const backdropUrl = tmdb.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdb.getImageUrl(movie.poster_path);
  const inWatchlist = isInWatchlist(movie.id);
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube') || movie.videos?.results?.[0];
  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;

  const handleWatchlistToggle = () => {
    if (!user) {
      login();
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie, type);
    }
  };

  return (
    <div className="min-h-screen relative pb-20 bg-[#050505]">
      {/* Background Hero */}
      <div className="absolute top-0 left-0 w-full h-[70vh] -z-10">
        <div className="absolute inset-0 bg-[#050505]/80 mt-[70vh]"></div>
        <img src={backdropUrl} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-16 pt-32">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {(type === 'tv') && (
                <span className="inline-block py-1 px-3 rounded text-[10px] uppercase tracking-widest font-bold text-[#00F5FF] border border-[#00F5FF]/40 glass mb-4">
                  TV Series
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 drop-shadow-lg tracking-tight">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-slate-300 mb-8 font-medium">
                <span className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 fill-current" /> {movie.vote_average?.toFixed(1)} / 10
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {movie.runtime || movie.episode_run_time?.[0] || 'N/A'} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {date?.split('-')[0]}
                </span>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-3xl">
                {movie.overview}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                {trailer && (
                  <button 
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-[#00F5FF] text-black px-8 py-4 rounded-md font-bold transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:-translate-y-1"
                  >
                    <Play className="w-5 h-5 fill-current" /> Watch Trailer
                  </button>
                )}
                <button 
                  onClick={handleWatchlistToggle}
                  className="flex items-center gap-2 glass px-8 py-4 rounded-md font-bold transition-all hover:-translate-y-1 hover:border-white/40"
                >
                  {inWatchlist ? (
                    <><Check className="w-5 h-5 text-[#00F5FF]" /> In Watchlist</>
                  ) : (
                    <><Plus className="w-5 h-5" /> Add to Watchlist</>
                  )}
                </button>
              </div>

              {/* Ad Banner Placeholder */}
              <div className="bg-[#111] border border-[#333] rounded-lg p-4 mb-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
                <span className="absolute top-1 left-2 text-[10px] text-slate-500 uppercase tracking-widest">Advertisement</span>
                <p className="text-slate-400 font-bold mb-2 mt-2">Get NovaFlix VIP for Ad-Free Experience & Direct Downloads!</p>
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-md font-bold text-sm max-w-max hover:scale-105 transition-transform">
                  Upgrade to VIP
                </button>
              </div>

              {/* Downloads Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-[#00F5FF]" /> Download Links
                </h3>
                {downloads.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {downloads.map((dl, i) => (
                      <a 
                        key={i} 
                        href={dl.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="glass p-4 rounded-lg flex items-center justify-between hover:border-[#00F5FF]/50 transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-[#00F5FF] transition-colors">{dl.quality}</span>
                          <span className="text-xs text-slate-400">{dl.server}</span>
                        </div>
                        <Download className="w-5 h-5 text-slate-500 group-hover:text-[#00F5FF] transition-colors" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="glass p-6 rounded-lg border-dashed">
                    <p className="text-slate-400 text-sm text-center">No download links available yet.</p>
                  </div>
                )}
              </div>
              
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4 text-white">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(g => (
                    <span key={g.id} className="glass px-4 py-1.5 rounded-full text-sm font-medium">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar Poster / Additional Meta */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/3 lg:w-1/4"
          >
            <div className="border border-white/10 rounded-lg overflow-hidden mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <img src={posterUrl} alt={title} className="w-full h-auto" />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">Top Cast</h3>
                <div className="flex flex-col gap-3">
                  {movie.credits.cast.slice(0, 4).map(actor => (
                    <div key={actor.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800">
                        {actor.profile_path ? (
                          <img src={tmdb.getImageUrl(actor.profile_path, 'w500')} alt={actor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 bg-slate-800 border border-slate-700">NA</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{actor.name}</p>
                        <p className="text-slate-400 text-xs">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trailer Modal Overlay */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-[#00F5FF] transition-colors z-10 glass p-3 rounded-full hover:scale-110"
          >
            ✕
          </button>
          <div className="w-full max-w-5xl aspect-video relative rounded-lg overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
