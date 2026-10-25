import React, { useRef, useState } from 'react';
import { Phone, MapPin, Users, HeartHandshake, Headphones, ExternalLink, Search, Sparkles, ShieldCheck, ArrowUpRight, Radio, MapPinned } from 'lucide-react';
import { verifiedResourcesAll } from '../data/verifiedResources';

type Filter = 'todos' | 'lineas' | 'presencial' | 'familiares' | 'medellin';

export function Help() {
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');
  const [strongGlow, setStrongGlow] = useState<string | null>(null);
  const tapRef = useRef<{ id: string; at: number }>({ id: '', at: 0 });
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lightUp = (id: string) => {
    setStrongGlow(id);
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setStrongGlow(null), 1250);
  };
  const handlePointer = (id: string) => {
    const now = Date.now();
    if (tapRef.current.id === id && now - tapRef.current.at < 380) lightUp(id);
    tapRef.current = { id, at: now };
  };

  const filtered = verifiedResourcesAll.filter(r => {
    const matchesQuery = !query.trim() || [r.name, r.category, r.description, r.location].some(value => value.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es')));
    if (!matchesQuery) return false;
    if (filter === 'todos') return true;
    if (filter === 'lineas') return r.category === 'Emergencia' || /^\d+$/.test(r.contactInfo);
    if (filter === 'presencial') return r.category === 'Salud Mental' || r.name.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('antioquia');
    if (filter === 'familiares') return r.category === 'Familia';
    if (filter === 'medellin') return r.location.toLowerCase().includes('medellín') || r.location.toLowerCase().includes('antioquia') || r.name.toLowerCase().includes('medellín') || r.name.toLowerCase().includes('antioquia');
    return true;
  });

  const filters: { id: Filter; label: string }[] = [
    { id: 'todos', label: 'Todos los recursos' },
    { id: 'medellin', label: 'Medellín + Antioquia' },
    { id: 'lineas', label: 'Líneas de ayuda' },
    { id: 'presencial', label: 'Atención presencial' },
    { id: 'familiares', label: 'Para familiares' },
  ];

  return (
    <main className="bl-resources-page min-h-screen overflow-hidden px-4 pb-16 pt-7 text-white sm:px-7 sm:pt-10 lg:px-10">
      <style>{`
        .bl-resources-page{background:radial-gradient(ellipse at 82% 0%,rgba(47,139,103,.22),transparent 32%),radial-gradient(ellipse at 0% 32%,rgba(29,92,77,.18),transparent 35%),#081715}
        .bl-resource-glass{position:relative;isolation:isolate;overflow:hidden;border:1px solid rgba(210,255,229,.13);background:linear-gradient(145deg,rgba(255,255,255,.085),rgba(255,255,255,.025) 55%,rgba(100,180,143,.035));box-shadow:0 16px 42px rgba(0,0,0,.17),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);transition:transform .28s ease,border-color .28s ease,box-shadow .28s ease}
        .bl-resource-glass:before{content:"";position:absolute;z-index:-1;inset:-70% -45%;pointer-events:none;transform:translateX(-75%) rotate(24deg);background:linear-gradient(90deg,transparent 38%,rgba(202,255,224,.025) 44%,rgba(215,255,235,.22) 50%,rgba(202,255,224,.04) 56%,transparent 63%);animation:bl-resource-sweep 7.5s ease-in-out infinite}
        .bl-resource-glass:after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;background:radial-gradient(380px circle at var(--bl-x,50%) var(--bl-y,50%),rgba(142,244,188,.16),transparent 55%);transition:opacity .3s ease}
        .bl-resource-glass:hover{transform:translateY(-3px);border-color:rgba(185,232,190,.34);box-shadow:0 22px 48px rgba(0,0,0,.24),0 0 24px rgba(67,185,130,.08),inset 0 1px 0 rgba(255,255,255,.2)}
        .bl-resource-glass:hover:after,.bl-resource-glass:focus-within:after{opacity:1}
        .bl-resource-glass.bl-strong-glow{border-color:rgba(185,255,207,.78);box-shadow:0 0 0 1px rgba(185,255,207,.15),0 0 32px rgba(89,233,157,.28),0 0 70px rgba(50,169,120,.15),inset 0 1px 0 rgba(255,255,255,.38)}
        .bl-resource-glass.bl-strong-glow:after{opacity:1;background:radial-gradient(460px circle at 50% 50%,rgba(142,255,190,.24),transparent 62%)}
        .bl-resource-action{position:relative;isolation:isolate;overflow:hidden;box-shadow:0 5px 18px rgba(53,174,119,.12);transition:transform .2s ease,box-shadow .25s ease,background .25s ease}
        .bl-resource-action:before{content:"";position:absolute;z-index:-1;top:-70%;bottom:-70%;left:-65%;width:38%;transform:skewX(-24deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.52),transparent);pointer-events:none;transition:left .55s ease}
        .bl-resource-action:hover:before,.bl-resource-action:focus-visible:before{left:135%}
        .bl-resource-action:hover,.bl-resource-action:focus-visible{transform:translateY(-1px);box-shadow:0 0 0 1px rgba(185,255,207,.2),0 0 24px rgba(89,233,157,.27)}
        .bl-resource-action:active{transform:scale(.98);box-shadow:0 0 30px rgba(89,233,157,.35)}
        .bl-resource-filter{border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.035);color:rgba(255,255,255,.72);transition:all .22s ease}
        .bl-resource-filter[aria-pressed=true]{border-color:rgba(185,232,190,.55);background:rgba(185,232,190,.13);color:#d8ffe0;box-shadow:inset 0 0 18px rgba(94,209,145,.06),0 0 18px rgba(94,209,145,.08)}
        .bl-resource-filter:hover{border-color:rgba(185,232,190,.45);background:rgba(185,232,190,.09);color:#fff}
        @keyframes bl-resource-sweep{0%,12%{transform:translateX(-75%) rotate(24deg);opacity:0}25%{opacity:.9}58%{transform:translateX(75%) rotate(24deg);opacity:.55}70%,100%{transform:translateX(75%) rotate(24deg);opacity:0}}
        @media(hover:none){.bl-resource-glass:active{border-color:rgba(185,232,190,.55);box-shadow:0 0 28px rgba(89,233,157,.16),inset 0 1px 0 rgba(255,255,255,.2)}}
        @media(prefers-reduced-motion:reduce){.bl-resource-glass,.bl-resource-glass:before,.bl-resource-glass:after,.bl-resource-action,.bl-resource-action:before{animation:none!important;transition:none!important}}
      `}</style>
      <div className="mx-auto max-w-[1380px]">
        <a href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"><ArrowUpRight className="h-4 w-4" /> Volver a BLUMHELPS</a>

        <header className="relative mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#102b29] px-5 py-8 shadow-2xl sm:px-9 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-[26rem] w-[26rem] rounded-full border border-emerald-100/10 bg-emerald-300/[.07] shadow-[0_0_100px_rgba(75,200,140,.12)] blur-[1px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-[42%] h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.25em] text-emerald-200"><Sparkles className="h-4 w-4" /> BLUM · RECURSOS PARA ACOMPAÑARTE</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-6xl">Encontrar apoyo.<br/><span className="text-emerald-200">A tu propio ritmo.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">Un directorio para descubrir orientación, líneas de ayuda y espacios de acompañamiento. Guarda esta página y vuelve cuando necesites dar el siguiente paso.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/65">
                <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2"><ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-emerald-200"/>{verifiedResourcesAll.filter(r=>r.isVerified).length} recursos con fuente registrada</span>
                <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2"><MapPinned className="mr-1.5 inline h-3.5 w-3.5 text-emerald-200"/>Colombia · cobertura por confirmar</span>
              </div>
            </div>
            <a href="/voz" onPointerDown={() => handlePointer('voice')} onDoubleClick={() => lightUp('voice')} className={`bl-resource-glass ${strongGlow==='voice'?'bl-strong-glow':''} group flex items-center gap-4 rounded-2xl p-4 sm:p-5 lg:max-w-[320px]`}>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-100/20 bg-emerald-200/10 text-emerald-100 shadow-[0_0_30px_rgba(94,209,145,.12)]"><Headphones className="h-7 w-7"/></span>
              <span><span className="block text-[9px] font-bold uppercase tracking-[.2em] text-emerald-200">BLUM ORIGINALS</span><span className="mt-1 block text-sm font-semibold text-white">Escuchar la biblioteca</span><span className="mt-1 block text-xs text-white/50">Audios para acompañar tu proceso</span></span>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-100"/>
            </a>
          </div>
        </header>

        <section className="mt-8" aria-labelledby="resource-list-title">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[.22em] text-emerald-200">DIRECTORIO DE APOYO</p><h2 id="resource-list-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Recursos para ti</h2><p className="mt-2 text-sm text-white/50">Filtra por el tipo de apoyo que necesitas hoy.</p></div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.045] px-4 py-3 md:w-[330px]"><Search className="h-4 w-4 shrink-0 text-emerald-200"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Buscar recursos" placeholder="Buscar por nombre o ubicación…" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"/></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{filters.map(item=><button key={item.id} type="button" aria-pressed={filter===item.id} onPointerDown={()=>handlePointer('filter-'+item.id)} onDoubleClick={()=>lightUp('filter-'+item.id)} onClick={()=>setFilter(item.id)} className={`bl-resource-filter ${strongGlow==='filter-'+item.id?'bl-strong-glow':''} rounded-full px-3.5 py-2.5 text-xs font-semibold`}>{item.label}</button>)}</div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100/10 bg-emerald-100/[.045] p-4 text-xs leading-6 text-white/60"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200"/><p><strong className="text-white/85">Antes de acudir:</strong> los horarios, teléfonos y cobertura pueden cambiar. Confirma los datos en la fuente institucional. La etiqueta de verificación indica que hay una fuente registrada; no garantiza disponibilidad en tiempo real.</p></div>

          {filtered.length===0 ? <div className="bl-resource-glass mt-5 rounded-2xl p-8 text-center"><Search className="mx-auto h-7 w-7 text-emerald-200"/><h3 className="mt-3 font-semibold">No encontramos coincidencias</h3><p className="mt-1 text-sm text-white/50">Prueba otra palabra o cambia el filtro.</p></div> :
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r,index) => {
              const id = String(r.id);
              const contactIsUrl = r.contactInfo.startsWith('http');
              return <article key={r.id} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--bl-x',`${e.clientX-rect.left}px`);e.currentTarget.style.setProperty('--bl-y',`${e.clientY-rect.top}px`);}} className={`bl-resource-glass ${strongGlow===id?'bl-strong-glow':''} rounded-[1.5rem] p-5 sm:p-6`}>
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border border-emerald-100/15 bg-emerald-100/[.08] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-100">{r.category}</span>
                    <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-white/40"><Radio className="h-3 w-3"/>{String(index+1).padStart(2,'0')}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">{r.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-white/62">{r.description}</p>
                  <div className="mt-4 space-y-2 border-t border-white/[.08] pt-4 text-xs text-white/55">
                    <span className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-200"/><span>{r.location}</span></span>
                    <span className="flex items-start gap-2"><Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-200"/><span className="break-all">{r.source.replace('https://','')}</span></span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    {r.isVerified ? <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-100/80"><ShieldCheck className="h-3.5 w-3.5"/>Fuente registrada · {r.lastVerified}</span> : <span className="text-[10px] text-white/35">Fuente pendiente de verificación</span>}
                    <a href={contactIsUrl ? r.contactInfo : `tel:${r.contactInfo}`} target={contactIsUrl ? '_blank' : undefined} rel={contactIsUrl ? 'noreferrer' : undefined} onPointerDown={()=>handlePointer(id)} onDoubleClick={()=>lightUp(id)} className={`bl-resource-action inline-flex items-center gap-2 rounded-xl border border-emerald-100/15 bg-emerald-200 px-3.5 py-2.5 text-xs font-bold text-[#08231d] ${strongGlow===id?'bl-strong-glow':''}`}>
                      {contactIsUrl ? <ExternalLink className="h-3.5 w-3.5"/> : <Phone className="h-3.5 w-3.5"/>}{contactIsUrl ? 'Ver información' : `Llamar: ${r.contactInfo}`}
                    </a>
                  </div>
                </div>
              </article>;
            })}
          </div>}
        </section>

        <section className="bl-resource-glass mt-9 rounded-[1.6rem] border-red-200/15 p-5 sm:p-6">
          <div className="relative z-10 flex items-start gap-3"><HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-rose-200"/><div><h3 className="font-semibold text-white">Si hay riesgo inmediato</h3><p className="mt-2 text-sm leading-6 text-white/65">Si hay peligro inmediato, llama al <a href="tel:123" className="font-semibold text-rose-100 underline underline-offset-4">123</a> o acude a urgencias. Para orientación emocional en Colombia, la Línea 106 ofrece escucha y orientación; confirma la cobertura territorial en la fuente oficial.</p><a href="https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx" target="_blank" rel="noreferrer" className="bl-resource-action mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-100/20 bg-rose-100/10 px-4 py-3 text-xs font-semibold text-rose-50">Información oficial de la Línea 106 <ExternalLink className="h-3.5 w-3.5"/></a></div></div>
        </section>
        <p className="mt-7 text-center text-[10px] leading-5 text-white/35">BLUMHELPS · Recursos de orientación. No sustituye atención profesional ni servicios de emergencia.</p>
      </div>
    </main>
  );
}
