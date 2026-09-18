import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, ArrowRight, Building2, Truck, Factory, ShoppingBag, Briefcase,
  Sparkles, ChevronDown, Globe, Shield, Leaf, Zap, ChevronRight,
  Package, MapPin, Users, Sun, Plug, BarChart3, TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const FONT = 'Montserrat, sans-serif';

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
            ? 'border-[#00C2B2] bg-[#00C2B2]/8 text-[#1B4D4A]'
            : 'border-[#00C2B2]/40 bg-white text-[#0C447C] hover:border-[#00C2B2] hover:bg-[#00C2B2]/5'
          }
        `}
        style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600 }}
      >
        {value || placeholder}
        <ChevronDown size={15} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E6F1FB] z-50 py-2 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(27,77,74,0.15)' }}
        >
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onChange(opt.id, opt.label); onToggle(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#E6F1FB] transition-colors"
              style={{ fontFamily: FONT, fontSize: 13, fontWeight: 500, color: '#303234' }}
            >
              {opt.icon && <opt.icon size={16} className="text-[#1B4D4A] shrink-0" />}
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
    <div className="min-h-screen bg-[#F4F3F3]" style={{ fontFamily: FONT }}>

      {/* ═══════════════════════════════════════════════════════════════
          SCREEN 1 — THE PERSONALIZED "INTENT" HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Blueprint grid background */}
        <div className="absolute inset-0 bg-[#1B4D4A]">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#00C2B2]/6 blur-3xl" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-8 pt-20 pb-28">
          {/* Small label */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-8 bg-[#00C2B2]/50" />
            <span className="text-[#00C2B2] tracking-[0.2em] uppercase" style={{ fontSize: 11, fontWeight: 700 }}>
              Logistics Property Intelligence
            </span>
            <div className="h-px w-8 bg-[#00C2B2]/50" />
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
                  className="group flex items-center gap-2.5 px-8 py-4 bg-[#1B4D4A] text-white rounded-2xl hover:bg-[#187770] transition-all duration-200 shadow-lg shadow-[#1B4D4A]/30 hover:shadow-xl hover:shadow-[#187770]/30"
                  style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.02em' }}
                >
                  <Search size={18} />
                  Find Logistics Fit
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate('/search')}
                  className="text-white/40 hover:text-[#00C2B2] transition-colors flex items-center gap-1.5"
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
                className="px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:border-[#00C2B2]/50 hover:text-[#00C2B2] hover:bg-[#00C2B2]/5 transition-all"
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
        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E6F1FB] grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E6F1FB]">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-3.5 py-6 px-6">
              <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] flex items-center justify-center shrink-0">
                <s.icon size={20} className="text-[#1B4D4A]" />
              </div>
              <div>
                <p className="text-[#0C447C]" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
                  {s.value}<span style={{ fontSize: 14 }}>{s.unit}</span>
                </p>
                <p className="text-[#303234]/50 mt-0.5" style={{ fontSize: 11, fontWeight: 500 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Segment Cards Section ─── */}
      <section className="max-w-[1100px] mx-auto px-8 py-20">
        <div className="text-center mb-10">
          <p className="text-[#1B4D4A] tracking-[0.15em] uppercase mb-2" style={{ fontSize: 11, fontWeight: 700 }}>Tailored Workflows</p>
          <h2 className="text-[#0C447C]" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.01em' }}>
            Search Tuned for Your Business
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {roles.map(seg => (
            <button
              key={seg.id}
              onClick={() => navigate(`/search?segment=${seg.id}`)}
              className="group bg-white rounded-2xl p-6 text-left border border-transparent hover:border-[#00C2B2]/30 hover:shadow-lg hover:shadow-[#00C2B2]/5 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-11 h-11 rounded-xl bg-[#E6F1FB] group-hover:bg-[#00C2B2]/10 flex items-center justify-center mb-4 transition-colors">
                <seg.icon size={20} className="text-[#1B4D4A] group-hover:text-[#00C2B2] transition-colors" />
              </div>
              <p className="text-[#0C447C] mb-1" style={{ fontSize: 14, fontWeight: 700 }}>{seg.label}</p>
              <p className="text-[#303234]/50" style={{ fontSize: 11, lineHeight: 1.5 }}>
                {seg.id === 'ecommerce-operator' && 'Speed-to-market, dock-heavy, automation-ready'}
                {seg.id === '3pl-provider' && 'Multi-market search, portfolio workflows'}
                {seg.id === 'manufacturer' && 'Heavy power, rail access, build-to-suit'}
                {seg.id === 'retailer' && 'Seasonal flex, consumer proximity'}
                {seg.id === 'broker' && 'Bulk export, compare, LOI handoff'}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Prologis Essentials Highlight ─── */}
      <section className="bg-white border-y border-[#E6F1FB]">
        <div className="max-w-[1100px] mx-auto px-8 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#00C2B2] tracking-[0.15em] uppercase" style={{ fontSize: 11, fontWeight: 700 }}>Prologis Essentials</span>
              <h2 className="text-[#0C447C] mt-2 mb-4" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.01em' }}>
                More Than a Building.<br />A Logistics Platform.
              </h2>
              <p className="text-[#303234]/60 mb-8" style={{ fontSize: 14, lineHeight: 1.8 }}>
                From solar energy and EV charging to racking systems and workforce programs—Prologis Essentials turns every facility into an operational advantage. Available during search, not after deal close.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Sun, label: 'Solar & LED', color: '#00CC66' },
                  { icon: Plug, label: 'EV Charging', color: '#00C2B2' },
                  { icon: Package, label: 'Racking & Forklifts', color: '#0C447C' },
                  { icon: Users, label: 'Workforce Training', color: '#1B4D4A' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#F4F3F3] rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.color + '12' }}>
                      <item.icon size={16} style={{ color: item.color }} />
                    </div>
                    <span className="text-[#303234]" style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/search')}
                className="mt-8 px-6 py-3 bg-[#1B4D4A] text-white rounded-xl hover:bg-[#187770] transition-colors"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Explore Properties with Essentials
              </button>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1726866492047-7f9516558c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzb2xhciUyMHBhbmVscyUyMHJvb2Z0b3B8ZW58MXx8fHwxNzc1NjMzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Prologis Essentials"
                  className="w-full h-[360px] object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg border border-[#E6F1FB] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00CC66]/10 flex items-center justify-center">
                  <BarChart3 size={18} className="text-[#00CC66]" />
                </div>
                <div>
                  <p className="text-[#0C447C]" style={{ fontSize: 16, fontWeight: 800 }}>~32%</p>
                  <p className="text-[#303234]/50" style={{ fontSize: 10, fontWeight: 500 }}>Avg. CapEx Reduction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="max-w-[1100px] mx-auto px-8 py-20 text-center">
        <h2 className="text-[#0C447C] mb-3" style={{ fontSize: 28, fontWeight: 800 }}>
          Ready to Find Your Next Facility?
        </h2>
        <p className="text-[#303234]/50 mb-8 max-w-md mx-auto" style={{ fontSize: 14, lineHeight: 1.7 }}>
          Search by operational specs. Compare side-by-side. Connect with local market experts.
        </p>
        <button
          onClick={() => navigate('/search')}
          className="px-8 py-3.5 bg-[#1B4D4A] text-white rounded-2xl hover:bg-[#187770] transition-all shadow-lg shadow-[#1B4D4A]/20"
          style={{ fontSize: 15, fontWeight: 700 }}
        >
          Browse Available Properties
        </button>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[#303234] text-white/50 py-8">
        <div className="max-w-[1100px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#1B4D4A]" style={{ fontWeight: 800, fontSize: 11 }}>P</span>
            </div>
            <span className="text-white/70" style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.05em' }}>PROLOGIS</span>
          </div>
          <p style={{ fontSize: 11 }}>&copy; 2026 Prologis, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
