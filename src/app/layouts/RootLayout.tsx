import { Outlet, useLocation } from 'react-router';
import { TopNav } from '../components/TopNav';
import { SideRail } from '../components/shell/SideRail';

export function RootLayout() {
  const location = useLocation();
  // The workspace rail is for the app screens, not the marketing home page.
  const showRail = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1 flex">
        {showRail && <SideRail />}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
