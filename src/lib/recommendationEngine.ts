import { UserProfile } from '../data/userProfile';
import { verifiedResources, VerifiedResource } from '../data/verifiedResources';

// Reglas de recomendación basadas en el perfil
function scoreResource(resource: VerifiedResource, profile: UserProfile): number {
  let score = 0;

  // Prioridad por etapa
  if (profile.stage === 'crisis' && resource.category === 'Emergencia') {
    score += 100;
  }
  if (profile.stage === 'buscando_ayuda' && 
      (resource.category === 'Salud Mental' || resource.category === 'Emergencia')) {
    score += 80;
  }
  if (profile.stage === 'en_proceso' && resource.category === 'Reinserción Laboral') {
    score += 70;
  }

  // Prioridad por rol
  if (profile.role === 'familiar' && resource.category === 'Familia') {
    score += 60;
  }
  if (profile.role === 'persona_en_recuperacion' && 
      (resource.category === 'Salud Mental' || resource.category === 'Reinserción Laboral')) {
    score += 50;
  }

  // Prioridad por necesidades específicas
  if (profile.needs.includes('apoyo_emocional') && resource.category === 'Salud Mental') {
    score += 40;
  }
  if (profile.needs.includes('empleo') && resource.category === 'Reinserción Laboral') {
    score += 40;
  }
  if (profile.needs.includes('tratamiento') && resource.category === 'Salud Mental') {
    score += 30;
  }

  return score;
}

// Motor principal: devuelve recursos ordenados por relevancia
export function getRecommendedResources(profile: UserProfile): VerifiedResource[] {
  const scored = verifiedResources.map(resource => ({
    resource,
    score: scoreResource(resource, profile)
  }));

  // Ordenar por score descendente y filtrar solo los relevantes (score > 0)
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.resource);
}

// Generar mensaje de orientación basado en el perfil
export function getOrientationMessage(profile: UserProfile): string {
  if (profile.stage === 'crisis') {
    return 'Estás en un momento crítico. Lo más importante ahora es contactar una línea de emergencia. No estás solo/a.';
  }
  if (profile.stage === 'buscando_ayuda') {
    return 'Estás dando el primer paso, y eso es valiente. Estos recursos pueden orientarte en tu proceso.';
  }
  if (profile.stage === 'en_proceso') {
    return 'Ya estás en camino. Estos recursos pueden apoyarte en tu reinserción y bienestar.';
  }
  if (profile.stage === 'mantenimiento') {
    return 'Has avanzado mucho. Estos recursos pueden ayudarte a sostener tu progreso.';
  }
  return '';
}
