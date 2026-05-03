import React, { useState, useEffect } from 'react';
import { Media, tmdb } from '../api/tmdb';
import Hero from '../components/Hero';
import Row from '../components/Row';

export default function Movies() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [action, setAction] = useState<Media[]>([]);
  const [comedy, setComedy] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          popularData,
          topRatedData,
          actionData,
          comedyData
        ] = await Promise.all([
          tmdb.getTrending('movie'),
          tmdb.getPopular('movie'),
          tmdb.getTopRated('movie'),
          tmdb.getByCategory(28, 'movie'), // Action
          tmdb.getByCategory(35, 'movie')  // Comedy
        ]);

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setAction(actionData.results);
        setComedy(comedyData.results);
      } catch (error) {
        console.error("Error fetching movies data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 md:px-16 flex flex-col gap-8 bg-[#050505]">
        <div className="h-[60vh] w-full glass animate-pulse rounded-lg"></div>
        <div className="h-40 w-full glass animate-pulse rounded-lg"></div>
        <div className="h-40 w-full glass animate-pulse rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 w-full overflow-hidden">
      <Hero movies={trending} />
      
      <div className="-mt-24 relative z-20 pb-12 space-y-4">
        <Row title="Trending Movies" movies={trending} mediaType="movie" />
        <Row title="Popular Movies" movies={popular} mediaType="movie" />
        <Row title="Action Movies" movies={action} mediaType="movie" />
        <Row title="Top Rated Movies" movies={topRated} mediaType="movie" />
        <Row title="Comedy Movies" movies={comedy} mediaType="movie" />
      </div>
    </div>
  );
}
