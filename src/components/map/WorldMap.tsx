import { useEffect, useRef } from 'react';
import maplibregl, { Map, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useNavigate } from 'react-router-dom';
import { useJourneys, useLocations } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { formatFullDate } from '@/lib/utils';

const DEFAULT_STYLE =
  import.meta.env.VITE_MAP_STYLE_URL ||
  'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json';

const SOURCE_ID = 'visited-locations';
const ROUTE_SOURCE_ID = 'journey-routes';

export function WorldMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { data: locations } = useLocations();
  const { data: journeys } = useJourneys();
  const navigate = useNavigate();

  // Init map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: DEFAULT_STYLE,
      center: [20, 25],
      zoom: 1.4,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Populate markers + routes once data + style are ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !locations || !journeys) return;

    function setup() {
      if (!map) return;
      // --- Clustered location points -----------------------------------
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: locations!.map((loc) => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
          properties: { ...loc },
        })),
      };

      if (map.getSource(SOURCE_ID)) {
        (map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource).setData(geojson);
      } else {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: geojson,
          cluster: true,
          clusterMaxZoom: 6,
          clusterRadius: 50,
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': 'rgba(110,168,255,0.25)',
            'circle-stroke-color': '#6EA8FF',
            'circle-stroke-width': 1.5,
            'circle-radius': ['step', ['get', 'point_count'], 16, 5, 22, 10, 28],
          },
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Noto Sans Regular'],
            'text-size': 12,
          },
          paint: { 'text-color': '#FFFFFF' },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#6EA8FF',
            'circle-radius': 7,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#050505',
          },
        });

        // Marker "arrival" animation: pulse ring
        map.addLayer({
          id: 'unclustered-point-pulse',
          type: 'circle',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': 'rgba(110,168,255,0.35)',
            'circle-radius': 14,
            'circle-opacity': 0.5,
          },
        });

        // Click cluster -> zoom in
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0]?.properties?.cluster_id;
          const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
          if (clusterId == null) return;
          source.getClusterExpansionZoom(clusterId).then((zoom) => {
            const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
            map.easeTo({ center: coords, zoom });
          });
        });

        // Click point -> fly + open journey
        map.on('click', 'unclustered-point', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
          map.flyTo({ center: coords, zoom: 8, duration: 1400, essential: true });
          const journey = journeys!.find((j) => j.id === feature.properties?.id);
          if (journey) {
            setTimeout(() => navigate(`/journey/${journey.slug}`), 1500);
          }
        });

        // Hover popup
        let hoverPopup: Popup | null = null;
        map.on('mouseenter', 'unclustered-point', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const feature = e.features?.[0];
          if (!feature) return;
          const p = feature.properties as any;
          const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

          hoverPopup = new maplibregl.Popup({ closeButton: false, offset: 14 })
            .setLngLat(coords)
            .setHTML(
              `<div style="font-family:Inter,sans-serif;min-width:180px">
                <div style="font-family:'General Sans',sans-serif;font-weight:600;font-size:14px;margin-bottom:4px">${p.name}</div>
                <div style="font-size:12px;color:#B6BCC8;margin-bottom:6px">${p.country} · ${formatFullDate(p.visited_on)}</div>
                <div style="font-size:11px;color:#B6BCC8;display:flex;gap:10px">
                  <span>${p.photo_count} photos</span><span>${p.video_count} videos</span>
                </div>
              </div>`,
            )
            .addTo(map);
        });
        map.on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
          hoverPopup?.remove();
        });
        map.on('mouseenter', 'clusters', () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', 'clusters', () => (map.getCanvas().style.cursor = ''));
      }

      // --- Route lines between visited places ---------------------------
      const routeFeatures: GeoJSON.Feature[] = journeys!
        .filter((j) => j.route && j.route.length > 1)
        .map((j) => ({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: j.route as [number, number][] },
          properties: { id: j.id },
        }));

      const routeGeojson: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: routeFeatures };

      if (map.getSource(ROUTE_SOURCE_ID)) {
        (map.getSource(ROUTE_SOURCE_ID) as maplibregl.GeoJSONSource).setData(routeGeojson);
      } else {
        map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: routeGeojson });
        map.addLayer({
          id: 'route-lines',
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#6EA8FF',
            'line-width': 1.5,
            'line-opacity': 0.6,
            'line-dasharray': [1, 1.6],
          },
        });
      }
    }

    if (map.isStyleLoaded()) setup();
    else map.once('load', setup);
  }, [locations, journeys, navigate]);

  return (
    <section id="map" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Everywhere, at once"
          title="The interactive world map"
          description="Every marker is a place you've stood. Click one to fly there and open the full journey."
        />
        <ScrollReveal>
          <div className="relative h-[560px] w-full overflow-hidden rounded-[18px] border border-border">
            <div ref={mapContainer} className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/10" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
