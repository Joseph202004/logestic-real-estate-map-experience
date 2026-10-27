import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap, useMapEvents, Polyline, Rectangle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router';
import {
  Layers, Users, Navigation, Train, Clock, MapPin, Zap, Sparkles,
  ArrowUpRight, ChevronRight
} from 'lucide-react';
import type { Property } from '../data/properties';
import { getStatusLabel } from '../data/properties';
import type { LayerId, Persona } from '../personas/personas';
import { defaultPersona } from '../personas/personas';
import { AnalysisToolbar, LayerPanel, MatchPanel, REACH_OPTIONS } from './map/overlays';
import type { ReachId } from './map/overlays';
import { useApp } from '../context/AppContext';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/* ─── Price pill markers ─── */
function createPriceIcon(property: Property, isActive: boolean, isSaved = false): L.DivIcon {
  const label = property.rentPsf ? `$${property.rentPsf}/SF` : 'Ask';
  const width = label.length * 7.5 + 22;

  return L.divIcon({
    className: 'price-marker',
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        height:28px;padding:0 11px;border-radius:999px;
        background:${isActive ? '#322F35' : '#ffffff'};
        color:${isActive ? '#ffffff' : '#21005D'};
        border:1px solid ${isActive ? '#322F35' : 'rgba(12,68,124,0.12)'};
        box-shadow:0 2px 6px rgba(12,68,124,0.22);
        font-family:${FONT};font-size:12px;font-weight:800;white-space:nowrap;
        transition:transform .15s ease;
        transform:${isActive ? 'scale(1.06)' : 'scale(1)'};
      ">${isSaved ? '&#9829; ' : ''}${label}</div>
    `,
    iconSize: [width, 28],
    iconAnchor: [width / 2, 14],
    popupAnchor: [0, -18],
  });
}

const STATUS_COLORS: Record<string, string> = {
  available: '#2E7D32',
  under_negotiation: '#8C5000',
  coming_soon: '#21005D',
};

const ACTIVE_COLOR = '#6750A4';

/* ─── Transit hub mock data (positioned near real US logistics hubs) ─── */
const TRANSIT_HUBS = [
  { lat: 41.8, lng: -87.75, name: 'Chicago Intermodal Terminal' },
  { lat: 40.72, lng: -74.17, name: 'Port Newark Container Terminal' },
  { lat: 33.95, lng: -118.25, name: 'Port of Los Angeles / Long Beach' },
  { lat: 32.9, lng: -96.8, name: 'Dallas Intermodal Hub' },
  { lat: 33.6, lng: -84.5, name: 'Atlanta CSX Intermodal' },
  { lat: 47.25, lng: -122.35, name: 'Port of Tacoma' },
  { lat: 35.12, lng: -89.85, name: 'Memphis BNSF Intermodal' },
  { lat: 40.55, lng: -75.5, name: 'Lehigh Valley Rail Hub' },
  { lat: 33.5, lng: -112.0, name: 'Phoenix BNSF Yard' },
  { lat: 32.1, lng: -81.2, name: 'Port of Savannah' },
  { lat: 39.8, lng: -104.9, name: 'Denver UP Intermodal' },
  { lat: 29.75, lng: -95.3, name: 'Port of Houston' },
];

/* ─── Labor pool density zones (circles with varying radius based on score) ─── */
const LABOR_ZONES = [
  { lat: 41.85, lng: -87.7, score: 87, pop: '9.5M metro' },
  { lat: 40.75, lng: -74.0, score: 91, pop: '20M metro' },
  { lat: 34.05, lng: -117.5, score: 79, pop: '4.6M metro' },
  { lat: 32.78, lng: -96.8, score: 83, pop: '7.5M metro' },
  { lat: 33.75, lng: -84.4, score: 80, pop: '6.1M metro' },
  { lat: 47.6, lng: -122.3, score: 85, pop: '4.0M metro' },
  { lat: 35.15, lng: -90.0, score: 76, pop: '1.3M metro' },
  { lat: 33.45, lng: -112.0, score: 77, pop: '4.9M metro' },
  { lat: 32.08, lng: -81.1, score: 72, pop: '0.4M metro' },
  { lat: 39.74, lng: -104.95, score: 81, pop: '2.9M metro' },
  { lat: 29.76, lng: -95.37, score: 84, pop: '7.1M metro' },
];

/* ─── Metro anchors, used to derive the additional data layers ─── */
const METROS: [number, number][] = [
  [41.85, -87.7], [40.75, -74.0], [34.05, -117.5], [32.78, -96.8],
  [33.75, -84.4], [47.6, -122.3], [35.15, -90.0], [33.45, -112.0],
  [32.08, -81.1], [39.74, -104.95], [29.76, -95.37],
];
const nudge = (base: [number, number][], dLat: number, dLng: number): [number, number][] =>
  base.map(([la, ln]) => [la + dLat, ln + dLng]);

/* Point-style additional layers (suppliers, stores, cold-chain). Parcel hubs
   are derived from the visible properties instead, so they always sit on land. */
const SUPPLIER_SITES = nudge(METROS, -0.19, 0.23);
const COLD_SITES = nudge(METROS, 0.13, -0.22);
const STORE_SITES: [number, number][] = METROS.flatMap(([la, ln]) => [
  [la + 0.06, ln + 0.06], [la - 0.09, ln + 0.14], [la + 0.11, ln - 0.11],
]);
/* Heat-style additional layers. */
const DEMAND_ZONES = METROS.map(([lat, lng], i) => ({ lat, lng, weight: [95, 100, 82, 86, 84, 78, 70, 74, 55, 72, 80][i] }));
const RISK_ZONES = [ // coastal / flood-exposed metros
  { lat: 40.75, lng: -74.0, kind: 'Coastal flood' },
  { lat: 47.6, lng: -122.3, kind: 'Seismic' },
  { lat: 32.08, lng: -81.1, kind: 'Hurricane' },
  { lat: 29.76, lng: -95.37, kind: 'Hurricane / flood' },
  { lat: 34.05, lng: -117.5, kind: 'Wildfire / seismic' },
];

/* ─── Major interstate routes (Transit-app style coloured lines across US) ─── */
const HIGHWAY_ROUTES = [
  // I-10 (LA → Houston)
  { name: 'I-10', color: '#EE6C4D', points: [[34.0, -118.2], [33.45, -112.0], [32.2, -110.9], [31.8, -106.4], [29.75, -95.4]] as [number, number][] },
  // I-95 (NJ → Savannah)
  { name: 'I-95', color: '#1B7A8C', points: [[40.8, -74.1], [40.6, -75.4], [39.3, -76.6], [37.5, -77.4], [35.8, -78.6], [33.8, -84.4], [32.1, -81.1]] as [number, number][] },
  // I-40 (Memphis → IE)
  { name: 'I-40', color: '#6750A4', points: [[35.1, -90.0], [35.5, -97.5], [35.1, -106.6], [34.0, -117.4]] as [number, number][] },
  // I-55 (Chicago → Memphis)
  { name: 'I-55', color: '#E8963A', points: [[41.8, -87.8], [39.8, -89.6], [37.2, -89.5], [35.1, -90.0]] as [number, number][] },
  // I-5 (Seattle → IE)
  { name: 'I-5', color: '#2E7D5B', points: [[47.4, -122.3], [45.5, -122.7], [40.6, -122.4], [37.8, -122.4], [34.0, -118.2]] as [number, number][] },
  // I-20 (Atlanta → Dallas)
  { name: 'I-20', color: '#C74B78', points: [[33.75, -84.4], [33.45, -86.8], [32.3, -90.2], [32.5, -93.7], [32.65, -96.85]] as [number, number][] },
  // I-70 (Denver → midwest)
  { name: 'I-70', color: '#3E6DB5', points: [[39.77, -104.87], [39.1, -99.3], [39.0, -94.6], [38.9, -90.2], [39.8, -86.2]] as [number, number][] },
];

/* Labor-score badge — a solid chip so the zone reads clearly over busy tiles. */
function createLaborBadge(score: number): L.DivIcon {
  return L.divIcon({
    className: 'labor-badge',
    html: `
      <div style="
        display:flex;align-items:center;gap:3px;
        height:22px;padding:0 8px;border-radius:999px;
        background:#21005D;color:#ffffff;
        border:1.5px solid #ffffff;
        box-shadow:0 2px 6px rgba(12,68,124,0.3);
        font-family:${FONT};font-size:10.5px;font-weight:800;white-space:nowrap;
      ">
        <span style="opacity:.7;font-weight:600;">Labor</span>${score}
      </div>`,
    iconSize: [56, 22],
    iconAnchor: [28, 11],
  });
}

/* Teardrop terminal pin — marks the end of a route, coloured per line. */
function createRoutePin(color: string): L.DivIcon {
  return L.divIcon({
    className: 'route-pin',
    html: `
      <div style="
        width:16px;height:16px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:#ffffff;border:3px solid ${color};
        box-shadow:0 2px 5px rgba(0,0,0,0.25);
      "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 15],
  });
}

