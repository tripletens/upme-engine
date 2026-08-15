import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress third-party Chrome extension injected script errors (e.g. 200.js M_ID message handlers)
window.addEventListener('unhandledrejection', (event) => {
  if (
    event?.reason?.message?.includes('M_ID') ||
    event?.reason?.stack?.includes('200.js')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

window.addEventListener('error', (event) => {
  if (
    event?.message?.includes('M_ID') ||
    event?.filename?.includes('200.js')
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
