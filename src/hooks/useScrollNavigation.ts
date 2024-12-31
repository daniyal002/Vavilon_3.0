import { useEffect, useRef, WheelEvent } from 'react';

interface UseScrollNavigationProps {
  onScrollUp: () => void;
  onScrollDown: () => void;
  threshold?: number;
}

export function useScrollNavigation({
  onScrollUp,
  onScrollDown,
  threshold = 50
}: UseScrollNavigationProps) {
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  const handleScroll = (e: WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (isScrolling.current || now - lastScrollTime.current < 500) return;
    
    const delta = e.deltaY;
    if (Math.abs(delta) < threshold) return;
    
    isScrolling.current = true;
    lastScrollTime.current = now;
    
    if (delta > 0) {
      onScrollDown();
    } else {
      onScrollUp();
    }
    
    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  return { onWheel: handleScroll };
}