import { Link } from 'react-router-dom';
import { Phone, Instagram, Send } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-black/50 border-t border-purple-500/10 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Верхняя секция */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Логотип и описание */}
            <div className="text-center md:text-left">
             <Logo size='6xl' text='Vavilon'/>
              <p className="text-sm text-purple-300 mt-1 px-4">
                Кинотеатр на крыше
              </p>
            </div>

            {/* Навигация */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link to="/" className="text-purple-300 hover:text-purple-200 transition-colors">
                Афиша
              </Link>
              <Link to="/booked" className="text-purple-300 hover:text-purple-200 transition-colors">
                Мои билеты
              </Link>
              <Link to="/menu" className="text-purple-300 hover:text-purple-200 transition-colors">
                Меню
              </Link>
              <Link to="/contacts" className="text-purple-300 hover:text-purple-200 transition-colors">
                Контакты
              </Link>
            </div>

            {/* Контакты */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <a 
                href="tel:+79285439257" 
                className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
              >
                <Phone size={16} />
                <span>+7 (928) 543-92-57</span>
              </a>
              <div className="flex items-center gap-4">
                <a 
                  href="https://www.instagram.com/kinoteatr_vavilon" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://t.me/vavilon_kinoteatr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <Send size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Разделитель */}
          <div className="border-t border-purple-500/10" />

          {/* Нижняя секция */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-purple-400">
            <p>© {new Date().getFullYear()} Все права защищены</p>
          </div>
        </div>
      </div>
    </footer>
  );
}