import { useState } from 'react';

export function AboutUsPage() {
  const images = [
    'https://avatars.mds.yandex.net/get-altay/11748256/2a00000190ba7ba5c05aa2deafa828ecf9a6/XXXL',
    'https://avatars.mds.yandex.net/get-altay/13287730/2a00000190ba7d10bf12ea77b96a859b6f32/XXXL',
    'https://avatars.mds.yandex.net/get-altay/5245944/2a0000017be51be1a10f7d175fafa7a4ee21/XXXL',
    // Замените на свои URL изображений
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return; // Если анимация идет, не переключаем слайд
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500); // Время анимации
  };

  const prevSlide = () => {
    if (isAnimating) return; // Если анимация идет, не переключаем слайд
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setTimeout(() => setIsAnimating(false), 500); // Время анимации
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Фотографии
      </h1>
      {/* Слайдер для фотографий */}

      <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 w-full">
        <div className="relative">
          <img
            src={images[currentIndex]}
            alt={`Слайд ${currentIndex + 1}`}
            className={`w-full md:w-1/2 mx-auto object-cover rounded-md transition-transform duration-500 ${
              isAnimating ? 'transform scale-95' : 'transform scale-100'
            }`}
          />
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white rounded-md p-2 hover:bg-purple-500 transition-colors cursor-pointer"
          >
            &#10094; {/* Стрелка влево */}
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white rounded-md p-2 hover:bg-purple-500 transition-colors cursor-pointer"
          >
            &#10095; {/* Стрелка вправо */}
          </button>
        </div>

        {/* Индикаторы активного изображения */}
        <div className="flex justify-center mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full ${
                currentIndex === index ? 'bg-purple-400' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
