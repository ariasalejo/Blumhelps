import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowUpRight, BookOpen, ChevronDown, Heart, Headphones, Leaf, Menu, ShieldCheck, X
} from 'lucide-react';
import { CrisisBar } from './crisis/CrisisBar';

const navigation = [
  { label: 'Inicio', path: '/' },
  { label: 'Mi proceso', path: '/recuperacion' },
  { label: 'Mi ruta', path: '/ruta' },
  { label: 'Recursos', path: '/ayuda' },
  { label: 'Voz', path: '/voz' },
  { label: 'Familiares', path: '/familiares' },
  { label: 'Oportunidades', path: '/oportunidades' },
  { label: 'Ciencia', path: '/ciencia' },
  { label: 'Ajustes', path: '/ajustes' }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // El menú móvil sigue la navegación y se puede cerrar con Escape.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);
  const encouragements = [
    { title: 'Vas a salir adelante.', note: 'Un paso a la vez.' },
    { title: 'No tienes que resolverlo todo hoy.', note: 'Empieza por lo posible.' },
    { title: 'Cada pequeño avance cuenta.', note: 'Aunque hoy parezca pequeño.' },
    { title: 'Pedir apoyo también es avanzar.', note: 'No tienes que hacerlo a solas.' },
    { title: 'Tu historia sigue escribiéndose.', note: 'Todavía hay caminos por explorar.' },
    { title: 'Avanza a tu propio ritmo.', note: 'Tu proceso merece respeto.' },
    { title: 'Hoy también puedes empezar.', note: 'Con un paso basta.' }
  ];
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setEncouragementIndex(index => (index + 1) % encouragements.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/ayuda') return ['/ayuda', '/recursos'].includes(location.pathname);
    if (path === '/voz') return location.pathname === '/voz';
    if (path === '/oportunidades') return ['/oportunidades', '/empleo'].includes(location.pathname);
    return location.pathname === path || (path === '/recuperacion' && location.pathname.startsWith('/recuperacion'));
  };

  const navClass = (path: string) =>
    `rounded-full px-3 py-2 text-[12px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a7dfb3] ${isActive(path) ? 'bg-[#16866f] text-white shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white'}`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="bl-app-shell flex min-h-screen flex-col text-[#202d25]">
      <a href="#contenido-principal" className="skip-link">Saltar al contenido principal</a>
      <div id="scrollProgress" className="scroll-progress" aria-hidden="true" />
      <CrisisBar />
      <header className="bl-site-header sticky top-0 z-50 border-b border-white/10 bg-[#073638]/95 text-white shadow-[0_8px_28px_rgba(4,34,35,.18)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-4 py-3 sm:px-7 lg:px-10" aria-label="Navegación principal">
          <Link to="/" onClick={closeMobile} className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78966f]">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/15 bg-[#b9e8be] text-[#124c40] shadow-[0_5px_12px_rgba(0,0,0,.12)] transition-transform group-hover:-rotate-3">
              <Leaf className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <span className="block">
              <span className="block font-display text-[19px] font-semibold leading-5 tracking-[-.04em] text-white">BlumHelps<span className="text-[#a7dfb3]">.</span></span>
              <span className="mt-1 hidden text-[9px] font-semibold tracking-[.08em] text-white/55 sm:block">Bienestar con evidencia</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[.045] p-1 lg:flex">
            {navigation.map(item => (
              <Link key={item.path} to={item.path} className={navClass(item.path)} aria-current={isActive(item.path) ? 'page' : undefined}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <Link to="/ciencia" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
              <ShieldCheck className="h-4 w-4" /> Con evidencia
            </Link>
            <Link to="/recuperacion/valores" className="inline-flex items-center gap-2 rounded-xl bg-[#16866f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#1c9a7f]">
              Empezar <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/recuperacion/valores" onClick={closeMobile} className="hidden rounded-xl bg-[#16866f] px-3.5 py-2.5 text-xs font-bold text-white sm:inline-flex">Empezar</Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/[.05] text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a7dfb3]"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
              aria-controls="blum-mobile-navigation"
              onClick={() => setMobileOpen(value => !value)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="blum-mobile-navigation" className="border-t border-white/10 bg-[#073638] px-4 pb-5 pt-3 shadow-lg lg:hidden">
            <div className="mx-auto grid max-w-[720px] grid-cols-2 gap-2 sm:grid-cols-4">
              {navigation.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${isActive(item.path) ? 'border-[#5fb99d]/30 bg-[#1d6b5b] text-white' : 'border-white/10 bg-white/[.045] text-white/80 hover:bg-white/10'}`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 -rotate-90 ${isActive(item.path) ? 'text-[#547655]' : 'text-[#a1a99d]'}`} />
                </Link>
              ))}
            </div>
            <p className="mx-auto mt-4 flex max-w-[720px] items-center gap-2 text-[11px] leading-5 text-white/60"><BookOpen className="h-3.5 w-3.5 shrink-0" /> Explora a tu ritmo. No necesitas crear una cuenta para empezar.</p>
          </div>
        )}
      </header>

      <main id="contenido-principal" tabIndex={-1} className="flex-grow outline-none">
        {children}
      </main>

      <section aria-label="Un mensaje para seguir adelante" className="bl-hope-band relative isolate overflow-hidden border-y border-white/10 bg-[#0b2925] text-white">
        <div className="bl-hope-band__shine" aria-hidden="true" />
        <div className="bl-hope-band__glow" aria-hidden="true" />
        <div className="mx-auto flex min-h-[94px] max-w-[1320px] items-center justify-center px-5 py-5 text-center sm:px-8" aria-live="polite" aria-atomic="true">
          <div key={encouragementIndex} className="bl-hope-message relative z-10">
            <p className="font-display text-base font-semibold tracking-wide sm:text-xl"><span className="mr-2 text-[#b9e8be]" aria-hidden="true">✦</span>{encouragements[encouragementIndex].title}</p>
            <p className="mt-1 text-sm text-white/70 sm:text-base">{encouragements[encouragementIndex].note}</p>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#203e2d] text-[#f7f5ee]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-40 h-[26rem] w-[26rem] rounded-full border border-white/[.08]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-[18rem] w-[18rem] rounded-full border border-white/[.07]" />
        <div className="relative mx-auto max-w-[1320px] px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-12">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.35fr_.8fr_.8fr]">
            <div className="max-w-sm">
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/10 text-[#dce8ca]"><Leaf className="h-5 w-5" /></span>
                <span className="font-display text-2xl font-semibold tracking-[-.04em]">BlumHelps<span className="text-[#b7cb9b]">.</span></span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-7 text-[#c4d0c0]">Un espacio colombiano de orientación, recursos y pasos posibles. Con evidencia, cuidado y transparencia sobre lo que sabemos y lo que aún falta.</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-2 text-[10px] font-semibold uppercase tracking-[.12em] text-[#d3dec9]"><ShieldCheck className="h-3.5 w-3.5" /> Orientación, no diagnóstico</div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a8bf9c]">Explora</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#d2dbcf]">
                <li><Link to="/recuperacion" className="transition hover:text-white">Mi proceso</Link></li>
                <li><Link to="/ruta" className="transition hover:text-white">Mi ruta de hoy</Link></li>
                <li><Link to="/voz" className="inline-flex items-center gap-2 transition hover:text-white"><Headphones className="h-3.5 w-3.5" /> Biblioteca de voz</Link></li>
                <li><Link to="/oportunidades" className="transition hover:text-white">Oportunidades</Link></li>
                <li><Link to="/ciencia" className="transition hover:text-white">Ciencia y esperanza</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a8bf9c]">Apoyo</h2>
              <ul className="mt-4 space-y-3 text-sm text-[#d2dbcf]">
                <li><Link to="/familiares" className="transition hover:text-white">Para familiares</Link></li>
                <li><Link to="/ayuda" className="transition hover:text-white">Recursos de ayuda</Link></li>
                <li><a href="tel:123" className="transition hover:text-white">Emergencias · 123</a></li>
                <li><a href="https://github.com/ariasalejo/Blumhelps" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition hover:text-white">Código abierto <ArrowUpRight className="h-3 w-3" /></a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-6 text-[11px] leading-5 text-[#aebdaf] md:flex-row md:items-center md:justify-between">
            <p>© 2026 BlumHelps · Hecho con cuidado en Colombia 🇨🇴</p>
            <p className="inline-flex items-center gap-2 text-[#d4b5a6]"><Heart className="h-3.5 w-3.5 fill-current" /> Dedicado a Angela María Londoño</p>
            <p className="max-w-md md:text-right">Si hay peligro inmediato, llama al 123 o acude a urgencias. No somos un servicio de emergencias.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
