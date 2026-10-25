import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDownRight, ArrowRight, AudioLines, BookOpen, Check, Compass,
  Heart, Leaf, LockKeyhole, Map, ShieldCheck, Sparkles, Sprout,
  Sun, Users, Waves, Wind
} from 'lucide-react';
import { recoveryStorage } from '../lib/recovery/storage';

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }
};

const pillars = [
  {
    number: '01',
    icon: Compass,
    eyebrow: 'MIRAR HACIA ADENTRO',
    title: 'Encuentra tu norte',
    description: 'Aclara qué te importa y convierte tus valores en decisiones pequeñas, posibles y tuyas.',
    link: '/recuperacion/valores',
    action: 'Abrir mi brújula',
    theme: 'sage'
  },
  {
    number: '02',
    icon: Map,
    eyebrow: 'EMPEZAR POR HOY',
    title: 'Un día a la vez',
    description: 'Organiza un siguiente paso realista. No necesitas resolver toda tu vida esta tarde.',
    link: '/ruta',
    action: 'Crear mi ruta',
    theme: 'night'
  },
  {
    number: '03',
    icon: BookOpen,
    eyebrow: 'APRENDER SIN JUICIOS',
    title: 'Recursos que orientan',
    description: 'Explora materiales psicoeducativos y consulta sus fuentes para seguir aprendiendo.',
    link: '/recuperacion',
    action: 'Explorar recursos',
    theme: 'clay'
  },
  {
    number: '04',
    icon: Users,
    eyebrow: 'NO TIENES QUE HACERLO SOLO',
    title: 'Reconectar con otros',
    description: 'Encuentra orientación para familiares y explora oportunidades sin confundirlas con promesas.',
    link: '/familiares',
    action: 'Ver apoyo para familias',
    theme: 'cream'
  }
];

