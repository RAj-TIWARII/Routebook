/**
 * Domain model for RouteBook.
 * These types mirror the Supabase schema in `supabase/schema.sql` 1:1 so that
 * data returned from the database and the mock dataset are interchangeable.
 */

export type SearchCategory =
  | 'journey'
  | 'gallery'
  | 'place'
  | 'video'
  | 'timeline'
  | 'story'
  | 'country'
  | 'city';

export interface Country {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2
}

export interface City {
  id: string;
  name: string;
  country_id: string;
}

export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  lat: number;
  lng: number;
  visited_on: string; // ISO date
  photo_count: number;
  video_count: number;
  cover_image: string;
}

export interface Photo {
  id: string;
  journey_id: string;
  url: string;
  width: number;
  height: number;
  camera?: string;
  taken_on?: string;
  location?: string;
  alt: string;
}

export interface Video {
  id: string;
  journey_id: string;
  title: string;
  url: string;
  poster: string;
  duration_seconds: number;
}

export interface Journey {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  country: string;
  country_code: string;
  date_start: string;
  date_end: string;
  cover_image: string;
  hero_image: string;
  category: SearchCategory;
  story: string; // long-form markdown/plain text
  distance_km: number;
  places_visited: string[];
  lat: number;
  lng: number;
  route?: [number, number][]; // ordered [lng, lat] waypoints
  photos: Photo[];
  videos: Video[];
  tags: string[];
}

export interface TimelineEntry {
  id: string;
  journey_slug: string;
  date: string;
  place: string;
  country: string;
  thumbnail: string;
}

export interface SearchResult {
  id: string;
  title: string;
  category: SearchCategory;
  description: string;
  image: string;
  href: string;
}

export interface TravelStats {
  countries_visited: number;
  cities_visited: number;
  total_journeys: number;
  total_distance_km: number;
  total_photos: number;
  total_videos: number;
}
