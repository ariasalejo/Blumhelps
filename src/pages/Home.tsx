import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, Route, BookOpen, ShieldCheck, Phone, 
  ArrowRight, Sparkles, Lock, Zap, HeartPulse
} from 'lucide-react';
import { recoveryStorage } from '../lib/recovery/storage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function Home() {
  const [hasCompass, setHasCompass] = useState(false);

  useEffect(() => {
    const checkCompass = async () => {
      const values = await recoveryStorage.getValues();
      setHasCompass(!!values && Object.keys(values).length >= 3);
    };
    checkCompass();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] relative overflow-hidden selection:bg-[var(--moss)] selection:text-white">
      {/* FONDO DINÁMICO CÍCLICO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[var(--moss)]/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--gold)]/20 blur-[100px]"
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        
        {/* HERO DE ALTO IMPACTO */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-16 lg:mb-24">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[var(--moss)]/20 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-[var(--moss)]" />
            <span className="text-sm font-semibold text-[var(--ink)] tracking-wide uppercase">Bienestar con evidencia y transparencia</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-display text-4xl sm:text-6xl lg:text-7xl font-light text-[var(--ink)] leading-[1.05] tracking-tight mb-6">
            Bienestar con evidencia, <br />
            <span className="italic font-normal bg-gradient-to-r from-[var(--moss)] via-[#5a7d52] to-[var(--gold)] bg-clip-text text-transparent">
              no con promesas.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Una plataforma colombiana que combina evidencia, valores personales y pasos prácticos. Puedes explorar sin crear una cuenta. En el módulo de recuperación, los registros quedan en el almacenamiento del navegador y no están cifrados con una clave personal.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={hasCompass ? "/recuperacion" : "/recuperacion/valores"} className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[var(--moss)] to-[var(--gold)] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <button className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--ink)] text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                {hasCompass ? "Continuar mi proceso" : "Comenzar mi proceso"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <Link to="/ruta" className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[var(--ink)] border border-gray-200 rounded-2xl font-semibold text-lg shadow-sm hover:shadow-md hover:border-[var(--moss)]/30 hover:-translate-y-1 transition-all duration-300">
              <Route className="w-5 h-5 text-[var(--moss)]" />
              Mi Ruta de 24 horas
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-200/60">
            {[
              { icon: Lock, text: "Sin cuenta obligatoria" },
              { icon: ShieldCheck, text: "Datos locales, con límites claros" },
              { icon: HeartPulse, text: "Hecho en Colombia 🇨🇴" }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <badge.icon className="w-4 h-4 text-[var(--moss)]" />
                {badge.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* BENTO GRID DE FUNCIONALIDADES */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-5xl font-light text-[var(--ink)] mb-4">
              Tu ciclo de recuperación
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No es una línea recta. Es un ecosistema continuo de orientación, acción y reflexión.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
            {/* Tarjeta 1: Brújula */}
            <motion.div variants={itemVariants} className="md:col-span-2 group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[var(--moss)]/5 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--moss)]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--moss)]/10 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[var(--moss)]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--moss)]/20 transition-all duration-300">
                  <Compass className="w-7 h-7 text-[var(--moss)]" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-3">Brújula de Valores</h3>
                <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                  Reconoce qué te importa y reflexiona sobre la distancia entre tus valores y tus acciones. Es una herramienta de orientación personal, no una medición clínica.
                </p>
                <Link to="/recuperacion/valores" className="inline-flex items-center gap-2 text-[var(--moss)] font-semibold hover:gap-3 transition-all">
                  Explorar brújula <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Tarjeta 2: Ruta 24h */}
            <motion.div variants={itemVariants} className="group relative bg-[var(--ink)] rounded-3xl p-8 border border-gray-800 shadow-sm hover:shadow-xl hover:shadow-black/20 transition-all duration-500 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[var(--gold)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
                    <Route className="w-7 h-7 text-[var(--gold)]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-3">Ruta de 24 Horas</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Un plan corto, realista y personalizado para hoy. Pasos pequeños y accionables sin abrumarte.
                  </p>
                </div>
                <Link to="/ruta" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold hover:gap-3 transition-all">
                  Generar plan <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Tarjeta 3: Catálogo con Voz */}
            <motion.div variants={itemVariants} className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[var(--terra)]/5 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--terra)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[var(--terra)]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--terra)]/20 transition-all duration-300">
                  <BookOpen className="w-7 h-7 text-[var(--terra)]" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-3">Catálogo con Voz</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Recursos psicoeducativos con fuentes declaradas. Hay audios Piper pre-generados para parte del catálogo; la lectura integrada de toda la página todavía está en desarrollo.
                </p>
                <Link to="/recuperacion" className="inline-flex items-center gap-2 text-[var(--terra)] font-semibold hover:gap-3 transition-all">
                  Ver recursos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Tarjeta 4: Privacidad */}
            <motion.div variants={itemVariants} className="md:col-span-2 group relative bg-gradient-to-r from-[var(--moss)] to-[#5a7d52] rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-[var(--moss)]/20 transition-all duration-500 overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-white mb-2">Privacidad sin promesas absolutas</h3>
                    <p className="text-white/80 leading-relaxed max-w-lg">
                      Los registros del módulo de recuperación se guardan en el almacenamiento de este navegador. En esta versión no están cifrados con una clave personal. Evita escribir datos identificables si otras personas pueden acceder al dispositivo.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <span className="text-white font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Almacenamiento no cifrado
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* EMERGENCIA ELEGANTE */}
        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto">
          <div className="relative bg-red-50/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-red-100 shadow-sm">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500 rounded-l-3xl" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-red-900 mb-2">¿Necesitas ayuda AHORA?</h3>
                  <p className="text-red-800/80 leading-relaxed">
                    No tienes que resolverlo solo. Si hay peligro inmediato, llama al 123 o acude a urgencias. La cobertura de líneas de apoyo como la 106 puede variar por territorio.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href="tel:106" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-red-600 text-white rounded-xl text-base font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 hover:-translate-y-0.5 transition-all">
                  <Phone className="w-5 h-5" /> Línea 106
                </a>
                <a href="tel:123" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-700 border-2 border-red-100 rounded-xl text-base font-bold hover:bg-red-50 hover:border-red-200 hover:-translate-y-0.5 transition-all">
                  <Phone className="w-5 h-5" /> Emergencias 123
                </a>
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
