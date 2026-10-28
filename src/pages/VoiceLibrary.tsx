import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Headphones, LockKeyhole, Play, Search, ShieldCheck, Sparkles } from "lucide-react";
import { recoveryPiperAudioManifest } from "../data/recovery/piperAudioManifest";
import { getRecoveryPiperAudio } from "../lib/recovery/piperAudioLibrary";
import { LocalAudioPlayer } from "../components/recovery/LocalAudioPlayer";
import { PodcastSeries } from "../components/voice/PodcastSeries";

type Episode = (typeof recoveryPiperAudioManifest.items)[number];
const STORAGE_KEY = "blumhelps.voice.progress.v1";
const seasonDefinitions = [
  { id: 1, name: "Volver a escucharte", subtitle: "Reconocer dónde estás y empezar sin juicios.", tone: "mint", goal: "Orientación y autoconocimiento" },
  { id: 2, name: "Pequeños pasos, cambios reales", subtitle: "Practicar herramientas para atravesar momentos difíciles.", tone: "blue", goal: "Herramientas cotidianas" },
  { id: 3, name: "Cuidar el camino", subtitle: "Construir apoyos y sostener lo que vas aprendiendo.", tone: "amber", goal: "Apoyo y prevención" },
];
const artStyles = [
  "from-emerald-200 via-teal-500 to-slate-950",
  "from-violet-200 via-indigo-500 to-slate-950",
  "from-sky-200 via-cyan-600 to-slate-950",
  "from-amber-100 via-orange-500 to-rose-950",
  "from-lime-100 via-emerald-600 to-slate-950",
  "from-pink-200 via-fuchsia-600 to-slate-950",
  "from-blue-100 via-sky-500 to-indigo-950",
];
function readProgress(): string[] {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []; }
  catch { return []; }
}
function CoverArt({ index, title, size = "normal" }: { index: number; title: string; size?: "normal" | "hero" }) {
  const reduced = useReducedMotion();
  return <div className={`bl-voice-cover relative isolate overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${artStyles[index % artStyles.length]} ${size === "hero" ? "aspect-square w-full max-w-[330px]" : "aspect-square w-full"}`} aria-label={`Carátula artística de ${title}`} role="img">
    <div className="bl-voice-orb absolute -right-[18%] -top-[12%] h-[76%] w-[76%] rounded-full border border-white/45 bg-white/10 shadow-[inset_-18px_-16px_35px_rgba(0,0,0,.2),inset_12px_12px_35px_rgba(255,255,255,.35),0_0_50px_rgba(255,255,255,.2)] backdrop-blur-[2px]" />
    <div className="absolute left-[13%] top-[14%] h-[68%] w-[68%] rounded-full border border-white/30 bg-gradient-to-br from-white/35 via-white/5 to-black/25 shadow-[inset_0_0_28px_rgba(255,255,255,.25),0_15px_40px_rgba(0,0,0,.22)]">
      <div className="absolute inset-[8%] rounded-full border border-white/25" />
      <div className="absolute inset-[18%] rounded-full border border-white/20" />
      <div className="absolute inset-[30%] rounded-full border border-white/25 bg-white/10 backdrop-blur-sm" />
      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,.8)]" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/10" />
    <motion.div aria-hidden="true" className="bl-voice-glint absolute -inset-y-1/2 -left-1/2 z-10 w-[48%] rotate-[28deg] bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[2px]" animate={reduced ? undefined : { x: ["-20%", "360%", "360%", "-20%"], opacity: [0, .9, 0, 0] }} transition={reduced ? undefined : { duration: 5.8, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut", times: [0, .32, .46, 1] }} />
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <p className="text-[9px] font-bold uppercase tracking-[.22em] text-white/75">BLUM · AUDIO SERIES</p>
      <p className="mt-1 line-clamp-2 text-sm font-bold leading-tight drop-shadow-md">{title}</p>
    </div>
    <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/20 px-2 py-1 text-[9px] font-semibold tracking-wide text-white backdrop-blur-md">PIPER</span>
  </div>;
}
export function VoiceLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "micro" | "guion">("todos");
  const [completed, setCompleted] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { setCompleted(readProgress()); }, []);
  const episodes: readonly Episode[] = recoveryPiperAudioManifest.items;
  const seasons = useMemo(() => seasonDefinitions.map((season, i) => ({ ...season, episodes: episodes.slice(i * 7, i * 7 + 7) })), [episodes]);
  const allEpisodes = seasons.flatMap(s => s.episodes);
  const activeEpisode = allEpisodes.find(e => e.id === selected) ?? allEpisodes[0];
  const markCompleted = (id: string) => setCompleted(current => {
    if (current.includes(id)) return current;
    const next = [...current, id];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage may be disabled */ }
    return next;
  });
  const unlocked = (seasonIndex: number, episodeIndex: number) => {
    if (seasonIndex === 0 && episodeIndex === 0) return true;
    if (episodeIndex > 0) return completed.includes(seasons[seasonIndex].episodes[episodeIndex - 1].id);
    const previousSeason = seasons[seasonIndex - 1];
    return Boolean(previousSeason?.episodes.length && previousSeason.episodes.every(e => completed.includes(e.id)));
  };
  const visibleSeasons = seasons.map((season, si) => ({ ...season, episodes: season.episodes.map((episode, ei) => ({ ...episode, index: allEpisodes.findIndex(e => e.id === episode.id), unlocked: unlocked(si, ei) })).filter(e => e.titulo.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")) && (filter === "todos" || Boolean((e.files as Record<string, string | undefined>)[filter]))) }));
  const activeIndex = Math.max(0, allEpisodes.findIndex(e => e.id === activeEpisode?.id));
  const overall = Math.round((completed.length / Math.max(1, allEpisodes.length)) * 100);
  const activeSrc = activeEpisode ? getRecoveryPiperAudio(activeEpisode.id, filter === "micro" ? "micro" : "guion") ?? getRecoveryPiperAudio(activeEpisode.id, "guion") : undefined;
  return <main className="bl-voice-page min-h-screen px-4 pb-16 pt-8 text-white sm:px-7 lg:px-10">
    <div className="mx-auto max-w-[1380px]">
      <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-4 w-4" /> Volver a BLUMHELPS</Link>
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#102b29] px-5 py-7 shadow-2xl sm:px-9 sm:py-10 lg:px-12">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_.8fr]">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-emerald-200"><Sparkles className="h-4 w-4" /> BLUM ORIGINALS · APRENDIZAJE EN AUDIO</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl">Un episodio a la vez.<br/><span className="text-emerald-200">A tu propio ritmo.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">Una ruta de audio para entenderte, practicar herramientas y fortalecer tu red de apoyo. Sin carreras, sin juicios: cada paso cuenta.</p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/65"><span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">{episodes.length} audios registrados</span><span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">Voz {recoveryPiperAudioManifest.voice}</span><span className="rounded-full border border-white/15 bg-white/5 px-3 py-2">Progreso guardado en este dispositivo</span></div>
            <div className="mt-8 max-w-lg rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4 text-xs"><span className="font-semibold text-white/80">Tu recorrido de escucha</span><span className="font-bold text-emerald-200">{completed.length}/{episodes.length} · {overall}%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-lime-200 transition-all duration-500" style={{width: `${overall}%`}} /></div>
              <p className="mt-2 text-[10px] leading-5 text-white/45">Un episodio se marca completado cuando el audio llega al final. El progreso es local; todavía no se sincroniza entre dispositivos.</p>
            </div>
          </div>
          {activeEpisode && <div className="mx-auto grid w-full max-w-md grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 sm:gap-6">
            <CoverArt index={activeIndex} title={activeEpisode.titulo} size="hero"/>
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-emerald-200">PARA CONTINUAR</p><h2 className="mt-3 text-xl font-semibold leading-tight sm:text-2xl">{activeEpisode.titulo}</h2><p className="mt-3 text-xs leading-5 text-white/55">Escucha breve o versión extensa. Elige la que encaje contigo hoy.</p><button type="button" onClick={() => document.getElementById("bl-voice-player")?.scrollIntoView({behavior:"smooth",block:"center"})} className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-200 px-4 py-3 text-xs font-bold text-[#0a3029] transition hover:-translate-y-0.5 hover:bg-white"><Play className="h-4 w-4 fill-current"/> Escuchar ahora</button></div>
          </div>}
        </div>
      </section>
      <PodcastSeries />
      <section id="bl-voice-player" className="mt-7 grid gap-5 rounded-[1.7rem] border border-white/10 bg-[#112522] p-5 sm:p-7 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
        <div className="flex items-center gap-4"><div className="w-24 shrink-0 sm:w-28"><CoverArt index={activeIndex} title={activeEpisode?.titulo ?? "Biblioteca BLUM"}/></div><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-emerald-200">REPRODUCTOR</p><h2 className="mt-2 text-lg font-semibold">{activeEpisode?.titulo}</h2><p className="mt-1 text-xs text-white/50">Audio local · sin enviar datos personales</p></div></div>
        <div>{activeEpisode && activeSrc ? <LocalAudioPlayer key={activeEpisode.id + activeSrc} src={activeSrc} label={`Piper · ${activeEpisode.titulo}`} className="bl-voice-player-surface" onCompleted={() => markCompleted(activeEpisode.id)}/> : <p className="rounded-xl border border-white/10 p-4 text-sm text-white/60">Selecciona un episodio con audio disponible.</p>}<div className="mt-3 flex flex-wrap gap-2">{(["micro","guion"] as const).map(kind => {const src = activeEpisode ? getRecoveryPiperAudio(activeEpisode.id,kind) : undefined;return <button key={kind} type="button" disabled={!src} onClick={() => setFilter(kind)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${filter===kind?"border-emerald-200 bg-emerald-200 text-[#0a3029]":"border-white/15 text-white/65 hover:bg-white/5"} disabled:cursor-not-allowed disabled:opacity-30`}>{kind==="micro"?"Versión breve":"Versión extensa"}</button>})}</div></div>
      </section>
      <div className="mt-9 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label><span className="mb-2 block text-xs font-semibold text-white/70">Buscar en la biblioteca</span><span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.06] px-4 py-3"><Search className="h-4 w-4 text-emerald-200"/><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35" placeholder="Sueño, valores, apoyo…"/></span></label>
        <div className="flex gap-2">{([{value:"todos",label:"Todos"},{value:"micro",label:"Breves"},{value:"guion",label:"Extensos"}] as const).map(o=><button key={o.value} type="button" aria-pressed={filter===o.value} onClick={()=>setFilter(o.value)} className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition ${filter===o.value?"border-emerald-200 bg-emerald-200 text-[#0a3029]":"border-white/15 text-white/70 hover:bg-white/10"}`}>{o.label}</button>)}</div>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100/15 bg-emerald-100/[.05] p-4 text-xs leading-6 text-white/65"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200"/><p><strong className="text-white/90">Transparencia:</strong> se muestran audios incluidos en el manifiesto local. Los niveles son una organización inicial de aprendizaje, no una evaluación clínica. Los episodios actuales no se anuncian como sesiones de 30 minutos si su duración real no está confirmada.</p></div>
      <div className="mt-10 space-y-12">
        {visibleSeasons.map((season,si)=>{const originalSeason=seasons[si];const done=originalSeason.episodes.filter(e=>completed.includes(e.id)).length;return <section key={season.id} aria-labelledby={`season-${season.id}`}>
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.23em] text-emerald-200">TEMPORADA 0{season.id} · NIVEL {season.id}</p><h2 id={`season-${season.id}`} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{season.name}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">{season.subtitle}</p><p className="mt-2 text-[10px] text-white/40">{season.goal}</p></div><div className="text-xs text-white/55">{done}/{originalSeason.episodes.length} completados</div></div>
          {season.episodes.length===0?<p className="mt-5 rounded-2xl border border-dashed border-white/15 p-5 text-sm text-white/50">Los episodios de este nivel se publicarán cuando sus audios y materiales estén preparados y verificados.</p>:<div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">{season.episodes.map(episode=>{const ei=originalSeason.episodes.findIndex(e=>e.id===episode.id);const isDone=completed.includes(episode.id);const isLocked=!unlocked(si,ei);const globalIndex=allEpisodes.findIndex(e=>e.id===episode.id);return <article key={episode.id} className={`group min-w-0 ${isLocked?"opacity-55":""}`}><button type="button" disabled={isLocked} onClick={()=>{setSelected(episode.id);document.getElementById("bl-voice-player")?.scrollIntoView({behavior:"smooth",block:"center"});}} className="block w-full rounded-[1.4rem] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-200 disabled:cursor-not-allowed"><div className="relative"><CoverArt index={globalIndex} title={episode.titulo}/>{isLocked?<span className="absolute inset-0 flex items-center justify-center rounded-[1.4rem] bg-black/40"><LockKeyhole className="h-7 w-7 text-white"/></span>:isDone?<span className="absolute right-2 top-2 rounded-full bg-emerald-200 p-1.5 text-[#073a32]"><Check className="h-3.5 w-3.5"/></span>:<span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#123b36] opacity-0 shadow-lg transition group-hover:opacity-100"><Play className="h-4 w-4 fill-current"/></span>}</div><p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-white">{episode.titulo}</p><p className="mt-2 flex items-center gap-1.5 text-[10px] text-white/45">{isDone?<><CheckCircle2 className="h-3 w-3 text-emerald-200"/>Completado</>:isLocked?<><LockKeyhole className="h-3 w-3"/>Bloqueado · completa el anterior</>:<><Headphones className="h-3 w-3"/>Episodio {String(globalIndex+1).padStart(2,"0")}</>}</p></button></article>})}</div>}
        </section>})}
      </div>
      <section className="mt-12 flex flex-col gap-4 rounded-[1.7rem] border border-white/10 bg-gradient-to-r from-[#153c32] to-[#172a31] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-200">UN PASO A LA VEZ</p><h2 className="mt-2 text-xl font-semibold">Escuchar también puede ser una forma de cuidarte.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Puedes volver cuando quieras. La biblioteca guarda el progreso de escucha en este dispositivo, sin cuenta y sin sincronización en la nube.</p></div><Link to="/recuperacion" className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/10 sm:self-center">Volver a Mi proceso <ArrowRight className="h-4 w-4"/></Link></section>
      <p className="mt-7 text-center text-[10px] leading-5 text-white/40">Orientación psicoeducativa general; no sustituye atención profesional. En Colombia, ante peligro inmediato llama al 123.</p>
    </div>
  </main>;
}
