import SideNav from './features/side-nav/SideNav';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { TITLE } from './App';

function DocFooterPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const findTarget = () => {
      const el = document.getElementById('doc-viewer') as HTMLElement | null;
      setTarget(el);
    };
    findTarget();

    const observer = new MutationObserver(findTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!target) {
    return null;
  } else {
    return createPortal(
      <footer>
        <hr></hr>
        <div>
          <p>© 2026 {TITLE}</p>
          <p>
            <small>
              Fan project. Not affiliated with Nintendo, Game Freak, or The Pokémon
              Company.
            </small>
          </p>
          <p>
            <small>
              本站为粉丝项目，非官方网站。站内所有素材版权归各自版权所有者所有。
            </small>
          </p>
        </div>
      </footer>,
      target
    );
  }
}

export default function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document
      .getElementById('doc-viewer')
      ?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <main id="main">
      <SideNav />
      <Outlet />
      <DocFooterPortal />
    </main>
  );
}
