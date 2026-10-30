import React, { useEffect, useMemo, useState } from 'react';
import './home-editorial.css';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity, ArrowRight, BookOpen, Briefcase, Volume2,
  Check, CheckCircle2, Compass, Heart, HeartHandshake, Leaf,
  LockKeyhole, MessageCircle, Mountain, ShieldCheck, Sparkles,
  Sprout, Sun, Users, Wind
} from 'lucide-react';
import { recoveryStorage } from '../lib/recovery/storage';
import type { JournalEntry, MoodLabel } from '../lib/recovery/types';

type Focus = 'paz' | 'accion' | 'vinculo' | 'progreso';

const moods: Array<{ value: MoodLabel; label: string; face: string; score: number }> = [
  { value: 'muy_bajo', label: 'Muy difícil', face: '☁️', score: 1 },
  { value: 'bajo', label: 'Difícil', face: '🌧️', score: 2 },
  { value: 'neutral', label: 'Así así', face: '🌤️', score: 3 },
  { value: 'bien', label: 'Bien', face: '🌿', score: 4 },
  { value: 'muy_bien', label: 'Muy bien', face: '☀️', score: 5 },
];

const focusOptions: Array<{ value: Focus; label: string; sub: string }> = [
  { value: 'paz', label: 'Paz', sub: 'Cuidar mi calma' },
  { value: 'accion', label: 'Acción', sub: 'Dar un paso' },
  { value: 'vinculo', label: 'Vínculo', sub: 'Pedir o dar apoyo' },
  { value: 'progreso', label: 'Progreso', sub: 'Reconocer lo vivido' },
];

const features = [
  {
    number: '01',
    tag: 'AUTOCONOCIMIENTO',
    title: 'Brújula de valores',
    description: 'Reconoce qué te importa y transforma tus valores en decisiones pequeñas y posibles.',
    action: 'Explorar mi brújula',
    href: '/recuperacion/valores',
    icon: Compass,
    image: 'brujula-valores.svg',
    art: 'from-[#e9dfc5] via-[#b5c5a6] to-[#597c66]',
    iconTone: 'text-[#264c3d]',
  },
  {
    number: '02',
    tag: 'ACCIÓN PRÁCTICA',
    title: 'Ruta de 24 horas',
    description: 'Organiza un plan realista para hoy. Sin tener que resolverlo todo de una vez.',
    action: 'Crear mi ruta',
    href: '/ruta',
    icon: Sun,
    image: 'ruta-24-horas.svg',
    art: 'from-[#f4d9b5] via-[#d9aa80] to-[#496e69]',
    iconTone: 'text-[#6f482e]',
  },
  {
    number: '03',
    tag: 'APRENDIZAJE',
    title: 'Recursos con voz',
    description: 'Explora materiales psicoeducativos y consulta sus fuentes y límites.',
    action: 'Ver recursos',
    href: '/voz',
    icon: Volume2,
    image: 'voz-aprendizaje.svg',
    art: 'from-[#d5d9f0] via-[#a1b9c5] to-[#426b72]',
    iconTone: 'text-[#243f56]',
  },
  {
    number: '04',
    tag: 'VÍNCULOS SANOS',
    title: 'Apoyo para familiares',
    description: 'Orientación para acompañar con respeto, límites y escucha, sin juicios.',
    action: 'Explorar el apoyo',
    href: '/familiares',
    icon: HeartHandshake,
    image: 'vinculos-familiares.svg',
    art: 'from-[#e8d4c4] via-[#c7b9a3] to-[#758e79]',
    iconTone: 'text-[#4d4939]',
  },
];

const cycle = [
  { key: 'paz' as const, label: 'Paz', subtitle: 'Calma interior', icon: Wind, href: '/recuperacion/valores' },
  { key: 'accion' as const, label: 'Acción', subtitle: 'Pasos pequeños', icon: Sprout, href: '/ruta' },
  { key: 'vinculo' as const, label: 'Vínculo', subtitle: 'Con tu entorno', icon: HeartHandshake, href: '/familiares' },
  { key: 'progreso' as const, label: 'Progreso', subtitle: 'Tu propio camino', icon: Activity, href: '/recuperacion' },
];

