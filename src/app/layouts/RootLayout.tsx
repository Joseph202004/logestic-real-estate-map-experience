import { Outlet, useLocation } from 'react-router';
import { SideRail } from '../components/shell/SideRail';

export function RootLayout() {
  const location = useLocation();
  // The workspace rail is for the app screens, not the marketing home or auth pages.
  const showRail = location.pathname !== '/' && location.pathname !== '/signin';

  return (
    <div className="min-h-screen flex">
      {showRail && <SideRail />}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