/**
 * Leaflet projects against the container's pixel size, so any camera move made
 * while that size is 0 (e.g. during a flex-layout shift) yields NaN LatLngs.
 * This waits until the container reports a real size before reporting ready,
 * re-checking on resize and nudging Leaflet with invalidateSize.
 */
function useMapReady() {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      const size = map.getSize();
      if (size.x > 0 && size.y > 0) {
        setReady(true);
        return true;
      }
      return false;
    };

    map.invalidateSize();
    check();

    // Always observe: the container also resizes when the side panel collapses,
    // and Leaflet must re-invalidate to fill the newly-available width.
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
      check();
    });
    ro.observe(map.getContainer());
    return () => ro.disconnect();
  }, [map]);

  return ready;
}

/* ─── Map bounds / auto-fit component ─── */
function MapFitter({ properties: visibleProperties }: { properties: Property[]; selectedId: string | null }) {
  const map = useMap();
  const ready = useMapReady();
  const prevPropsRef = useRef<string>('');

  useEffect(() => {
    if (!ready || visibleProperties.length === 0) return;
    const key = visibleProperties.map(p => p.id).sort().join(',');
    if (key === prevPropsRef.current) return;
    prevPropsRef.current = key;

    const bounds = L.latLngBounds(visibleProperties.map(p => [p.map.lat, p.map.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true, duration: 0.5 });
  }, [visibleProperties, map, ready]);

  return null;
}

/**
 * A labor zone or transit hub within this many degrees of the selected property
 * belongs to its metro, so it is drawn on the property itself — otherwise the
 * ring sits a few miles off the marker it is meant to describe.
 */
const SAME_METRO_DEG = 0.6;

function snapToSelected(
  lat: number,
  lng: number,
  selected: Property | undefined
): [number, number] {
  if (
    selected &&
    Math.abs(lat - selected.map.lat) < SAME_METRO_DEG &&
    Math.abs(lng - selected.map.lng) < SAME_METRO_DEG
  ) {
    return [selected.map.lat, selected.map.lng];
  }
  return [lat, lng];
}

/* ─── Fly-to selected property ─── */
function FlyToSelected({ property }: { property: Property | undefined }) {
  const map = useMap();
  const ready = useMapReady();
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !property || property.id === prevIdRef.current) return;
    if (!property.map || isNaN(property.map.lat) || isNaN(property.map.lng)) return;
    prevIdRef.current = property.id;
    const currentZoom = map.getZoom();
    const zoom = isNaN(currentZoom) ? 7 : Math.max(currentZoom, 7);
    map.flyTo([property.map.lat, property.map.lng], zoom, { animate: true, duration: 0.6 });
  }, [property, map, ready]);

  return null;
}


