import { Link, useNavigate, useLocation } from 'react-router';
import { Search, GitCompareArrows, Bookmark, Menu, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

const FONT = 'Montserrat, sans-serif';

export function TopNav() {
  const { compareList, savedProperties } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location.pathname === '/';

  return (
    <nav
      className="sticky top-0 z-50 bg-[#1B4D4A]"
      style={{ fontFamily: FONT }}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-[#1B4D4A]" style={{ fontWeight: 800, fontSize: 15, lineHeight: 1 }}>P</span>
          </div>
          <span className="text-white tracking-[0.08em]" style={{ fontWeight: 700, fontSize: 16 }}>PROLOGIS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/search"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
              location.pathname === '/search'
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Search size={15} />
            Search
          </Link>

          <button
            onClick={() => navigate('/compare')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all relative ${
              location.pathname === '/compare'
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <GitCompareArrows size={15} />
            Compare
            {compareList.length > 0 && (
              <span className="ml-0.5 w-5 h-5 bg-[#00C2B2] text-white rounded-full flex items-center justify-center shadow-sm" style={{ fontSize: 10, fontWeight: 800 }}>
                {compareList.length}
              </span>
            )}
          </button>

          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all relative"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Bookmark size={15} />
            Saved
            {savedProperties.length > 0 && (
              <span className="ml-0.5 w-5 h-5 bg-[#00C2B2] text-white rounded-full flex items-center justify-center shadow-sm" style={{ fontSize: 10, fontWeight: 800 }}>
                {savedProperties.length}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-white/15 mx-2" />

          <button
            className="flex items-center gap-1 px-5 py-2 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-all border border-white/10"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            Sign In
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#163F3D] border-t border-white/10 px-4 pb-5 pt-2 flex flex-col gap-1">
          <Link to="/search" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3 text-white/80 border-b border-white/5" style={{ fontSize: 14, fontWeight: 600 }}>
            <span className="flex items-center gap-2"><Search size={15} /> Search Properties</span>
            <ChevronRight size={14} />
          </Link>
          <Link to="/compare" onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3 text-white/80 border-b border-white/5" style={{ fontSize: 14, fontWeight: 600 }}>
            <span className="flex items-center gap-2"><GitCompareArrows size={15} /> Compare</span>
            {compareList.length > 0 && <span className="px-2 py-0.5 bg-[#00C2B2] rounded-full text-white" style={{ fontSize: 11, fontWeight: 700 }}>{compareList.length}</span>}
          </Link>
          <button className="flex items-center justify-between py-3 text-white/80 border-b border-white/5 w-full text-left" style={{ fontSize: 14, fontWeight: 600 }}>
            <span className="flex items-center gap-2"><Bookmark size={15} /> Saved</span>
            {savedProperties.length > 0 && <span className="px-2 py-0.5 bg-[#00C2B2] rounded-full text-white" style={{ fontSize: 11, fontWeight: 700 }}>{savedProperties.length}</span>}
          </button>
          <button className="mt-3 w-full py-2.5 bg-white text-[#1B4D4A] rounded-xl" style={{ fontSize: 13, fontWeight: 700 }}>
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
