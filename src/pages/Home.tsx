import React, { useState, useEffect } from 'react';
import { Media, tmdb } from '../api/tmdb';
import Hero from '../components/Hero';
import Row from '../components/Row';

export default function Home() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<Media[]>([]);
  const [action, setAction] = useState<Media[]>([]);
  const [trendingTv, setTrendingTv] = useState<Media[]>([]);
  const [comedy, setComedy] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          popularData,
          topRatedTvData,
          actionData,
          trendingTvData,
          comedyData
        ] = await Promise.all([
          tmdb.getTrending('all'),
          tmdb.getPopular('movie'),
          tmdb.getTopRated('tv'),
          tmdb.getByCategory(28, 'movie'), // Action Movies
          tmdb.getTrending('tv'),
          tmdb.getByCategory(35, 'movie')  // Comedy Movies
        ]);

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRatedTv(topRatedTvData.results);
        setAction(actionData.results);
        setTrendingTv(trendingTvData.results);
        setComedy(comedyData.results);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
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
        <Row title="Trending Now" movies={trending} />
        <Row title="Popular Movies" movies={popular} mediaType="movie" />
        <Row title="Trending TV Shows" movies={trendingTv} mediaType="tv" />
        <Row title="Sci-Fi & Action Movies" movies={action} mediaType="movie" />
        <Row title="Top Rated TV Shows" movies={topRatedTv} mediaType="tv" />
        <div id="movies"></div>
        <Row title="Comedy Hits" movies={comedy} mediaType="movie" />
      </div>
    </div>
  );
}
