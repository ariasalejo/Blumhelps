import React, { useState } from 'react';
import { HeartHandshake, MessageCircle, Shield, Heart, CheckCircle2, AlertTriangle, Phone, BookOpen, HandHeart, ArrowRight, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const conversations = [
  { title: 'Quiero acercarme sin presionar', goal: 'Abrir una conversación y dejar espacio para que la otra persona decida.', words: 'Me importas. No quiero juzgarte ni obligarte a hablar. Si te sirve, puedo escucharte y pensar contigo cuál sería un primer paso.' },
  { title: 'La persona no quiere hablar', goal: 'Respetar el límite sin desaparecer ni convertir la conversación en una discusión.', words: 'Está bien, no tienes que hablar ahora. Quiero que sepas que estoy disponible cuando quieras y que también voy a cuidar de mí.' },
  { title: 'Quiero ofrecer ayuda concreta', goal: 'Cambiar promesas generales por una oferta pequeña, clara y consentida.', words: '¿Te ayudaría que te acompañe a buscar un servicio, revisar una opción o hacer una llamada? Puedes decirme que no.' },
  { title: 'Necesito expresar un límite', goal: 'Cuidar la relación sin encubrir daños ni exponerte a situaciones inseguras.', words: 'Te quiero y quiero apoyarte. No puedo prestar dinero ni aceptar situaciones que nos pongan en riesgo. Sí puedo acompañarte a buscar ayuda.' },
];

const steps = [
  ['Escucha primero', 'Pregunta si la persona quiere hablar. Deja que termine y evita interrogarla.'],
  ['Pregunta qué necesita', 'No supongas que necesita consejos. Puede necesitar compañía, información o espacio.'],
  ['Ofrece una acción pequeña', 'Acompañar a una cita, buscar una entidad o revisar juntos una opción concreta.'],
  ['Acuerden el siguiente contacto', 'Define cuándo volverán a hablar, sin vigilar ni exigir reportes.'],
];

export function Familiares() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = conversations[selected];

  async function copyPhrase() {
    try {
      await navigator.clipboard.writeText(current.words);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="bl-family-page mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
      <header className="bl-family-hero relative overflow-hidden rounded-[2rem] px-6 py-9 sm:px-10 sm:py-14">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em]"><HeartHandshake className="h-4 w-4"/> Guía para familiares y personas cercanas</span>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-6xl">Acompañar también es <span>aprender a cuidarse.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">No tienes que tener todas las respuestas. Puedes escuchar, ofrecer apoyo concreto, respetar decisiones y reconocer cuándo necesitas ayuda para ti.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#conversaciones" className="inline-flex items-center gap-2 rounded-full bg-[#092f4c] px-5 py-3 font-semibold text-white shadow-lg hover:bg-[#124f6c]">Preparar una conversación <ArrowRight className="h-4 w-4"/></a>
            <a href="#seguridad" className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/45 px-5 py-3 font-semibold text-[#123b56] backdrop-blur">Orientación de seguridad <Shield className="h-4 w-4"/></a>
          </div>
        </div>
        <div className="bl-family-orbit" aria-hidden="true"><div/><div/><div/></div>
      </header>


      <section className="bl-visual-feature" aria-labelledby="family-visual-title">
        <div className="bl-visual-photo bl-photo-family"><img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=82" alt="Familia compartiendo un momento de cercanía y apoyo" loading="lazy" decoding="async"/><span>VÍNCULOS QUE ACOMPAÑAN</span></div>
        <div className="bl-visual-diagram"><p className="bl-family-kicker">Mapa de acompañamiento</p><h2 id="family-visual-title">Cuatro movimientos. Sin intentar controlarlo todo.</h2>
          <svg viewBox="0 0 640 170" role="img" aria-labelledby="family-flow-title family-flow-desc"><title id="family-flow-title">Ciclo de acompañamiento respetuoso</title><desc id="family-flow-desc">Escuchar, preguntar, ofrecer una acción y acordar un siguiente contacto. Se puede volver a cualquier paso.</desc><path d="M75 65 H565" stroke="#9bcbd9" strokeWidth="4" strokeDasharray="7 8" fill="none"/>{[75,238,402,565].map((x,i)=><g key={x}><circle cx={x} cy="65" r="28" fill={["#d8f2f7","#dce8fa","#e8e0f5","#dff0e8"][i]} stroke="#78b7ca" strokeWidth="2"/><text x={x} y="71" textAnchor="middle" fill="#17445f" fontSize="17" fontWeight="700">{i+1}</text><text x={x} y="119" textAnchor="middle" fill="#244e67" fontSize="13" fontWeight="600">{["Escuchar","Preguntar","Ofrecer","Acordar"][i]}</text></g>)}</svg>
          <p className="bl-diagram-note">No es una escalera ni una obligación: adapta el paso a la voluntad y la seguridad de cada persona.</p>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Principios de acompañamiento">
        <article className="bl-family-principle"><MessageCircle/><h2>Escuchar</h2><p>Comprender antes de aconsejar. La escucha no exige resolverlo todo.</p></article>
        <article className="bl-family-principle"><HandHeart/><h2>Acompañar</h2><p>Ofrecer opciones concretas, respetando autonomía y consentimiento.</p></article>
        <article className="bl-family-principle"><Heart/><h2>Cuidarse</h2><p>Tu bienestar también importa. Poner límites no significa dejar de querer.</p></article>
      </section>

      <section id="conversaciones" className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <p className="bl-family-kicker">Herramienta práctica</p>
          <h2 className="bl-family-heading">Encuentra palabras que abran puertas.</h2>
          <p className="mt-3 leading-relaxed text-slate-600">Elige una situación. La frase es solo un punto de partida: adáptala a tu relación y a lo que sea seguro para ambos.</p>
          <div className="mt-5 grid gap-2">
            {conversations.map((item, index) => (
              <button key={item.title} type="button" onClick={() => { setSelected(index); setCopied(false); }} aria-pressed={selected === index} className="bl-family-choice">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 font-bold text-cyan-800">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-left"><strong>{item.title}</strong><small>{item.goal}</small></span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0"/>
              </button>
            ))}
          </div>
        </div>
        <article className="bl-family-script">
          <div className="flex items-center justify-between gap-3"><span className="bl-family-kicker">Guion orientativo</span><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-900">Situación {selected + 1} de 4</span></div>
          <h3 className="mt-4 text-2xl font-bold text-[#0b3452]">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.goal}</p>
          <blockquote className="mt-7 rounded-2xl border border-white/90 bg-white/70 p-6 text-lg leading-relaxed text-[#153c58] shadow-inner">“{current.words}”</blockquote>
          <button type="button" onClick={copyPhrase} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0b3c59] px-5 py-3 text-sm font-semibold text-white hover:bg-[#155b78]">{copied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>}{copied ? 'Frase copiada' : 'Copiar frase'}</button>
          <p className="mt-4 text-xs text-slate-500">No es un libreto clínico. Si la frase no encaja o no es segura, no la uses.</p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="bl-family-panel">
          <h2><CheckCircle2/> Qué suele ayudar</h2>
          <ul>{steps.map(([title, detail]) => <li key={title}><strong>{title}</strong><span>{detail}</span></li>)}</ul>
        </article>
        <article className="bl-family-panel bl-family-panel-warm">
          <h2><AlertTriangle/> Qué conviene evitar</h2>
          <ul>
            <li><strong>Humillar o etiquetar.</strong><span>La vergüenza y los sermones pueden cerrar el diálogo.</span></li>
            <li><strong>Controlar cada decisión.</strong><span>Apoyar no significa vigilar, amenazar ni quitar autonomía.</span></li>
            <li><strong>Encubrir daños o asumirlo todo.</strong><span>No prestes dinero ni aceptes conductas que te pongan en riesgo.</span></li>
            <li><strong>Prometer resultados.</strong><span>No hay una frase ni una familia que pueda garantizar un proceso lineal.</span></li>
          </ul>
        </article>
      </section>

      <section className="bl-family-boundaries">
        <div><p className="bl-family-kicker">Cuidar a quien acompaña</p><h2 className="bl-family-heading">Los límites también son una forma de cuidado.</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-600">Puedes querer a alguien y, al mismo tiempo, decir que no. Busca una persona de confianza o apoyo profesional para hablar de lo que estás viviendo.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><strong>Me siento sobrepasado/a</strong><p>Puedo tomar una pausa y pedir apoyo para mí.</p></div>
          <div><strong>No me siento seguro/a</strong><p>Puedo alejarme de la situación y buscar ayuda inmediata.</p></div>
          <div><strong>No sé qué hacer</strong><p>Puedo consultar a un profesional o servicio local.</p></div>
          <div><strong>Necesito descansar</strong><p>El acompañamiento no debe depender de una sola persona.</p></div>
        </div>
      </section>

      <section id="seguridad" className="bl-family-safety">
        <div className="flex items-start gap-3"><Shield className="mt-1 h-7 w-7 shrink-0"/><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-100">Prioridad: seguridad</p><h2 className="mt-1 text-2xl font-bold sm:text-3xl">Si hay una urgencia, no intentes resolverla con esta guía.</h2><p className="mt-3 max-w-3xl leading-relaxed text-white/80">Ante pérdida de conciencia, dificultad para respirar, convulsiones, lesión grave, riesgo inmediato de suicidio o violencia, solicita atención de emergencia. En Colombia puedes llamar al 123. No dejes sola a una persona en peligro si puedes permanecer sin ponerte en riesgo.</p></div></div>
        <a href="tel:123" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-[#0b3452]"><Phone className="h-4 w-4"/> Llamar al 123</a>
        <p className="mt-4 text-xs text-white/65">La línea 106 y otros servicios de apoyo emocional pueden variar en cobertura según el municipio. Confirma su disponibilidad local. BLUMHelps no es un servicio de emergencias ni sustituye atención profesional.</p>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white bg-white/70 p-6 shadow-lg backdrop-blur">
        <div><p className="bl-family-kicker">Siguiente paso</p><h2 className="text-xl font-bold text-[#0b3452]">No tienes que acompañar sin apoyo.</h2><p className="mt-1 text-sm text-slate-600">Explora rutas y recursos para encontrar orientación profesional y comunitaria.</p></div>
        <div className="flex flex-wrap gap-2"><Link to="/ayuda" className="rounded-full bg-[#0b3c59] px-5 py-3 text-sm font-semibold text-white">Ver recursos</Link><Link to="/ruta" className="rounded-full border border-cyan-900/20 bg-white px-5 py-3 text-sm font-semibold text-[#0b3c59]">Mi ruta de hoy</Link></div>
      </section>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500"><BookOpen className="h-4 w-4 shrink-0"/>Contenido psicoeducativo general. No diagnostica, no prescribe y no reemplaza la evaluación de profesionales. Cada situación familiar requiere considerar seguridad, contexto y voluntad de las personas involucradas.</p>
    </main>
  );
}
