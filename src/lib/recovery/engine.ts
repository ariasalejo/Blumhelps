import type {
  DailyPlan,
  Etapa,
  Formato,
  Reason,
  ReasonDimension,
  RecommendationContext,
  RecoveryItem,
  RecoveryProfile,
  ScoredItem,
  Tema,
} from './types';

// Motor de recomendación EXPLICABLE. Sin modelos opacos.
// Todo score() debe devolver reasons[] con explicaciones legibles.
// No hace llamadas a red. Función pura.

const PESOS = {
  etapaCompatible: 40,
  desencadenanteMatch: 30,
  formatoPreferido: 15,
  evidenciaMetaAnalisis: 20,
  evidenciaRCT: 15,
  evidenciaCohortes: 10,
  evidenciaExpertOpinion: 3,
  evidenciaPendiente: 0,
  progresoRepetidoHoy: -50,
  progresoRepetidoReciente: -15,
  diversidadTemaNuevo: 10,
  diversidadTemaReciente: -8,
  valorACT: 25,
  tiempoDisponible: 10,
  recaidaFocus: 12,
} as const;

const ETAPA_ORDEN: Record<Etapa, number> = {
  precontemplacion: 0,
  contemplacion: 1,
  preparacion: 2,
  accion: 3,
  mantenimiento: 4,
  recaida: 2,
};

const EVIDENCIA_PESOS: Record<RecoveryItem['nivelEvidencia'], number> = {
  metaanalisis: PESOS.evidenciaMetaAnalisis,
  ensayo_controlado: PESOS.evidenciaRCT,
  cohortes: PESOS.evidenciaCohortes,
  expert_opinion: PESOS.evidenciaExpertOpinion,
  PENDIENTE_VERIFICACION: PESOS.evidenciaPendiente,
};

function razon(
  peso: number,
  dimension: ReasonDimension,
  explicacion: string,
): Reason {
  return { peso, dimension, explicacion };
}

function etapaCompatible(
  perfil: RecoveryProfile,
  item: RecoveryItem,
): { compatible: boolean; reasons: Reason[] } {
  const etapaPerfil = perfil.etapa;
  const razones: Reason[] = [];

  if (!item.etapas.includes(etapaPerfil)) {
    return { compatible: false, reasons: [] };
  }

  razones.push(
    razon(
      PESOS.etapaCompatible,
      'etapa',
      `Por tu etapa de cambio (${etapaPerfil.replace('_', ' ')}): este ítem está pensado para esta fase del proceso.`,
    ),
  );

  if (etapaPerfil === 'recaida') {
    if (item.tema === 'manejo_recaidas' || item.tema === 'autocompasion') {
      razones.push(
        razon(
          PESOS.recaidaFocus,
          'etapa',
          'Enfocado al cuidado tras una recaída: retomar sin castigo y buscar apoyo.',
        ),
      );
    }
  }

  return { compatible: true, reasons: razones };
}

function puntajeDesencadenantes(
  perfil: RecoveryProfile,
  item: RecoveryItem,
): Reason[] {
  const razones: Reason[] = [];
  if (perfil.desencadenantes.length === 0) return razones;

  const tags = new Set(item.tags);
  const temas = new Set([item.tema, ...item.subtemas]);

  let match = false;

  // Mapeo heurístico explícito y auditable (no opaco).
  for (const t of perfil.desencadenantes) {
    const desc = t.descripcion.toLowerCase();
    if (desc.includes('estrés') || desc.includes('ansiedad')) {
      if (temas.has('regulacion_emocional') || temas.has('mindfulness') || tags.has('respiracion')) {
        match = true;
        break;
      }
    }
    if (desc.includes('sueño') || desc.includes('insomnio')) {
      if (item.tema === 'higiene_sueno') {
        match = true;
        break;
      }
    }
    if (desc.includes('soledad') || desc.includes('aislamiento') || desc.includes('conflicto')) {
      if (item.tema === 'apoyo_social' || item.tema === 'comunicacion_asertiva') {
        match = true;
        break;
      }
    }
    if (desc.includes('craving') || desc.includes('antojo') || desc.includes('urgencia')) {
      if (item.tema === 'craving_como_ola') {
        match = true;
        break;
      }
    }
  }

  if (match) {
    razones.push(
      razon(
        PESOS.desencadenanteMatch,
        'desencadenante',
        'Por tu desencadenante identificado: este ejercicio ofrece una herramienta para ese momento.',
      ),
    );
  }

  return razones;
}

function puntajeFormato(
  perfil: RecoveryProfile,
  item: RecoveryItem,
): Reason[] {
  const razones: Reason[] = [];
  const pref = perfil.preferencias.formatos;
  if (pref.length === 0) return razones;

  if (pref.includes(item.formato)) {
    razones.push(
      razon(
        PESOS.formatoPreferido,
        'formato',
        `Ajustado a tu formato preferido (${item.formato.replace('_', ' ')}).`,
      ),
    );
  }

  return razones;
}

