import { Outlet } from 'react-router';
import { TopNav } from '../components/TopNav';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
