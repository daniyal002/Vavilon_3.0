import { useRef, useState, useEffect } from "react";

// Кастомный хук для реализации панорамирования и масштабирования
export const usePanZoom = () => {
  // Ссылка на DOM-элемент контейнера, в котором происходит пан и зум
  const containerRef = useRef<HTMLDivElement>(null);

  // Состояние текущего масштаба (scale), изначально 1 (100%)
  const [scale, _setScale] = useState(0.9);

  // Состояние текущей позиции (смещения) контейнера {x, y}
  const [position, _setPosition] = useState({ x: 0, y: 0 });

  // Флаг, указывающий, происходит ли сейчас перетаскивание мышью
  const [isDragging, setIsDragging] = useState(false);

  // Координаты начала перетаскивания — позиция мыши при нажатии минус текущая позиция
  const [start, setStart] = useState({ x: 0, y: 0 });

  // refs для доступа к актуальному масштабу и позиции внутри обработчиков,
  // т.к. setState асинхронен, а refs синхронны и не вызывают ререндер
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);

  // Функция установки масштаба с ограничением и перерасчётом позиции
  const setScale = (newScale: number, center?: { x: number; y: number }) => {
    // Ограничиваем масштаб от 0.5 до 2
    const clampedScale = Math.max(0.5, Math.min(newScale, 2));

    // Если контейнер отсутствует или масштаб не изменился — выход
    if (!containerRef.current || clampedScale === scaleRef.current) return;

    const container = containerRef.current;

    // Получаем размер и позицию контейнера относительно окна
    const rect = container.getBoundingClientRect();

    // Координаты центра масштабирования относительно контейнера
    // Если center не передан — берём центр контейнера
    const cx = center?.x ?? rect.width / 2;
    const cy = center?.y ?? rect.height / 2;

    // Переводим координаты центра в координаты "мировые" — с учётом текущей позиции и масштаба
    // (Какой координате в элементе контейнера соответствует точка центра масштабирования)
    const worldX = (cx - positionRef.current.x) / scaleRef.current;
    const worldY = (cy - positionRef.current.y) / scaleRef.current;

    // Новый сдвиг позиции после изменения масштаба,
    // чтобы точка центра масштабирования оставалась на месте
    const newPosition = {
      x: cx - worldX * clampedScale,
      y: cy - worldY * clampedScale,
    };

    // Обновляем refs на новые значения
    scaleRef.current = clampedScale;
    positionRef.current = newPosition;

    // Обновляем состояние React (будет вызван ререндер)
    _setScale(clampedScale);
    _setPosition(newPosition);
  };

  // Установка позиции (смещения) контейнера
  const setPosition = (pos: { x: number; y: number }) => {
    positionRef.current = pos; // обновляем ref
    _setPosition(pos);         // обновляем состояние
  };

  // Обработчик нажатия мыши — начало перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    // Сохраняем позицию мыши относительно текущей позиции контейнера
    setStart({
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    });
  };

  // Обработчик движения мыши — изменение позиции при перетаскивании
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return; // если не перетаскиваем — ничего не делаем
    // Новая позиция — сдвиг мыши минус начальное смещение
    const newPos = { x: e.clientX - start.x, y: e.clientY - start.y };
    setPosition(newPos);
  };

  // Обработчик отпускания мыши — конец перетаскивания
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // useEffect для установки и очистки слушателей событий колесика мыши и тач-событий
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Вспомогательная функция — вычисляет расстояние между двумя касаниями
    const getDistance = (touches: TouchList) => {
      const [t1, t2] = [touches[0], touches[1]];
      const dx = t1.clientX - t2.clientX;
      const dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Вспомогательная функция — вычисляет середину между двумя касаниями
    const getMidpoint = (touches: TouchList) => {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    };

    // Переменные для отслеживания состояния тача
    let lastDistance: number | null = null;               // последняя дистанция между пальцами (для пинча)
    let isTouchDragging = false;                          // флаг, если идёт перетаскивание одним пальцем
    let dragStart = { x: 0, y: 0 };                       // координаты начала перетаскивания
    let pinchMidpoint: { x: number; y: number } | null = null;  // середина пинча
    let pinchStartScale = scaleRef.current;               // масштаб при начале пинча

    // Обработчик колесика мыши — масштабирование
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Определяем направление масштабирования (увеличить или уменьшить)
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      const newScale = scaleRef.current + delta;
      const rect = container.getBoundingClientRect();

      // Координаты мыши относительно контейнера — центр масштабирования
      const localX = e.clientX - rect.left - 120;
      const localY = e.clientY - rect.top - 120;
      console.log("e.clientX: ",e.clientX,"rect.left: ", rect.left,"localX: ", localX)
      console.log("e.clientY: ",e.clientY,"rect.top: ", rect.top,"localY: ", localY)

      // Вызываем функцию установки масштаба с вычисленными координатами центра
      setScale(newScale, { x: localX, y: localY });
    };

    // Обработчик начала касания (тапа/перетаскивания)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Один палец — начинаем перетаскивание
        isTouchDragging = true;
        const touch = e.touches[0];
        // Запоминаем точку начала перетаскивания с учётом текущей позиции
        dragStart = {
          x: touch.clientX - positionRef.current.x,
          y: touch.clientY - positionRef.current.y,
        };
      } else if (e.touches.length === 2) {
        // Два пальца — начинаем масштабирование (пинч)
        isTouchDragging = false;
        lastDistance = getDistance(e.touches);      // дистанция между пальцами в начале
        pinchMidpoint = getMidpoint(e.touches);     // середина между пальцами
        pinchStartScale = scaleRef.current;         // масштаб в начале пинча
      }
    };

    // Обработчик движения пальцев
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && isTouchDragging) {
        // Перетаскивание одним пальцем — вычисляем новую позицию
        const touch = e.touches[0];
        const newPos = {
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        };
        setPosition(newPos);
      } else if (e.touches.length === 2 && lastDistance && pinchMidpoint) {
        // Масштабирование двумя пальцами (пинч)
        const newDistance = getDistance(e.touches);          // новая дистанция
        const scaleChange = newDistance / lastDistance;      // коэффициент изменения масштаба
        const newScale = pinchStartScale * scaleChange;      // новый масштаб

        const rect = container.getBoundingClientRect();
        // Центр масштабирования — середина между пальцами относительно контейнера
        const localX = pinchMidpoint.x - rect.left - 120;
        const localY = pinchMidpoint.y - rect.top - 120;

        setScale(newScale, { x: localX, y: localY });
      }
    };

    // Обработчик окончания касания — сбрасываем состояние
    const handleTouchEnd = () => {
      isTouchDragging = false;
      lastDistance = null;
      pinchMidpoint = null;
    };

    // Навешиваем слушатели событий на контейнер
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    // Чистим слушатели при размонтировании
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // Возвращаем из хука refs, состояние и обработчики для управления из компонента
  return {
    containerRef,               // ссылка на контейнер для навешивания событий и доступа к DOM
    scale: scaleRef.current,    // текущий масштаб
    position: positionRef.current, // текущая позиция (смещение)
    isDragging,                 // флаг перетаскивания мышью
    handleMouseDown,            // обработчик начала перетаскивания мышью
    handleMouseMove,            // обработчик движения мышью
    handleMouseUp,              // обработчик окончания перетаскивания
    setScale,                   // функция установки масштаба с перерасчётом позиции
    setPosition,                // функция установки позиции
  };
};
