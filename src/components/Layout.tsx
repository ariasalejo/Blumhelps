import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => 
    location.pathname === path ? "text-emerald-700 font-bold" : "text-gray-600 hover:text-emerald-600";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navegación */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between" aria-label="Navegación principal">
          <Link to="/" className="text-2xl font-bold text-emerald-800 tracking-tight">
            BlumHelps 🌱
          </Link>
          <div className="flex gap-6 text-sm">
            <Link to="/" className={isActive('/')}>Inicio</Link>
            <Link to="/recuperacion" className={isActive('/recuperacion')}>Recuperación</Link>
            <Link to="/ayuda" className={isActive('/ayuda')}>Ayuda</Link>
            <Link to="/ajustes" className={isActive('/ajustes')}>Ajustes</Link>
          </div>
        </nav>
      </header>

      {/* Contenido de la página */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Pie de página */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm">
          <p>© 2026 BlumHelps · Hecho con 🌱 en Colombia</p>
          <p className="mt-2 text-xs">No es un servicio médico de emergencias. En crisis, llama al 106 o 123.</p>
        </div>
      </footer>
    </div>
  );
}
