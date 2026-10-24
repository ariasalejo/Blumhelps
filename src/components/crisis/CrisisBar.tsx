import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import { crisisConfigColombia, getVisibleCrisisResources } from '../../data/recovery/crisis';

// CrisisBar lee configuración. 122 oculto hasta verificación. 106 con alcance explícito.
// No se hardcodea lógica de países no verificados.

export function CrisisBar() {
  const resources = getVisibleCrisisResources(crisisConfigColombia).slice(0, 2);
  const tel106 = resources.find((r) => r.shortLabel === '106')?.phone ?? '106';
  const tel123 = resources.find((r) => r.shortLabel === '123')?.phone ?? '123';

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white sticky top-0 z-[60] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-4 h-4" />
          <span>¿NECESITAS AYUDA YA?</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a href={`tel:${tel106}`} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition font-semibold" title="Línea 106 - principalmente distrital (Bogotá). Alcance nacional a verificar.">
            <Phone className="w-3.5 h-3.5" />
            Llamar al {tel106} (24/7)
          </a>
          <a href={`tel:${tel123}`} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition font-semibold">
            <Phone className="w-3.5 h-3.5" />
            Emergencias {tel123}
          </a>
          <span className="hidden md:inline text-xs opacity-90">Anónimo • Sin juicios • Confidencial</span>
        </div>
      </div>
    </div>
  );
}
