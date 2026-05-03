import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { tmdb, Media } from '../api/tmdb';
import { Search, Loader2, Save } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function Admin() {
  const { role } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    url: '',
    quality: '1080p',
    server: 'Server 1'
  });

  if (role !== 'admin') {
    return <div className="min-h-screen pt-32 text-center text-white">Access Denied. Admins Only.</div>;
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await tmdb.searchMulti(query);
      setResults(res.results.filter(m => m.media_type !== 'person'));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const selectMedia = async (media: Media) => {
    setSelectedMedia(media);
  };

  const handleSaveDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedia || !form.url) return;
    setSaving(true);
    
    try {
      const ref = doc(db, 'media', selectedMedia.id.toString());
      const docSnap = await getDoc(ref);
      let existingDownloads = [];
      if (docSnap.exists() && docSnap.data().downloads) {
        existingDownloads = docSnap.data().downloads;
      }
      
      const newDownloads = [...existingDownloads, {
        quality: form.quality,
        server: form.server,
        url: form.url
      }];

      await setDoc(ref, {
        mediaType: selectedMedia.media_type || 'movie',
        updatedAt: serverTimestamp(),
        downloads: newDownloads
      }, { merge: true });

      alert('Download Link added successfully!');
      setForm({ ...form, url: '' }); // reset url
    } catch (error) {
      console.error(error);
      alert('Failed to save download link.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen pt-32 px-4 md:px-16 max-w-7xl mx-auto w-full pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Side: Search & Select TMDB Media */}
        <div>
          <h2 className="text-xl font-semibold text-[#00F5FF] mb-4">1. Search TMDB Item</h2>
          <form onSubmit={handleSearch} className="mb-6 flex gap-2">
            <input 
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Search Movie / TV Series..."
              className="flex-1 glass px-4 py-3 rounded-md focus:border-[#00F5FF] text-white outline-none"
            />
            <button disabled={loading} type="submit" className="bg-[#00F5FF] text-black px-6 font-bold rounded-md hover:bg-opacity-90">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </form>

          {results.length > 0 && (
            <div className="bg-[#050505] border border-white/10 rounded-lg p-4 h-[500px] overflow-y-auto w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map(media => (
                <div key={media.id} onClick={() => selectMedia(media)} className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedMedia?.id === media.id ? 'border-[#00F5FF] scale-105' : 'border-transparent hover:border-white/20'}`}>
                  <img src={tmdb.getImageUrl(media.poster_path)} alt={media.title || media.name} className="w-full h-auto aspect-[2/3] object-cover" />
                  <div className="bg-[#111] p-2 text-xs truncate text-center text-white">
                    {media.title || media.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Manage Data */}
        <div>
          <h2 className="text-xl font-semibold text-[#00F5FF] mb-4">2. Manage Media Links</h2>
          
          {!selectedMedia ? (
            <div className="glass h-40 flex items-center justify-center rounded-lg border-dashed">
              <span className="text-slate-400">Please select a media item from the left.</span>
            </div>
          ) : (
            <div className="glass p-6 rounded-xl border border-white/5 space-y-6">
              <div className="flex gap-4 items-start">
                <img src={tmdb.getImageUrl(selectedMedia.poster_path)} alt="poster" className="w-24 rounded-md shadow-lg" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedMedia.title || selectedMedia.name}</h3>
                  <p className="text-xs text-[#00F5FF] uppercase font-bold tracking-widest">{selectedMedia.media_type || 'movie'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Add Download Link / Stream URL</h4>
                <form onSubmit={handleSaveDownload} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Link URL</label>
                    <input 
                      required
                      type="url" 
                      value={form.url}
                      onChange={e => setForm({ ...form, url: e.target.value })}
                      placeholder="https://mega.nz/..."
                      className="w-full bg-[#050505] border border-white/10 px-4 py-2 rounded-md outline-none focus:border-[#00F5FF] text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1">Quality</label>
                      <select 
                        value={form.quality}
                        onChange={e => setForm({ ...form, quality: e.target.value })}
                        className="w-full bg-[#050505] border border-white/10 px-4 py-2 rounded-md outline-none focus:border-[#00F5FF] text-white"
                      >
                        <option>480p</option>
                        <option>720p</option>
                        <option>1080p</option>
                        <option>4K</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1">Server Name</label>
                      <input 
                        required
                        type="text" 
                        value={form.server}
                        onChange={e => setForm({ ...form, server: e.target.value })}
                        placeholder="Server 1"
                        className="w-full bg-[#050505] border border-white/10 px-4 py-2 rounded-md outline-none focus:border-[#00F5FF] text-white"
                      />
                    </div>
                  </div>
                  
                  <button type="submit" disabled={saving} className="w-full bg-white text-black py-3 rounded-md font-bold hover:bg-slate-200 flex items-center justify-center gap-2">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Link</>}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
