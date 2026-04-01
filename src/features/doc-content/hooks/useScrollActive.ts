import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';
import type { ContentSeries } from '@/types';

export const useScrollActive = (
  current: ContentSeries,
  contentRef: RefObject<HTMLElement | null>
) => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return window.matchMedia('(max-width: 767px)').matches;
  });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleHeadingsRef = useRef<Set<string>>(new Set());
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const scrollElem = contentRef.current;
    if (!scrollElem) return;

    observerRef.current?.disconnect();
    visibleHeadingsRef.current.clear();

    const headings = Array.from(scrollElem.querySelectorAll<HTMLElement>('h3[id]'));
    if (headings.length === 0) return;

    const pickFromVisible = () => {
      for (const el of headings) {
        if (visibleHeadingsRef.current.has(el.id)) {
          setActiveKey(el.id);
          return true;
        }
      }
      return false;
    };

    const pickByScroll = () => {
      const top = isMobile ? window.scrollY : scrollElem.scrollTop;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = headings[i];
        const elTop = isMobile
          ? el.getBoundingClientRect().top + window.scrollY
          : el.offsetTop;
        if (elTop <= top + 100) {
          setActiveKey(el.id);
          return true;
        }
      }
      return false;
    };

    const isAtBottom = () => {
      if (isMobile) {
        const doc = document.documentElement;
        return window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
      }
      const { scrollTop, scrollHeight, clientHeight } = scrollElem;
      return scrollTop + clientHeight >= scrollHeight - 2;
    };

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (!id) return;

          if (entry.isIntersecting) {
            visibleHeadingsRef.current.add(id);
          } else {
            visibleHeadingsRef.current.delete(id);
          }
        });

        if (!isScrollingRef.current) {
          if (!pickFromVisible()) {
            pickByScroll();
          }
        }
      },
      {
        root: isMobile ? null : scrollElem,
        threshold: 0.1,
        rootMargin: '-80px 0px -60% 0px',
      }
    );

    headings.forEach((el) => observerRef.current?.observe(el));

    const handleScroll = () => {
      isScrollingRef.current = true;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;

        if (isAtBottom()) {
          const last = headings[headings.length - 1];
          if (last) {
            setActiveKey(last.id);
            return;
          }
        }
        if (pickFromVisible()) return;
        pickByScroll();
      }, 120);
    };

    const scrollTarget: EventTarget = isMobile ? window : scrollElem;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, [current, contentRef, isMobile]);

  return activeKey;
};
