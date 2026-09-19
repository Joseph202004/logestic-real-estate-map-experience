import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap, Polyline, Tooltip } from 'react-leaflet';
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

const FONT = 'Montserrat, sans-serif';

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
        background:${isActive ? '#0C2B45' : '#ffffff'};
        color:${isActive ? '#ffffff' : '#0C447C'};
        border:1px solid ${isActive ? '#0C2B45' : 'rgba(12,68,124,0.12)'};
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
  available: '#00CC66',
  under_negotiation: '#B26A00',
  coming_soon: '#0C447C',
};

const ACTIVE_COLOR = '#00C2B2';

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

/* ─── Major interstate routes (simplified polylines across US) ─── */
const HIGHWAY_ROUTES = [
  // I-10 (LA → Houston)
  { name: 'I-10', points: [[34.0, -118.2], [33.45, -112.0], [32.2, -110.9], [31.8, -106.4], [29.75, -95.4]] as [number, number][] },
  // I-95 (NJ → Savannah)
  { name: 'I-95', points: [[40.8, -74.1], [40.6, -75.4], [39.3, -76.6], [37.5, -77.4], [35.8, -78.6], [33.8, -84.4], [32.1, -81.1]] as [number, number][] },
  // I-40 (Memphis → IE)
  { name: 'I-40', points: [[35.1, -90.0], [35.5, -97.5], [35.1, -106.6], [34.0, -117.4]] as [number, number][] },
  // I-55 (Chicago → Memphis)
  { name: 'I-55', points: [[41.8, -87.8], [39.8, -89.6], [37.2, -89.5], [35.1, -90.0]] as [number, number][] },
  // I-5 (Seattle → IE)
  { name: 'I-5', points: [[47.4, -122.3], [45.5, -122.7], [40.6, -122.4], [37.8, -122.4], [34.0, -118.2]] as [number, number][] },
  // I-20 (Atlanta → Dallas)
  { name: 'I-20', points: [[33.75, -84.4], [33.45, -86.8], [32.3, -90.2], [32.5, -93.7], [32.65, -96.85]] as [number, number][] },
  // I-70 (Denver → midwest)
  { name: 'I-70', points: [[39.77, -104.87], [39.1, -99.3], [39.0, -94.6], [38.9, -90.2], [39.8, -86.2]] as [number, number][] },
];

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
    if (check()) return;

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


