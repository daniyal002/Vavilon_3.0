import { useRef, useState, useEffect } from 'react';

export const usePanZoom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  // refs для хранения актуальных значений между рендерами и обработчиками
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);
  const lastScaleRef = useRef(scale);
  const lastPositionRef = useRef(position);

  // флаг для requestAnimationFrame
  const frameRequested = useRef(false);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Синхронизация последних значений для работы с тачами
  useEffect(() => {
    lastScaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    lastPositionRef.current = position;
  }, [position]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getDistance = (touches: TouchList) => {
      const [t1, t2] = [touches[0], touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getMidpoint = (touches: TouchList) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    let touchDragStart = { x: 0, y: 0 };
    let isTouchDragging = false;
    let lastDistance: number | null = null;
    let lastMidpoint: { x: number; y: number } | null = null;

    // временные значения, которые обновляем в событиях
    let nextScale = scaleRef.current;
    let nextPosition = { ...positionRef.current };

    const updateState = () => {
      frameRequested.current = false;
      setScale(nextScale);
      setPosition(nextPosition);
    };

    const requestUpdate = () => {
      if (!frameRequested.current) {
        frameRequested.current = true;
        requestAnimationFrame(updateState);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      nextScale = Math.min(Math.max(0.5, scaleRef.current + delta), 2);
      requestUpdate();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isTouchDragging = true;
        const touch = e.touches[0];
        touchDragStart = {
          x: touch.clientX - lastPositionRef.current.x,
          y: touch.clientY - lastPositionRef.current.y,
        };
      } else if (e.touches.length === 2) {
        isTouchDragging = false;
        lastDistance = getDistance(e.touches);
        lastMidpoint = getMidpoint(e.touches);
        lastScaleRef.current = scaleRef.current;
        lastPositionRef.current = positionRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && isTouchDragging) {
        const touch = e.touches[0];
        nextPosition = {
          x: touch.clientX - touchDragStart.x,
          y: touch.clientY - touchDragStart.y,
        };
        requestUpdate();
      } else if (e.touches.length === 2) {
        const newDistance = getDistance(e.touches);
        const midpoint = getMidpoint(e.touches);

        if (lastDistance && lastMidpoint) {
          const distanceRatio = newDistance / lastDistance;
          nextScale = Math.min(Math.max(0.5, lastScaleRef.current * distanceRatio), 2);

          const scaleChange = nextScale / lastScaleRef.current;
          nextPosition = {
            x: midpoint.x - scaleChange * (midpoint.x - lastPositionRef.current.x),
            y: midpoint.y - scaleChange * (midpoint.y - lastPositionRef.current.y),
          };
          requestUpdate();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        isTouchDragging = false;
        lastDistance = null;
        lastMidpoint = null;
        lastScaleRef.current = scaleRef.current;
        lastPositionRef.current = positionRef.current;
      } else if (e.touches.length === 1) {
        isTouchDragging = true;
        const touch = e.touches[0];
        touchDragStart = {
          x: touch.clientX - lastPositionRef.current.x,
          y: touch.clientY - lastPositionRef.current.y,
        };
        lastDistance = null;
        lastMidpoint = null;
        lastScaleRef.current = scaleRef.current;
        lastPositionRef.current = positionRef.current;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Мышиные обработчики
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    containerRef,
    scale,
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setScale,
    setPosition,
  };
};
