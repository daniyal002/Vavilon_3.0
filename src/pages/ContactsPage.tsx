import { MapPin, Phone, Mail, Clock, Send, Instagram } from 'lucide-react';

export function ContactsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Контакты
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
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

        <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10">
          <h2 className="text-xl font-semibold text-purple-200 mb-4">
            Как добраться
          </h2>
          <p className="text-purple-300">
            На машине: Удобная парковка прямо у входа в кинотеатр.
            <br />
            На метро: Станция "Примерная", выход №1.
            <br />
            На автобусе: Остановка "Кинотеатр", маршруты 1, 2, 3.
          </p>
        </div>
      </div>

      <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/10 h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5838.081778473799!2d47.439674358146064!3d42.97741230000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x404ea148791b54bf%3A0x96e94a8ff778ee5!2z0JrQuNC90L7RgtC10LDRgtGAINC90LAg0LrRgNGL0YjQtSDQv9C-0LQg0L7RgtC60YDRi9GC0YvQvCDQvdC10LHQvtC8IFZBVklMT04!5e0!3m2!1sru!2sru!4v1735989745283!5m2!1sru!2sru"
          className="w-full h-full rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
