import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Building2, Zap, Train, Snowflake, Sun, Leaf, Truck, MapPin,
  Clock, Bookmark, GitCompareArrows, ArrowUpRight, Shield, Users, Wifi,
  ChevronRight, Package, Plug, Sparkles, Phone, Mail, Calendar
} from 'lucide-react';
import { properties, formatSqft, getStatusLabel, getEssentialsList } from '../data/properties';
import type { Property } from '../data/properties';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

function SpecCard({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: any; highlight?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-[#6750A4]/5 border-[#6750A4]/20' : 'bg-white border-[#E7E0EC]'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${highlight ? 'bg-[#6750A4]/10' : 'bg-[#E7E0EC]'}`}>
          <Icon size={14} className={highlight ? 'text-[#6750A4]' : 'text-[#6750A4]'} />
        </div>
        <span className="text-[#1D1B20]/50" style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
      </div>
      <span className="text-[#21005D]" style={{ fontSize: 18, fontWeight: 800 }}>{value}</span>
    </div>
  );
}

export function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleCompare, toggleSaved, isInCompare, isSaved } = useApp();
  const [showInterestModal, setShowInterestModal] = useState(false);
  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF]" style={{ fontFamily: FONT }}>
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm">
          <p className="text-[#21005D] mb-4" style={{ fontSize: 20, fontWeight: 700 }}>Property Not Found</p>
          <Link to="/search" className="px-5 py-2.5 bg-[#6750A4] text-white rounded-xl inline-block" style={{ fontSize: 13, fontWeight: 600 }}>Back to Search</Link>
        </div>
      </div>
    );
  }

  const similar = properties.filter(p => p.id !== property.id && p.market === property.market).slice(0, 3);
  if (similar.length < 3) {
    similar.push(...properties.filter(p => p.id !== property.id && !similar.find(s => s.id === p.id)).slice(0, 3 - similar.length));
  }

  const essentialItems: { key: keyof Property['essentials']; label: string; icon: any }[] = [
    { key: 'racking', label: 'Racking Systems', icon: Package },
    { key: 'automation', label: 'Automation Ready', icon: Zap },
    { key: 'energy', label: 'Energy Solutions', icon: Sun },
    { key: 'evCharging', label: 'EV Charging', icon: Plug },
    { key: 'moveInMoveOut', label: 'Move-in Services', icon: Truck },
    { key: 'software', label: 'Software', icon: Wifi },
    { key: 'workforce', label: 'Workforce', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FEF7FF]" style={{ fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E7E0EC]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-[#1D1B20]/40" style={{ fontSize: 12, fontWeight: 500 }}>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#6750A4] hover:text-[#4F378B] transition-colors" style={{ fontWeight: 600 }}>
            <ArrowLeft size={15} /> Back
          </button>
          <span>/</span>
          <Link to="/search" className="hover:text-[#21005D] transition-colors">Search</Link>
          <span>/</span>
          <span className="text-[#21005D]" style={{ fontWeight: 600 }}>{property.name}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-72 md:h-[380px] overflow-hidden">
        <ImageWithFallback src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,77,74,0.85) 0%, rgba(27,77,74,0.3) 40%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 ${
                property.availabilityStatus === 'available' ? 'bg-[#2E7D32] text-white' :
                property.availabilityStatus === 'under_negotiation' ? 'bg-[#8C5000] text-white' :
                'bg-[#21005D] text-white'
              }`}
              style={{ fontSize: 11, fontWeight: 700 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              {getStatusLabel(property.availabilityStatus)}
            </span>
            <h1 className="text-white mb-1" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {property.name}
            </h1>
            <p className="text-white/60 flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 500 }}>
              <MapPin size={14} /> {property.market}, {property.submarket}, {property.country}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Action bar */}
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setShowInterestModal(true)}
                className="px-6 py-2.5 bg-[#6750A4] text-white rounded-2xl hover:bg-[#4F378B] transition-colors shadow-lg shadow-[#6750A4]/15"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Signal Interest
              </button>
              <button
                onClick={() => toggleCompare(property.id)}
                className={`px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                  isInCompare(property.id)
                    ? 'bg-[#6750A4]/10 border-[#6750A4] text-[#6750A4]'
                    : 'border-[#E7E0EC] text-[#1D1B20]/50 hover:border-[#6750A4]/40 hover:text-[#6750A4]'
                }`}
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                <GitCompareArrows size={15} />
                {isInCompare(property.id) ? 'In Compare' : 'Add to Compare'}
              </button>
              <button
                onClick={() => toggleSaved(property.id)}
                className={`px-4 py-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                  isSaved(property.id)
                    ? 'bg-[#6750A4] border-[#6750A4] text-white'
                    : 'border-[#E7E0EC] text-[#1D1B20]/50 hover:border-[#6750A4]/30 hover:text-[#6750A4]'
                }`}
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                <Bookmark size={15} />
                {isSaved(property.id) ? 'Saved' : 'Save Property'}
              </button>
            </div>

            {/* Key Specs Grid */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h2 className="text-[#21005D] mb-4" style={{ fontSize: 17, fontWeight: 800 }}>Key Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <SpecCard label="Building Size" value={formatSqft(property.sizeSqft)} icon={Building2} />
                <SpecCard label="Clear Height" value={`${property.clearHeightFt} ft`} icon={ArrowUpRight} highlight />
                <SpecCard label="Dock Doors" value={`${property.dockDoors}`} icon={Truck} highlight />
                {property.driveInDoors && <SpecCard label="Drive-in Doors" value={`${property.driveInDoors}`} icon={ArrowUpRight} />}
                {property.columnSpacing && <SpecCard label="Column Spacing" value={property.columnSpacing} icon={Building2} />}
                {property.powerCapacityAmps && <SpecCard label="Power Capacity" value={`${property.powerCapacityAmps.toLocaleString()}A`} icon={Zap} highlight />}
                <SpecCard label="Rail Access" value={property.railAccess ? 'Yes' : 'No'} icon={Train} />
                <SpecCard label="Cold Storage" value={property.coldStorageReady ? 'Ready' : 'No'} icon={Snowflake} />
                {property.landSizeAcres && <SpecCard label="Land Size" value={`${property.landSizeAcres} acres`} icon={MapPin} />}
              </div>
            </div>

            {/* Best For Tags */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h2 className="text-[#21005D] mb-3" style={{ fontSize: 17, fontWeight: 800 }}>Operational Fit</h2>
              <p className="text-[#1D1B20]/40 mb-3" style={{ fontSize: 12 }}>This property is best suited for:</p>
              <div className="flex flex-wrap gap-2">
                {property.bestFor.map(b => (
                  <span key={b} className="px-4 py-2 bg-[#E7E0EC] text-[#21005D] rounded-xl" style={{ fontSize: 13, fontWeight: 700 }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Availability & Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h2 className="text-[#21005D] mb-4" style={{ fontSize: 17, fontWeight: 800 }}>Availability & Terms</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-4 bg-[#FEF7FF] rounded-2xl">
                  <span className="text-[#1D1B20]/40 block mb-1" style={{ fontSize: 10, fontWeight: 600 }}>Available From</span>
                  <span className="text-[#21005D]" style={{ fontSize: 15, fontWeight: 800 }}>{new Date(property.availableFrom).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="p-4 bg-[#FEF7FF] rounded-2xl">
                  <span className="text-[#1D1B20]/40 block mb-1" style={{ fontSize: 10, fontWeight: 600 }}>Lease Terms</span>
                  <span className="text-[#21005D]" style={{ fontSize: 13, fontWeight: 700 }}>{property.leaseTermOptions.join(', ')}</span>
                </div>
                {property.rentPsf && (
                  <div className="p-4 bg-[#2E7D32]/5 rounded-2xl border border-[#2E7D32]/10">
                    <span className="text-[#1D1B20]/40 block mb-1" style={{ fontSize: 10, fontWeight: 600 }}>Indicative Rent</span>
                    <span className="text-[#2E7D32]" style={{ fontSize: 18, fontWeight: 800 }}>${property.rentPsf}/SF<span className="text-[#1D1B20]/30" style={{ fontSize: 11, fontWeight: 500 }}>/yr</span></span>
                  </div>
                )}
                {property.btsAvailable && (
                  <div className="p-4 bg-[#6750A4]/5 rounded-2xl border border-[#6750A4]/10">
                    <span className="text-[#1D1B20]/40 block mb-1" style={{ fontSize: 10, fontWeight: 600 }}>Build-to-Suit</span>
                    <span className="text-[#6750A4]" style={{ fontSize: 15, fontWeight: 800 }}>Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prologis Essentials */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-[#21005D]" style={{ fontSize: 17, fontWeight: 800 }}>Prologis Essentials</h2>
                <span className="px-2.5 py-0.5 bg-[#6750A4]/10 text-[#6750A4] rounded-full" style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}>PLATFORM ADVANTAGE</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {essentialItems.map(e => {
                  const active = property.essentials[e.key];
                  return (
                    <div key={e.key} className={`p-3.5 rounded-2xl border-2 transition-all ${active ? 'bg-[#E7E0EC]/50 border-[#6750A4]/15' : 'bg-[#FEF7FF] border-transparent opacity-40'}`}>
                      <div className={`w-8 h-8 rounded-xl mb-2 flex items-center justify-center ${active ? 'bg-[#6750A4]/10' : 'bg-white'}`}>
                        <e.icon size={16} className={active ? 'text-[#6750A4]' : 'text-[#1D1B20]/30'} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: active ? '#21005D' : '#1D1B20' }}>{e.label}</p>
                      <p style={{ fontSize: 10, fontWeight: 600, color: active ? '#2E7D32' : '#1D1B20', opacity: active ? 1 : 0.3 }}>
                        {active ? 'Available' : 'Not included'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sustainability Scorecard */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h2 className="text-[#21005D] mb-5" style={{ fontSize: 17, fontWeight: 800 }}>Sustainability Scorecard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Carbon Score', score: property.sustainability.carbonScore, color: '#2E7D32' },
                  { label: 'Energy Score', score: property.sustainability.energyScore, color: '#6750A4' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E7E0EC" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9155" fill="none" stroke={item.color} strokeWidth="3"
                          strokeDasharray={`${item.score} ${100 - item.score}`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[#21005D]" style={{ fontSize: 16, fontWeight: 800 }}>{item.score}</span>
                    </div>
                    <p className="text-[#1D1B20]/50" style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</p>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center">
                  <Sun size={28} className={property.sustainability.solarReady ? 'text-[#2E7D32] mb-2' : 'text-[#E7E0EC] mb-2'} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: property.sustainability.solarReady ? '#2E7D32' : '#1D1B20' }}>
                    {property.sustainability.solarReady ? 'Solar Ready' : 'No Solar'}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {property.sustainability.certification ? (
                    <>
                      <Shield size={28} className="text-[#2E7D32] mb-2" />
                      <p className="text-[#2E7D32]" style={{ fontSize: 12, fontWeight: 700 }}>{property.sustainability.certification}</p>
                    </>
                  ) : (
                    <>
                      <Shield size={28} className="text-[#E7E0EC] mb-2" />
                      <p className="text-[#1D1B20]/30" style={{ fontSize: 12, fontWeight: 600 }}>No Certification</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Location Intelligence */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h2 className="text-[#21005D] mb-4" style={{ fontSize: 17, fontWeight: 800 }}>Location Intelligence</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Highway Access', value: property.locationSignals.highwayAccess },
                  property.locationSignals.airportDistanceMiles ? { label: 'Airport', value: `${property.locationSignals.airportDistanceMiles} mi` } : null,
                  property.locationSignals.seaportDistanceMiles ? { label: 'Seaport', value: `${property.locationSignals.seaportDistanceMiles} mi` } : null,
                  property.locationSignals.intermodalDistanceMiles ? { label: 'Intermodal Hub', value: `${property.locationSignals.intermodalDistanceMiles} mi` } : null,
                  { label: 'Labor Pool Score', value: `${property.locationSignals.laborPoolScore}/100` },
                  { label: 'Same-Day Reach', value: property.locationSignals.sameDayReach },
                ].filter(Boolean).map((item) => (
                  <div key={item!.label} className="p-3.5 bg-[#FEF7FF] rounded-2xl">
                    <span className="text-[#1D1B20]/40 block mb-0.5" style={{ fontSize: 10, fontWeight: 600 }}>{item!.label}</span>
                    <span className="text-[#21005D]" style={{ fontSize: 14, fontWeight: 700 }}>{item!.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div>
                <h2 className="text-[#21005D] mb-4" style={{ fontSize: 17, fontWeight: 800 }}>Compare Similar Properties</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {similar.map(p => (
                    <Link key={p.id} to={`/property/${p.id}`} className="bg-white rounded-2xl overflow-hidden border border-[#E7E0EC] hover:shadow-lg hover:border-[#6750A4]/20 transition-all group">
                      <div className="h-32 overflow-hidden">
                        <ImageWithFallback src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <p className="text-[#21005D] truncate" style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</p>
                        <p className="text-[#1D1B20]/40 mt-0.5" style={{ fontSize: 11 }}>{p.market}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[#21005D]" style={{ fontSize: 12, fontWeight: 800 }}>{formatSqft(p.sizeSqft)}</span>
                          <span className="text-[#21005D]" style={{ fontSize: 11, fontWeight: 700 }}>{p.clearHeightFt}'</span>
                          <span className="text-[#21005D]" style={{ fontSize: 11, fontWeight: 700 }}>{p.dockDoors} Docks</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2.5 text-[#6750A4] group-hover:text-[#6750A4] transition-colors" style={{ fontSize: 11, fontWeight: 700 }}>
                          View Details <ChevronRight size={13} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <div className="space-y-5">
            {/* Leasing Rep Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm sticky top-[76px]">
              <h3 className="text-[#21005D] mb-4" style={{ fontSize: 15, fontWeight: 800 }}>Your Leasing Contact</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6750A4] to-[#4F378B] flex items-center justify-center text-white" style={{ fontSize: 18, fontWeight: 800 }}>
                  SM
                </div>
                <div>
                  <p className="text-[#21005D]" style={{ fontSize: 14, fontWeight: 700 }}>Sarah Mitchell</p>
                  <p className="text-[#1D1B20]/40" style={{ fontSize: 11, fontWeight: 500 }}>{property.market} Market Expert</p>
                </div>
              </div>

              {/* SLA Pill */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[#2E7D32]/8 rounded-xl mb-4 border border-[#2E7D32]/10">
                <Clock size={14} className="text-[#2E7D32]" />
                <span className="text-[#6750A4]" style={{ fontSize: 12, fontWeight: 700 }}>Typical response: &lt; 2 hours</span>
              </div>

              <div className="space-y-2 mb-4">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#FEF7FF] text-[#1D1B20]/60 hover:bg-[#E7E0EC] transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                  <Phone size={13} /> (312) 555-0142
                </button>
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#FEF7FF] text-[#1D1B20]/60 hover:bg-[#E7E0EC] transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                  <Mail size={13} /> s.mitchell@prologis.com
                </button>
              </div>

              <button
                onClick={() => setShowInterestModal(true)}
                className="w-full py-3 bg-[#6750A4] text-white rounded-2xl hover:bg-[#4F378B] transition-colors shadow-lg shadow-[#6750A4]/15 mb-2"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Signal Interest
              </button>
              <button className="w-full py-2.5 border-2 border-[#E7E0EC] text-[#1D1B20]/50 rounded-2xl hover:border-[#6750A4]/20 hover:text-[#6750A4] transition-all flex items-center justify-center gap-2" style={{ fontSize: 12, fontWeight: 600 }}>
                <Calendar size={14} /> Schedule a Tour
              </button>
            </div>

            {/* Move-in Cost Estimator */}
            <div className="bg-white rounded-2xl p-6 border border-[#E7E0EC] shadow-sm">
              <h3 className="text-[#21005D] mb-1" style={{ fontSize: 15, fontWeight: 800 }}>Move-in Cost Estimator</h3>
              <p className="text-[#1D1B20]/40 mb-5" style={{ fontSize: 11 }}>Estimated savings with Essentials bundle</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[#1D1B20]/50" style={{ fontSize: 11, fontWeight: 600 }}>Standard Setup</span>
                    <span className="text-[#1D1B20]" style={{ fontSize: 13, fontWeight: 800 }}>$2.8M</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FEF7FF] rounded-full overflow-hidden">
                    <div className="h-full bg-[#E7E0EC] rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[#1D1B20]/50" style={{ fontSize: 11, fontWeight: 600 }}>With Essentials Bundle</span>
                    <span className="text-[#2E7D32]" style={{ fontSize: 13, fontWeight: 800 }}>$1.9M</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FEF7FF] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2E7D32] rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-5 p-4 bg-[#2E7D32]/5 rounded-2xl border border-[#2E7D32]/10 text-center">
                <p className="text-[#6750A4]" style={{ fontSize: 24, fontWeight: 800 }}>Save ~$900K</p>
                <p className="text-[#1D1B20]/40" style={{ fontSize: 11, fontWeight: 500 }}>Estimated CapEx reduction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowInterestModal(false)}>
          <div className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl border border-[#E7E0EC]" onClick={e => e.stopPropagation()} style={{ fontFamily: FONT }}>
            <h3 className="text-[#21005D] mb-1" style={{ fontSize: 20, fontWeight: 800 }}>Signal Your Interest</h3>
            <p className="text-[#1D1B20]/40 mb-6" style={{ fontSize: 13 }}>Quick and lightweight. No commitment required.</p>
            <div className="space-y-3">
              <input placeholder="Your name" className="w-full px-4 py-3 bg-[#FEF7FF] rounded-xl border-2 border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none transition-all" style={{ fontSize: 13 }} />
              <input placeholder="Work email" className="w-full px-4 py-3 bg-[#FEF7FF] rounded-xl border-2 border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none transition-all" style={{ fontSize: 13 }} />
              <input placeholder="Company (optional)" className="w-full px-4 py-3 bg-[#FEF7FF] rounded-xl border-2 border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none transition-all" style={{ fontSize: 13 }} />
              <select className="w-full px-4 py-3 bg-[#FEF7FF] rounded-xl border-2 border-transparent focus:border-[#6750A4] focus:bg-white focus:outline-none text-[#1D1B20]/50 transition-all" style={{ fontSize: 13 }}>
                <option>Timeline to occupancy</option>
                <option>0–30 days</option>
                <option>30–90 days</option>
                <option>3–6 months</option>
                <option>6+ months</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInterestModal(false)}
                className="flex-1 py-3 bg-[#6750A4] text-white rounded-2xl hover:bg-[#4F378B] transition-colors shadow-lg shadow-[#6750A4]/15"
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                Send Interest
              </button>
              <button onClick={() => setShowInterestModal(false)} className="px-5 py-3 border-2 border-[#E7E0EC] text-[#1D1B20]/40 rounded-2xl hover:border-[#1D1B20]/20 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
