import { useQuery } from '@tanstack/react-query';
import {
  fetchJourneys,
  fetchJourneyBySlug,
  fetchLocations,
  fetchTimeline,
  fetchTravelStats,
} from '@/lib/journeysRepo';

export function useJourneys() {
  return useQuery({ queryKey: ['journeys'], queryFn: fetchJourneys });
}

export function useJourney(slug: string | undefined) {
  return useQuery({
    queryKey: ['journey', slug],
    queryFn: () => fetchJourneyBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useLocations() {
  return useQuery({ queryKey: ['locations'], queryFn: fetchLocations });
}

export function useTimeline() {
  return useQuery({ queryKey: ['timeline'], queryFn: fetchTimeline });
}

export function useTravelStats() {
  return useQuery({ queryKey: ['travel-stats'], queryFn: fetchTravelStats });
}
