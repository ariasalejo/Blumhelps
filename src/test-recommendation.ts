import { UserProfileSchema } from './data/userProfile';
import { getRecommendedResources, getOrientationMessage } from './lib/recommendationEngine';

// ESCENARIO 1: Persona en crisis en Medellín que necesita apoyo emocional
const perfilCrisis = {
  role: 'persona_en_recuperacion' as const,
  city: 'Medellín',
  stage: 'crisis' as const,
  needs: ['apoyo_emocional' as const],
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
};

const perfilCrisisValidado = UserProfileSchema.parse(perfilCrisis);

console.log('\n=========================================');
console.log('🚨 ESCENARIO 1: Persona en Crisis');
console.log('=========================================');
console.log('💬 Mensaje del sistema:', getOrientationMessage(perfilCrisisValidado));
console.log('\n📋 Recursos recomendados (ordenados por urgencia):');
const recursosCrisis = getRecommendedResources(perfilCrisisValidado);
recursosCrisis.forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.category}] ${r.name}`);
  console.log(`     📞 Contacto: ${r.contactInfo}`);
});

// ESCENARIO 2: Familiar en Bogotá buscando información sobre tratamientos
const perfilFamiliar = {
  role: 'familiar' as const,
  city: 'Bogotá',
  stage: 'buscando_ayuda' as const,
  needs: ['informacion_familia' as const, 'tratamiento' as const],
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString()
};

const perfilFamiliarValidado = UserProfileSchema.parse(perfilFamiliar);

console.log('\n=========================================');
console.log('👨‍👩‍👧 ESCENARIO 2: Familiar buscando ayuda');
console.log('=========================================');
console.log('💬 Mensaje del sistema:', getOrientationMessage(perfilFamiliarValidado));
console.log('\n📋 Recursos recomendados (ordenados por relevancia):');
const recursosFamiliar = getRecommendedResources(perfilFamiliarValidado);
recursosFamiliar.forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.category}] ${r.name}`);
});
console.log('=========================================\n');
