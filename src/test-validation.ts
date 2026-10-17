import { ResourceSchema } from './data/verifiedResources';

// Prueba 1: Un recurso válido debe pasar
const recursoValido = {
  id: 'test-1',
  name: 'Test',
  category: 'Emergencia' as const,
  description: 'Descripción de prueba con más de diez caracteres',
  location: 'Bogotá',
  contactInfo: '123',
  source: 'https://test.com',
  isVerified: true,
  lastVerified: '2026-01-01'
};

// Prueba 2: Un recurso sin fecha debe FALLAR
const recursoInvalido = {
  id: 'test-2',
  name: 'Test',
  category: 'Emergencia',
  description: 'Desc',
  location: 'Bogotá',
  contactInfo: '123',
  source: 'no-es-url', // Esto debe fallar
  isVerified: true,
  lastVerified: 'fecha-invalida' // Esto debe fallar
};

try {
  ResourceSchema.parse(recursoValido);
  console.log('✅ Recurso válido pasó correctamente');
} catch (e) {
  console.log('❌ ERROR: Recurso válido fue rechazado');
}

try {
  ResourceSchema.parse(recursoInvalido);
  console.log('❌ ERROR: Recurso inválido fue aceptado');
} catch (e) {
  console.log('✅ Recurso inválido fue rechazado correctamente');
  console.log('Razón:', (e as Error).message);
}