function puntajeEvidencia(item: RecoveryItem): Reason[] {
  const peso = EVIDENCIA_PESOS[item.nivelEvidencia];
  if (peso === 0) return [];
  let texto = 'Nivel de evidencia: ';
  if (item.nivelEvidencia === 'metaanalisis') texto += 'metaanálisis.';
  else if (item.nivelEvidencia === 'ensayo_controlado') texto += 'ensayo controlado.';
  else if (item.nivelEvidencia === 'cohortes') texto += 'estudios de cohorte.';
  else if (item.nivelEvidencia === 'expert_opinion') texto += 'opinión experta.';
  else return [];
  return [razon(peso, 'evidencia', texto)];
}

function puntajeProgreso(
  item: RecoveryItem,
  contexto: RecommendationContext,
): Reason[] {
  const razones: Reason[] = [];
  if (contexto.completadosHoy.includes(item.id)) {
    razones.push(
      razon(
        PESOS.progresoRepetidoHoy,
        'progreso',
        'Ya lo completaste hoy. Se evita repetirlo para promover diversidad en tu práctica.',
      ),
    );
  } else if (contexto.completadosRecientes.includes(item.id)) {
    razones.push(
      razon(
        PESOS.progresoRepetidoReciente,
        'progreso',
        'Lo has practicado recientemente. Se le da menor prioridad hoy.',
      ),
    );
  }
  return razones;
}

function puntajeDiversidad(
  item: RecoveryItem,
  contexto: RecommendationContext,
): Reason[] {
  const razones: Reason[] = [];
  if (contexto.temasRecientes.includes(item.tema)) {
    razones.push(
      razon(
        PESOS.diversidadTemaReciente,
        'diversidad',
        'Tema trabajado recientemente. Se prioriza rotación para cubrir distintas habilidades.',
      ),
    );
  } else {
    razones.push(
      razon(
        PESOS.diversidadTemaNuevo,
        'diversidad',
        'Añade un tema nuevo para ampliar tu caja de herramientas.',
      ),
    );
  }
  return razones;
}

function puntajeValoresACT(
  perfil: RecoveryProfile,
  item: RecoveryItem,
): Reason[] {
  if (perfil.valoresACT.length === 0) return [];
  if (item.tema === 'valores_personales') {
    return [
      razon(
        PESOS.valorACT,
        'valor_ACT',
        'Se alinea con tu trabajo de valores (ACT): elegir dirección incluso en días difíciles.',
      ),
    ];
  }
  return [];
}

function puntajeTiempo(
  perfil: RecoveryProfile,
  item: RecoveryItem,
  contexto: RecommendationContext,
): Reason[] {
  const razones: Reason[] = [];
  const objetivo = perfil.preferencias.minutosDia || contexto.minutosDisponibles || 10;
  if (item.duracionMin <= objetivo) {
    razones.push(
      razon(
        PESOS.tiempoDisponible,
        'tiempo_disponible',
        `Ajustado a tu tiempo disponible (${item.duracionMin} min ≤ ${objetivo} min).`,
      ),
    );
  }
  return razones;
}

/**
 * scoreItem es una función pura. Toda razón es legible en español.
 */
export function scoreItem(
  perfil: RecoveryProfile,
  item: RecoveryItem,
  contexto: RecommendationContext,
): ScoredItem {
  const razones: Reason[] = [];
  let score = 0;

  const etapa = etapaCompatible(perfil, item);
  if (!etapa.compatible) {
    return { item, score: -1000, reasons: [] };
  }
  for (const r of etapa.reasons) {
    score += r.peso;
    razones.push(r);
  }

  for (const r of puntajeDesencadenantes(perfil, item)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeFormato(perfil, item)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeEvidencia(item)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeProgreso(item, contexto)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeDiversidad(item, contexto)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeValoresACT(perfil, item)) {
    score += r.peso;
    razones.push(r);
  }
  for (const r of puntajeTiempo(perfil, item, contexto)) {
    score += r.peso;
    razones.push(r);
  }

  // Penalización extra si ya completado hoy (aplicado antes) pero mantenemos razón.
  // Ordenamos razones por peso descendente para lectura clara.
  razones.sort((a, b) => b.peso - a.peso);

  return { item, score, reasons: razones };
}

