import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Admin from './pages/Admin';
import Movies from './pages/Movies';
import Series from './pages/Series';
import ApiKeySetupScreen from './components/ApiKeySetupScreen';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const isApiConfigured = !!import.meta.env.VITE_TMDB_API_KEY;

  if (!isApiConfigured) {
    return <ApiKeySetupScreen />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#050505] font-sans text-white flex flex-col selection:bg-[#00F5FF]/30">
          <Navbar />
          <main className="flex-1 flex flex-col w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/series" element={<Series />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watch/:mediaType/:id" element={<Watch />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
