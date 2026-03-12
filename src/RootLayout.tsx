import SideNav from './features/side-nav/SideNav';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const main = document.getElementById('main');
    main?.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const article = document.getElementById('doc-viewer');
    article?.scrollTo({ top: 0, left: 0, behavior: 'auto' });

  }, [location.pathname]);

  return (
    <main id="main">
      <SideNav />
      <Outlet />
    </main>
  );
}
