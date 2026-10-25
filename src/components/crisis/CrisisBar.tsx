import React from 'react';
import { Phone, AlertTriangle, MapPin } from 'lucide-react';
import { crisisConfigColombia, getVisibleCrisisResources } from '../../data/recovery/crisis';

// La franja informa rutas de ayuda sin prometer alcance o disponibilidad que no esté verificada.
export function CrisisBar() {
  const resources = getVisibleCrisisResources(crisisConfigColombia);
  const tel106 = resources.find((resource) => resource.shortLabel === '106')?.phone ?? '106';
  const tel123 = resources.find((resource) => resource.shortLabel === '123')?.phone ?? '123';

  return (
    <div className="border-b border-white/10 bg-[#062d30] text-white">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-7 lg:px-10">
        <div className="flex items-center justify-center gap-2 text-center sm:justify-start sm:text-left">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#f2b6a8]" aria-hidden="true" />
          <span className="text-[11px] font-bold tracking-wide sm:text-xs">¿Necesitas ayuda ahora?</span>
          <span className="hidden text-[10px] text-white/65 md:inline">BlumHelps no sustituye atención profesional ni emergencias.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <a
            href={`tel:${tel106}`}
            title="La cobertura de la línea 106 puede variar. Principalmente distrital (Bogotá); verifica disponibilidad en tu municipio."
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/20 bg-white/[.06] px-3 py-1.5 text-[10px] font-semibold text-white/90 transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MapPin className="h-3.5 w-3.5 text-[#c9e7ce]" aria-hidden="true" />
            106 · verifica cobertura local
          </a>
          <a
            href={`tel:${tel123}`}
            title="Llamar al número de emergencias. Confirma la cobertura local."
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#b94136] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#a4342c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Emergencias · 123
          </a>
        </div>
      </div>
    </div>
  );
}
