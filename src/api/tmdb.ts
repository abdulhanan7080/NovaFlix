const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Media {
  id: number;
  title?: string;
  name?: string; // TV shows use name
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string; // TV shows use first_air_date
  vote_average: number;
  genre_ids: number[];
  media_type?: 'movie' | 'tv';
}

export interface MediaDetail extends Media {
  genres: { id: number; name: string }[];
  runtime?: number;
  episode_run_time?: number[];
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
}

class TMDBService {
  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    if (!API_KEY) {
      throw new Error("TMDB API key is missing. Please configure VITE_TMDB_API_KEY.");
    }
    
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    });

    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from TMDB: ${response.statusText}`);
    }

    return response.json();
  }

  // Exposed utility for images
  getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  // Generic Getters
  async getTrending(mediaType: 'movie' | 'tv' | 'all' = 'movie'): Promise<{ results: Media[] }> {
    return this.request(`/trending/${mediaType}/day`);
  }

  async getPopular(mediaType: 'movie' | 'tv' = 'movie'): Promise<{ results: Media[] }> {
    return this.request(`/${mediaType}/popular`);
  }

  async getTopRated(mediaType: 'movie' | 'tv' = 'movie'): Promise<{ results: Media[] }> {
    return this.request(`/${mediaType}/top_rated`);
  }

  async getByCategory(genreId: number, mediaType: 'movie' | 'tv' = 'movie'): Promise<{ results: Media[] }> {
    return this.request(`/discover/${mediaType}`, { with_genres: genreId.toString() });
  }

  async searchMulti(query: string): Promise<{ results: Media[] }> {
    if (!query) return { results: [] };
    return this.request('/search/multi', { query, include_adult: 'false' });
  }

  async getDetails(id: string, mediaType: 'movie' | 'tv' = 'movie'): Promise<MediaDetail> {
    return this.request(`/${mediaType}/${id}`, { append_to_response: 'videos,credits' });
  }
}

export const tmdb = new TMDBService();
