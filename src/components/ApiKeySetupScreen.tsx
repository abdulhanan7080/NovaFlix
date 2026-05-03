import React from 'react';
import { Film, Key, Settings } from 'lucide-react';

export default function ApiKeySetupScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-16 py-8 text-center space-y-8 bg-[url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md"></div>
      
      <div className="relative z-10 max-w-2xl w-full glass p-10 rounded-lg flex flex-col items-center">
        <div className="w-20 h-20 rounded-full glass border-[#00F5FF]/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,245,255,0.3)]">
          <Key className="w-10 h-10 text-[#00F5FF]" />
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">
          Welcome to <span className="text-gradient">NovaFlix</span>
        </h1>
        
        <p className="text-slate-300 text-lg mb-8 max-w-md">
          To browse the full catalogue of movies, TV shows, and trailers, you need to configure your TMDB API key.
        </p>

        <div className="glass rounded-lg p-6 w-full text-left space-y-4">
          <h3 className="text-[#00F5FF] font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" /> Setup Instructions
          </h3>
          <ol className="list-decimal list-inside text-slate-300 space-y-3 text-sm">
            <li>Create an account at <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-[#00F5FF] hover:text-[#00F5FF]/80 underline underline-offset-4">The Movie Database (TMDB)</a></li>
            <li>Go to your account settings and navigate to the <strong>API</strong> section.</li>
            <li>Generate a new API key (v3 auth).</li>
            <li>Open the <strong>Secrets</strong> panel in AI Studio settings.</li>
            <li>Add a new secret named <code className="glass px-2 py-1 rounded text-[#00F5FF] font-mono text-xs mx-1">VITE_TMDB_API_KEY</code> and paste your key.</li>
            <li>Restart the app to dive into NovaFlix!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
