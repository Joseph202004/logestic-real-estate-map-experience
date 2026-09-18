import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router';
import {
  Layers, Users, Navigation, Train, Clock, MapPin, Zap, Sparkles,
  ArrowUpRight, ChevronRight
} from 'lucide-react';
import type { Property } from '../data/properties';
import { getStatusLabel, getEssentialsList } from '../data/properties';

const FONT = 'Montserrat, sans-serif';

/* ─── Custom SVG Marker Icons ─── */
function createMarkerIcon(color: string, isActive: boolean = false): L.DivIcon {
  const size = isActive ? 28 : 16;
  const border = isActive ? 4 : 3;
  const glow = isActive ? `<div style="position:absolute;top:-10px;left:-10px;width:${size + 20}px;height:${size + 20}px;border-radius:50%;background:${color}22;animation:mapPulse 2s ease-in-out infinite;"></div>` : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;">
        ${glow}
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};
          border:${border}px solid white;
          box-shadow:0 2px 8px ${color}66${isActive ? ',0 0 20px ' + color + '44' : ''};
          transition:all 0.2s;
          cursor:pointer;
          position:relative;
          z-index:2;
        "></div>
      </div>
    `,
    iconSize: [isActive ? 48 : 24, isActive ? 48 : 24],
    iconAnchor: [isActive ? 24 : 12, isActive ? 24 : 12],
    popupAnchor: [0, isActive ? -24 : -12],
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

/* ─── Map bounds / auto-fit component ─── */
function MapFitter({ properties: visibleProperties, selectedId }: { properties: Property[]; selectedId: string | null }) {
  const map = useMap();
  const prevPropsRef = useRef<string>('');

  useEffect(() => {
    const key = visibleProperties.map(p => p.id).sort().join(',');
    if (key === prevPropsRef.current || visibleProperties.length === 0) return;
    prevPropsRef.current = key;

    const bounds = L.latLngBounds(visibleProperties.map(p => [p.map.lat, p.map.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8, animate: true, duration: 0.5 });
  }, [visibleProperties, map]);

  return null;
}

/* ─── Fly-to selected property ─── */
function FlyToSelected({ property }: { property: Property | undefined }) {
  const map = useMap();
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!property || property.id === prevIdRef.current) return;
    if (!property.map || isNaN(property.map.lat) || isNaN(property.map.lng)) return;
    prevIdRef.current = property.id;
    const currentZoom = map.getZoom();
    const zoom = isNaN(currentZoom) ? 7 : Math.max(currentZoom, 7);
    map.flyTo([property.map.lat, property.map.lng], zoom, { animate: true, duration: 0.6 });
  }, [property, map]);

  return null;
}


/* ═══════════════════════════════════════════════════════════════
   MAIN INTERACTIVE MAP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function InteractiveMap({
  properties: visibleProperties,
  selectedId,
  onSelectProperty,
}: {
  properties: Property[];
  selectedId: string | null;
  onSelectProperty: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [overlays, setOverlays] = useState({
    labor: false,
    highway: true,
    transit: false,
  });

  const toggle = useCallback((key: keyof typeof overlays) =>
    setOverlays(prev => ({ ...prev, [key]: !prev[key] })), []);

  const selectedProperty = visibleProperties.find(p => p.id === selectedId);

  // Compute center for initial view
  const center = useMemo<[number, number]>(() => {
    if (visibleProperties.length === 0) return [39.5, -98.5]; // US center
    const avgLat = visibleProperties.reduce((s, p) => s + p.map.lat, 0) / visibleProperties.length;
    const avgLng = visibleProperties.reduce((s, p) => s + p.map.lng, 0) / visibleProperties.length;
    return [avgLat, avgLng];
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E6F1FB] shadow-inner" style={{ fontFamily: FONT }}>
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
            center={[zone.lat, zone.lng]}
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
            center={[hub.lat, hub.lng]}
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

        {/* ─── 1-Hour Delivery Radius for selected property ─── */}
        {selectedProperty && (
          <>
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={80000}
              pathOptions={{
                color: '#00C2B2',
                fillColor: '#00C2B2',
                fillOpacity: 0.06,
                weight: 2,
                dashArray: '8 4',
                opacity: 0.5,
              }}
            />
            <Circle
              center={[selectedProperty.map.lat, selectedProperty.map.lng]}
              radius={50000}
              pathOptions={{
                color: '#00C2B2',
                fillColor: '#00C2B2',
                fillOpacity: 0.04,
                weight: 1,
                opacity: 0.3,
              }}
            />
          </>
        )}

        {/* ─── Property markers ─── */}
        {visibleProperties.map(p => {
          const isActive = p.id === selectedId;
          const color = isActive ? ACTIVE_COLOR : STATUS_COLORS[p.availabilityStatus] || '#0C447C';
          const icon = createMarkerIcon(color, isActive);

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
                maxWidth={280}
                closeButton={false}
              >
                <div style={{ fontFamily: FONT, minWidth: 240 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0C447C', lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#303234aa', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        📍 {p.market}, {p.submarket}
                      </div>
                    </div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: 9,
                      fontWeight: 700,
                      color: 'white',
                      background: p.availabilityStatus === 'available' ? '#00CC66' :
                                  p.availabilityStatus === 'under_negotiation' ? '#B26A00' : '#0C447C',
                      whiteSpace: 'nowrap',
                    }}>
                      {getStatusLabel(p.availabilityStatus)}
                    </span>
                  </div>

                  {/* Key specs */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0C447C' }}>
                      {p.sizeSqft.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 600, color: '#303234aa' }}>SF</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0C447C' }}>
                      {p.clearHeightFt}' <span style={{ fontSize: 10, fontWeight: 600, color: '#303234aa' }}>Clear</span>
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0C447C' }}>
                      {p.dockDoors} <span style={{ fontSize: 10, fontWeight: 600, color: '#303234aa' }}>Docks</span>
                    </span>
                    {p.powerCapacityAmps && (
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#0C447C' }}>
                        ⚡ {p.powerCapacityAmps.toLocaleString()} <span style={{ fontSize: 10, fontWeight: 600, color: '#303234aa' }}>A</span>
                      </span>
                    )}
                  </div>

                  {/* Essentials badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {getEssentialsList(p.essentials).slice(0, 4).map(e => (
                      <span key={e} style={{
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: 9,
                        fontWeight: 700,
                        background: '#E6F1FB',
                        color: '#0C447C',
                      }}>{e}</span>
                    ))}
                    {p.sustainability.certification && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 10,
                        fontSize: 9,
                        fontWeight: 700,
                        background: '#00CC6618',
                        color: '#00CC66',
                      }}>✨ {p.sustainability.certification}</span>
                    )}
                  </div>

                  {/* Delivery reach */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 10,
                    background: '#00C2B20a',
                    border: '1px solid #00C2B220',
                    marginBottom: 10,
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1B4D4A' }}>
                      🕐 Same-Day Reach: <strong>{p.locationSignals.sameDayReach}</strong>
                    </span>
                  </div>

                  {/* Rent + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {p.rentPsf && (
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#00CC66' }}>
                        ${p.rentPsf}/SF<span style={{ fontSize: 10, fontWeight: 500, color: '#303234aa' }}>/yr</span>
                      </span>
                    )}
                    <button
                      onClick={() => navigate(`/property/${p.id}`)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 10,
                        background: '#1B4D4A',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: FONT,
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ─── 1-Hour Delivery Reach label (floating on map when selected) ─── */}
      {selectedProperty && (
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-[#00C2B2]/20 px-4 py-2.5 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#00C2B2]/10 flex items-center justify-center">
            <Clock size={14} className="text-[#00C2B2]" />
          </div>
          <div>
            <p className="text-[#1B4D4A]" style={{ fontSize: 11, fontWeight: 700 }}>1-Hour Delivery Radius</p>
            <p className="text-[#303234]/50" style={{ fontSize: 10 }}>
              Reach: <strong className="text-[#0C447C]">{selectedProperty.locationSignals.sameDayReach}</strong>
            </p>
          </div>
        </div>
      )}

      {/* ─── Map Overlay Controls (bottom-right floating panel) ─── */}
      <div className="absolute bottom-5 right-5 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-[#E6F1FB] overflow-hidden w-52">
        <div className="px-4 py-2.5 border-b border-[#E6F1FB] flex items-center gap-1.5">
          <Layers size={13} className="text-[#1B4D4A]" />
          <span className="text-[#0C447C]" style={{ fontSize: 11, fontWeight: 700 }}>Data Layers</span>
        </div>
        {([
          { key: 'labor' as const, icon: Users, label: 'Labor Pool Density', desc: 'Metro workforce size & scores' },
          { key: 'highway' as const, icon: Navigation, label: 'Highway Proximity', desc: 'Major interstate routes' },
          { key: 'transit' as const, icon: Train, label: 'Transit Hubs', desc: 'Intermodal & port terminals' },
        ]).map(item => (
          <button
            key={item.key}
            onClick={() => toggle(item.key)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors text-left ${
              overlays[item.key] ? 'bg-[#E6F1FB] text-[#0C447C]' : 'text-[#303234]/50 hover:bg-[#F4F3F3]'
            }`}
            style={{ fontSize: 11, fontWeight: overlays[item.key] ? 700 : 500 }}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
              overlays[item.key] ? 'bg-[#00C2B2] border-[#00C2B2]' : 'border-[#D5DDD5]'
            }`}>
              {overlays[item.key] && <span className="text-white" style={{ fontSize: 9 }}>✓</span>}
            </div>
            <item.icon size={13} className="shrink-0" />
            <div>
              <div>{item.label}</div>
              {overlays[item.key] && <div className="text-[#303234]/40" style={{ fontSize: 9, fontWeight: 400 }}>{item.desc}</div>}
            </div>
          </button>
        ))}
      </div>

      {/* ─── Legend (bottom-left) ─── */}
      <div className="absolute bottom-5 left-5 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-[#E6F1FB] p-3 flex flex-wrap items-center gap-3">
        {[
          { color: '#00CC66', label: 'Available' },
          { color: '#B26A00', label: 'Negotiating' },
          { color: '#0C447C', label: 'Coming Soon' },
          { color: '#00C2B2', label: 'Selected', ring: true },
        ].map(item => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{
                background: item.color,
                ...(item.ring ? { boxShadow: `0 0 0 2px ${item.color}33, 0 1px 3px rgba(0,0,0,0.1)` } : {}),
              }}
            />
            <span className="text-[#303234]/60" style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</span>
          </span>
        ))}
      </div>

      {/* Inline styles for Leaflet popup override & marker animation */}
      <style>{`
        .prologis-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          border: 2px solid #00C2B220 !important;
          box-shadow: 0 12px 40px rgba(27,77,74,0.15) !important;
          padding: 0 !important;
        }
        .prologis-popup .leaflet-popup-content {
          margin: 16px !important;
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
  );
}
