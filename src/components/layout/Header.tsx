import { Navigation } from './Navigation';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';

export function Header() {
  return (
    <header className="">
      {/* Logo Section */}
      <div className="w-full bg-black/50 backdrop-blur-sm border-b border-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-40">
            <Logo/>
            <Navigation className="hidden md:flex justify-center" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}