/**
 * Fetches real road-following geometry for each interstate route from the public
 * OSRM demo API (keyless). Runs once when the layer is first enabled; until it
 * resolves — or if the request fails — the render falls back to the static
 * hand-drawn coordinates, so the map is always usable offline.
 */
function useRoadRoutes(enabled: boolean) {
  const [roads, setRoads] = useState<Record<string, [number, number][]>>({});
  const fetched = useRef(false);

  useEffect(() => {
    if (!enabled || fetched.current) return;
    fetched.current = true;
    let cancelled = false;

    (async () => {
      const results: Record<string, [number, number][]> = {};
      await Promise.all(
        HIGHWAY_ROUTES.map(async (route, i) => {
          // OSRM wants lng,lat pairs; our points are [lat, lng].
          const coords = route.points.map(([la, ln]) => `${ln},${la}`).join(';');
          const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
          try {
            const json = await fetch(url).then(r => r.json());
            const line = json?.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;
            if (Array.isArray(line)) {
              results[`hw-${i}`] = line.map(([ln, la]) => [la, ln]);
            }
          } catch {
            /* keep the static fallback for this route */
          }
        })
      );
      if (!cancelled) setRoads(results);
    })();

    return () => { cancelled = true; };
  }, [enabled]);

  return roads;
}

