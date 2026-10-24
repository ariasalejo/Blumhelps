// BLUMHELPS - CrisisRouter (Colombia)
export interface CrisisLine {
  id: string;
  name: string;
  phone: string;
  description: string;
  available: string;
  type: 'emergency' | 'mental-health' | 'substance' | 'family';
  priority: number;
}

export const CRISIS_LINES_CO: CrisisLine[] = [
  {
    id: 'emergencias-123',
    name: 'Emergencias',
    phone: '123',
    description: 'Ambulancia, Bomberos o Policía en caso de emergencia inmediata.',
    available: '24/7',
    type: 'emergency',
    priority: 1
  },
  {
    id: 'linea-106',
    name: 'Línea Calma / Línea 106',
    phone: '106',
    description: 'Apoyo en crisis emocional, intento de suicidio y orientación inmediata.',
    available: '24/7',
    type: 'mental-health',
    priority: 2
  },
  {
    id: 'linea-vida',
    name: 'Línea de la Vida',
    phone: '106',
    description: 'Atención en crisis, escucha activa y derivación a ayuda especializada.',
    available: '24/7',
    type: 'mental-health',
    priority: 3
  }
];

export function getCrisisPriority(): CrisisLine[] {
  return [...CRISIS_LINES_CO].sort((a, b) => a.priority - b.priority);
}

export function getEmergencyTel(): string {
  return 'tel:123';
}

export function getCrisisTel(): string {
  return 'tel:106';
}
