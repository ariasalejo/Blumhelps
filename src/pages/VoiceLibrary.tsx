import React, { useMemo, useState } from "react";
import { Headphones, Search, ShieldCheck, Volume2, BookOpen, Info } from "lucide-react";
import { recoveryPiperAudioManifest } from "../data/recovery/piperAudioManifest";
import { getRecoveryPiperAudio } from "../lib/recovery/piperAudioLibrary";
import { LocalAudioPlayer } from "../components/recovery/LocalAudioPlayer";

type AudioKind = "todos" | "micro" | "guion";

export function VoiceLibrary() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<AudioKind>("todos");
  const items = useMemo(() => recoveryPiperAudioManifest.items.filter((item) => {
    const matchesQuery = item.titulo.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es"));
    const files = item.files as Record<"micro" | "guion", string | undefined>;
    const hasKind = kind === "todos" || Boolean(files[kind]);
    return matchesQuery && hasKind;
  }), [query, kind]);

  return (
    <main className="min-h-screen bg-[#f6f4ec] px-4 py-10 text-[#123b36] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#073a38] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full bg-[#77cba1]/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="rounded-2xl border border-white/15 bg-white/10 p-3"><Headphones className="h-7 w-7 text-[#a9e5bd]" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a9e5bd]">BLUMHELPS · APRENDIZAJE</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Biblioteca de voz Piper</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Materiales psicoeducativos pregrabados con voz Piper. Elige una versión breve o extensa y escucha directamente desde este catálogo.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">Voz: {recoveryPiperAudioManifest.voice}</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">Audio local · MP3</span>
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{recoveryPiperAudioManifest.items.length} temas en el manifiesto</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Buscar un tema</span>
            <span className="flex items-center gap-3 rounded-2xl border border-[#d5dfd4] bg-white px-4 py-3 shadow-sm">
              <Search className="h-5 w-5 text-[#548173]" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Ej. sueño, craving, valores…" />
            </span>
          </label>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar tipo de audio">
            {([{ value: "todos", label: "Todos" }, { value: "micro", label: "Breves" }, { value: "guion", label: "Extensos" }] as const).map((option) => (
              <button key={option.value} type="button" onClick={() => setKind(option.value)} aria-pressed={kind === option.value} className={"rounded-full border px-4 py-2.5 text-sm font-semibold transition " + (kind === option.value ? "border-[#0c6552] bg-[#0c6552] text-white" : "border-[#d5dfd4] bg-white text-[#214e43] hover:bg-[#e9f1e8]")}>{option.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#cbded0] bg-[#eaf4e9] p-4 text-sm leading-6 text-[#315c4c]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p><strong>Transparencia:</strong> aquí solo se muestran audios registrados en el manifiesto. No se genera voz en tiempo real. Si un tema no tiene una versión breve o extensa disponible, esa versión no se ofrece.</p>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-[#b9cbbd] bg-white p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-[#52816c]" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-bold">No encontramos ese audio</h2>
            <p className="mt-2 text-sm text-[#5c7168]">Prueba otra búsqueda o selecciona “Todos”.</p>
          </div>
        ) : (
          <section className="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Audios psicoeducativos">
            {items.map((item, index) => {
              const micro = getRecoveryPiperAudio(item.id, "micro");
              const guion = getRecoveryPiperAudio(item.id, "guion");
              return (
                <article key={item.id} className="rounded-3xl border border-[#e0e4d9] bg-white p-5 shadow-[0_12px_40px_rgba(18,59,54,.06)] sm:p-6">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f2e6] text-sm font-bold text-[#1b7057]">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#6b8b7a]">RECURSO PSICOEDUCATIVO</p>
                      <h2 className="mt-1 text-lg font-bold leading-snug text-[#123b36]">{item.titulo}</h2>
                    </div>
                    <Volume2 className="h-5 w-5 shrink-0 text-[#32836a]" aria-hidden="true" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {kind !== "guion" && (micro ? <LocalAudioPlayer src={micro} label="Versión breve · Piper" /> : <p className="rounded-xl bg-[#f6f4ec] p-3 text-xs text-[#6c6f62]">Versión breve no disponible para este tema.</p>)}
                    {kind !== "micro" && (guion ? <LocalAudioPlayer src={guion} label="Versión extensa · Piper" /> : <p className="rounded-xl bg-[#f6f4ec] p-3 text-xs text-[#6c6f62]">Versión extensa no disponible para este tema.</p>)}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#e3d7ba] bg-[#fff8e8] p-4 text-sm leading-6 text-[#715d37]">
          <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>Estos materiales ofrecen orientación general y no sustituyen atención profesional. Si hay peligro inmediato en Colombia, llama al 123. Para orientación emocional, consulta las líneas oficiales de tu territorio y verifica su cobertura.</p>
        </div>
      </div>
    </main>
  );
}
