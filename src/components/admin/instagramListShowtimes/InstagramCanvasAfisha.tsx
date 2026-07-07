import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { baseURL } from "../../../api/axios";
import { formatTime } from "../../../utils/formatters";
import { ShowTime } from "../../../types/showtime";
import { Theater } from "../../../types/theater";

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 2000;

export function InstagramCanvasAfisha({
  showTimes,
  selectedDate,
  refetch,
  theater,
}: {
  showTimes: ShowTime[];
  selectedDate: string;
  refetch: () => void;
  theater: Theater;
}) {
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wrapText = (
      context: CanvasRenderingContext2D,
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      lineHeight: number,
    ) => {
      const words = text.split(" ");
      let line = "";
      let testLine = "";
      let lineCount = 0;
      let currentY = y;

      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + " ";
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + " ";
          currentY += lineHeight;
          lineCount++;
          // Ограничим заголовок максимум двумя строками для красоты
          if (lineCount >= 2) return currentY;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
      return currentY + lineHeight;
    };

    ctx.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // 1. Фон
    const gradient = ctx.createLinearGradient(0, 0, 0, STORY_HEIGHT);
    gradient.addColorStop(0, "#2b034e");
    gradient.addColorStop(1, "#5c1d9b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

    // 2. Шапка

    // Плашка даты (ИСПРАВЛЕНО)
    const dateText = format(new Date(selectedDate), "d MMMM", {
      locale: ru,
    }).toUpperCase();
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.fillText("РАСПИСАНИЕ НА", STORY_WIDTH - 370, 110);

    ctx.font = "bold 40px sans-serif";
    const dateWidth = ctx.measureText(dateText).width + 45;
    ctx.fillStyle = "#ffffff";
    drawRoundedRect(ctx, STORY_WIDTH - 60 - dateWidth, 70, dateWidth, 50, 15);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.textBaseline = "middle";
    ctx.fillText(dateText, STORY_WIDTH - 85, 98);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("VAVILON", 60, 190);

    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(theater.name.toUpperCase(), 480, 175);

    const LogoImg = await loadImage(`/icon/logo.svg`);
    ctx.save();
    drawRoundedRect(ctx, 90, 70, 160, 210, 20);
    ctx.clip();
    ctx.drawImage(LogoImg, 90, 70, 100, 80);
    ctx.restore();

    // 3. Динамический расчет списка сеансов
    const startY = 250;
    const footerHeight = 450;
    const availableHeight = STORY_HEIGHT - startY - footerHeight;

    // Если сеансов много, уменьшаем их высоту
    const count = showTimes.length;
    let itemHeight = 210;
    let gap = 35;

    const ClockImg = await loadImage(`/icon/clock.svg`);

    if (count * (itemHeight + gap) > availableHeight) {
      const totalStep = availableHeight / count;
      itemHeight = totalStep * 0.85;
      gap = totalStep * 0.15;
    }

    let index = 0;
    for (const st of showTimes) {
      const y = startY + index * (itemHeight + gap);

      // Карточка
      ctx.fillStyle = "#ffffff";
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
        ctx.fillStyle = "#333";
        ctx.fillRect(60, y, 160, itemHeight);
      }

      // Номер (на карточке)
      ctx.fillStyle = "#9333eb8f";
      drawRoundedRect(ctx, 30, y - 0, 30, 40, 5);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText((index + 1).toString(), 45, y + 30);

      // Инфо
      ctx.textAlign = "left";
      ctx.fillStyle = "#460089";

      const titleFontSize = Math.min(38, itemHeight / 6);
      ctx.font = `bold ${titleFontSize}px sans-serif`;

      const titleX = 240;
      const titleY = y + itemHeight * 0.25; // Начальная точка чуть выше
      const maxWidth = STORY_WIDTH - 215 - titleX - 20; // Расстояние до блоков времени
      const lineHeight = titleFontSize * 1.1;

      // Рисуем заголовок и получаем Y координату конца текста
      const nextY = wrapText(
        ctx,
        st.movie.title.toUpperCase(),
        titleX,
        titleY,
        maxWidth - 80,
        lineHeight,
      );

      // Жанры (рисуем относительно того, где закончился заголовок)
      ctx.fillStyle = "#000000";
      const genreFontSize = Math.min(30, itemHeight / 8);
      ctx.font = `${genreFontSize}px sans-serif`;

      const genres =
        st.movie.genres
          ?.slice(0, 2)
          .map((g: any) => g.name)
          .join(", ") || "";
      const genreText = `${genres} | ${st.movie.year}г`;
      ctx.fillText(genreText, titleX, nextY + 5);

      // Рейтинг (чуть ниже жанров)
      ctx.fillStyle = "#eab308";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(`★ ${st.movie.rating}`, titleX, nextY + genreFontSize + 25);

      // Блоки справа (Время и Цена)
      const rightX = STORY_WIDTH - 215;
      const blockWidth = 150;

      // 1. Блок ВРЕМЕНИ (Делаем выше и шрифт крупнее)
      const timeBoxHeight = itemHeight * 0.5; // Увеличено с 0.33
      const timeBoxY = y + itemHeight * 0.08; // Смещаем чуть выше к краю

      ctx.fillStyle = "#460089";
      drawRoundedRect(
        ctx,
        rightX,
        y + itemHeight * 0.05,
        blockWidth,
        itemHeight * 0.33,
        15,
      );
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.min(42, itemHeight / 5)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(
        formatTime(st.startTime as unknown as string),
        rightX + blockWidth / 2,
        timeBoxY + timeBoxHeight / 2 - 10,
      );

      // 2. Блок ЦЕНЫ (Делаем ниже и компактнее, увеличивая отступ)
      const priceBoxHeight = itemHeight * 0.25; // Уменьшено с 0.3
      const priceBoxY = y + itemHeight * 0.65; // Создаем большой разрыв (0.45 + 0.08 = 0.53. Отступ будет 0.12 от itemHeight)

      // ИКОНКА ЧАСОВ
      const clockSize = Math.min(64, itemHeight / 4);
      const clockX = rightX - 60;
      const clockY = timeBoxY + 2;

      ctx.save();
      ctx.drawImage(ClockImg, clockX, clockY, clockSize, clockSize);
      ctx.restore();

      ctx.fillStyle = "#460089";
      drawRoundedRect(
        ctx,
        rightX + 35,
        priceBoxY,
        blockWidth / 1.3,
        priceBoxHeight + 10,
        15,
      );
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = `${Math.min(32, itemHeight / 6)}px sans-serif`;
      ctx.fillText(
        `${st.price} ₽`,
        rightX + blockWidth / 1.6,
        priceBoxY + priceBoxHeight / 2 + 15,
      );

      // Сброс настроек текста для следующей итерации
      ctx.textBaseline = "alphabetic";
      index++;
    }

    // 4. Футер
    const footerStartY = STORY_HEIGHT - 420;
    // ctx.fillStyle = '#0d0517'; // Отсечка
    // ctx.fillRect(0, footerStartY, STORY_WIDTH, 420);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "32px sans-serif";
    ctx.fillText(
      "БРОНЬ БИЛЕТОВ ПО ССЫЛКЕ ИЛИ НОМЕРУ",
      STORY_WIDTH / 2,
      footerStartY + 60,
    );

    // Ссылка-стикер
    const linkText = "Kinovavilon.ru";
    ctx.font = "bold 42px sans-serif";
    const linkTextWidth = ctx.measureText(linkText).width;
    const pillWidth = linkTextWidth + 140;
    const pillX = 60;
    const pillY = footerStartY + 120;

    ctx.fillStyle = "#ffffff";
    drawRoundedRect(ctx, pillX, pillY, pillWidth, 110, 55);
    ctx.fill();

    ctx.fillStyle = "#0088ff";
    ctx.font = "50px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🔗", pillX + 35, pillY + 72);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(linkText, pillX + 110, pillY + 72);

    // Телефон
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("+7(928)543-92-57", STORY_WIDTH - 60, pillY + 72);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.fillText(
      "БРОНЬ БЕСПЛАТНАЯ, ОПЛАТА ПРОИЗВОДИТСЯ НА МЕСТЕ",
      STORY_WIDTH / 2,
      STORY_HEIGHT - 80,
    );
  };

  function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
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

  const redrawCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Полный сброс canvas (важно)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await drawAfisha();
  };

  useEffect(() => {
    redrawCanvas();
  }, [showTimes, selectedDate]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="flex flex-col items-center p-8  rounded-3xl">
      <div className="mb-6 flex gap-4 items-center w-full max-w-md bg-black/20 p-4 rounded-xl">
        <label className="text-white text-xs uppercase">Масштаб:</label>
        <input
          type="range"
          min="0.2"
          max="0.6"
          step="0.05"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="flex-1 accent-purple-500"
        />
      </div>
      <div
        className="shadow-2xl border-[12px] border-black rounded-[3.5rem] overflow-hidden"
        style={{ width: STORY_WIDTH * zoom, height: STORY_HEIGHT * zoom }}
      >
        <canvas
          ref={canvasRef}
          width={STORY_WIDTH}
          height={STORY_HEIGHT}
          className="w-full h-full"
        />
      </div>
      <button
        onClick={() => {
          const link = document.createElement("a");
          link.download = `afisha-${selectedDate}.png`;
          link.href = canvasRef.current?.toDataURL("image/png") || "";
          link.click();
        }}
        className="mt-8 px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
      >
        📥 СКАЧАТЬ ДЛЯ INSTAGRAM
      </button>
      <button
        onClick={redrawCanvas}
        className="mt-4 px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl"
      >
        🔄 ОБНОВИТЬ АФИШУ
      </button>
    </div>
  );
}
