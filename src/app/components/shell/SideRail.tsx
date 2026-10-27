import { Link, useLocation } from 'react-router';
import { Bookmark, GitCompareArrows, LayoutDashboard, Search, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FONT = '"Google Sans", Figtree, Roboto, sans-serif';

/**
 * Slim icon rail on the left of the workspace, as in the reference dashboards.
 * Desktop only — the top nav still carries navigation on small screens.
 */
export function SideRail() {
  const location = useLocation();
  const { compareList, savedProperties } = useApp();

  const items = [
    { to: '/', icon: LayoutDashboard, label: 'Home', badge: 0 },
    { to: '/search', icon: Search, label: 'Search', badge: 0 },
    { to: '/compare', icon: GitCompareArrows, label: 'Compare', badge: compareList.length },
    { to: '/saved', icon: Bookmark, label: 'Saved', badge: savedProperties.length },
  ];

  return (
    <nav
      className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-1 py-4 bg-white border-r border-[#E7E0EC]"
      style={{ fontFamily: FONT }}
      aria-label="Workspace"
    >
      <Link to="/" className="w-9 h-9 rounded-xl bg-[#6750A4] flex items-center justify-center mb-3" aria-label="Prologis home">
        <span className="text-white" style={{ fontWeight: 800, fontSize: 14, lineHeight: 1 }}>P</span>
      </Link>

      {items.map(item => {
        const active = item.to === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.to);

        return (
          <Link
            key={item.to}
            to={item.to}
            title={item.label}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            className={`
              relative w-11 h-10 rounded-full flex items-center justify-center transition-colors
              ${active ? 'bg-[#E8DEF8] text-[#21005D]' : 'text-[#1D1B20]/40 hover:bg-[#FEF7FF] hover:text-[#6750A4]'}
            `}
          >
            <item.icon size={17} />
            {item.badge > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#6750A4] text-white flex items-center justify-center"
                style={{ fontSize: 9, fontWeight: 800 }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-auto">
        <Link
          to="/settings"
          title="Settings"
          aria-label="Settings"
          aria-current={location.pathname.startsWith('/settings') ? 'page' : undefined}
          className={`w-11 h-10 rounded-full flex items-center justify-center transition-colors ${
            location.pathname.startsWith('/settings')
              ? 'bg-[#E8DEF8] text-[#21005D]'
              : 'text-[#1D1B20]/35 hover:bg-[#FEF7FF] hover:text-[#6750A4]'
          }`}
        >
          <Settings size={17} />
        </Link>
      </div>
    </nav>
  );
}