/* ═══════════════════════════════════════════════════════════════
   MAIN INTERACTIVE MAP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function InteractiveMap({
  properties: visibleProperties,
  selectedId,
  onSelectProperty,
  showControls = true,
  persona = defaultPersona,
}: {
  properties: Property[];
  selectedId: string | null;
  onSelectProperty: (id: string) => void;
  /** false renders the bare map — no toolbar, layer panel, legend or match panel. */
  showControls?: boolean;
  /** Drives which layers are recommended and how the match is explained. */
  persona?: Persona;
}) {
  const navigate = useNavigate();
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const [reach, setReach] = useState<ReachId>('1h');

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
    highway: active.has('highway'),
    transit: active.has('transit'),
    reach: active.has('reach'),
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
    // Grid: map card top-left, Data Layers right column, match bar along the bottom.
    <div
      className="w-full h-full grid gap-3"
      style={{
        fontFamily: FONT,
        gridTemplateColumns: showControls ? 'minmax(0,1fr) 236px' : '1fr',
        gridTemplateRows: showControls && selectedProperty ? 'minmax(0,1fr) auto' : 'minmax(0,1fr)',
      }}
    >
      {/* Map card. `isolate z-0` keeps Leaflet's panes in their own stacking context. */}
      <div className="relative isolate z-0 min-h-0 min-w-0 rounded-2xl overflow-hidden border border-[#E6F1FB] shadow-inner">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#E8EDE8' }}
      >
        {/* Tile layer — Carto Voyager (clean, modern, muted) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Fit bounds */}
        <MapFitter properties={visibleProperties} selectedId={selectedId} />
        <FlyToSelected property={selectedProperty} />

        {/* ─── DATA LAYER: Highway routes ─── */}
        {overlays.highway && HIGHWAY_ROUTES.map((route, i) => (
          <Polyline
            key={`hw-${i}`}
            positions={route.points}
            pathOptions={{
              color: '#1B4D4A',
              weight: 2.5,
              opacity: 0.3,
              dashArray: '10 6',
            }}
          >
            <Tooltip sticky>
              <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: '#1B4D4A' }}>{route.name}</span>
            </Tooltip>
          </Polyline>
        ))}

        {/* ─── DATA LAYER: Labor pool density ─── */}
        {overlays.labor && LABOR_ZONES.map((zone, i) => (
          <Circle
            key={`labor-${i}`}
            center={snapToSelected(zone.lat, zone.lng, selectedProperty)}
            radius={zone.score * 800}
            pathOptions={{
              color: '#00C2B2',
              fillColor: '#00C2B2',
              fillOpacity: 0.08 + (zone.score / 100) * 0.08,
              weight: 1,
              opacity: 0.25,
            }}
          >
            <Tooltip>
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0C447C' }}>Labor Pool Zone</div>
                <div style={{ fontSize: 10, color: '#303234' }}>Score: <strong>{zone.score}/100</strong></div>
                <div style={{ fontSize: 10, color: '#303234aa' }}>{zone.pop}</div>
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* ─── DATA LAYER: Transit hubs ─── */}
        {overlays.transit && TRANSIT_HUBS.map((hub, i) => (
          <CircleMarker
            key={`transit-${i}`}
            center={snapToSelected(hub.lat, hub.lng, selectedProperty)}
            radius={7}
            pathOptions={{
              color: '#0C447C',
              fillColor: '#0C447C',
              fillOpacity: 0.6,
              weight: 2,
              opacity: 0.8,
            }}
          >
            <Tooltip>
              <div style={{ fontFamily: FONT }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0C447C' }}>
                  <span style={{ marginRight: 4 }}>🚂</span>{hub.name}
                </div>
                <div style={{ fontSize: 10, color: '#303234aa' }}>Intermodal / Transit Hub</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* ─── Delivery reach for the selected property (spec §7.1) ─── */}
        {overlays.reach && selectedProperty && (
          <>
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={reachOption.radiusKm * 1000}
              pathOptions={{
                color: '#00C2B2', fillColor: '#00C2B2', fillOpacity: 0.06,
                weight: 2, dashArray: '8 4', opacity: 0.5,
              }}
            />
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={reachOption.radiusKm * 620}
              pathOptions={{
                color: '#00C2B2', fillColor: '#00C2B2', fillOpacity: 0.04,
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
                  <div style={{ position: 'relative', height: 170, background: '#E6F1FB' }}>
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
                      fontSize: 10, fontWeight: 700, color: '#0C447C',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 999,
                        background: STATUS_COLORS[p.availabilityStatus] || '#0C447C',
                      }} />
                      {getStatusLabel(p.availabilityStatus)}
                    </span>
                  </div>

                  {/* Summary line, then the figures that decide the shortlist */}
                  <div style={{ padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0C447C' }}>{p.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1B4D4A', whiteSpace: 'nowrap' }}>
                        {p.locationSignals.laborPoolScore}/100
                        <span style={{ color: '#303234aa', fontWeight: 500 }}> labor</span>
                      </span>
                    </div>

                    <div style={{ fontSize: 11.5, color: '#303234aa', marginTop: 2 }}>
                      {p.market}, {p.submarket}
                    </div>

                    <div style={{ fontSize: 11.5, color: '#303234aa', marginTop: 6 }}>
                      {p.sizeSqft.toLocaleString()} SF · {p.clearHeightFt}&#39; clear · {p.dockDoors} docks
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0C447C' }}>
                        {p.rentPsf ? `$${p.rentPsf}/SF` : 'Pricing on request'}
                        {p.rentPsf && <span style={{ fontSize: 11, fontWeight: 500, color: '#303234aa' }}> per year</span>}
                      </span>
                      <button
                        onClick={() => navigate(`/property/${p.id}`)}
                        style={{
                          padding: '6px 12px', borderRadius: 10,
                          background: '#1B4D4A', color: 'white',
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

      {/* Only the analysis toolbar floats on the map; the panels sit in the grid. */}
      {showControls && <AnalysisToolbar reach={reach} onReachChange={setReach} />}

      {/* Inline styles for Leaflet popup override & marker animation */}
      <style>{`
        .prologis-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          border: 2px solid #00C2B220 !important;
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
        .price-marker {
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
        .leaflet-tooltip {
          font-family: ${FONT} !important;
          border-radius: 10px !important;
          border: 1px solid #E6F1FB !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          padding: 6px 10px !important;
        }
      `}</style>
      </div>

      {/* Data Layers — right column card */}
      {showControls && (
        <div className="min-h-0" style={{ gridColumn: 2, gridRow: 1 }}>
          <LayerPanel persona={persona} active={active} onToggle={toggleLayer} />
        </div>
      )}

      {/* Why this location fits — full-width bar below the map */}
      {showControls && selectedProperty && (
        <div className="min-w-0" style={{ gridColumn: '1 / -1', gridRow: 2 }}>
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