function elegirMicroAccion(
  perfil: RecoveryProfile,
  catalogo: RecoveryItem[],
  contexto: RecommendationContext,
): ScoredItem {
  // Priorizar ejercicios cortos y prácticos.
  const candidatos = catalogo.filter(
    (i) =>
      i.duracionMin <= 5 &&
      (i.formato === 'ejercicio' ||
        i.formato === 'ejercicio_guiado' ||
        i.tema === 'craving_como_ola' ||
        i.tema === 'apoyo_social') &&
      i.etapas.includes(perfil.etapa),
  );
  if (candidatos.length === 0) {
    // Fallback a cualquier ítem corto compatible.
    const cortos = catalogo
      .filter((i) => i.duracionMin <= 5 && i.etapas.includes(perfil.etapa))
      .sort((a, b) => a.duracionMin - b.duracionMin);
    const elegido = cortos[0] ?? catalogo[0];
    return scoreItem(perfil, elegido, contexto);
  }
  const scored = candidatos.map((c) => scoreItem(perfil, c, contexto));
  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

function elegirEjercicioOpcional(
  perfil: RecoveryProfile,
  catalogo: RecoveryItem[],
  contexto: RecommendationContext,
  usados: Set<string>,
): ScoredItem | undefined {
  // Opcional y suave. No obligatorio.
  const candidatos = catalogo.filter(
    (i) =>
      !usados.has(i.id) &&
      i.etapas.includes(perfil.etapa) &&
      (i.tema === 'mindfulness' ||
        i.tema === 'regulacion_emocional' ||
        i.tema === 'autocompasion') &&
      i.duracionMin >= 3 &&
      i.duracionMin <= 10,
  );
  if (candidatos.length === 0) return undefined;
  const scored = candidatos.map((c) => scoreItem(perfil, c, { ...contexto, esEjercicioOpcional: true }));
  scored.sort((a, b) => b.score - a.score);
  // Solo sugerir si tiene score positivo.
  if (scored[0].score <= 0) return undefined;
  return scored[0];
}

/**
 * generateDailyPlan: máximo 3 sugerencias + 1 microacción + 1 ejercicio opcional.
 * Explicable con razones legibles.
 */
export function generateDailyPlan(
  perfil: RecoveryProfile,
  catalogo: RecoveryItem[],
  contexto: RecommendationContext,
): DailyPlan {
  const usados = new Set<string>();
  // Marcar completados como usados para diversidad.
  for (const id of contexto.completadosHoy) usados.add(id);
  for (const id of contexto.completadosRecientes) usados.add(id);

  // Candidatos base compatibles con etapa.
  const candidatos = catalogo.filter((i) => i.etapas.includes(perfil.etapa));

  // Scoring
  const scored = candidatos
    .map((i) => scoreItem(perfil, i, contexto))
    .filter((s) => s.score > -500); // permitir con razones pero penalizados

  // Ordenar por score desc.
  scored.sort((a, b) => b.score - a.score);

  // Seleccionar hasta 3 sugerencias, evitando duplicados.
  const sugerencias: ScoredItem[] = [];
  for (const s of scored) {
    if (sugerencias.length >= 3) break;
    if (usados.has(s.item.id)) continue;
    sugerencias.push(s);
    usados.add(s.item.id);
  }

  // Si no hay suficientes, relajar filtro sin romper explicación.
  if (sugerencias.length < 3) {
    for (const s of scored) {
      if (sugerencias.length >= 3) break;
      if (sugerencias.find((x) => x.item.id === s.item.id)) continue;
      sugerencias.push(s);
      usados.add(s.item.id);
    }
  }

  const microAccion = elegirMicroAccion(perfil, catalogo, contexto);
  usados.add(microAccion.item.id);

  const ejercicioOpcional = elegirEjercicioOpcional(perfil, catalogo, contexto, usados);

  // Razonamiento legible para el usuario.
  let razonamiento =
    'Plan diario pensado para tu etapa actual. Prioriza acciones pequeñas y seguras. Si hay crisis, prioriza ayuda inmediata.';
  if (perfil.etapa === 'recaida') {
    razonamiento =
      'Tras una recaída, el enfoque es cuidado y retomar, no castigo. Un paso pequeño es suficiente hoy.';
  } else if (perfil.etapa === 'precontemplacion') {
    razonamiento =
      'Sin presión para cambiar hoy. La información psicoeducativa te ayuda a conocer opciones a tu ritmo.';
  }

  return {
    fecha: contexto.hoy,
    sugerencias,
    microAccion,
    ejercicioOpcional,
    razonamiento,
  };
}

export function getEtapaProxima(etapa: Etapa): Etapa | undefined {
  const orden = ETAPA_ORDEN[etapa];
  const siguiente: Array<[Etapa, number]> = [
    ['precontemplacion', 0],
    ['contemplacion', 1],
    ['preparacion', 2],
    ['accion', 3],
    ['mantenimiento', 4],
  ];
  for (const [e, o] of siguiente) {
    if (o === orden + 1) return e;
  }
  return undefined;
}