const scoreByMood: Record<MoodLabel, number> = {
  muy_bajo: 1,
  bajo: 2,
  neutral: 3,
  bien: 4,
  muy_bien: 5,
};

function dayKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function greetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function Home() {
  const reduceMotion = useReducedMotion();
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [hasValues, setHasValues] = useState(false);
  const [mood, setMood] = useState<MoodLabel>('neutral');
  const [focus, setFocus] = useState<Focus>('accion');
  const [note, setNote] = useState('');
  const [localNoticeAccepted, setLocalNoticeAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loadReady, setLoadReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      recoveryStorage.getJournal(),
      recoveryStorage.getCompleted(),
      recoveryStorage.getValues(),
    ]).then(([entries, done, values]) => {
      if (!active) return;
      setJournal(entries);
      setCompleted(done);
      setHasValues(!!values && Object.keys(values).length >= 3);
      setLoadReady(true);
    }).catch(() => {
      if (active) setLoadReady(true);
    });
    return () => { active = false; };
  }, []);

  const checkIns = useMemo(
    () => journal.filter((entry) => entry.etiquetas?.includes('blum-home-checkin')),
    [journal],
  );

  const lastSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const key = dayKey(date);
      const entries = checkIns.filter((entry) => dayKey(new Date(entry.createdAt)) === key);
      const average = entries.length
        ? entries.reduce((sum, entry) => sum + scoreByMood[entry.animo], 0) / entries.length
        : null;
      return {
        key,
        label: date.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
        shortDate: date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }).replace('.', ''),
        count: entries.length,
        average,
      };
    });
  }, [checkIns]);

  const lastCheckIn = checkIns[0];
  const lastMood = lastCheckIn ? moods.find((item) => item.value === lastCheckIn.animo) : undefined;

  const saveCheckIn = async () => {
    if (!localNoticeAccepted) {
      setSaveMessage('Lee y acepta la nota de almacenamiento local antes de guardar.');
      return;
    }
    setSaving(true);
    setSaveMessage('');
    const entry: JournalEntry = {
      id: `home-checkin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      texto: note.trim() || 'Registro breve desde el inicio de BlumHelps.',
      animo: mood,
      etiquetas: ['blum-home-checkin', focus],
    };
    try {
      const entries = await recoveryStorage.addJournalEntry(entry);
      setJournal(entries);
      setNote('');
      setLocalNoticeAccepted(false);
      setSaveMessage('Registro añadido a este navegador. Puedes verlo reflejado en la gráfica.');
    } catch {
      setSaveMessage('No pudimos confirmar el guardado. Revisa el almacenamiento del navegador.');
    } finally {
      setSaving(false);
    }
  };

  const totalMoodDays = checkIns.length;
  const heroBackground = `linear-gradient(90deg,rgba(5,31,52,.58),rgba(5,31,52,.08)),url("https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=88"),url("${import.meta.env.BASE_URL}images/blum-hero.svg")`;

  return (
    <div className="blum-home min-w-0 overflow-hidden bg-[#f3f2e9] text-[#102f30]">
      {/* HERO — paisaje original vectorial, sin texto incrustado ni dependencia de servicios externos */}
      <section
        className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-[#083538] bg-cover bg-center text-white sm:min-h-[660px] lg:min-h-[700px]"
        style={{ backgroundImage: heroBackground }}
        aria-labelledby="home-title"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062b2e]/95 via-[#062f30]/75 to-[#062f30]/10" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#05282b]/75 via-transparent to-[#082b31]/10" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(circle_at_75%_35%,rgba(255,236,193,.7)_0,transparent_30%)]" />

        <div className="relative mx-auto grid w-full max-w-[1500px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.04fr_.8fr] lg:gap-16 lg:px-12 lg:py-24">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-[780px]"
          >
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[#082e31]/55 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.19em] text-[#d6e9d0] shadow-lg backdrop-blur-md sm:text-xs">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute h-full w-full animate-ping rounded-full bg-[#92d5a8] opacity-40" /><span className="relative h-2.5 w-2.5 rounded-full bg-[#8be0a9]" /></span>
              Acompañamiento psicoeducativo
            </div>
            <p className="mb-3 text-sm font-medium tracking-[.11em] text-[#e3d2ae]">{greetingTime()}. Este espacio es tuyo.</p>
            <h1 id="home-title" className="max-w-[800px] font-display text-[3.6rem] font-semibold leading-[.91] tracking-[-.065em] text-[#fffdf4] sm:text-7xl lg:text-[6.6rem]">
              Tu historia
              <br />
              <span className="text-[#b3e3b7]">no termina aquí.</span>
            </h1>
            <p className="mt-7 max-w-[620px] text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Bienestar con evidencia, valores personales y pasos prácticos. Encuentra orientación, reconecta con lo que te importa y explora nuevas oportunidades; sin prometer soluciones mágicas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={hasValues ? '/recuperacion' : '/recuperacion/valores'}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#c9f0ce]/70 bg-gradient-to-r from-[#2fbd8a] to-[#13866f] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_rgba(16,147,112,.35)] transition hover:-translate-y-0.5 hover:from-[#40c99a] hover:to-[#1d9b80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
              >
                <Leaf className="h-5 w-5" />
                {hasValues ? 'Continuar mi proceso' : 'Comenzar mi proceso'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/ruta" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/45 bg-[#082e31]/35 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base">
                <Compass className="h-5 w-5" /> Mi ruta de 24 horas
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/80 sm:text-sm">
              <span className="inline-flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#a8dfbb]" /> Explora sin cuenta</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#a8dfbb]" /> Fuentes y límites visibles</span>
              <span className="inline-flex items-center gap-2"><span aria-hidden="true">🇨🇴</span> Hecho en Colombia</span>
            </div>
          </motion.div>

          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, x: 18, scale: .98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: .75, delay: .12 }}
            className="relative z-10 ml-auto hidden w-full max-w-[390px] lg:block"
            aria-label="Principios de BlumHelps"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-[#8dd4b5]/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/30 bg-[#062f30]/75 p-7 shadow-[0_30px_80px_rgba(0,0,0,.28)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#b8e1bc]/30 bg-[#83d4a6]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#c6efcd]">Tu espacio seguro</span>
                <Sprout className="h-6 w-6 text-[#a5e4b6]" />
              </div>
              <p className="mt-6 font-serif text-2xl leading-snug text-[#fff9ea]">“El bienestar no es un destino; es una forma de caminar.”</p>
              <div className="mt-6 space-y-4 border-t border-white/15 pt-5">
                <div className="flex items-center gap-3 text-sm text-white/90"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#75cba1]/15 text-[#a4e8b9]"><Activity className="h-4 w-4" /></span> Aprende con evidencia y contexto</div>
                <div className="flex items-center gap-3 text-sm text-white/90"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#75cba1]/15 text-[#a4e8b9]"><BookOpen className="h-4 w-4" /></span> Consulta fuentes y limitaciones</div>
                <div className="flex items-center gap-3 text-sm text-white/90"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#75cba1]/15 text-[#a4e8b9]"><HeartHandshake className="h-4 w-4" /></span> Construye oportunidades reales</div>
              </div>
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d9e7c4] text-[#194738]"><Mountain className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-white">Pequeños pasos.</p><p className="text-xs text-white/70">Cambios que cuentan.</p></div>
                <Heart className="ml-auto h-5 w-5 text-[#a8dfbb]" />
              </div>
            </div>
          </motion.aside>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </section>

      {/* ACCESOS: cada tarjeta lleva a un módulo existente */}
      <section aria-label="Herramientas principales" className="relative z-20 mx-auto -mt-7 max-w-[1500px] px-4 sm:-mt-10 sm:px-8 lg:px-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.number}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: .45, delay: index * .055 }}
                className="group overflow-hidden rounded-[1.55rem] border border-[#dfe5d9] bg-[#fffef9] shadow-[0_12px_30px_rgba(20,54,44,.09)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(20,54,44,.15)]"
              >
                <div
                  className={`relative flex h-[118px] items-center justify-between overflow-hidden bg-gradient-to-br ${feature.art} px-6`}
                  style={{ backgroundImage: `linear-gradient(90deg, rgba(8,35,33,.12), rgba(8,35,33,.02)), url("${import.meta.env.BASE_URL}images/editorial/${feature.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                  <div aria-hidden="true" className="absolute -right-7 -top-14 h-44 w-44 rounded-full border border-white/35" />
                  <div aria-hidden="true" className="absolute -right-1 -bottom-14 h-36 w-36 rounded-full border border-white/35" />
                  <span className="relative z-10 max-w-[180px] text-[10px] font-extrabold tracking-[.16em] text-[#113d3b]/75">{feature.tag}</span>
                  <div className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-[1.4rem] border border-white/55 bg-white/50 text-[#1b4944] shadow-lg backdrop-blur-md transition duration-300 group-hover:rotate-3 group-hover:scale-105">
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                  </div>
                  <span className="absolute bottom-3 left-6 font-serif text-5xl italic text-white/30">{feature.number}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <h2 className="font-display text-xl font-semibold tracking-[-.035em] text-[#123638] sm:text-2xl">{feature.title}</h2>
                  <p className="mt-2 min-h-[66px] text-sm leading-6 text-[#5e7170]">{feature.description}</p>
                  <Link to={feature.href} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#edf4ec] px-4 py-2.5 text-xs font-bold text-[#14564b] transition hover:gap-3 hover:bg-[#dceee0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14564b]">
                    {feature.action}<ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* TABLERO DEL PROCESO — orientación visual, sin escalas clínicas */}
      <section className="mx-auto grid max-w-[1500px] gap-5 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:px-12 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#073a39] p-6 text-white shadow-[0_25px_65px_rgba(5,50,48,.15)] sm:p-8 lg:p-10">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#9cd8b5]">Tu camino · sin comparación</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.045em] sm:text-4xl">Paz. Acción. Vínculo. Progreso.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Cuatro maneras de orientarte. Puedes volver a cualquiera de ellas cuando lo necesites; no es una escala ni una carrera.</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[10px] font-semibold text-white/75">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#a8e4b6]" />
                {completed.length} recurso{completed.length === 1 ? '' : 's'} marcado{completed.length === 1 ? '' : 's'} como completado{completed.length === 1 ? '' : 's'} en este navegador
              </div>
            </div>
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#a4e2b9] sm:flex"><Sprout className="h-6 w-6" /></div>
          </div>
          <div className="relative mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            <svg aria-hidden="true" viewBox="0 0 600 80" preserveAspectRatio="none" className="absolute left-[7%] right-[7%] top-5 hidden h-14 w-[86%] sm:block">
              <path d="M10 35 C70 -5 105 75 165 35 S265 -5 315 35 S420 75 470 35 S550 0 590 35" fill="none" stroke="#a8e4b6" strokeWidth="2" strokeDasharray="5 9" opacity=".48" />
            </svg>
            {cycle.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={item.key} to={item.href} className="group relative z-10 rounded-2xl border border-white/10 bg-white/[.045] p-4 text-center transition hover:-translate-y-1 hover:border-[#a8e4b6]/45 hover:bg-white/[.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8e4b6] sm:px-2">
                  <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/25 shadow-lg transition group-hover:scale-105 ${['bg-[#d4e4c3] text-[#164d3d]', 'bg-[#f3c66f] text-[#704b1d]', 'bg-[#9cddc1] text-[#125449]', 'bg-[#83caa7] text-[#10483d]'][index]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white">{item.label}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-white/65">{item.subtitle}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#a8e4b6] opacity-75 transition group-hover:gap-2 group-hover:opacity-100">Explorar <ArrowRight className="h-3 w-3" /></span>
                </Link>
              );
            })}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c4742]/65 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#a3dfb6]/15 text-[#a3dfb6]"><MessageCircle className="h-5 w-5" /></div>
            <p className="text-xs leading-5 text-white/75">Un día difícil no borra los pasos que ya diste. Tu recorrido te pertenece.</p>
          </div>
        </div>

        {/* BIENESTAR EN DATOS: solo registros reales de este navegador */}
        <div className="rounded-[2rem] border border-[#dfe8dc] bg-[#fffef9] p-6 shadow-[0_20px_55px_rgba(20,54,44,.07)] sm:p-8 lg:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#418574]">Un momento para ti</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.045em] text-[#103d3c]">Tu bienestar en datos</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#647776]">Registra cómo llegas hoy. La gráfica refleja tus propias entradas, no mide tu salud ni predice el futuro.</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e3f1e5] text-[#287561]"><Activity className="h-6 w-6" /></div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#e4ebe0] bg-[#f6f8f1] p-4 sm:p-5">
            <p className="text-sm font-bold text-[#214b46]">¿Cómo te sientes ahora?</p>
            <div className="mt-3 grid grid-cols-5 gap-1.5 sm:gap-2" role="group" aria-label="Selecciona cómo te sientes">
              {moods.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMood(item.value)}
                  aria-pressed={mood === item.value}
                  className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27785e] ${mood === item.value ? 'border-[#2b8b6e] bg-[#d8eee0] text-[#164c41] shadow-sm' : 'border-[#e3e9df] bg-white text-[#62726d] hover:border-[#9dc7ae]'}`}
                >
                  <span className="text-xl" aria-hidden="true">{item.face}</span>
                  <span className="text-[9px] font-bold leading-3 sm:text-[10px]">{item.label}</span>
                </button>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs font-bold text-[#47645e]">¿Qué quieres cuidar hoy?</p>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((item) => (
                <button key={item.value} type="button" aria-pressed={focus === item.value} onClick={() => setFocus(item.value)} className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition ${focus === item.value ? 'border-[#2b8b6e] bg-[#155a4d] text-white' : 'border-[#dde6dc] bg-white text-[#60736c] hover:border-[#91bba4]'}`}>
                  {item.label}<span className={`ml-1 hidden sm:inline ${focus === item.value ? 'text-white/70' : 'text-[#8b9c91]'}`}>· {item.sub}</span>
                </button>
              ))}
            </div>
            <label htmlFor="blum-checkin-note" className="mt-4 block text-xs font-semibold text-[#47645e]">Una nota para ti (opcional)</label>
            <textarea id="blum-checkin-note" value={note} onChange={(event) => setNote(event.target.value.slice(0, 180))} rows={2} maxLength={180} placeholder="¿Qué te ayudaría a dar el siguiente paso?" className="mt-2 w-full resize-y rounded-xl border border-[#dce6dc] bg-white px-3.5 py-3 text-sm text-[#173e3c] placeholder:text-[#93a29a] focus:border-[#3b8b70] focus:outline-none focus:ring-2 focus:ring-[#3b8b70]/20" />
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#d8e6d3] bg-white/80 p-3">
              <input id="blum-local-consent" type="checkbox" checked={localNoticeAccepted} onChange={(event) => setLocalNoticeAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-[#b6cbb9] accent-[#26765c]" />
              <label htmlFor="blum-local-consent" className="text-[10px] leading-4 text-[#62746c]">Entiendo que este registro se guarda en este navegador y no está cifrado con una clave propia. No incluiré nombres, teléfonos ni otros datos que me identifiquen.</label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={saveCheckIn} disabled={saving || !localNoticeAccepted} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#14785f] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#0d624e] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14785f]">
                {saving ? 'Guardando…' : <><Check className="h-4 w-4" /> Guardar mi check-in</>}
              </button>
              <span className="text-[10px] text-[#7d8d83]">{loadReady ? `${totalMoodDays} registro${totalMoodDays === 1 ? '' : 's'} en este navegador` : 'Leyendo registros locales…'}</span>
            </div>
            {saveMessage && <p role="status" aria-live="polite" className="mt-3 rounded-lg bg-[#e5f3e7] px-3 py-2 text-xs leading-5 text-[#215948]">{saveMessage}</p>}
          </div>

          <div className="mt-6 rounded-2xl border border-[#e7ece3] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#204542]">Tu última semana</h3>
                <p className="mt-1 text-[11px] text-[#7c8d83]">Promedio de registros personales · escala orientativa 1–5</p>
              </div>
              {lastMood && <span className="rounded-full bg-[#e7f3e7] px-3 py-1.5 text-[10px] font-bold text-[#2a725c]">Último: {lastMood.label.toLowerCase()}</span>}
            </div>
            {checkIns.length > 0 ? (
              <>
                <div className="mt-5 grid h-[120px] grid-cols-7 items-end gap-2" role="img" aria-label="Gráfica de registros de ánimo introducidos por la persona durante los últimos siete días">
                  {lastSevenDays.map((day) => (
                    <div key={day.key} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                      <div className="flex h-[94px] w-full items-end justify-center rounded-t-lg bg-[#f2f6ef]">
                        {day.average !== null && <div title={`${day.shortDate}: promedio ${day.average.toFixed(1)} de 5, ${day.count} registro(s)`} className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-[#14765d] to-[#93d3a4] transition-[height] duration-500" style={{ height: `${Math.max(12, (day.average / 5) * 100)}%` }} />}
                      </div>
                      <span className="text-[9px] font-medium capitalize text-[#7c8d83]">{day.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0e9] pt-3 text-[10px] text-[#7c8d83]">
                  <span>{checkIns.length} check-in(s) guardados desde Inicio</span>
                  <span>Los días sin registro aparecen vacíos.</span>
                </div>
              </>
            ) : (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-[#cbdccf] bg-[#f8faf6] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4f1e3] text-[#2b7a60]"><Activity className="h-5 w-5" /></div>
                <div><p className="text-sm font-bold text-[#315a4e]">Tu gráfica comienza contigo</p><p className="mt-1 text-xs leading-5 text-[#7a8b82]">Todavía no hay registros. Guarda un check-in si te sirve; no es obligatorio y no hay datos de ejemplo.</p></div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RECURSOS, CIENCIA, OPORTUNIDADES Y AYUDA */}
      <section className="border-y border-[#dfe6da] bg-[#e9eee4]">
        <div className="mx-auto grid max-w-[1500px] gap-5 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_1fr_.9fr] lg:px-12 lg:py-16">
          <article className="group relative overflow-hidden rounded-[1.7rem] bg-[#fdfcf5] p-6 shadow-sm transition hover:shadow-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dcefe4] text-[#1d765f]"><BookOpen className="h-6 w-6" /></div>
              <span className="rounded-full bg-[#e9f2e4] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-[#527b60]">Ciencia y esperanza</span>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-.04em] text-[#153e3b]">La evidencia también explica sus límites.</h2>
            <p className="mt-3 text-sm leading-6 text-[#657873]">Consulta investigaciones, quiénes participaron, qué se puede concluir y qué no. Sin porcentajes de éxito inventados ni promesas de curación.</p>
            <Link to="/ciencia" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#21755d] transition group-hover:gap-3">Ver estudios y fuentes <ArrowRight className="h-4 w-4" /></Link>
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-8 h-36 w-36 rounded-full border-[18px] border-[#d8e9dc]/60" />
          </article>

          <article className="group relative overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-[#164c48] to-[#082f34] p-6 text-white shadow-sm transition hover:shadow-xl sm:p-7">
            <div aria-hidden="true" className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#a7e1b9]"><Briefcase className="h-6 w-6" /></div>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-[#c8e4cc]">Oportunidades</span>
            </div>
            <h2 className="relative z-10 mt-5 font-display text-2xl font-semibold tracking-[-.04em]">Un siguiente paso también puede ser una oportunidad.</h2>
            <p className="relative z-10 mt-3 text-sm leading-6 text-white/75">Explora formación, empleo y recursos. Revisa requisitos, fechas y condiciones directamente con la entidad antes de postularte.</p>
            <Link to="/oportunidades" className="relative z-10 mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#a7e1b9] transition group-hover:gap-3">Explorar oportunidades <ArrowRight className="h-4 w-4" /></Link>
            <div className="relative z-10 mt-6 flex flex-wrap gap-2 text-[10px] text-white/70"><span className="rounded-full border border-white/15 px-3 py-1.5">Formación</span><span className="rounded-full border border-white/15 px-3 py-1.5">Empleo</span><span className="rounded-full border border-white/15 px-3 py-1.5">Apoyo local</span></div>
          </article>

          <article className="rounded-[1.7rem] border border-[#f0c5bd] bg-[#fff4f0] p-6 shadow-sm sm:p-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ffe0d9] text-[#b94034]"><Heart className="h-5 w-5" /></div>
              <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#bb5145]">Apoyo inmediato</p><h2 className="mt-1 font-display text-xl font-semibold text-[#742b28]">No tienes que resolverlo a solas.</h2></div>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#805f5b]">Si hay peligro inmediato, busca ayuda de emergencias. La disponibilidad y cobertura de las líneas de apoyo emocional pueden variar según el territorio.</p>
            <div className="mt-5 grid gap-2">
              <a href="tel:123" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#bf4136] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#a93029] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bf4136]"><ShieldCheck className="h-4 w-4" /> Emergencias · 123</a>
              <a href="tel:106" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e3b5ad] bg-white px-4 py-3 text-xs font-bold text-[#9f3d34] transition hover:bg-[#fff9f6]">Línea 106 · verifica cobertura</a>
            </div>
            <p className="mt-3 text-[10px] leading-4 text-[#956c66]">BlumHelps no es un servicio de emergencias ni sustituye atención profesional.</p>
          </article>
        </div>
      </section>

      {/* TRANSPARENCIA Y ACCESIBILIDAD: sin sellos no auditados */}
      <section className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#3c8974]">Confianza sin letra pequeña</p><h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.045em] text-[#133b3b] sm:text-4xl">Un camino con los pies en la tierra.</h2></div>
          <p className="max-w-md text-sm leading-6 text-[#687d76]">Queremos que sepas qué hace el producto hoy y qué capacidades siguen en construcción.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="flex gap-4 rounded-[1.5rem] border border-[#dce6d8] bg-[#fffef9] p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e3f0df] text-[#33765c]"><ShieldCheck className="h-6 w-6" /></div>
            <div><h3 className="text-base font-bold text-[#1b4943]">Transparencia primero</h3><p className="mt-2 text-xs leading-5 text-[#6b7d75]">Fuentes, fechas, población y límites deben acompañar las afirmaciones. Las ofertas se deben confirmar con su entidad.</p><Link to="/ciencia" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#277760]">Cómo verificamos <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          </article>
          <article className="flex gap-4 rounded-[1.5rem] border border-[#dce6d8] bg-[#fffef9] p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e5e9f0] text-[#425d77]"><LockKeyhole className="h-6 w-6" /></div>
            <div><h3 className="text-base font-bold text-[#1b4943]">Tus datos requieren cuidado</h3><p className="mt-2 text-xs leading-5 text-[#6b7d75]">Los registros de esta versión viven en el navegador y no están cifrados con una clave propia. Evita datos identificables.</p><Link to="/ajustes" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#277760]">Ver privacidad <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          </article>
          <article className="flex gap-4 rounded-[1.5rem] border border-[#dce6d8] bg-[#fffef9] p-5 sm:p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f6e8d5] text-[#98643b]"><Users className="h-6 w-6" /></div>
            <div><h3 className="text-base font-bold text-[#1b4943]">Un recurso de orientación</h3><p className="mt-2 text-xs leading-5 text-[#6b7d75]">No diagnostica ni sustituye tratamiento profesional. Pide apoyo si lo necesitas; volver a empezar también es parte del proceso.</p><Link to="/familiares" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#277760]">Encontrar apoyo <ArrowRight className="h-3.5 w-3.5" /></Link></div>
          </article>
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-[1.5rem] border border-[#dce6d8] bg-[#e8efe5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#33765c]"><Sparkles className="h-5 w-5" /></div><div><h3 className="text-sm font-bold text-[#1b4943]">Haz que la experiencia se adapte a ti.</h3><p className="mt-1 text-xs text-[#6b7d75]">Contraste, texto grande, lectura y opciones de accesibilidad disponibles desde el botón flotante.</p></div></div>
          <Link to="/ajustes" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#c1d5c1] bg-white px-5 py-2.5 text-xs font-bold text-[#256b56] transition hover:bg-[#f8fcf7]">Ver opciones <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <p className="mt-5 text-center text-[10px] leading-5 text-[#87958b]">BlumHelps es una plataforma de acompañamiento psicoeducativo. Las gráficas describen únicamente entradas personales y no son evaluaciones clínicas.</p>
      </section>
    </div>
  );
}
