import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

window.onerror = function(message, source, lineno, colno, error) {
  console.error("!!! GLOBAL RUNTIME ERROR !!!", message, "at", source, ":", lineno, ":", colno, error);
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA Service Worker registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('PWA Service Worker registration failed: ', error);
      });
  });
}
