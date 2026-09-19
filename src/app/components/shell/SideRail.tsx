import { Link, useLocation } from 'react-router';
import { Bookmark, GitCompareArrows, LayoutDashboard, Search, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FONT = 'Montserrat, sans-serif';

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
      className="hidden md:flex w-[64px] shrink-0 flex-col items-center gap-1 py-4 bg-white border-r border-[#E6F1FB]"
      style={{ fontFamily: FONT }}
      aria-label="Workspace"
    >
      <Link to="/" className="w-9 h-9 rounded-xl bg-[#1B4D4A] flex items-center justify-center mb-3" aria-label="Prologis home">
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
              relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${active ? 'bg-[#E6F1FB] text-[#0C447C]' : 'text-[#303234]/40 hover:bg-[#F4F3F3] hover:text-[#1B4D4A]'}
            `}
          >
            <item.icon size={17} />
            {item.badge > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#00C2B2] text-white flex items-center justify-center"
                style={{ fontSize: 9, fontWeight: 800 }}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}

      <div className="mt-auto">
        <button
          title="Settings"
          aria-label="Settings"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#303234]/35 hover:bg-[#F4F3F3] hover:text-[#1B4D4A] transition-colors"
        >
          <Settings size={17} />
        </button>
      </div>
    </nav>
  );
}
