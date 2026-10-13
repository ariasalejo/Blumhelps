import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, MapPin, Wifi, Phone, CalendarDays, ShieldAlert, ExternalLink } from "lucide-react";
import type { Resource } from "../data/demo";
import { fmtDate } from "../data/demo";
import { useApp } from "../state/app";
import { DemoTag } from "./ui";

/** Tarjeta compacta de recurso para listas. */
export function ResourceCard({ r, to }: { r: Resource; to?: string }) {
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved(r.id);
  const body = (
    <div className="card-bh h-full flex flex-col gap-2.5 hover:shadow-lift transition-shadow group">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted">
            {r.type} · {r.city} <DemoTag />
          </p>
          <h3 className="mt-1 font-bold text-[17px] leading-snug text-ink group-hover:text-forest transition-colors">
            {r.title}
          </h3>
          <p className="text-sm text-muted mt-0.5">{r.org}</p>
        </div>
        <span
          aria-hidden="true"
          onClick={(e) => e.preventDefault()}
          className={"shrink-0 grid place-items-center w-10 h-10 rounded-full transition-colors " + (saved ? "bg-forest text-white" : "bg-sage text-forest")}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </span>
      </div>
      <p className="text-sm text-ink/80 leading-relaxed line-clamp-2">{r.summary}</p>
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><MapPin size={13} />{r.coverage}</span>
        <span className="inline-flex items-center gap-1">
          {r.modality.includes("telefónica") ? <Phone size={13} /> : r.modality.includes("virtual") ? <Wifi size={13} /> : <MapPin size={13} />}
          {r.modality.join(" · ")}
        </span>
        <span className="inline-flex items-center gap-1"><CalendarDays size={13} />Verificado {fmtDate(r.verifiedAt)}</span>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {to ? (
        <Link to={to} state={{ fromList: true }}>
          {body}
        </Link>
      ) : (
        body
      )}
      <button
        aria-label={saved ? `Quitar ${r.title} de guardados` : `Guardar ${r.title}`}
        onClick={() => toggleSave(r.id)}
        className="absolute top-4 right-4 w-11 h-11 rounded-full opacity-0 cursor-pointer"
        style={{ opacity: 1 }}
      >
        <span className="sr-only">{saved ? "Quitar de guardados" : "Guardar"}</span>
      </button>
    </div>
  );
}

/** Ficha completa del recurso (fuente, cobertura, verificación, limitaciones). */
export function ResourceDetail({ r }: { r: Resource }) {
  const { isSaved, toggleSave } = useApp();
  const saved = isSaved(r.id);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="card-bh">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald">
          {r.kind === "empleo" ? "Oportunidad laboral" : r.kind === "formacion" ? "Formación" : "Recurso"} <DemoTag />
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-ink leading-tight">{r.title}</h2>
        <p className="mt-1 text-[15px] text-muted font-medium">{r.org}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-ink/90">{r.summary}</p>

        <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <Field label="Fuente">
            {r.source}{" "}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-coral align-middle">
              <ShieldAlert size={12} /> verificar antes de confiar
            </span>
          </Field>
          <Field label="Cobertura">{r.coverage} · {r.city}</Field>
          <Field label="Modalidad">{r.modality.join(", ")}</Field>
          <Field label="Última verificación">{fmtDate(r.verifiedAt)} (fecha ficticia en demo)</Field>
          {r.duration && <Field label="Duración">{r.duration}</Field>}
          {r.level && <Field label="Nivel">{r.level}</Field>}
          {r.salaryNote && <Field label="Remuneración (ficticia)">{r.salaryNote}</Field>}
          <Field label="Limitaciones">{r.limitations}</Field>
        </dl>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            className={saved ? "btn-primary" : "btn-secondary"}
            onClick={() => toggleSave(r.id)}
          >
            {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
            {saved ? "Guardado — quitar" : "Guardar para después"}
          </button>
          <a
            className="btn-ghost inline-flex"
            href={r.url ?? "#"}
            onClick={(e) => { if (!r.url) e.preventDefault(); }}
            aria-disabled={!r.url}
          >
            <ExternalLink size={16} /> Ver sitio de la entidad
            {!r.url && <span className="text-xs">(en demo no hay enlace real)</span>}
          </a>
        </div>
      </div>

      <div className="rounded-xl2 bg-coral/10 border border-coral/30 p-4 text-sm leading-relaxed text-ink">
        <b>Antes de ir:</b> confirma horarios y requisitos directamente con la
        entidad. BlumHelps no presta servicios médicos ni legales y no garantiza
        cupos. Si hay peligro inmediato, llama a la <b>Línea 123</b>.
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-ink/90 leading-relaxed">{children}</dd>
    </div>
  );
}
