import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Navigation } from './Navigation';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div 
          className="fixed top-0 right-0 bottom-0 w-[80%] z-[100] 
          bg-black/90 backdrop-blur-lg 
          border-l border-purple-900/50 
          animate-slideFromRight 
          overflow-y-auto"
        >
          <div className="container mx-auto px-4 py-8 h-full">
            <Navigation
            />
          </div>
        </div>
      )}
    </div>
  );
}