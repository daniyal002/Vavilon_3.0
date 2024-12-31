import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        <Outlet />
      </main>
    </div>
  );
}