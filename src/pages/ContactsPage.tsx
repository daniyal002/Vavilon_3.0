import { MapPin, Phone, Instagram, Send } from 'lucide-react';

export function ContactsPage() {
 
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Контакты
      </h1>

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
