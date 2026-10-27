import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, ArrowRight, Building2, Truck, Factory, ShoppingBag, Briefcase,
  ChevronDown, Globe, Shield, ChevronRight, TrendingUp
} from 'lucide-react';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/* ─── Dropdown data ─── */
const roles = [
  { id: 'ecommerce-operator', label: 'E-commerce Operator', icon: ShoppingBag },
  { id: '3pl-provider', label: '3PL Provider', icon: Truck },
  { id: 'manufacturer', label: 'Manufacturer', icon: Factory },
  { id: 'retailer', label: 'Retailer', icon: Building2 },
  { id: 'broker', label: 'Broker / Tenant Rep', icon: Briefcase },
];

const spaceTypes = [
  { id: 'last-mile', label: 'Last-Mile Fulfillment' },
  { id: 'regional-dc', label: 'Regional Distribution' },
  { id: 'mega-dc', label: 'Mega Distribution Center' },
  { id: 'cold-chain', label: 'Cold Chain Facility' },
  { id: 'manufacturing', label: 'Manufacturing Space' },
  { id: 'cross-dock', label: 'Cross-Dock Facility' },
  { id: 'bts', label: 'Build-to-Suit' },
];

const markets = [
  { id: 'chicago', label: 'Chicago' },
  { id: 'new-jersey', label: 'New Jersey / NY Metro' },
  { id: 'inland-empire', label: 'Inland Empire, CA' },
  { id: 'dallas', label: 'Dallas-Fort Worth' },
  { id: 'atlanta', label: 'Atlanta' },
  { id: 'seattle', label: 'Seattle / Puget Sound' },
  { id: 'memphis', label: 'Memphis' },
  { id: 'lehigh-valley', label: 'Lehigh Valley, PA' },
  { id: 'phoenix', label: 'Phoenix' },
  { id: 'savannah', label: 'Savannah' },
  { id: 'denver', label: 'Denver' },
  { id: 'houston', label: 'Houston' },
];

const stats = [
  { value: '1.2B', unit: 'SF', label: 'Logistics Real Estate', icon: Building2 },
  { value: '20', unit: '', label: 'Countries', icon: Globe },
  { value: '6,700', unit: '+', label: 'Properties', icon: Shield },
  { value: '$230B', unit: '', label: 'AUM', icon: TrendingUp },
];