/* ─── Drive-time isochrone rings around the selected property ─── */
const DRIVE_RINGS = [
  { min: 15, radiusKm: 22, opacity: 0.14 },
  { min: 30, radiusKm: 45, opacity: 0.10 },
  { min: 45, radiusKm: 70, opacity: 0.06 },
];

function DriveTimeRings({ property }: { property: Property | undefined }) {
  if (!property) return null;
  const center: [number, number] = [property.map.lat, property.map.lng];
  return (
    <>
      {[...DRIVE_RINGS].reverse().map(ring => (
        <Circle
          key={ring.min}
          center={center}
          radius={ring.radiusKm * 1000}
          pathOptions={{
            color: '#1B7A8C', fillColor: '#1B7A8C', fillOpacity: ring.opacity,
            weight: 1.5, opacity: 0.6, dashArray: '6 5',
          }}
        >
          <Tooltip direction="top" sticky>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#1B7A8C' }}>
              ~{ring.min} min drive
            </span>
          </Tooltip>
        </Circle>
      ))}
    </>
  );
}

/* ─── Draw-area rectangle tool ─── */
function DrawAreaLayer({
  active,
  properties,
  onCount,
}: {
  active: boolean;
  properties: Property[];
  onCount: (n: number | null) => void;
}) {
  const [corner1, setCorner1] = useState<[number, number] | null>(null);
  const [corner2, setCorner2] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      if (!active) return;
      const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
      if (!corner1 || corner2) {
        // No box yet, or a completed box — start a fresh one.
        setCorner1(pt);
        setCorner2(null);
      } else {
        // One corner down — this click sets the opposite corner.
        setCorner2(pt);
      }
    },
  });

  // Reset the drawing whenever the tool is switched off; show a crosshair while on.
  useEffect(() => {
    const el = map.getContainer();
    el.style.cursor = active ? 'crosshair' : '';
    if (!active) { setCorner1(null); setCorner2(null); onCount(null); }
    return () => { el.style.cursor = ''; };
  }, [active, onCount, map]);

  useEffect(() => {
    if (corner1 && corner2) {
      const bounds = L.latLngBounds(corner1, corner2);
      const n = properties.filter(p => bounds.contains([p.map.lat, p.map.lng])).length;
      onCount(n);
    }
  }, [corner1, corner2, properties, onCount]);

  if (!corner1 || !corner2) return null;
  return (
    <Rectangle
      bounds={L.latLngBounds(corner1, corner2)}
      pathOptions={{ color: '#6750A4', weight: 2, fillColor: '#6750A4', fillOpacity: 0.08, dashArray: '6 4' }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN INTERACTIVE MAP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function InteractiveMap({
  properties: visibleProperties,
  selectedId,
  onSelectProperty,
  showControls = true,
  persona = defaultPersona,
  overlayInsetLeft = 0,
  filtersOpen,
  onToggleFilters,
}: {
  properties: Property[];
  selectedId: string | null;
  onSelectProperty: (id: string) => void;
  /** false renders the bare map — no toolbar, layer panel, legend or match panel. */
  showControls?: boolean;
  /** Drives which layers are recommended and how the match is explained. */
  persona?: Persona;
  /** px the floating panels occupy on the left, so the map's own overlays clear them. */
  overlayInsetLeft?: number;
  /** Filters-panel open state + toggle, surfaced as a pill in the toolbar. */
  filtersOpen?: boolean;
  onToggleFilters?: () => void;
}) {
  const navigate = useNavigate();
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const [reach, setReach] = useState<ReachId>('1h');
  const [driveTime, setDriveTime] = useState(false);
  const [drawArea, setDrawArea] = useState(false);
  const [drawCount, setDrawCount] = useState<number | null>(null);
  // Real road geometry from OSRM, fetched the first time Drive time is enabled.
  const roadRoutes = useRoadRoutes(driveTime);

  // Persona presets pick the layers; manual choices hold until the persona changes.
  const [active, setActive] = useState<Set<LayerId>>(() => new Set(persona.recommended));
  const personaRef = useRef(persona.id);
  useEffect(() => {
    if (personaRef.current !== persona.id) {
      personaRef.current = persona.id;
      setActive(new Set(persona.recommended));
    }
  }, [persona]);

  const toggleLayer = useCallback((id: LayerId) =>
    setActive(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    }), []);

  const overlays = {
    labor: active.has('labor'),
    transit: active.has('transit'),
    reach: active.has('reach'),
    parcel: active.has('parcel'),
    demand: active.has('demand'),
    suppliers: active.has('suppliers'),
    stores: active.has('stores'),
    coldChain: active.has('coldChain'),
    rent: active.has('rent'),
    risk: active.has('risk'),
  };
  const reachOption = REACH_OPTIONS.find(r => r.id === reach)!;

  const selectedProperty = visibleProperties.find(p => p.id === selectedId);

  // Compute center for initial view
  const center = useMemo<[number, number]>(() => {
    if (visibleProperties.length === 0) return [39.5, -98.5]; // US center
    const avgLat = visibleProperties.reduce((s, p) => s + p.map.lat, 0) / visibleProperties.length;
    const avgLng = visibleProperties.reduce((s, p) => s + p.map.lng, 0) / visibleProperties.length;
    return [avgLat, avgLng];
  }, []);

  return (
    // Full-bleed map with floating overlays that the panels overlap.
    <div
      className="relative isolate z-0 w-full h-full rounded-2xl overflow-hidden border border-[#E7E0EC] shadow-inner"
      style={{ fontFamily: FONT }}
    >
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#E6E0E9' }}
      >
        {/* Tile layer — OpenStreetMap standard (keyless, no watermark) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds */}
        <MapFitter properties={visibleProperties} selectedId={selectedId} />
        <FlyToSelected property={selectedProperty} />

        {/* ─── Highway routes — shown together with the Drive-time toggle ─── */}
        {driveTime && HIGHWAY_ROUTES.map((route, i) => {
          const start = route.points[0];
          const end = route.points[route.points.length - 1];
          // Prefer real road geometry from OSRM; fall back to the static coords.
          const positions = roadRoutes[`hw-${i}`] ?? route.points;
          return (
            <React.Fragment key={`hw-${i}`}>
              {/* White casing underneath for the transit-line look */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: '#ffffff', weight: 8, opacity: 0.9,
                  lineCap: 'round', lineJoin: 'round',
                }}
              />
              {/* Coloured line on top with rounded joints */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: route.color, weight: 4.5, opacity: 0.95,
                  lineCap: 'round', lineJoin: 'round',
                }}
              >
                <Tooltip sticky>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: route.color }}>{route.name}</span>
                </Tooltip>
              </Polyline>
              {/* Flowing dots travelling toward the destination */}
              <Polyline
                positions={positions}
                interactive={false}
                pathOptions={{
                  className: 'route-flow',
                  color: '#ffffff', weight: 2.5, opacity: 0.9,
                  lineCap: 'round', dashArray: '0.1 16',
                }}
              />
              {/* Stop dots at each bend */}
              {route.points.slice(1, -1).map((pt, j) => (
                <CircleMarker
                  key={`hw-${i}-stop-${j}`}
                  center={pt}
                  radius={4}
                  pathOptions={{
                    color: route.color, fillColor: '#ffffff',
                    fillOpacity: 1, weight: 2.5, opacity: 1,
                  }}
                />
              ))}
              {/* Origin dot */}
              <CircleMarker
                center={start}
                radius={5.5}
                pathOptions={{
                  color: '#ffffff', fillColor: route.color,
                  fillOpacity: 1, weight: 2, opacity: 1,
                }}
              />
              {/* Destination pin */}
              <Marker position={end} icon={createRoutePin(route.color)} />
            </React.Fragment>
          );
        })}

        {/* ─── DATA LAYER: Labor pool density ─── */}
        {overlays.labor && LABOR_ZONES.map((zone, i) => {
          const center = snapToSelected(zone.lat, zone.lng, selectedProperty);
          return (
            <React.Fragment key={`labor-${i}`}>
              <Circle
                center={center}
                radius={zone.score * 800}
                pathOptions={{
                  color: '#6750A4',
                  fillColor: '#6750A4',
                  fillOpacity: 0.14 + (zone.score / 100) * 0.16,
                  weight: 2,
                  opacity: 0.85,
                }}
              >
                <Tooltip>
                  <div style={{ fontFamily: FONT }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#21005D' }}>Labor Pool Zone</div>
                    <div style={{ fontSize: 10, color: '#1D1B20' }}>Score: <strong>{zone.score}/100</strong></div>
                    <div style={{ fontSize: 10, color: '#1D1B20aa' }}>{zone.pop}</div>
                  </div>
                </Tooltip>
              </Circle>
              {/* Always-visible score badge at the zone centre */}
              <Marker position={center} icon={createLaborBadge(zone.score)} interactive={false} />
            </React.Fragment>
          );
        })}

        {/* ─── DATA LAYER: Transit hubs ─── */}
        {overlays.transit && TRANSIT_HUBS.map((hub, i) => (
          <CircleMarker
            key={`transit-${i}`}
            center={snapToSelected(hub.lat, hub.lng, selectedProperty)}
            radius={7}
            pathOptions={{
              color: '#21005D',
              fillColor: '#21005D',
              fillOpacity: 0.6,
              weight: 2,
              opacity: 0.8,
            }}
          >
            <Tooltip>
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#21005D' }}>
                  <span style={{ marginRight: 4 }}>🚂</span>{hub.name}
                </div>
                <div style={{ fontSize: 10, color: '#1D1B20aa' }}>Intermodal / Transit Hub</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* ─── DATA LAYER: Parcel sortation hubs (near each property, inland) ─── */}
        {overlays.parcel && visibleProperties.map((p, i) => {
          // Offset west/south of the property so the hub lands on land, not water.
          const pt: [number, number] = [p.map.lat - 0.06, p.map.lng - 0.14];
          return (
            <CircleMarker key={`parcel-${p.id}-${i}`} center={pt} radius={6}
              pathOptions={{ color: '#E8963A', fillColor: '#E8963A', fillOpacity: 0.6, weight: 2, opacity: 0.9 }}>
              <Tooltip>
                <div style={{ fontFamily: FONT }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#8C5000' }}>Carrier sortation hub</div>
                  <div style={{ fontSize: 10, color: '#1D1B20aa' }}>Serving {p.market}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* ─── DATA LAYER: Supplier network ─── */}
        {overlays.suppliers && SUPPLIER_SITES.map((pt, i) => (
          <CircleMarker key={`supp-${i}`} center={pt} radius={5.5}
            pathOptions={{ color: '#2E7D5B', fillColor: '#2E7D5B', fillOpacity: 0.5, weight: 2, opacity: 0.85 }}>
            <Tooltip><span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#2E7D5B' }}>🏭 Upstream supplier</span></Tooltip>
          </CircleMarker>
        ))}

        {/* ─── DATA LAYER: Store network ─── */}
        {overlays.stores && STORE_SITES.map((pt, i) => (
          <CircleMarker key={`store-${i}`} center={pt} radius={4}
            pathOptions={{ color: '#3E6DB5', fillColor: '#ffffff', fillOpacity: 1, weight: 2.5, opacity: 0.9 }}>
            <Tooltip><span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#3E6DB5' }}>🏬 Retail location</span></Tooltip>
          </CircleMarker>
        ))}

        {/* ─── DATA LAYER: Cold-chain network ─── */}
        {overlays.coldChain && COLD_SITES.map((pt, i) => (
          <CircleMarker key={`cold-${i}`} center={pt} radius={6}
            pathOptions={{ color: '#1B7A8C', fillColor: '#1B7A8C', fillOpacity: 0.5, weight: 2, opacity: 0.85 }}>
            <Tooltip><span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#1B7A8C' }}>❄️ Reefer / cold facility</span></Tooltip>
          </CircleMarker>
        ))}

        {/* ─── DATA LAYER: Customer demand heatmap ─── */}
        {overlays.demand && DEMAND_ZONES.map((z, i) => (
          <Circle key={`demand-${i}`} center={[z.lat, z.lng]} radius={z.weight * 900}
            pathOptions={{ color: '#C74B78', fillColor: '#C74B78', fillOpacity: 0.05 + (z.weight / 100) * 0.14, weight: 0, opacity: 0 }}>
            <Tooltip><div style={{ fontFamily: FONT }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#C74B78' }}>Consumer demand</div>
              <div style={{ fontSize: 10, color: '#1D1B20aa' }}>Index {z.weight}/100</div>
            </div></Tooltip>
          </Circle>
        ))}

        {/* ─── DATA LAYER: Asking-rent heatmap (per property) ─── */}
        {overlays.rent && visibleProperties.filter(p => p.rentPsf != null).map(p => {
          const psf = p.rentPsf as number;
          const t = Math.min(1, Math.max(0, (psf - 5) / 8)); // 5→13 $/SF
          return (
            <Circle key={`rent-${p.id}`} center={[p.map.lat, p.map.lng]} radius={28000}
              pathOptions={{ color: '#B3261E', fillColor: '#B3261E', fillOpacity: 0.08 + t * 0.28, weight: 0, opacity: 0 }}>
              <Tooltip><span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#B3261E' }}>${psf}/SF asking</span></Tooltip>
            </Circle>
          );
        })}

        {/* ─── DATA LAYER: Outage & flood risk ─── */}
        {overlays.risk && RISK_ZONES.map((z, i) => (
          <Circle key={`risk-${i}`} center={[z.lat, z.lng]} radius={55000}
            pathOptions={{ color: '#8C5000', fillColor: '#8C5000', fillOpacity: 0.1, weight: 1.5, opacity: 0.4, dashArray: '5 5' }}>
            <Tooltip><div style={{ fontFamily: FONT }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#8C5000' }}>⚠️ Hazard exposure</div>
              <div style={{ fontSize: 10, color: '#1D1B20aa' }}>{z.kind}</div>
            </div></Tooltip>
          </Circle>
        ))}

        {/* ─── Drive-time isochrone rings (toolbar toggle) ─── */}
        {driveTime && <DriveTimeRings property={selectedProperty} />}

        {/* ─── Draw-area rectangle tool (toolbar toggle) ─── */}
        <DrawAreaLayer active={drawArea} properties={visibleProperties} onCount={setDrawCount} />

        {/* ─── Delivery reach for the selected property (spec §7.1) ─── */}
        {overlays.reach && selectedProperty && (
          <>
            {/* Radar ripples — glow outward from the centre, staggered */}
            {[0, 1, 2].map(k => (
              <Circle
                key={`reach-pulse-${selectedProperty.id}-${k}`}
                center={[selectedProperty.map.lat, selectedProperty.map.lng]}
                radius={reachOption.radiusKm * 1000}
                interactive={false}
                pathOptions={{
                  className: `reach-pulse reach-pulse-${k}`,
                  color: 'transparent', fillColor: '#6750A4',
                  fillOpacity: 0.28, weight: 0, opacity: 0,
                }}
              />
            ))}
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={reachOption.radiusKm * 1000}
              pathOptions={{
                color: '#6750A4', fillColor: '#6750A4', fillOpacity: 0.06,
                weight: 2, dashArray: '8 4', opacity: 0.5,
              }}
            />
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={reachOption.radiusKm * 620}
              pathOptions={{
                color: '#6750A4', fillColor: '#6750A4', fillOpacity: 0.04,
                weight: 1, opacity: 0.3,
              }}
            />
          </>
        )}

        {/* ─── Property markers ─── */}
        {visibleProperties.map(p => {
          const isActive = p.id === selectedId;
          const icon = createPriceIcon(p, isActive);

          return (
            <Marker
              key={p.id}
              position={[p.map.lat, p.map.lng]}
              icon={icon}
              zIndexOffset={isActive ? 1000 : 0}
              eventHandlers={{
                click: () => onSelectProperty(p.id),
              }}
            >
              <Popup
                className="prologis-popup"
                maxWidth={300}
                minWidth={300}
                closeButton={false}
              >
                <div style={{ fontFamily: FONT, width: 300 }}>
                  {/* Photograph with the close and save affordances over it */}
                  <div style={{ position: 'relative', height: 170, background: '#E7E0EC' }}>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 9px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.95)',
                      fontSize: 10, fontWeight: 700, color: '#21005D',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: STATUS_COLORS[p.availabilityStatus] || '#21005D',
                      }} />
                      {getStatusLabel(p.availabilityStatus)}
                    </span>
                  </div>

                  {/* Summary line, then the figures that decide the shortlist */}
                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#21005D' }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#6750A4', whiteSpace: 'nowrap' }}>
                        {p.locationSignals.laborPoolScore}/100
                        <span style={{ color: '#1D1B20aa', fontWeight: 500 }}> labor</span>
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#1D1B20aa', marginTop: 2 }}>
                      {p.market}, {p.submarket}
                    </div>

                    <div style={{ fontSize: 11.5, color: '#1D1B20aa', marginTop: 6 }}>
                      {p.sizeSqft.toLocaleString()} SF · {p.clearHeightFt}&#39; clear · {p.dockDoors} docks
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#21005D' }}>
                        {p.rentPsf ? `$${p.rentPsf}/SF` : 'Pricing on request'}
                        {p.rentPsf && <span style={{ fontSize: 11, fontWeight: 500, color: '#1D1B20aa' }}> per year</span>}
                      </span>
                      <button
                        onClick={() => navigate(`/property/${p.id}`)}
                        style={{
                          padding: '6px 12px', borderRadius: 10,
                          background: '#6750A4', color: 'white',
                          fontSize: 11, fontWeight: 700, border: 'none',
                          cursor: 'pointer', fontFamily: FONT,
                        }}
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Analysis toolbar floats top-left, clearing any panels docked on the left. */}
      {showControls && (
        <AnalysisToolbar
          reach={reach}
          onReachChange={setReach}
          insetLeft={overlayInsetLeft}
          filtersOpen={filtersOpen}
          onToggleFilters={onToggleFilters}
          driveTime={driveTime}
          onDriveTimeToggle={() => setDriveTime(v => !v)}
          drawArea={drawArea}
          onDrawAreaToggle={() => setDrawArea(v => !v)}
          drawCount={drawCount}
        />
      )}

      {/* Inline styles for Leaflet popup override & marker animation */}
      <style>{`
        .prologis-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          border: 2px solid #6750A420 !important;
          box-shadow: 0 12px 40px rgba(27,77,74,0.15) !important;
          padding: 0 !important;
        }
        .prologis-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 300px !important;
        }
        .prologis-popup .leaflet-popup-content-wrapper {
          overflow: hidden !important;
        }
        .price-marker,
        .labor-badge,
        .route-pin {
          background: none !important;
          border: none !important;
        }
        .prologis-popup .leaflet-popup-tip {
          border-top-color: white !important;
          box-shadow: none !important;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
        @keyframes mapPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .leaflet-container {
          font-family: ${FONT};
        }
        /* Delivery-reach ripple: glow outward from the centre, then fade */
        .reach-pulse {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform, opacity;
        }
        @keyframes reachPulse {
          0%   { transform: scale(0.04); opacity: 0.5; }
          70%  { opacity: 0.12; }
          100% { transform: scale(1); opacity: 0; }
        }
        .reach-pulse-0 { animation: reachPulse 3s cubic-bezier(0.25,0.6,0.3,1) infinite; }
        .reach-pulse-1 { animation: reachPulse 3s cubic-bezier(0.25,0.6,0.3,1) infinite 1s; }
        .reach-pulse-2 { animation: reachPulse 3s cubic-bezier(0.25,0.6,0.3,1) infinite 2s; }
        @media (prefers-reduced-motion: reduce) {
          .reach-pulse { animation: none !important; opacity: 0 !important; }
        }
        /* Dots flowing along each route toward the destination */
        @keyframes routeFlow {
          to { stroke-dashoffset: -160; }
        }
        .route-flow {
          animation: routeFlow 2.4s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .route-flow { animation: none; }
        }
        .leaflet-tooltip {
          font-family: ${FONT} !important;
          border-radius: 10px !important;
          border: 1px solid #E7E0EC !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          padding: 6px 10px !important;
        }
      `}</style>

      {/* Data Layers — collapsible, bottom-right */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-[500] flex justify-end">
          <LayerPanel persona={persona} active={active} onToggle={toggleLayer} />
        </div>
      )}

      {/* Why this location fits — collapsible, bottom-left */}
      {showControls && selectedProperty && (
        <div className="absolute bottom-4 z-[500]" style={{ left: overlayInsetLeft + 16 }}>
          <MatchPanel
            persona={persona}
            property={selectedProperty}
            reachLabel={reachOption.label}
            onCompare={() => toggleCompare(selectedProperty.id)}
            onSave={() => toggleSaved(selectedProperty.id)}
            saved={isSaved(selectedProperty.id)}
            inCompare={isInCompare(selectedProperty.id)}
          />
        </div>
      )}
    </div>
  );
}
