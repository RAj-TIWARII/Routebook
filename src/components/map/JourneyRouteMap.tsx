import { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Journey } from '@/types';

const STYLE =
  import.meta.env.VITE_MAP_STYLE_URL ||
  'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json';

export function JourneyRouteMap({ journey }: { journey: Journey }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!container.current) return;

    const map = new maplibregl.Map({
      container: container.current,
      style: STYLE,
      center: [journey.lng, journey.lat],
      zoom: 8,
      attributionControl: false,
      interactive: true,
    });
    mapRef.current = map;

    map.on('load', () => {
      new maplibregl.Marker({ color: '#6EA8FF' })
        .setLngLat([journey.lng, journey.lat])
        .addTo(map);

      if (journey.route && journey.route.length > 1) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: journey.route },
          },
        });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#6EA8FF', 'line-width': 2.5, 'line-opacity': 0.8 },
        });

        const bounds = journey.route.reduce(
          (b, coord) => b.extend(coord as [number, number]),
          new maplibregl.LngLatBounds(journey.route[0], journey.route[0]),
        );
        map.fitBounds(bounds, { padding: 60, duration: 0 });
      }
    });

    return () => map.remove();
  }, [journey]);

  return <div ref={container} className="h-[380px] w-full rounded-[18px] border border-border" />;
}
