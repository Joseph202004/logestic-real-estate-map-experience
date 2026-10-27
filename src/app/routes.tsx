import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SavedPage } from './pages/SavedPage';
import { SignInPage } from './pages/SignInPage';
import { SettingsPage } from './pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'signin', Component: SignInPage },
      { path: 'search', Component: SearchPage },
      { path: 'property/:id', Component: PropertyDetailPage },
      { path: 'compare', Component: ComparePage },
      { path: 'saved', Component: SavedPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);
