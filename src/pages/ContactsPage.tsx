import { MapPin, Phone, Instagram, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactsPage() {
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
      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        О нас
      </h2>
      <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Фотографии
      </h2>
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

      <h2 className="text-1xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Контакты
      </h2>

      <div className="grid md:grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10">
            <h2 className="text-xl font-semibold text-purple-200 mb-4">
              Как с нами связаться
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <a
                  href="tel:+79285439257"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  +7 (928) 543-92-57
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                <span className="text-purple-300">
                  просп. Али-Гаджи Акушинского, 119, Махачкала
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-purple-400" />
                <a
                  href="https://www.instagram.com/kinoteatr_vavilon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  @kinoteatr_vavilon
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Send className="w-5 h-5 text-purple-400" />
                <a
                  href="https://t.me/vavilon_kinoteatr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  @vavilon_kinoteatr
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 h-[400px]">
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3Af618ca357d4d11049ffd45737a36e8c5de8d603c8c81fd368f77a37d877049b1&amp;source=constructor"
          width="100%"
          height="350"
          className="rounded-xl"
          frameBorder={0}
        ></iframe>
      </div>
    </div>
  );
}
