import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ScrollRevealProps {
  children: ReactNode;
}

export function ScrollReveal({ children }: ScrollRevealProps) {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: '-50px',
  });

  return (
    <div
      ref={elementRef}
      className={`transform transition-all duration-1000 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-20'
      }`}
    >
      {children}
    </div>
  );
}