import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigation } from './Navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="md:hidden  ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-[160 px] left-0 right-0 z-[100] bg-black/50 backdrop-blur-lg border-t border-purple-900/50 animate-slideDown">
          <div className="container mx-auto px-4 py-4">
            <Navigation vertical className="flex justify-center" onItemClick={handleClose} />
          </div>
        </div>
      )}
    </div>
  );
}