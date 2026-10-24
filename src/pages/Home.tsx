import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';
import { HelpingHands } from '../components/illustrations/HelpingHands';

export function Home() {
  return (
    <div className="min-h-screen">
      <a href="#main" className="skip-link">Saltar al contenido principal</a>
      
      <main id="main">
        {/* HERO - CENTRO DE AYUDA SPLIT */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 sm:pb-14">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--moss)]/10 text-[var(--moss)] text-xs font-semibold mb-5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Anónimo • Sin registro • Sin juicios • Medellín & Antioquia</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight serif leading-[1.05]">
                  Centro de Ayuda para salir adelante
                </h1>
                <p className="mt-5 text-lg sm:text-xl text-gray-700 leading-relaxed">
                  ¿Necesitas ayuda ahora, quieres cambiar o quieres apoyar a alguien? 
                  Da tu <strong>primer paso</strong> hoy. Pequeño. Realista. Sin presiones.
                </p>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <HelpingHands className="w-full max-w-md drop-shadow-sm" />
              </div>
            </div>

            {/* ACCIÓN DIRECTA - CRISIS PRIMERO */}
            <div className="mt-8 grid md:grid-cols-2 gap-4 max-w-3xl">
              <Link 
                to="/recuperacion" 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 text-white p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
                      <Phone className="w-4 h-4" />
                      <span>URGENTE</span>
                    </div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold">NECESITO AYUDA AHORA</h2>
                    <p className="mt-2 text-white/90">Genera tu ruta de 24 horas o llama directo al 106</p>
                  </div>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                to="/recuperacion" 
                className="group rounded-2xl border-2 border-[var(--moss)]/30 bg-white p-6 sm:p-7 hover:border-[var(--moss)] hover:shadow-lg transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--moss)]">
                      <HeartHandshake className="w-4 h-4" />
                      <span>ACOMPAÑAR</span>
                    </div>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">QUIERO AYUDAR A ALGUIEN</h2>
                    <p className="mt-2 text-gray-600">Guía práctica para familiares y acompañantes</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[var(--moss)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* LÍNEAS DIRECTAS */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="tel:106" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-[var(--moss)] transition shadow-sm">
                <Phone className="w-4 h-4 text-[var(--moss)]" />
                <span className="font-semibold">Llamar al 106</span>
                <span className="text-xs text-gray-500">24/7 • Anónimo</span>
              </a>
              <a href="tel:123" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-red-500 transition shadow-sm">
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-semibold">Emergencias 123</span>
                <span className="text-xs text-gray-500">24/7</span>
              </a>
            </div>
          </div>
        </section>

        {/* MENSAJE HUMANO */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold serif">Pedir ayuda es valentía</h3>
            <p className="mt-2 text-gray-700 leading-relaxed max-w-3xl">
              No tienes que resolverlo todo de golpe. Un solo paso puede cambiar el rumbo. 
              Este sitio es completamente anónimo, sin registro y enfocado <strong>Medellín y Antioquia</strong>, pero abierto a todo Colombia.
            </p>
            <p className="mt-3 text-sm text-gray-500">
              <strong>Importante:</strong> BlumHelps no es un servicio médico de emergencias ni reemplaza atención clínica. En riesgo inmediato llama al 106 o 123.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
