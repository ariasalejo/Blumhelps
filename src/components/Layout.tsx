import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { CrisisBar } from './crisis/CrisisBar';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => 
    location.pathname === path ? "text-[var(--moss)] font-bold" : "text-gray-700 hover:text-[var(--moss)]";

  return (
    <div className="min-h-screen bg-[var(--cream)] flex flex-col">
      {/* CRISIS BAR - SIEMPRE VISIBLE */}
      <CrisisBar />
      {/* Encabezado */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-[40px] z-50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Navegación principal">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-bold text-[var(--moss)] tracking-tight serif">BlumHelps 🌱</span>
          </Link>
          <div className="hidden sm:flex gap-4 text-sm font-medium">
            <Link to="/" className={isActive('/')}>Inicio</Link>
            <Link to="/recuperacion" className={isActive('/recuperacion') || isActive('/ruta') ? "text-[var(--moss)] font-bold" : "text-gray-700 hover:text-[var(--moss)]"}>Mi Ruta</Link>
            <Link to="/ayuda" className={isActive('/ayuda') || isActive('/recursos') ? "text-[var(--moss)] font-bold" : "text-gray-700 hover:text-[var(--moss)]"}>Recursos</Link>
            <Link to="/familiares" className={isActive('/familiares') ? "text-[var(--moss)] font-bold" : "text-gray-700 hover:text-[var(--moss)]"}>Familiares</Link>
            <Link to="/oportunidades" className={isActive('/oportunidades') || isActive('/empleo') ? "text-[var(--moss)] font-bold" : "text-gray-700 hover:text-[var(--moss)]"}>Oportunidades</Link>
            <Link to="/ciencia" className={isActive('/ciencia')}>Ciencia y Esperanza</Link>
            <Link to="/ajustes" className={isActive('/ajustes')}>Ajustes</Link>
          </div>
          <div className="sm:hidden">
            <Link to="/recuperacion" className="px-3 py-1.5 rounded-lg bg-[var(--moss)]/10 text-[var(--moss)] text-sm font-semibold">Mi Ruta</Link>
          </div>
        </nav>
      </header>

      {/* Contenido de la página */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Pie de página ÚNICO y dedicado */}
      <footer className="bg-[var(--ink)] text-[var(--cream)] py-12 mt-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="serif text-xl font-bold mb-3">BlumHelps</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Plataforma de bienestar y recursos verificados para Colombia. 
                Evidencia científica, privacidad local y cero datos inventados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/recuperacion" className="hover:text-[var(--lime)] transition">Recursos Verificados</Link></li>
                <li><Link to="/ciencia" className={isActive('/ciencia')}>Ciencia y Esperanza</Link>
            <Link to="/ayuda" className="hover:text-[var(--lime)] transition">Líneas de Ayuda</Link></li>
                <li><a href="https://github.com/ariasalejo/blumhelps" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--lime)] transition">Código Abierto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Emergencias</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="tel:106" className="hover:text-[var(--lime)] transition font-semibold">Línea 106 · 24/7</a></li>
                <li><a href="tel:123" className="hover:text-[var(--lime)] transition font-semibold">Emergencias 123</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© 2026 BlumHelps · Hecho con 🌱 en Colombia</p>
            
            {/* Dedicatoria especial a tu madre */}
            <div className="flex items-center gap-2 text-[var(--terra)] font-medium">
              <Heart className="w-3 h-3 fill-current" />
              <span>Dedicado a Angela María Londoño</span>
            </div>
            
            <p className="text-center md:text-right max-w-md">
              No es un servicio médico de emergencias. En crisis, llama al 106 o 123.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
