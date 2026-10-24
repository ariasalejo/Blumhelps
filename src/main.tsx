import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './state/app';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuickExit } from './components/security/QuickExit';
import './index.css';

function ScrollProgress() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const progress = document.getElementById('scrollProgress');
      if (progress) {
        progress.style.transform = `scaleX(${scrolled})`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <ScrollProgress />
        <App />
        <QuickExit />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
