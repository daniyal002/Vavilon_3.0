import React from 'react';
import { Navigation } from './Navigation';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Logo Section */}
      <div className="w-full bg-black/90 backdrop-blur-sm border-b border-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <Navigation className="hidden md:flex" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}