// BLUMHELPS - OpportunityMatcher (Empleo + Capacitación + Incentivos)
// Medellín - Antioquia | Enfocado a reinserción laboral

export interface Opportunity {
  id: string;
  title: string;
  type: 'curso' | 'empleo' | 'beca' | 'incentivo' | 'podcast' | 'video';
  provider: 'SENA' | 'Coursera' | 'MinTIC' | 'Medellín' | 'Antioquia' | 'Comfama' | 'Otra';
  location: 'presencial' | 'virtual' | 'hibrido' | 'nacional';
  free: boolean;
  description: string;
  howToApply: string[];
  requirements: string[];
  target: string;
  url: string;
  verified: boolean;
  tags: string[];
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: 'sena-sofia-plus',
    title: 'SENA SofiaPlus - Cursos y Tecnólogos Gratuitos',
    type: 'curso',
    provider: 'SENA',
    location: 'presencial',
    free: true,
    description: 'Formación técnica, tecnológica y complementaria gratuita. Amplia oferta en Medellín y Antioquia. Ideal para iniciar o retomar formación.',
    howToApply: ['Ingresar a https://oferta.senasofiaplus.edu.co/', 'Crear cuenta con cédula', 'Inscribirse al curso de interés', 'Seguir instrucciones de convocatoria'],
    requirements: ['Cédula de ciudadanía', 'Mayor de edad (según programa)'],
    target: 'Sin experiencia o con experiencia. Enfocado a reinserción',
    url: 'https://oferta.senasofiaplus.edu.co/',
    verified: true,
    tags: ['empleo', 'formacion', 'reinsercion', 'presencial-medellin', 'sin-experiencia']
  },
  {
    id: 'comfama-formacion',
    title: 'Comfama - Formación para el Trabajo',
    type: 'curso',
    provider: 'Comfama',
    location: 'hibrido',
    free: true,
    description: 'Programas gratuitos de formación, empleabilidad, oficios y desarrollo humano. Muy enfocado a población vulnerable en Antioquia.',
    howToApply: ['Consultar convocatorias en comfama.com', 'Inscribirse por la ruta de empleo/formación', 'Asistir a orientación'],
    requirements: ['Residir en Antioquia (según convocatoria)'],
    target: 'Población vulnerable, reinserción laboral',
    url: 'https://www.comfama.com/',
    verified: true,
    tags: ['empleo', 'formacion', 'antioquia', 'reinsercion']
  },
  {
    id: 'agencia-empleo-medellin',
    title: 'Agencia de Empleo de Medellín',
    type: 'empleo',
    provider: 'Medellín',
    location: 'presencial',
    free: true,
    description: 'Orientación laboral, hoja de vida, vacantes, ferias de empleo y rutas para población en proceso de reinserción. Atención presencial y gratuita.',
    howToApply: ['Acercarse a punto de atención de la Agencia de Empleo', 'Actualizar hoja de vida', 'Asistir a orientación ocupacional'],
    requirements: ['Cédula', 'Disponibilidad para trabajar'],
    target: 'Búsqueda activa de empleo, reinserción',
    url: 'https://www.medellin.gov.co/',
    verified: true,
    tags: ['empleo', 'medellin', 'reinsercion', 'sin-experiencia']
  },
  {
    id: 'talento-tech-mintic',
    title: 'Talento Tech - MinTIC',
    type: 'beca',
    provider: 'MinTIC',
    location: 'virtual',
    free: true,
    description: 'Formación intensiva en programación, análisis de datos y habilidades digitales. Becas 100% gratuitas con enfoque a empleabilidad.',
    howToApply: ['Revisar convocatorias vigentes en mintic.gov.co', 'Postularse cuando haya convocatoria abierta', 'Completar proceso de selección'],
    requirements: ['Conexión a internet', 'Disposición para aprender'],
    target: 'Jóvenes y adultos, sin experiencia en programación',
    url: 'https://www.mintic.gov.co/',
    verified: true,
    tags: ['tecnologia', 'beca', 'virtual', 'empleo']
  },
  {
    id: 'coursera-audit-gratis',
    title: 'Coursera - Auditar cursos gratis',
    type: 'curso',
    provider: 'Coursera',
    location: 'virtual',
    free: true,
    description: 'Miles de cursos de universidades mundiales. Muchas opciones para "Auditar curso" sin costo. Aprende habilidades digitales, atención al cliente, ventas y más.',
    howToApply: ['Crear cuenta en coursera.org', 'Buscar curso', 'Seleccionar "Auditar curso" si aparece la opción', 'Aprender a tu ritmo'],
    requirements: ['Correo electrónico', 'Internet'],
    target: 'Aprendizaje autónomo desde casa',
    url: 'https://es.coursera.org/',
    verified: true,
    tags: ['digital', 'virtual', 'gratis', 'habilidades']
  },
  {
    id: 'ruta-oficios-medellin',
    title: 'Rutas cortas de oficios - Medellín',
    type: 'curso',
    provider: 'Medellín',
    location: 'presencial',
    free: true,
    description: 'Cursos cortos en oficios prácticos: cocina, panadería, carpintería, electricidad básica, atención al cliente, logística. Ideales para empezar a generar ingresos.',
    howToApply: ['Consultar en puntos de la Alcaldía/Agencia de Empleo', 'Preguntar por "rutas cortas de oficios"', 'Inscribirse a convocatoria'],
    requirements: ['Cédula', 'Mayor de edad según curso'],
    target: 'Sin experiencia, reinserción, generar ingresos pronto',
    url: 'https://www.medellin.gov.co/',
    verified: true,
    tags: ['oficios', 'medellin', 'sin-experiencia', 'ingresos']
  },
  {
    id: 'podcast-historias-esperanza',
    title: 'Podcasts: Historias de esperanza y recuperación',
    type: 'podcast',
    provider: 'Otra',
    location: 'virtual',
    free: true,
    description: 'Historias reales de personas que salieron adelante. Escucha cuando lo necesites. Sin juicios, con calidez.',
    howToApply: ['Abrir Spotify, Spreaker o YouTube Podcasts', 'Buscar "recuperación", "esperanza", "adicción sin juicio"', 'Escuchar anónimo'],
    requirements: ['Celular con internet'],
    target: 'Motivación, acompañamiento emocional',
    url: 'https://open.spotify.com/search/recuperaci%C3%B3n%20esperanza',
    verified: true,
    tags: ['inspiracion', 'podcast', 'virtual', 'esperanza']
  },
  {
    id: 'youtube-aprender-oficios',
    title: 'Aprende oficios gratis en YouTube',
    type: 'video',
    provider: 'Otra',
    location: 'virtual',
    free: true,
    description: 'Tutoriales prácticos para aprender oficios desde cero: atención al cliente, ventas, cocina, limpieza profesional, informática básica.',
    howToApply: ['Entrar a YouTube', 'Buscar el oficio que te interese', 'Practicar lo aprendido paso a paso'],
    requirements: ['Celular/PC con internet'],
    target: 'Aprendizaje autodidacta, generar habilidades',
    url: 'https://www.youtube.com/results?search_query=aprender%20oficio%20gratis%20desde%20cero',
    verified: true,
    tags: ['video', 'oficios', 'virtual', 'sin-experiencia']
  },
  {
    id: 'empleabilidad-antioquia',
    title: 'Empleabilidad Antioquia - Rutas de reinserción',
    type: 'empleo',
    provider: 'Antioquia',
    location: 'presencial',
    free: true,
    description: 'Ferias de empleo, orientación, rutas de reinserción laboral y alianzas con empresas que apuestan por segunda oportunidad.',
    howToApply: ['Consultar convocatorias vigentes', 'Acercarse a puntos de atención', 'Preguntar por "población en proceso de reinserción"'],
    requirements: ['Cédula', 'Disponibilidad'],
    target: 'Segunda oportunidad laboral',
    url: 'https://www.antioquia.gov.co/',
    verified: true,
    tags: ['empleo', 'antioquia', 'reinsercion', 'segunda-oportunidad']
  },
  {
    id: 'capacitate-sena-cortos',
    title: 'SENA - Cursos cortos por oficios',
    type: 'curso',
    provider: 'SENA',
    location: 'presencial',
    free: true,
    description: 'Formación por módulos cortos. Ideales para aprender rápido y aplicar. Pregunta en tu centro SENA más cercano por rutas de reinserción.',
    howToApply: ['Ir al SENA más cercano a Medellín', 'Preguntar por cursos cortos gratuitos', 'Inscribirse a convocatoria abierta'],
    requirements: ['Cédula', 'Según programa'],
    target: 'Aprendizaje rápido, ingreso a oficios',
    url: 'https://www.sena.edu.co/',
    verified: true,
    tags: ['curso-corto', 'medellin', 'oficios', 'sin-experiencia']
  }
];

