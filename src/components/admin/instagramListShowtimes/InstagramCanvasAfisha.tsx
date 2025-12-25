import { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { baseURL } from "../../../api/axios";
import { formatTime } from "../../../utils/formatters";
import { ShowTime } from '../../../types/showtime';

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

export function InstagramCanvasAfisha({ showTimes, selectedDate }: { showTimes: ShowTime[], selectedDate: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(0.4);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Image load error"));
    });
  };

  const drawAfisha = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // 1. Фон
    const gradient = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT);
    gradient.addColorStop(0, '#1a0b2e');
    gradient.addColorStop(1, '#08020d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // 2. Шапка
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('VAVILON', 60, 120);
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('ЗАКРЫТЫЙ ЗАЛ НА КРЫШЕ', 60, 165);

    // Плашка даты (ИСПРАВЛЕНО)
    const dateText = format(new Date(selectedDate), 'd MMMM', { locale: ru }).toUpperCase();
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText('РАСПИСАНИЕ НА', STORY_WIDTH - 60, 110);

    ctx.font = 'bold 55px sans-serif';
    const dateWidth = ctx.measureText(dateText).width + 80;
    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, STORY_WIDTH - 60 - dateWidth, 130, dateWidth, 100, 15);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'middle';
    ctx.fillText(dateText, STORY_WIDTH - 100, 185);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    // 3. Динамический расчет списка сеансов
    const startY = 320;
    const footerHeight = 450;
    const availableHeight = STORY_HEIGHT - startY - footerHeight;

    // Если сеансов много, уменьшаем их высоту
    const count = showTimes.length;
    let itemHeight = 210;
    let gap = 35;

    if (count * (itemHeight + gap) > availableHeight) {
      const totalStep = availableHeight / count;
      itemHeight = totalStep * 0.85;
      gap = totalStep * 0.15;
    }

    let index = 0;
    for (const st of showTimes) {
      const y = startY + index * (itemHeight + gap);

      // Карточка
      ctx.fillStyle = '#ffffff';
      drawRoundedRect(ctx, 60, y, STORY_WIDTH - 120, itemHeight, 20);
      ctx.fill();

      // Постер
      try {
        const posterImg = await loadImage(`${baseURL}/${st.movie.imagePath}`);
        ctx.save();
        drawRoundedRect(ctx, 60, y, 160, itemHeight, 20);
        ctx.clip();
        ctx.drawImage(posterImg, 60, y, 160, itemHeight);
        ctx.restore();
      } catch (e) {
        ctx.fillStyle = '#333';
        ctx.fillRect(60, y, 160, itemHeight);
      }

      // Номер (на карточке)
      ctx.fillStyle = '#7e22ce';
      drawRoundedRect(ctx, 20, y - 10, 50, 50, 5);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((index + 1).toString(), 45, y + 25);

      // Инфо
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1e1b4b';
      ctx.font = `bold ${Math.min(38, itemHeight / 5)}px sans-serif`;
      const title = st.movie.title.length > 25 ? st.movie.title.slice(0, 22) + '...' : st.movie.title;
      ctx.fillText(title.toUpperCase(), 240, y + itemHeight * 0.35);

      ctx.fillStyle = '#6b7280';
      ctx.font = `${Math.min(24, itemHeight / 8)}px sans-serif`;
      const genres = st.movie.genres?.slice(0, 2).map((g: any) => g.name).join(', ') || '';
      ctx.fillText(`${genres} | ${st.movie.year}г`, 240, y + itemHeight * 0.55);

      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`★ ${st.movie.rating}`, 240, y + itemHeight * 0.8);

      // Блоки справа (Время и Цена)
      const rightX = STORY_WIDTH - 210;
      const blockWidth = 150;

      ctx.fillStyle = '#7e22ce';
      drawRoundedRect(ctx, rightX, y + itemHeight * 0.15, blockWidth, itemHeight * 0.33, 15);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.min(34, itemHeight / 6)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(formatTime(st.startTime as unknown as string), rightX + blockWidth / 2, y + itemHeight * 0.15 + itemHeight * 0.23);

      ctx.fillStyle = '#f3e8ff';
      drawRoundedRect(ctx, rightX, y + itemHeight * 0.55, blockWidth, itemHeight * 0.3, 15);
      ctx.fill();
      ctx.fillStyle = '#7e22ce';
      ctx.font = `bold ${Math.min(28, itemHeight / 7)}px sans-serif`;
      ctx.fillText(`${st.price}P`, rightX + blockWidth / 2, y + itemHeight * 0.55 + itemHeight * 0.22);

      index++;
    }

    // 4. Футер
    const footerStartY = STORY_HEIGHT - 420;
    ctx.fillStyle = '#0d0517'; // Отсечка
    ctx.fillRect(0, footerStartY, STORY_WIDTH, 420);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px sans-serif';
    ctx.fillText('БРОНЬ БИЛЕТОВ ПО ССЫЛКЕ ИЛИ НОМЕРУ', STORY_WIDTH / 2, footerStartY + 60);

    // Ссылка-стикер
    const linkText = 'Kinovavilon.ru';
    ctx.font = 'bold 42px sans-serif';
    const linkTextWidth = ctx.measureText(linkText).width;
    const pillWidth = linkTextWidth + 140;
    const pillX = 60;
    const pillY = footerStartY + 120;

    ctx.fillStyle = '#ffffff';
    drawRoundedRect(ctx, pillX, pillY, pillWidth, 110, 55);
    ctx.fill();

    ctx.fillStyle = '#0088ff';
    ctx.font = '50px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🔗', pillX + 35, pillY + 72);

    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(linkText, pillX + 110, pillY + 72);

    // Телефон
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('+7(928)543-92-57', STORY_WIDTH - 60, pillY + 72);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#6b7280';
    ctx.font = '24px sans-serif';
    ctx.fillText('БРОНЬ БЕСПЛАТНАЯ, ОПЛАТА ПРОИЗВОДИТСЯ НА МЕСТЕ', STORY_WIDTH / 2, STORY_HEIGHT - 80);

  };

  function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  useEffect(() => { drawAfisha(); }, [showTimes, selectedDate]);

  return (
    <div className="flex flex-col items-center p-8 bg-purple-950/20 rounded-3xl">
      <div className="mb-6 flex gap-4 items-center w-full max-w-md bg-black/20 p-4 rounded-xl">
        <label className="text-white text-xs uppercase">Масштаб:</label>
        <input type="range" min="0.2" max="0.6" step="0.05" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-1 accent-purple-500" />
      </div>
      <div className="shadow-2xl border-[12px] border-black rounded-[3.5rem] overflow-hidden" style={{ width: STORY_WIDTH * zoom, height: STORY_HEIGHT * zoom }}>
        <canvas ref={canvasRef} width={STORY_WIDTH} height={STORY_HEIGHT} className="w-full h-full" />
      </div>
      <button onClick={() => {
        const link = document.createElement('a');
        link.download = `afisha-${selectedDate}.png`;
        link.href = canvasRef.current?.toDataURL('image/png') || '';
        link.click();
      }} className="mt-8 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">
        📥 СКАЧАТЬ ДЛЯ INSTAGRAM
      </button>
    </div>
  );
}