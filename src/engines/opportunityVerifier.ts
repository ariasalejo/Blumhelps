// BLUMHELPS - Verificador de vigencia de oportunidades
export interface VerificationInfo {
  status: 'ok' | 'review' | 'stale';
  label: string;
  color: string;
  daysSince: number;
  advice: string;
}

export function checkOpportunity(lastVerified: string): VerificationInfo {
  try {
    const last = new Date(lastVerified + 'T00:00:00');
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 30) {
      return {
        status: 'ok',
        label: `Verificado hace ${daysSince} día${daysSince === 1 ? '' : 's'}`,
        color: 'text-emerald-700 bg-emerald-50',
        daysSince,
        advice: 'Información reciente. Verifica convocatorias vigentes al inscribirte.'
      };
    }
    if (daysSince <= 90) {
      return {
        status: 'review',
        label: `Verificado hace ${daysSince} días`,
        color: 'text-amber-700 bg-amber-50',
        daysSince,
        advice: 'Convocatorias cambian con frecuencia. Confirma que esté abierto antes de inscribirte.'
      };
    }
    return {
      status: 'stale',
      label: `Sin revisar hace ${daysSince} días`,
      color: 'text-orange-700 bg-orange-50',
      daysSince,
      advice: 'POR REVISAR: Las convocatorias pueden haber cambiado. Confirma siempre en la página oficial.'
    };
  } catch {
    return {
      status: 'review',
      label: 'Fecha por confirmar',
      color: 'text-gray-700 bg-gray-100',
      daysSince: 0,
      advice: 'Confirma siempre en la página oficial antes de inscribirte.'
    };
  }
}