/* ─── Pill Dropdown Component ─── */
function PillDropdown({
  value,
  placeholder,
  options,
  onChange,
  open,
  onToggle,
}: {
  value: string;
  placeholder: string;
  options: { id: string; label: string; icon?: any }[];
  onChange: (id: string, label: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    }
    if (open) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={onToggle}
        className={`
          inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 transition-all duration-200 cursor-pointer
          ${value
            ? 'border-[#6750A4] bg-[#6750A4]/8 text-[#6750A4]'
            : 'border-[#6750A4]/40 bg-white text-[#21005D] hover:border-[#6750A4] hover:bg-[#6750A4]/5'
          }
        `}
        style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600 }}
      >
        {value || placeholder}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E7E0EC] z-50 py-2 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(27,77,74,0.15)' }}
        >
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id, opt.label); onToggle(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#E7E0EC] transition-colors"
              style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: '#1D1B20' }}
            >
              {opt.icon && <opt.icon size={16} className="text-[#6750A4] shrink-0" />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export function HomePage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState({ id: '', label: '' });
  const [selectedSpace, setSelectedSpace] = useState({ id: '', label: '' });
  const [selectedMarket, setSelectedMarket] = useState({ id: '', label: '' });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedRole.id) params.set('segment', selectedRole.id);
    if (selectedMarket.id) params.set('market', selectedMarket.id);
    if (selectedSpace.id) params.set('type', selectedSpace.id);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FEF7FF]" style={{ fontFamily: FONT }}>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 1 — THE PERSONALIZED "INTENT" HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid background */}
        <div className="absolute inset-0 bg-[#6750A4]">
          <div className="absolute inset-0 opacity-[0.06]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="blueprint" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="80" y2="0" stroke="#fff" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="80" stroke="#fff" strokeWidth="0.5" />
                  <line x1="40" y1="0" x2="40" y2="80" stroke="#fff" strokeWidth="0.3" strokeDasharray="4,4" />
                  <line x1="0" y1="40" x2="80" y2="40" stroke="#fff" strokeWidth="0.3" strokeDasharray="4,4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueprint)" />
            </svg>
          </div>
          {/* Subtle radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#6750A4]/6 blur-3xl" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-8 pt-20 pb-28">
          {/* Small label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-8 bg-[#6750A4]/50" />
            <span className="text-[#6750A4] tracking-[0.2em] uppercase" style={{ fontSize: 11, fontWeight: 700 }}>
              Logistics Property Intelligence
            </span>
            <div className="h-px w-8 bg-[#6750A4]/50" />
          </div>

          {/* Headline */}
          <h1 className="text-center text-white mb-4" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Find Your Operational Fit
          </h1>
          <p className="text-center text-white/50 mb-14 max-w-xl mx-auto" style={{ fontSize: 15, lineHeight: 1.7 }}>
            Describe your logistics need. We'll match you with the right facility across 1.2 billion square feet of global infrastructure.
          </p>

          {/* ─── Mad Libs Intent Builder ─── */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-white" style={{ fontSize: 18, fontWeight: 500, lineHeight: 2.8 }}>
                <span className="text-white/60">I am a</span>

                <PillDropdown
                  value={selectedRole.label}
                  placeholder="select your role"
                  options={roles}
                  onChange={(id, label) => setSelectedRole({ id, label })}
                  open={openDropdown === 'role'}
                  onToggle={() => setOpenDropdown(openDropdown === 'role' ? null : 'role')}
                />

                <span className="text-white/60">looking for</span>

                <PillDropdown
                  value={selectedSpace.label}
                  placeholder="type of space"
                  options={spaceTypes}
                  onChange={(id, label) => setSelectedSpace({ id, label })}
                  open={openDropdown === 'space'}
                  onToggle={() => setOpenDropdown(openDropdown === 'space' ? null : 'space')}
                />

                <span className="text-white/60">in</span>

                <PillDropdown
                  value={selectedMarket.label}
                  placeholder="target market"
                  options={markets}
                  onChange={(id, label) => setSelectedMarket({ id, label })}
                  open={openDropdown === 'market'}
                  onToggle={() => setOpenDropdown(openDropdown === 'market' ? null : 'market')}
                />
              </div>

              {/* CTA Button */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  onClick={handleSearch}
                  className="group flex items-center gap-2.5 px-8 py-4 bg-[#6750A4] text-white rounded-2xl hover:bg-[#4F378B] transition-all duration-200 shadow-lg shadow-[#6750A4]/30 hover:shadow-xl hover:shadow-[#4F378B]/30"
                  style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.02em' }}
                >
                  <Search size={18} />
                  Find Logistics Fit
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate('/search')}
                  className="text-white/40 hover:text-[#6750A4] transition-colors flex items-center gap-1.5"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  Or browse all available properties
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Segment quick-link chips below hero */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <span className="text-white/30 mr-1" style={{ fontSize: 11, fontWeight: 600 }}>POPULAR:</span>
            {[
              { label: 'E-commerce Fulfillment', segment: 'ecommerce' },
              { label: '3PL Multi-Market', segment: '3pl' },
              { label: 'Cold Chain Ready', segment: 'cold-chain' },
              { label: 'Build-to-Suit', segment: 'bts' },
              { label: 'Rail-Served', segment: 'rail' },
            ].map(chip => (
              <button
                key={chip.segment}
                onClick={() => navigate(`/search?type=${chip.segment}`)}
                className="px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:border-[#6750A4]/50 hover:text-[#6750A4] hover:bg-[#6750A4]/5 transition-all"
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="relative -mt-10 z-10 max-w-[1100px] mx-auto px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E7E0EC] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E7E0EC]">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 py-6 px-6">
              <div className="w-11 h-11 rounded-xl bg-[#E7E0EC] flex items-center justify-center shrink-0">
                <s.icon size={20} className="text-[#6750A4]" />
              </div>
              <div>
                <p className="text-[#21005D]" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                  {s.value}<span style={{ fontSize: 14 }}>{s.unit}</span>
                </p>
                <p className="text-[#1D1B20]/50 mt-0.5" style={{ fontSize: 11, fontWeight: 500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
