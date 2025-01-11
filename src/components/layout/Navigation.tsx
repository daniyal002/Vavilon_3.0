import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const navItems = [
  { id: 'movies', label: 'Афиша', path: '/' },
  { id: 'booked', label: 'Мои билеты', path: '/booked' },
  { id: 'menu', label: 'Меню', path: '/menu' },
  { id: 'contacts', label: 'Контакты', path: '/contacts' },
];

interface NavigationProps {
  className?: string;
  vertical?: boolean;
  onItemClick?: () => void;
}

export function Navigation({
  className,
  onItemClick,
}: NavigationProps) {
  return (
    <nav className={cn('relative', className)}>
      <ul className={cn('flex gap-8', 'flex-row')}>
        {navItems.map((item) => (
          <li key={item.id} className="relative">
            <NavLink
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  'py-2 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'text-purple-400'
                    : 'text-gray-400 hover:text-purple-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 animate-slideIn" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
