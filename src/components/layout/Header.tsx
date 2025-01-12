import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="bg-black/50">
      {/* Logo Section */}
        <div className="container mx-auto px-4">
            <Navigation />
      </div>
    </header>
  );
}