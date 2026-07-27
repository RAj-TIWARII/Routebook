import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import type { Journey, SearchResult } from '@/types';

/**
 * Flattens journeys into every searchable facet the brief asks for —
 * journeys themselves, their countries, cities, stories, and media —
 * so one query box can surface all of it.
 */
function buildSearchIndex(journeys: Journey[]): SearchResult[] {
  const results: SearchResult[] = [];

  for (const j of journeys) {
    results.push({
      id: `journey-${j.id}`,
      title: j.title,
      category: 'journey',
      description: j.story.slice(0, 90) + (j.story.length > 90 ? '…' : ''),
      image: j.cover_image,
      href: `/journey/${j.slug}`,
    });

    results.push({
      id: `country-${j.id}`,
      title: j.country,
      category: 'country',
      description: `${j.title} — ${j.city}, ${j.country}`,
      image: j.cover_image,
      href: `/journey/${j.slug}`,
    });

    results.push({
      id: `city-${j.id}`,
      title: j.city,
      category: 'city',
      description: `Visited during "${j.title}"`,
      image: j.cover_image,
      href: `/journey/${j.slug}`,
    });

    if (j.photos.length) {
      results.push({
        id: `gallery-${j.id}`,
        title: `${j.title} — Gallery`,
        category: 'gallery',
        description: `${j.photos.length} photos from ${j.location}`,
        image: j.photos[0].url,
        href: `/journey/${j.slug}#gallery`,
      });
    }

    if (j.videos.length) {
      results.push({
        id: `video-${j.id}`,
        title: j.videos[0].title,
        category: 'video',
        description: `From "${j.title}"`,
        image: j.videos[0].poster,
        href: `/journey/${j.slug}#videos`,
      });
    }
  }

  return results;
}

export function useSearch(journeys: Journey[] | undefined) {
  const [query, setQuery] = useState('');

  const index = useMemo(() => buildSearchIndex(journeys ?? []), [journeys]);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: ['title', 'description', 'category'],
        threshold: 0.35,
        includeScore: true,
      }),
    [index],
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [fuse, query]);

  return { query, setQuery, results };
}
