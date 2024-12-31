import { useEffect, useRef, TouchEvent } from 'react';

interface UseSwipeNavigationProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number;
}

export function useSwipeNavigation({
  onSwipeUp,
  onSwipeDown,
  threshold = 100
}: UseSwipeNavigationProps) {
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const lastSwipeTime = useRef(0);

  const onTouchStart = (e: TouchEvent) => {
    // Don't handle swipes on scrollable content
    if ((e.target as HTMLElement).closest('.overflow-y-auto')) return;
    
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart.current) return;
    touchEnd.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    
    const now = Date.now();
    if (now - lastSwipeTime.current < 500) return;
    
    const distance = touchStart.current - touchEnd.current;
    const isSwipe = Math.abs(distance) > threshold;

    if (isSwipe) {
      lastSwipeTime.current = now;
      if (distance > 0) {
        onSwipeUp();
      } else {
        onSwipeDown();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
}