export function Home() {
  const [hasCompass, setHasCompass] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    recoveryStorage.getValues().then((values) => {
      if (active) setHasCompass(!!values && Object.keys(values).length >= 3);
    }).catch(() => {
      if (active) setHasCompass(false);
    });
    return () => { active = false; };
  }, []);

  const enter = reduceMotion ? {} : { initial: 'hidden', animate: 'visible' };

  return (
    <div className="blum-home relative overflow-hidden bg-[#f7f5ee] text-[#202d25]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-16 h-[32rem] w-[32rem] rounded-full bg-[#dce6d2]/70 blur-3xl" />
        <div className="absolute -left-48 top-[36rem] h-[28rem] w-[28rem] rounded-full bg-[#ead8c9]/50 blur-3xl" />
        <div className="blum-grain absolute inset-0 opacity-30" />
      </div>

      <main className="relative z-10">
        <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
            <motion.div {...enter} variants={reveal} className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d4dfcf] bg-white/75 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#49674e] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#739b70] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#557c59]" />
                </span>
                Una pausa para volver a ti
              </div>

              <h1 className="max-w-[760px] font-display text-[3.25rem] font-medium leading-[.98] tracking-[-.065em] text-[#23342a] sm:text-7xl lg:text-[6.25rem]">
                Tu historia
                <br />
                <span className="font-serif font-normal italic text-[#668364]">no termina</span>
                <br />
                aquí.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#59645b] sm:text-lg">
                Un lugar para ordenar lo que sientes, recuperar dirección y encontrar el siguiente paso. A tu ritmo. Sin juicios. Sin prometer soluciones mágicas.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={hasCompass ? '/recuperacion' : '/recuperacion/valores'}
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#294b37] px-7 py-4 text-base font-semibold text-white shadow-[0_12px_30px_rgba(41,75,55,.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#203d2c] hover:shadow-[0_18px_36px_rgba(41,75,55,.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#294b37]"
                >
                  {hasCompass ? 'Continuar mi proceso' : 'Dar mi primer paso'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/ruta"
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[#d9ded5] bg-white/80 px-7 py-4 text-base font-semibold text-[#294b37] transition duration-300 hover:-translate-y-1 hover:border-[#9db49a] hover:bg-white"
                >
                  <Sun className="h-5 w-5 text-[#b67b4e]" />
                  Mi ruta de hoy
                </Link>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#68736a]">
                <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#648365]" /> Sin cuenta obligatoria</span>
                <span className="inline-flex items-center gap-2"><Sprout className="h-4 w-4 text-[#648365]" /> Hecho en Colombia</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: .97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: .8, delay: .12, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[610px] lg:ml-auto"
            >
              <div className="relative overflow-hidden rounded-[2.25rem] bg-[#203e2d] p-5 shadow-[0_35px_80px_rgba(35,57,40,.18)] sm:rounded-[2.75rem] sm:p-7">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(199,218,164,.25),transparent_38%),linear-gradient(145deg,transparent_25%,rgba(6,22,14,.4))]" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#c8d7bc]">Un espacio para respirar</p>
                    <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-[#fffdf4] sm:text-3xl">Pequeños pasos.<br />Cambios que cuentan.</h2>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#d9e7c5]">
                    <Leaf className="h-5 w-5" />
                  </div>
                </div>

                <div className="relative mt-5 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#b8c9a5]">
                  <svg viewBox="0 0 600 370" role="img" aria-label="Ilustración de un amanecer entre montañas colombianas, símbolo de nuevos comienzos" className="block w-full">
                    <defs>
                      <linearGradient id="blumSky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#dce4c6" />
                        <stop offset="100%" stopColor="#e8c7a5" />
                      </linearGradient>
                      <linearGradient id="blumHill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#76916f" />
                        <stop offset="100%" stopColor="#375d45" />
                      </linearGradient>
                    </defs>
                    <rect width="600" height="370" fill="url(#blumSky)" />
                    <circle cx="405" cy="115" r="55" fill="#f8efcf" opacity=".95" />
                    <circle cx="405" cy="115" r="76" fill="#f8efcf" opacity=".23" />
                    <path d="M0 235 L95 138 L156 194 L248 93 L340 201 L414 149 L510 229 L600 167 L600 370 L0 370Z" fill="#9caf8d" opacity=".75" />
                    <path d="M0 272 L108 190 L190 250 L295 153 L405 251 L500 185 L600 255 L600 370 L0 370Z" fill="#688668" />
                    <path d="M0 302 Q100 252 195 294 T390 287 T600 285 L600 370 L0 370Z" fill="url(#blumHill)" />
                    <path d="M0 330 Q150 288 275 331 T600 316 L600 370 L0 370Z" fill="#294c39" />
                    <path d="M0 355 Q120 331 240 352 T600 347 L600 370 L0 370Z" fill="#1f402f" />
                    <g fill="none" stroke="#f5f0df" strokeWidth="2" opacity=".65" strokeLinecap="round">
                      <path d="M76 76 q12 -8 24 0 q12 -8 24 0" />
                      <path d="M130 100 q8 -5 16 0 q8 -5 16 0" />
                      <path d="M470 72 q10 -6 20 0 q10 -6 20 0" />
                    </g>
                    <g transform="translate(92 247)">
                      <path d="M0 57 Q9 16 20 0 Q32 24 35 57" fill="#e0d4ad" />
                      <path d="M16 58 Q25 28 43 17 Q45 41 32 60" fill="#f0e7ce" />
                      <path d="M18 61 L18 85" stroke="#e9dfc4" strokeWidth="4" strokeLinecap="round" />
                    </g>
                    <g transform="translate(500 236)" fill="#244a35">
                      <path d="M0 96 L17 45 L8 45 L27 0 L47 45 L37 45 L55 96Z" />
                      <path d="M37 96 L52 57 L44 57 L60 22 L76 57 L68 57 L82 96Z" opacity=".7" />
                    </g>
                  </svg>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-5 sm:left-5 sm:right-5">
                    <div className="rounded-2xl border border-white/35 bg-[#f8f5e9]/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                      <p className="text-[9px] font-bold uppercase tracking-[.17em] text-[#6b8067]">Recuerda</p>
                      <p className="mt-1 text-sm font-semibold text-[#2d4835]">No tienes que hacerlo todo hoy.</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f5e9] text-[#355b41] shadow-lg">
                      <Waves className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-5 grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/10 bg-white/[.055] py-4">
                  <div className="px-2 text-center">
                    <Compass className="mx-auto h-4 w-4 text-[#d4dfbe]" />
                    <p className="mt-2 text-[10px] font-semibold text-white sm:text-xs">Reconocer</p>
                  </div>
                  <div className="px-2 text-center">
                    <Wind className="mx-auto h-4 w-4 text-[#d4dfbe]" />
                    <p className="mt-2 text-[10px] font-semibold text-white sm:text-xs">Respirar</p>
                  </div>
                  <div className="px-2 text-center">
                    <ArrowDownRight className="mx-auto h-4 w-4 text-[#d4dfbe]" />
                    <p className="mt-2 text-[10px] font-semibold text-white sm:text-xs">Avanzar</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 top-[43%] hidden -translate-x-1/4 rounded-2xl border border-[#e6e4d9] bg-white px-4 py-3 shadow-[0_16px_35px_rgba(37,51,38,.12)] sm:block lg:-left-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0e7d7] text-[#946b49]"><Heart className="h-4 w-4" /></div>
                  <div>
                    <p className="text-xs font-bold text-[#2c3e30]">A tu propio ritmo</p>
                    <p className="mt-0.5 text-[10px] text-[#7b8278]">Sin comparaciones</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 right-6 hidden items-center gap-2 rounded-full border border-[#dce4d5] bg-[#f9f8f0] px-4 py-2.5 text-xs font-semibold text-[#47634a] shadow-lg sm:flex">
                <Check className="h-4 w-4" /> Cada paso merece respeto
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative border-y border-[#e4e3d8] bg-[#efeee5]/80">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-5 py-7 sm:grid-cols-3 sm:px-8 lg:px-12">
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#547456] shadow-sm"><ShieldCheck className="h-5 w-5" /></div>
              <div><p className="text-sm font-bold text-[#2c3e30]">Transparencia primero</p><p className="mt-1 text-xs leading-5 text-[#6e786d]">Fuentes y límites explicados, sin promesas absolutas.</p></div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#547456] shadow-sm"><LockKeyhole className="h-5 w-5" /></div>
              <div><p className="text-sm font-bold text-[#2c3e30]">Explora sin registrarte</p><p className="mt-1 text-xs leading-5 text-[#6e786d]">Los registros personales actuales no están cifrados con una clave propia.</p></div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#547456] shadow-sm"><Sparkles className="h-5 w-5" /></div>
              <div><p className="text-sm font-bold text-[#2c3e30]">Un camino, no una carrera</p><p className="mt-1 text-xs leading-5 text-[#6e786d]">Herramientas de orientación; no sustituyen atención profesional.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <motion.div
            initial={reduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={reveal}
            className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#6d8a6c]">Tu espacio, tus decisiones</p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-tight tracking-[-.045em] text-[#26392c] sm:text-5xl">Empieza por donde<br className="hidden sm:block" /> te resulte posible.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#687268]">No hay una única puerta de entrada. Elige la herramienta que mejor encaje con lo que necesitas hoy.</p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pillars.map((item, index) => {
              const Icon = item.icon;
              const dark = item.theme === 'night';
              const sage = item.theme === 'sage';
              const clay = item.theme === 'clay';
              return (
                <motion.article
                  key={item.number}
                  initial={reduceMotion ? false : 'hidden'}
                  whileInView="visible"
                  viewport={{ once: true, margin: '-45px' }}
                  variants={reveal}
                  transition={{ delay: index * .07 }}
                  className={`group relative flex min-h-[330px] flex-col overflow-hidden rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(36,54,39,.09)] sm:p-7 ${dark ? 'border-[#294b37] bg-[#294b37] text-white' : sage ? 'border-[#dce5d7] bg-[#e5ecdf] text-[#26392c]' : clay ? 'border-[#e8d9cc] bg-[#f0e2d6] text-[#43352b]' : 'border-[#e5e4d9] bg-white/85 text-[#26392c]'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? 'bg-white/10 text-[#e0e9cf]' : clay ? 'bg-white/70 text-[#a86c4a]' : 'bg-white/80 text-[#527453]'}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <span className={`font-serif text-2xl italic ${dark ? 'text-white/35' : 'text-[#7a8a76]/60'}`}>{item.number}</span>
                  </div>
                  <p className={`mt-7 text-[9px] font-bold tracking-[.19em] ${dark ? 'text-[#cbd9bd]' : 'text-[#72836f]'}`}>{item.eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium leading-tight tracking-[-.035em]">{item.title}</h3>
                  <p className={`mt-3 flex-1 text-sm leading-6 ${dark ? 'text-white/75' : 'text-[#667166]'}`}>{item.description}</p>
                  <Link to={item.link} className={`mt-6 inline-flex items-center gap-2 text-sm font-bold transition-all group-hover:gap-3 ${dark ? 'text-[#e0e9cf]' : 'text-[#426849'}`}>
                    {item.action}<ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#e6e9dc] px-6 py-8 sm:rounded-[2.5rem] sm:px-10 sm:py-12 lg:px-14">
            <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border-[1px] border-[#a8b8a0]/40 sm:right-12 sm:top-1/2 sm:-translate-y-1/2" />
            <div className="absolute -right-1 top-0 h-56 w-56 rounded-full border-[1px] border-[#a8b8a0]/30 sm:right-24 sm:top-1/2 sm:-translate-y-1/2" />
            <div className="relative z-10 grid items-center gap-7 md:grid-cols-[1fr_auto]">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#648064]">La esperanza también necesita información</p>
                <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-[-.04em] text-[#2b4230] sm:text-4xl">Ciencia, recursos y decisiones con los pies en la tierra.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#5e6e5e]">Consulta qué dicen las fuentes, qué límites tienen los datos y qué puedes explorar a continuación. Una herramienta de apoyo no tiene que fingir que tiene todas las respuestas.</p>
              </div>
              <Link to="/ciencia" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#294b37] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#203d2c]">
                Explorar ciencia y esperanza <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20">
          <div className="flex flex-col gap-5 rounded-[1.75rem] border border-[#ead5d1] bg-[#fbefec] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4d9d4] text-[#9a5146]"><Heart className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-semibold text-[#693c36]">¿Necesitas apoyo inmediato?</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#835d56]">Si hay peligro inmediato, llama al 123 o acude a urgencias. La disponibilidad de líneas de apoyo como la 106 puede variar según el territorio.</p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <a href="tel:106" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e2bdb5] bg-white px-5 py-3 text-sm font-bold text-[#804b43] transition hover:bg-[#fff9f7]">Línea 106</a>
              <a href="tel:123" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#8f4037] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#77342d]">Emergencias 123</a>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .blum-home { isolation: isolate; }
        .blum-grain { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='.12'/%3E%3C/svg%3E"); }
        @media (prefers-reduced-motion: reduce) {
          .blum-home *, .blum-home *::before, .blum-home *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
}
