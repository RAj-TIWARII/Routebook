import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { journeys as mockJourneys, timeline as mockTimeline, locations as mockLocations, travelStats as mockStats } from '@/data/mockData';
import type { Journey, Location, TimelineEntry, TravelStats } from '@/types';

/**
 * Every function here has the same shape: try Supabase if it's configured,
 * otherwise return the local mock dataset. This means the UI never has to
 * know or care which source it's reading from, and the app is fully
 * explorable the moment you `npm install`, before any backend is wired up.
 *
 * The Supabase queries assume the tables created in `supabase/schema.sql`.
 * Adjust `select()` shapes if you change the schema.
 */

export async function fetchJourneys(): Promise<Journey[]> {
  if (!isSupabaseConfigured) return mockJourneys;

  const { data, error } = await supabase
    .from('journeys')
    .select('*, photos(*), videos(*)')
    .order('date_start', { ascending: false });

  if (error) throw error;
  return (data as unknown as Journey[]) ?? [];
}

export async function fetchJourneyBySlug(slug: string): Promise<Journey | undefined> {
  if (!isSupabaseConfigured) {
    return mockJourneys.find((j) => j.slug === slug);
  }

  const { data, error } = await supabase
    .from('journeys')
    .select('*, photos(*), videos(*)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as unknown as Journey;
}

export async function fetchLocations(): Promise<Location[]> {
  if (!isSupabaseConfigured) return mockLocations;

  const { data, error } = await supabase.from('locations').select('*');
  if (error) throw error;
  return (data as unknown as Location[]) ?? [];
}

export async function fetchTimeline(): Promise<TimelineEntry[]> {
  if (!isSupabaseConfigured) return mockTimeline;

  const { data, error } = await supabase
    .from('journeys')
    .select('id, slug:slug, date:date_start, place:location, country, thumbnail:cover_image')
    .order('date_start', { ascending: false });

  if (error) throw error;
  return (data as unknown as TimelineEntry[]) ?? [];
}

export async function fetchTravelStats(): Promise<TravelStats> {
  if (!isSupabaseConfigured) return mockStats;

  const { data, error } = await supabase.rpc('get_travel_stats');
  if (error) throw error;
  return data as TravelStats;
}

/** Creates a new journey row (used by the admin panel). */
export async function createJourney(input: Partial<Journey>) {
  if (!isSupabaseConfigured) {
    throw new Error('Connect Supabase to create real journeys — see .env.example');
  }
  const { data, error } = await supabase.from('journeys').insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateJourney(id: string, input: Partial<Journey>) {
  if (!isSupabaseConfigured) {
    throw new Error('Connect Supabase to edit real journeys — see .env.example');
  }
  const { data, error } = await supabase.from('journeys').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteJourney(id: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Connect Supabase to delete real journeys — see .env.example');
  }
  const { error } = await supabase.from('journeys').delete().eq('id', id);
  if (error) throw error;
}
