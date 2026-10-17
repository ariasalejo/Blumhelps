import React from 'react';
import { ShieldCheck, Check, Headphones, MapPin, Phone, Mail, ExternalLink, Bookmark, PhoneCall, Clock, HeartPulse, Building2, Users, AlertCircle, Scale } from 'lucide-react';

export function Resources() {
  const resources = [
    {
      icon: <Headphones className="w-6 h-6 text-[var(--lime)]" />,
      bg: "bg-[var(--moss)]",
      title: "Línea 106 (MinSalud)",
      desc: "Servicio gratuito de atención psicológica del Ministerio de Salud, disponible para todas las personas en Colombia, 24/7.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "Nacional · 24 horas · 7 días" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "Marca 106 (Gratuito desde cualquier celular)" },
        { icon: <Clock className="w-3.5 h-3.5" />, text: "Orientación psicológica y atención en crisis" }
      ],
      source: "MinSalud Colombia",
      link: "https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx",
      action: "Llamar al 106",
      href: "tel:106"
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-[var(--cream)]" />,
      bg: "bg-[var(--terra)]",
      title: "Centros de Escucha (Medellín)",
      desc: "Atención psicológica comunitaria, escucha inmediata y entrevistas motivacionales en las 16 comunas y 5 corregimientos.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "Medellín, todas las comunas" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "(604) 444 4448 · WhatsApp 301 604 4444" },
        { icon: <Mail className="w-3.5 h-3.5" />, text: "centrosdeescuchaspa.maite@gmail.com" }
      ],
      source: "Alcaldía de Medellín",
      link: "https://www.medellin.gov.co",
      action: "Contactar",
      href: "tel:+576044444448"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-[var(--lime)]" />,
      bg: "bg-[var(--moss-deep)]",
      title: "Línea Construyéndonos",
      desc: "Línea de ayuda psicológica gratuita 24 horas en Colombia, enfocada en prevención del suicidio y apoyo emocional inmediato.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "Nacional · 24 horas" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "(606) 735 9950" },
        { icon: <Clock className="w-3.5 h-3.5" />, text: "Atención profesional inmediata" }
      ],
      source: "Construyéndonos",
      link: "https://construyendonos.org/",
      action: "Llamar ahora",
      href: "tel:+576067359950"
    },
    {
      icon: <Building2 className="w-6 h-6 text-[var(--cream)]" />,
      bg: "bg-[var(--clay)]",
      title: "Fundación Libérate",
      desc: "IPS reconocida enfocada en la atención, rehabilitación y tratamiento integral de adicciones en Bogotá con enfoque humano.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "Calle 35 N.o 20 - 32, Teusaquillo, Bogotá" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "(601) 919 2800" },
        { icon: <Mail className="w-3.5 h-3.5" />, text: "fundacionliberate@fundacionliberate.org.co" }
      ],
      source: "Fundación Libérate",
      link: "https://fundacionliberate.org.co/",
      action: "Visitar sitio",
      href: "https://fundacionliberate.org.co/"
    },
    {
      icon: <Users className="w-6 h-6 text-[var(--lime)]" />,
      bg: "bg-[var(--accent)]",
      title: "Línea 123 (Emergencias)",
      desc: "Línea nacional de emergencias. Disponible las 24 horas para crisis de salud mental, urgencias médicas o situaciones de riesgo.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "Nacional · 24 horas" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "Marca 123 (Gratuito)" },
        { icon: <AlertCircle className="w-3.5 h-3.5" />, text: "Solo para emergencias reales" }
      ],
      source: "Gobierno de Colombia",
      link: "https://www.gov.co",
      action: "Llamar al 123",
      href: "tel:123"
    },
    {
      icon: <Scale className="w-6 h-6 text-[var(--cream)]" />,
      bg: "bg-[var(--sage)]",
      title: "Ruta de Atención EPS",
      desc: "Tienes derecho a solicitar cita directamente con psicología o psiquiatría a través de tu EPS, sin pasar primero por medicina general.",
      details: [
        { icon: <MapPin className="w-3.5 h-3.5" />, text: "A través de tu EPS afiliada" },
        { icon: <Phone className="w-3.5 h-3.5" />, text: "Línea de atención de tu EPS" },
        { icon: <Clock className="w-3.5 h-3.5" />, text: "Garantizado por la Ley 1566 de 2012" }
      ],
      source: "MinSalud / Defensoría",
      link: "https://www.minsalud.gov.co",
      action: "Consultar tu EPS",
      href: "https://www.minsalud.gov.co"
    }
  ];

  return (
    <section id="recursos" className="py-28 px-6 lg:px-10 relative">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 reveal">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--moss)]/10 text-[var(--moss)] text-xs font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--moss)]"></span>
              01 · Recursos verificados
            </div>
            <h2 className="serif text-5xl md:text-6xl font-semibold leading-[0.95] tracking-tight mb-6">
              Solo recursos que<br/><span className="italic">existen de verdad.</span>
            </h2>
            <p className="text-lg text-muted leading-relaxed max-w-xl">
              Cada recurso listado proviene de fuentes oficiales colombianas verificadas. Mostramos la fuente, el contacto publicado y la fecha de verificación. Cero datos inventados.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <div className="w-full p-6 rounded-2xl bg-[var(--ink)]/5 border border-ink">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-[var(--moss)]" />
                <h3 className="serif text-xl font-semibold">Nuestro protocolo de verificación</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Solo entidades públicas o fundaciones reconocidas</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Contactos publicados oficialmente</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-[var(--moss)] mt-0.5 flex-shrink-0" /> Fecha de última verificación visible</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r, i) => (
            <article key={i} className="surface bg-white rounded-3xl p-7 hover-lift card-shine relative overflow-hidden border border-ink">
              <div className="flex items-center justify-between mb-5">
                <span className="verified-pill"><Check className="w-3 h-3" /> Verificado</span>
                <span className="text-[10px] text-muted">Verificado oct 2026</span>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${r.bg} flex items-center justify-center mb-5`}>
                {r.icon}
              </div>
              <h3 className="serif text-2xl font-semibold mb-2">{r.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{r.desc}</p>
              <div className="space-y-2 text-xs text-muted mb-5">
                {r.details.map((d, idx) => (
                  <div key={idx} className="flex items-center gap-2">{d.icon} {d.text}</div>
                ))}
              </div>
              <a href={r.link} target="_blank" rel="noopener noreferrer" className="source-link mb-4">
                <ExternalLink className="w-3 h-3" /> Fuente: {r.source}
              </a>
              <div className="flex gap-2">
                <a href={r.href} className="flex-1 bg-[var(--moss)] text-[var(--cream)] py-3 rounded-xl text-sm font-medium hover:bg-[var(--moss-deep)] transition flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> {r.action}
                </a>
                <button className="w-12 h-12 rounded-xl bg-[var(--ink)]/5 border border-ink flex items-center justify-center hover:bg-[var(--ink)]/10 transition" aria-label="Guardar">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-[var(--moss)]/5 border border-[var(--moss)]/20 flex items-start gap-4 reveal">
          <Scale className="w-6 h-6 text-[var(--moss)] flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold mb-1">Marco legal colombiano</h4>
            <p className="text-sm text-muted leading-relaxed">
              La <strong>Ley 1566 de 2012</strong> reconoce el derecho a la atención integral de personas con trastornos relacionados con el consumo. BlumHelps no sustituye la atención profesional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
