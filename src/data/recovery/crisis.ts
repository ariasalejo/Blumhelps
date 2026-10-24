import type { CrisisConfig, CrisisResource } from '../../lib/recovery/types';

// Configuración de recursos de crisis. Los números deben marcarse claramente
// hasta verificar su alcance. P2: Seguridad ante todo.
// 122 queda oculto hasta verificación. 123 es urgencias en Colombia.
// 106 se presenta con alcance explícito (Bogotá/distrital) hasta verificar alcance nacional.

const LAST_REVIEW = '2026-10-23';

function recursoColombia(partial: Partial<CrisisResource> & Pick<CrisisResource, 'id' | 'name' | 'shortLabel' | 'description' | 'type' | 'priority' | 'scope' | 'phone' | 'verificationStatus' | 'sourceUrl'>): CrisisResource {
  return {
    id: partial.id,
    name: partial.name,
    shortLabel: partial.shortLabel,
    phone: partial.phone,
    sms: partial.sms,
    whatsapp: partial.whatsapp,
    url: partial.url,
    description: partial.description,
    available: partial.available ?? '24/7',
    type: partial.type,
    priority: partial.priority,
    scope: partial.scope,
    visible: partial.verificationStatus !== 'NO_PUBLICAR_HASTA_VERIFICACION',
    verificationStatus: partial.verificationStatus,
    sourceUrl: partial.sourceUrl,
    lastReviewed: LAST_REVIEW,
    notes: partial.notes,
  };
}

export const crisisConfigColombia: CrisisConfig = {
  countryCode: 'CO',
  countryName: 'Colombia',
  region: 'Nacional',
  disclaimer:
    'Acompañamiento psicoeducativo. No sustituye atención profesional ni es un servicio médico de emergencias. Si estás en crisis, llama al 106 o al 123. Los recursos de esta configuración están marcados para verificación.',
  resources: [
    recursoColombia({
      id: 'emergencias-123',
      name: 'Emergencias',
      shortLabel: '123',
      phone: '123',
      description:
        'Emergencias médicas, policiales o de bomberos. Línea general de emergencias en Colombia.',
      type: 'emergency',
      priority: 1,
      scope: 'Nacional (verificar cobertura en tu municipio)',
      verificationStatus: 'VERIFICAR_ANTES_DE_PUBLICAR',
      sourceUrl: 'https://www.gov.co/',
      notes: 'Confirmar alcance oficial y teléfono correcto antes de promocionarlo como verificado.',
    }),
    recursoColombia({
      id: 'linea-106',
      name: 'Línea 106',
      shortLabel: '106',
      phone: '106',
      description:
        'Línea de atención en crisis emocional e intento de suicidio. En Colombia suele presentarse con alcance distrital (Bogotá); el alcance nacional debe verificarse antes de afirmar cobertura general.',
      type: 'mental-health',
      priority: 2,
      scope: 'Principalmente distrital (Bogotá). Verificar alcance nacional.',
      verificationStatus: 'VERIFICAR_ANTES_DE_PUBLICAR',
      sourceUrl: 'https://www.minsalud.gov.co/',
      notes:
        'Mantener alcance explícito. No afirmar cobertura 100% nacional sin evidencia oficial.',
    }),
    recursoColombia({
      id: 'linea-vida',
      name: 'Línea de la Vida',
      shortLabel: 'Línea de la Vida',
      phone: '106',
      description:
        'Apoyo en crisis, escucha activa y orientación. Se mantiene asociado a 106 hasta que haya fuentes verificables separadas.',
      type: 'mental-health',
      priority: 3,
      scope: 'Verificar',
      verificationStatus: 'VERIFICAR_ANTES_DE_PUBLICAR',
      sourceUrl: 'https://www.minsalud.gov.co/',
      notes: 'Puede ser la misma línea; no duplicar hasta verificar.',
    }),
    recursoColombia({
      id: 'icbf-linea-141',
      name: 'ICBF Línea 141',
      shortLabel: '141',
      phone: '141',
      description:
        'Línea de atención para niños, niñas y adolescentes. Protección y reporte.',
      type: 'child',
      priority: 4,
      scope: 'Nacional (verificar)',
      verificationStatus: 'VERIFICAR_ANTES_DE_PUBLICAR',
      sourceUrl: 'https://www.icbf.gov.co/',
      notes: 'Verificar horario y alcance antes de publicar como verificado.',
    }),
    recursoColombia({
      id: 'urgencias-122',
      name: 'Línea 122',
      shortLabel: '122',
      phone: '122',
      description:
        'Mencionado en algunos contextos. NO PUBLICADO HASTA VERIFICACIÓN. Oculto por defecto.',
      type: 'emergency',
      priority: 99,
      scope: 'No verificado',
      verificationStatus: 'NO_PUBLICAR_HASTA_VERIFICACION',
      sourceUrl: 'https://www.gov.co/',
      notes: 'Oculto. No mostrar en UI hasta tener fuente oficial verificable.',
    }),
  ],
};

export function getVisibleCrisisResources(config: CrisisConfig): CrisisResource[] {
  return config.resources
    .filter((r) => r.visible && r.verificationStatus !== 'NO_PUBLICAR_HASTA_VERIFICACION')
    .sort((a, b) => a.priority - b.priority);
}

export function getPrimaryCrisisPhones(): Array<{ label: string; phone: string; note: string }> {
  return [
    { label: 'Urgencias', phone: '123', note: 'Emergencias médicas/policía/bomberos (verificar cobertura)' },
    { label: 'Crisis emocional', phone: '106', note: 'Principalmente distrital (Bogotá). Alcance nacional a verificar.' },
  ];
}
