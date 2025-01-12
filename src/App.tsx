import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Movies } from './pages/Movies';
import { BookedPosters } from './pages/BookedPosters';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminPage } from './pages/AdminPage';
import { MoviePage } from './pages/MoviePage';
import { ContactsPage } from './pages/ContactsPage';
import ProductPage from './pages/ProductPage';
import { AboutUsPage } from './pages/AboutUsPage';

export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Movies />} />
            <Route path="booked" element={<BookedPosters />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="menu" element={<ProductPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
