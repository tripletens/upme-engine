import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler to catch and suppress third-party extension script errors (e.g. 200.js / M_ID)
window.addEventListener('unhandledrejection', (event) => {
  if (
    event?.reason?.message?.includes("reading 'M_ID'") ||
    event?.reason?.stack?.includes('200.js')
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (
    event?.message?.includes("reading 'M_ID'") ||
    event?.filename?.includes('200.js')
  ) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
