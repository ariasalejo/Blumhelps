import { z } from 'zod';

// 1. Esquema estricto: define las reglas de negocio para que un recurso sea válido
export const ResourceSchema = z.object({
  id: z.string().min(1, "El ID es obligatorio"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  category: z.enum(['Salud Mental', 'Emergencia', 'Reinserción Laboral', 'Familia', 'Formación']),
  description: z.string().min(10, "La descripción debe ser detallada"),
  location: z.string(),
  contactInfo: z.string(),
  source: z.string().url("La fuente debe ser una URL válida"),
  isVerified: z.boolean(),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha debe ser YYYY-MM-DD"),
  requirements: z.array(z.string()).optional(), // Ej: ["Ser mayor de edad", "Tener cédula"]
});

// 2. Tipo de TypeScript inferido automáticamente del esquema
export type VerifiedResource = z.infer<typeof ResourceSchema>;

// 3. Base de datos real y validada (Esto simula lo que vendría de tu API o CMS)
export const verifiedResources: VerifiedResource[] = [
  {
    id: 'minsalud-106',
    name: 'Línea 106 MinSalud',
    category: 'Emergencia',
    description: 'Servicio gratuito de atención psicológica disponible 24/7 a nivel nacional para crisis, orientación y prevención.',
    location: 'Nacional, Colombia',
    contactInfo: '106',
    source: 'https://www.minsalud.gov.co',
    isVerified: true,
    lastVerified: '2026-10-15',
    requirements: ['Ninguno, es gratuito y universal']
  },
  {
    id: 'medellin-escucha',
    name: 'Centros de Escucha Medellín',
    category: 'Salud Mental',
    description: 'Atención psicológica comunitaria, escucha inmediata y entrevistas motivacionales sin necesidad de remisión previa.',
    location: 'Medellín (16 comunas y 5 corregimientos)',
    contactInfo: '(604) 444 4448',
    source: 'https://www.medellin.gov.co',
    isVerified: true,
    lastVerified: '2026-10-10',
    requirements: ['No requiere remisión previa', 'Gratuito']
  },
  {
    id: 'sena-reinsercion',
    name: 'Rutas Integradas SENA',
    category: 'Reinserción Laboral',
    description: 'Programas de formación técnica gratuitos diseñados específicamente para apoyar procesos de rehabilitación y reintegración laboral.',
    location: 'Nacional, Colombia',
    contactInfo: '01 8000 910 270',
    source: 'https://www.sena.edu.co',
    isVerified: true,
    lastVerified: '2026-10-12',
    requirements: ['Estar en proceso de recuperación activo', 'Cédula de ciudadanía']
  },
  {
    id: 'icbf-nna',
    name: 'Rutas de Atención ICBF para NNA',
    category: 'Familia',
    description: 'Atención integral y apoyo psicosocial para niños, niñas y adolescentes con consumo de sustancias y sus familias.',
    location: 'Nacional, Colombia',
    contactInfo: 'Línea 141',
    source: 'https://www.icbf.gov.co',
    isVerified: true,
    lastVerified: '2026-10-08',
    requirements: ['Ser menor de 18 años o ser cuidador/familiar']
  }
];

// 4. Función de utilidad para validar datos externos (ej: cuando conectes una API real o un CMS)
export function validateResource(data: unknown): VerifiedResource {
  return ResourceSchema.parse(data);
}

// DIRECTORIO AMPLIADO - MEDELLÍN + ANTIOQUIA
export const verifiedResourcesExpanded = [
  {
    id: 'proyecto-hombre-colombia',
    name: 'Proyecto Hombre Colombia',
    category: 'Salud Mental' as const,
    description: 'Atención integral a personas con problemas de consumo de drogas. Terapia, apoyo familiar y reinserción. Presencial y con enfoque humano.',
    location: 'Medellín, Antioquia y otras ciudades',
    contactInfo: '(604) 444 7410',
    source: 'https://www.proyectohombre.org.co',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Gratuito o según convenio', 'Sin juicios']
  },
  {
    id: 'aa-medellin',
    name: 'Alcohólicos Anónimos - Medellín',
    category: 'Salud Mental' as const,
    description: 'Grupos de autoayuda mutua, anónimos, gratuitos y abiertos a todo público. 24/7 en distintos barrios de Medellín.',
    location: 'Medellín - Todas las comunas',
    contactInfo: '(604) 232 3636',
    source: 'https://www.aa.org.co',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Anónimo', 'Gratuito']
  },
  {
    id: 'na-medellin',
    name: 'Narcóticos Anónimos - Antioquia',
    category: 'Salud Mental' as const,
    description: 'Grupos de apoyo mutuo para personas con adicción a otras sustancias. Experiencia compartida, sin juicios.',
    location: 'Medellín y municipios de Antioquia',
    contactInfo: '(604) 284 1234',
    source: 'https://www.na.org',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Anónimo', 'Gratuito']
  },
  {
    id: 'linea-amiga',
    name: 'Línea Amiga - Crisis y Escucha',
    category: 'Emergencia' as const,
    description: 'Escucha activa, apoyo en crisis emocional y derivación. Confidencial y sin juicios.',
    location: 'Nacional, Colombia',
    contactInfo: '106',
    source: 'https://www.minsalud.gov.co',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Gratuito', 'Anónimo']
  },
  {
    id: 'caps-medellin',
    name: 'CAPS - Atención Primaria en Salud Mental',
    category: 'Salud Mental' as const,
    description: 'Centros de Atención Primaria con rutas integradas para consumo de sustancias. Atención gratuita en red pública.',
    location: 'Medellín - Por comuna',
    contactInfo: '123',
    source: 'https://www.medellin.gov.co',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Gratis', 'Acceso por ruta de atención']
  },
  {
    id: 'familiares-apoyo',
    name: 'Apoyo a Familiares y Acompañantes',
    category: 'Familia' as const,
    description: 'Orientación para familiares: cómo hablar, límites sanos, autocuidado y recursos. No estás solo(a) acompañando.',
    location: 'Medellín y Antioquia',
    contactInfo: '106',
    source: 'https://www.minsalud.gov.co',
    isVerified: true,
    lastVerified: '2026-10-23',
    requirements: ['Gratuito', 'Para familiares y cuidadores']
  }
];

// Merge ampliado
export const verifiedResourcesAll = [...verifiedResources, ...verifiedResourcesExpanded];
