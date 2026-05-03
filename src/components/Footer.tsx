import React from 'react';
import { Film, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 py-12 px-4 md:px-16 mt-12 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-display font-bold tracking-tighter text-white uppercase">
              Nova<span className="text-[#00F5FF] neon-glow">Flix</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-xs">
            Your premium destination for discovering and tracking the best movies and TV shows across the galaxy.
          </p>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold text-white">Explore</h4>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Home</a>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Trending</a>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Top Rated</a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-semibold text-white">Legal</h4>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-[#00F5FF] transition">Cookie Preferences</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} NovaFlix. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition"><Twitter className="w-4 h-4" /></a>
          <a href="#" className="hover:text-white transition"><Github className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
}
