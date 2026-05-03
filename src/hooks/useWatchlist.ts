import { useState, useEffect } from 'react';
import { Media, tmdb } from '../api/tmdb';
import { useAuth } from '../contexts/AuthContext';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWatchlistIds([]);
      setWatchlistMovies([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/watchlist`), async (snapshot) => {
      const ids: number[] = [];
      const fetchPromises: Promise<Media>[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        ids.push(data.tmdbId);
        fetchPromises.push(tmdb.getDetails(data.tmdbId.toString(), data.mediaType));
      });
      
      setWatchlistIds(ids);

      try {
        const movies = await Promise.all(fetchPromises);
        setWatchlistMovies(movies);
      } catch (e) {
        console.error("Failed to fetch watchlist details", e);
      }
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addToWatchlist = async (media: Media, type: 'movie' | 'tv' = 'movie') => {
    if (!user) return; // Note: In UI we should prompt login instead
    const ref = doc(db, `users/${user.uid}/watchlist`, media.id.toString());
    await setDoc(ref, {
      userId: user.uid,
      tmdbId: media.id,
      mediaType: type,
      addedAt: serverTimestamp()
    });
  };

  const removeFromWatchlist = async (mediaId: number) => {
    if (!user) return;
    const ref = doc(db, `users/${user.uid}/watchlist`, mediaId.toString());
    await deleteDoc(ref);
  };

  const isInWatchlist = (mediaId: number) => {
    return watchlistIds.includes(mediaId);
  };

  return {
    watchlist: watchlistMovies,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
