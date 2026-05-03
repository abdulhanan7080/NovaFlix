import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, User as UserIcon, Film, LogOut, Code } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, login, logout, role } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/series' },
    { name: 'My List', path: '/watchlist' }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-4 md:px-16 py-4",
        isScrolled ? "glass shadow-xl py-3 border-b border-white/5" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter text-white uppercase">
              Nova<span className="text-[#00F5FF] neon-glow">Flix</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <div key={link.name} className="relative">
                <Link 
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#00F5FF]",
                    location.pathname === link.path ? "text-[#00F5FF]" : "text-white opacity-70"
                  )}
                >
                  {link.name}
                </Link>
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#00F5FF] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6 text-slate-300">
          <Link to="/search" className="hover:text-[#00F5FF] transition-colors opacity-70 hover:opacity-100">
            <Search className="w-5 h-5" />
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {role === 'admin' && (
                <Link to="/admin" className="text-[#00F5FF] flex items-center gap-1 text-sm font-bold opacity-80 hover:opacity-100">
                  <Code className="w-4 h-4" /> Admin
                </Link>
              )}
              <div 
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-[#00F5FF] transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,245,255,0.2)]"
                title={user.email || ''}
              >
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={logout} 
                className="hover:text-red-400 transition-colors opacity-70 hover:opacity-100"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="bg-[#00F5FF] text-black px-4 py-1.5 rounded-md font-bold text-sm tracking-wide transition-all hover:shadow-[0_0_15px_rgba(0,245,255,0.4)]"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
