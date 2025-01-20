import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker зарегистрирован', registration);
  }).catch((error) => {
    console.error('Ошибка регистрации Service Worker:', error);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
);