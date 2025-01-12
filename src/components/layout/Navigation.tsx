import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

const navItems = [
  { id: 'movies', label: 'Афиша', path: '/' },
  { id: 'booked', label: 'Мои билеты', path: '/booked' },
  { id: 'menu', label: 'Меню', path: '/menu' },
  { id: 'about-us', label: 'Фотографии', path: '/about-us' },
  { id: 'contacts', label: 'Контакты', path: '/contacts' },
];

export function Navigation() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="container shadow-lg w-fullbackdrop-blur-sm border-b border-purple-900/20">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between">
          <div>
          <Logo/>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(item => (
              <Link
                key={item.id}
                className="py-4 px-2 text-white font-semibold hover:text-purple-500 transition duration-300"
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
          </div>
        <div className="md:hidden flex items-center">
          <button className="outline-none mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>
    </div>
    <div className={`mobile-menu overflow-hidden transition-max-height duration-300 ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
      <ul className='px-5'>
        {navItems.map(item => (
          <li key={item.id}>
            <Link
              className="block md:hidden text-sm px-2 text-white py-4 hover:text-purple-500 transition duration-300"
              to={item.path}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </nav>
  );
}
