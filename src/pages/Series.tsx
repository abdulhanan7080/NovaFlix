import React, { useState, useEffect } from 'react';
import { Media, tmdb } from '../api/tmdb';
import Hero from '../components/Hero';
import Row from '../components/Row';

export default function Series() {
  const [trending, setTrending] = useState<Media[]>([]);
  const [popular, setPopular] = useState<Media[]>([]);
  const [topRated, setTopRated] = useState<Media[]>([]);
  const [action, setAction] = useState<Media[]>([]);
  const [comedy, setComedy] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [
          trendingData,
          popularData,
          topRatedData,
          actionData, // Action & Adventure (TV genre id 10759)
          comedyData  // Comedy (TV genre id 35)
        ] = await Promise.all([
          tmdb.getTrending('tv'),
          tmdb.getPopular('tv'),
          tmdb.getTopRated('tv'),
          tmdb.getByCategory(10759, 'tv'), 
          tmdb.getByCategory(35, 'tv')
        ]);

        setTrending(trendingData.results);
        setPopular(popularData.results);
        setTopRated(topRatedData.results);
        setAction(actionData.results);
        setComedy(comedyData.results);
      } catch (error) {
        console.error("Error fetching tv data:", error);
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
        <Row title="Trending Series" movies={trending} mediaType="tv" />
        <Row title="Popular TV Shows" movies={popular} mediaType="tv" />
        <Row title="Action & Adventure" movies={action} mediaType="tv" />
        <Row title="Top Rated Series" movies={topRated} mediaType="tv" />
        <Row title="Comedy Series" movies={comedy} mediaType="tv" />
      </div>
    </div>
  );
}
