/**
 * Catálogo de recursos de demostración.
 * Marcado explícitamente como ficticio y demo.
 * Los datos reales verificados están en src/lib/verifiedResources.ts
 */

import { Resource } from '../hooks/useResourceFilter';

export const demoResources: Resource[] = [
  {
    id: 'demo_1',
    name: 'Taller ficticio de bienestar',
    category: 'Demo',
    description: 'Este es un recurso ficticio para ilustrar la interfaz. No existe en la vida real.',
    location: 'Bogotá · Virtual (ficticio)',
    isVerified: false
  },
  {
    id: 'demo_2',
    name: 'Grupo de apoyo ficticio',
    category: 'Demo',
    description: 'Recurso demostrativo. Para recursos reales, consulta la sección "Verificados".',
    location: 'Cali · Presencial (ficticio)',
    isVerified: false
  }
];

// Bandera explícita: estos datos son demo
export const demo: true = true;
export const ficticia: true = true;
