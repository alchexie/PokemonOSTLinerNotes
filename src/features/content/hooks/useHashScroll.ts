import { useEffect } from 'react';

export const useHashScroll = (dependence: unknown) => {
  useEffect(() => {
    if (!dependence) {
      return;
    }

    const scrollToHash = (hash?: string) => {
      const id = decodeURIComponent((hash ?? window.location.hash).slice(1));
      if (!id) {
        return;
      }
      const elem = document.getElementById(id);
      if (!elem) {
        return;
      }

      requestAnimationFrame(() => {
        elem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    };

    scrollToHash();

    const catalog = document.querySelector('.meta-catalog') as HTMLElement | null;
    if (!catalog) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const a = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) {
        return;
      }

      const hash = a.hash;
      if (!hash) {
        return;
      }

      const el = document.getElementById(hash.slice(1));
      if (!el) return;

      e.preventDefault();

      history.pushState(null, '', hash);
      scrollToHash(hash);
    };

    catalog.addEventListener('click', handleClick);

    return () => {
      catalog.removeEventListener('click', handleClick);
    };
  }, [dependence]);
};
