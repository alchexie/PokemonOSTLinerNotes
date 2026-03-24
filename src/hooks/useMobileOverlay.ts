import { useEffect, useRef, useState } from 'react';

export function useMobileOverlay(breakpoint = 768) {
  const [isOpenOverlay, setIsOpenOverlay] = useState(false);
  const refOverlay = useRef<HTMLElement | null>(null);
  const refTrigger = useRef<HTMLElement | null>(null);

  const openOverlay = () => {
    if (!isOpenOverlay) {
      setIsOpenOverlay(true);
    }
  };
  const closeOverlay = () => {
    setIsOpenOverlay(false);
    refTrigger.current?.blur();
    if (history.state?.overlay) {
      history.back();
    }
  };

  useEffect(() => {
    if (!isOpenOverlay) return;

    if (!history.state?.overlay) {
      history.pushState({ overlay: true }, '');
    }
    const handlePopState = () => {
      setIsOpenOverlay(false);
      refTrigger.current?.blur();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpenOverlay]);

  useEffect(() => {
    if (!isOpenOverlay) return;

    const handleClick = (e: MouseEvent) => {
      if (!refOverlay.current) return;
      if (!refOverlay.current.contains(e.target as Node)) {
        closeOverlay();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [isOpenOverlay]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${breakpoint}px)`);

    const handleChange = () => {
      if (mq.matches && isOpenOverlay) {
        closeOverlay();
      }
    };

    mq.addEventListener('change', handleChange);
    return () => {
      mq.removeEventListener('change', handleChange);
    };
  }, [isOpenOverlay, breakpoint]);

  return {
    isOpenOverlay,
    openOverlay,
    closeOverlay,
    refOverlay,
    refTrigger,
  };
}