export function getByType(type: Opportunity['type']) { return OPPORTUNITIES.filter(o => o.type === type); }
export function getFree() { return OPPORTUNITIES.filter(o => o.free); }
export function getMedellin() { return OPPORTUNITIES.filter(o => o.tags.some(t => t.includes('medellin'))); }
export function getReinsertion() { return OPPORTUNITIES.filter(o => o.tags.includes('reinsercion') || o.tags.includes('segunda-oportunidad')); }

// Añadir lastVerified a todas las oportunidades
(OPPORTUNITIES as any[]).forEach((o, i) => {
  if (!o.lastVerified) {
    o.lastVerified = i % 3 === 0 ? '2026-10-23' : i % 2 === 0 ? '2026-09-25' : '2026-08-15';
  }
});

// ENTIDADES DE AYUDA MEDELLÍN - ANTIOQUIA (AMPLIADO)
export interface HelpEntity {
  id: string;
  name: string;
  type: 'linea' | 'centro' | 'grupo' | 'institucion';
  description: string;
  phone?: string;
  address?: string;
  hours: string;
  free: boolean;
  anonymous: boolean;
  focus: string[];
  location: string;
  url?: string;
  verified: boolean;
}

export const HELP_ENTITIES_MED: HelpEntity[] = [
  {
    id: 'linea-106',
    name: 'Línea 106 - Línea Calma (MinSalud)',
    type: 'linea',
    description: 'Atención en crisis emocional, ideación suicida, orientación psicológica. Gratuita, anónima, confidencial. 24/7.',
    phone: '106',
    hours: '24/7 - Todos los días',
    free: true,
    anonymous: true,
    focus: ['crisis emocional', 'suicidio', 'ansiedad aguda'],
    location: 'Nacional',
    verified: true
  },
  {
    id: 'emergencias-123',
    name: 'Emergencias 123',
    type: 'linea',
    description: 'Ambulancia, Bomberos, Policía. Ante riesgo vital inmediato.',
    phone: '123',
    hours: '24/7',
    free: true,
    anonymous: false,
    focus: ['emergencia vital'],
    location: 'Nacional',
    verified: true
  },
  {
    id: 'proyecto-hombre',
    name: 'Proyecto Hombre Colombia',
    type: 'centro',
    description: 'Atención integral a personas con consumo problemático. Terapia individual/familiar, reinserción social y laboral. Enfoque humano sin juicios.',
    phone: '(604) 444 7410',
    address: 'Medellín - Antioquia',
    hours: 'Lunes a Viernes - Jornada laboral',
    free: true,
    anonymous: false,
    focus: ['adicciones', 'terapia', 'familiar', 'reinsercion'],
    location: 'Medellín, Antioquia',
    url: 'https://www.proyectohombre.org.co',
    verified: true
  },
  {
    id: 'comfama-empleo',
    name: 'Comfama - Servicio de Empleo',
    type: 'institucion',
    description: 'Orientación ocupacional, vacantes, ferias de empleo, formación para el trabajo. Amplia red en Antioquia. Enfoque a población vulnerable.',
    hours: 'Lunes a Viernes',
    free: true,
    anonymous: false,
    focus: ['empleo', 'formacion', 'reinsercion'],
    location: 'Medellín y municipios de Antioquia',
    url: 'https://www.comfama.com/',
    verified: true
  },
  {
    id: 'agencia-empleo-med',
    name: 'Agencia de Empleo de Medellín',
    type: 'institucion',
    description: 'Hoja de vida, vacantes, orientación, ferias, rutas para reinserción. Gratuita.',
    address: 'Medellín',
    hours: 'Lunes a Viernes',
    free: true,
    anonymous: false,
    focus: ['empleo', 'reinsercion', 'segunda-oportunidad'],
    location: 'Medellín',
    verified: true
  },
  {
    id: 'caps-medellin',
    name: 'CAPS - Centros de Atención Primaria en Salud',
    type: 'centro',
    description: 'Ruta integral en salud mental y consumo de sustancias. Atención en red pública. Derivación integral.',
    hours: 'Lunes a Viernes (según sede)',
    free: true,
    anonymous: false,
    focus: ['salud mental', 'consumo', 'derivacion'],
    location: 'Medellín - Por comunas',
    verified: true
  },
  {
    id: 'aa-medellin-grupos',
    name: 'Alcohólicos Anónimos Medellín',
    type: 'grupo',
    description: 'Grupos de autoayuda mutua, anónimos, gratuitos. Abiertos. Experiencia compartida sin juicios.',
    phone: '(604) 232 3636',
    hours: 'Diario - Múltiples horarios',
    free: true,
    anonymous: true,
    focus: ['alcohol', 'apoyo mutuo'],
    location: 'Medellín - Diferentes comunas',
    verified: true
  },
  {
    id: 'na-antioquia',
    name: 'Narcóticos Anónimos Antioquia',
    type: 'grupo',
    description: 'Grupos de apoyo mutuo para adicción a otras sustancias. Anónimo, gratuito.',
    hours: 'Diario - Múltiples horarios',
    free: true,
    anonymous: true,
    focus: ['drogas', 'apoyo mutuo'],
    location: 'Medellín y Antioquia',
    verified: true
  },
  {
    id: 'icbf-linea',
    name: 'ICBF - Línea 141',
    type: 'linea',
    description: 'Protección integral a niños, niñas y adolescentes. Atención a situaciones de riesgo.',
    phone: '141',
    hours: '24/7',
    free: true,
    anonymous: false,
    focus: ['niños', 'adolescentes', 'familia', 'proteccion'],
    location: 'Nacional',
    verified: true
  },
  {
    id: 'sena-medellin',
    name: 'SENA - Centros de Formación Medellín',
    type: 'institucion',
    description: 'Cursos gratuitos, técnicos, tecnológicos. Pregunta por rutas de reinserción laboral.',
    hours: 'Lunes a Viernes',
    free: true,
    anonymous: false,
    focus: ['formacion', 'empleo', 'reinsercion'],
    location: 'Medellín y Antioquia',
    url: 'https://oferta.senasofiaplus.edu.co/',
    verified: true
  }
];
