/**
 * BlumHelps — Datos de DEMO.
 * ⚠️ Ninguna entidad, curso, empleo o grupo aquí listado es real ni patrocinador.
 * Todos los registros llevan la marca "demo": true y se muestran con la etiqueta "(demo)".
 * La Línea 123 y la Línea 106 del MinSalud son referencias oficiales conocidas;
 * aun así, la app dirige a servicios de emergencia ante riesgo vital.
 */

export type Demo = { demo: true };

export type Resource = Demo & {
  id: string;
  kind: "ayuda" | "formacion" | "empleo" | "comunidad" | "familias";
  title: string;
  org: string;
  summary: string;
  city: string;
  coverage: string; // cobertura territorial / virtual
  modality: ("presencial" | "telefónica" | "virtual")[];
  type: string; // tipo de apoyo
  source: string; // fuente declarada (ficticia en demo)
  verifiedAt: string; // fecha de verificación (ficticia en demo)
  limitations: string;
  url?: string;
  duration?: string;
  level?: "principiante" | "intermedio" | "todos";
  area?: string;
  salaryNote?: string;
};

export const CIUDADES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Todo el país",
  "Virtual",
];

/* ---------------------------- AYUDA ---------------------------- */
export const AYUDA: Resource[] = [
  {
    demo: true,
    id: "a1",
    kind: "ayuda",
    title: "Línea de orientación en salud mental (referencia oficial)",
    org: "Gobierno de Colombia",
    summary:
      "Línea nacional para orientación en salud mental y situaciones de crisis. No reemplaza los servicios de emergencia.",
    city: "Todo el país",
    coverage: "Nacional, 24/7",
    modality: ["telefónica"],
    type: "Emergencia y crisis",
    source: "Referencia pública conocida (no afiliada a BlumHelps)",
    verifiedAt: "2026-10-01",
    limitations:
      "BlumHelps no opera esta línea. Ante peligro inmediato, sobredosis o pérdida de conciencia llama al 123.",
    url: undefined,
  },
  {
    demo: true,
    id: "a2",
    kind: "ayuda",
    title: "Consulta psicológica inicial sin cita previa",
    org: "Centro Comunitario Semilla (demo)",
    summary:
      "Primera conversación con psicólogo, sin formulario largo ni diagnóstico obligatorio. Puedes solo escuchar.",
    city: "Bogotá",
    coverage: "Localidades Kennedy y Bosa",
    modality: ["presencial", "telefónica"],
    type: "Salud mental",
    source: "Ficha ficticia de demostración",
    verifiedAt: "2026-09-15",
    limitations:
      "Servicio inventado para la demo. Cupos, horarios y elegibilidad reales deberían verificarse con la entidad.",
  },
  {
    demo: true,
    id: "a3",
    kind: "ayuda",
    title: "Acompañamiento por pares: caminatas de lunes",
    org: "Ruta Par (demo)",
    summary:
      "Grupo de personas acompañándose con caminatas cortas y café. No se habla de consumo si no quieres.",
    city: "Medellín",
    coverage: "Comunas 11 y 13",
    modality: ["presencial"],
    type: "Apoyo comunitario",
    source: "Organización ficticia de demostración",
    verifiedAt: "2026-08-30",
    limitations: "Demo. No es terapia de grupo clínica ni sustituye tratamiento profesional.",
  },
  {
    demo: true,
    id: "a4",
    kind: "ayuda",
    title: "Reducción de daños: información clara, sin sermones",
    org: "Fundación Paso Firme (demo)",
    summary:
      "Charlas y material sobre reducir riesgos mientras decides qué quieres para tu vida. Abstinencia no es requisito.",
    city: "Cali",
    coverage: "Comuna 15 y virtual",
    modality: ["presencial", "virtual"],
    type: "Reducción de riesgos",
    source: "Programa ficticio de demostración",
    verifiedAt: "2026-09-02",
    limitations: "Demo. Información educativa; no prescribe ni dosifica nada.",
  },
  {
    demo: true,
    id: "a5",
    kind: "ayuda",
    title: "Trámite fácil: afiliación y renovación de salud",
    org: "Punto de Atención Barrial (demo)",
    summary: "Te ayudan con papeles de salud sin cita y sin trato regañón. Lleva tu cédula, lo demás lo buscamos.",
    city: "Barranquilla",
    coverage: "Barrios Chiquinquirá y Belladero",
    modality: ["presencial"],
    type: "Acceso a servicios públicos",
    source: "Entidad ficticia de demostración",
    verifiedAt: "2026-07-21",
    limitations: "Demo. Los requisitos reales cambian; confírmalos con la entidad oficial correspondiente.",
  },
  {
    demo: true,
    id: "a6",
    kind: "ayuda",
    title: "Línea jurídica gratuita laboral",
    org: "Consultorio Jurídico Alameda (demo)",
    summary:
      "Orientación para reclamar derechos laborales, contratos y prestaciones. Confidencial.",
    city: "Bogotá",
    coverage: "Virtual para todo el país",
    modality: ["telefónica", "virtual"],
    type: "Orientación jurídica",
    source: "Consultorio ficticio de demostración",
    verifiedAt: "2026-09-10",
    limitations: "Demo. No representa casos ni reemplaza un abogado habilitado.",
  },
  {
    demo: true,
    id: "a7",
    kind: "ayuda",
    title: "Noche tranquila: espacio de descanso diurno",
    org: "Casa Puerta Abierta (demo)",
    summary:
      "Un lugar seguro para descansar unas horas, tomar agua y cargar el celular. Sin registro, sin preguntas.",
    city: "Medellín",
    coverage: "Centro Ampliado",
    modality: ["presencial"],
    type: "Apoyo básico inmediato",
    source: "Espacio ficticio de demostración",
    verifiedAt: "2026-06-18",
    limitations: "Demo. No es alojamiento ni centro de tratamiento.",
  },
];

/* --------------------------- BIENESTAR -------------------------- */
export type GoalTemplate = Demo & {
  id: string;
  title: string;
  micro: string; // la versión pequeña
  hint: string;
  advancedOnly?: boolean;
};

export const GOAL_TEMPLATES: GoalTemplate[] = [
  { demo: true, id: "g1", title: "Caminar 10 minutos", micro: "Basta con salir por la puerta. 10 minutos, a tu paso.", hint: "Puedes cambiarlo a 5 cuando quieras." },
  { demo: true, id: "g2", title: "Dormir a una hora más estable", micro: "Elige una hora para acostarte. Una, no perfecta.", hint: "Los días que no se pueda, no se puede. Mañana sigue siendo tuyo." },
  { demo: true, id: "g3", title: "Una llamada a alguien de confianza", micro: "Un ‘hola’ cuenta. No tienes que explicar nada más.", hint: "Si hoy no es el día, pausar también es avanzar." },
  { demo: true, id: "g4", title: "Comer algo caliente hoy", micro: "Una arepa, un caldo, lo que haya. Caliente y tuyo.", hint: "" },
  { demo: true, id: "g5", title: "Escribir cómo me siento (diario)", micro: "Tres líneas bastan. Nadie más lo lee.", hint: "Diario encriptado: función Avanzado.", advancedOnly: true },
  { demo: true, id: "g6", title: "Ver mi ánimo y sueño en gráficos", micro: "Patrones sin juicio: solo para conocerte mejor.", hint: "Analítica de patrones: función Avanzado.", advancedOnly: true },
];

/* --------------------------- FORMACIÓN -------------------------- */
export const FORMACION: Resource[] = [
  {
    demo: true,
    id: "f1",
    kind: "formacion",
    title: "Introducción al servicio de restaurante y bar",
    org: "Escuela Taller La Mesa (demo)",
    summary: "Mise en place, atención al cliente y manipulación de alimentos. Con práctica en restaurante escuela.",
    city: "Bogotá",
    coverage: "Sede Chapinero",
    modality: ["presencial"],
    type: "Formación para el trabajo",
    source: "Institución ficticia de demostración",
    verifiedAt: "2026-09-05",
    limitations: "Demo. Certificación, cupos y requisitos serían distintos en un programa real.",
    duration: "6 semanas · 8 h/semana",
    level: "principiante",
    area: "Gastronomía",
  },
  {
    demo: true,
    id: "f2",
    kind: "formacion",
    title: "Ofimática básica para volver al estudio",
    org: "Aula Barrial ConectaT (demo)",
    summary: "Computador, correo, hojas de vida digitales. Para quien empieza desde cero, sin vergüenza ninguna.",
    city: "Medellín",
    coverage: "Virtual + sede Robledo",
    modality: ["virtual", "presencial"],
    type: "Alfabetización digital",
    source: "Programa ficticio de demostración",
    verifiedAt: "2026-09-20",
    limitations: "Demo. No otorga títulos oficiales.",
    duration: "4 semanas · 6 h/semana",
    level: "principiante",
    area: "Digital",
  },
  {
    demo: true,
    id: "f3",
    kind: "formacion",
    title: "Soldadura básica con práctica certificable",
    org: "Centro Industrial Norte (demo)",
    summary: "Arco eléctrico, seguridad industrial y portafolio de piezas. Los docentes saben llegarle a la gente.",
    city: "Barranquilla",
    coverage: "Local",
    modality: ["presencial"],
    type: "Oficio técnico",
    source: "Centro ficticio de demostración",
    verifiedAt: "2026-08-11",
    limitations: "Demo. Requisitos de edad, papeles y evaluación serían definidos por la entidad real.",
    duration: "10 semanas · 12 h/semana",
    level: "principiante",
    area: "Industria",
  },
  {
    demo: true,
    id: "f4",
    kind: "formacion",
    title: "Manejo de alimentos y bioseguridad",
    org: "Fundación Sabor Sano (demo)",
    summary: "Curso corto, muy práctico, útil para trabajar en cocina, tienda o domicilios.",
    city: "Cali",
    coverage: "Virtual nacional",
    modality: ["virtual"],
    type: "Certificación corta",
    source: "Curso ficticio de demostración",
    verifiedAt: "2026-10-01",
    limitations: "Demo. La constancia real dependería de la entidad emisora.",
    duration: "2 semanas · 4 h/semana",
    level: "todos",
    area: "Gastronomía",
  },
  {
    demo: true,
    id: "f5",
    kind: "formacion",
    title: "Reparación de celulares: de cero a tu primer arreglo",
    org: "Taller Escuela Tornillo (demo)",
    summary: "Diagnóstico, cambio de pantallas y baterías. Incluye kit de práctica prestado durante el curso.",
    city: "Bogotá",
    coverage: "Sede Suba",
    modality: ["presencial"],
    type: "Oficio técnico",
    source: "Escuela ficticia de demostración",
    verifiedAt: "2026-07-30",
    limitations: "Demo. El kit prestado es parte de la simulación.",
    duration: "8 semanas · 10 h/semana",
    level: "intermedio",
    area: "Tecnología",
  },
];

/* ----------------------------- EMPLEO --------------------------- */
export const EMPLEO: Resource[] = [
  {
    demo: true,
    id: "e1",
    kind: "empleo",
    title: "Ayudante de cocina — turno mañana",
    org: "Restaurante Doña Rosa (demo)",
    summary: "Empresa que declara experiencia en segundas oportunidades. Entrevista breve, inicio rápido.",
    city: "Bogotá",
    coverage: "Usaquén",
    modality: ["presencial"],
    type: "Empleo formal",
    source: "Vacante ficticia de demostración",
    verifiedAt: "2026-10-03",
    limitations: "Demo. No es una oferta real ni hay acuerdo alguno con empleadores.",
    salaryNote: "SMMLV + auxilio de transporte (referencial)",
  },
  {
    demo: true,
    id: "e2",
    kind: "empleo",
    title: "Operario de bodega — medio tiempo",
    org: "Logística Andina (demo)",
    summary: "Recibir, organizar y despachar pedido. Trabajo en equipo con acompañamiento la primera semana.",
    city: "Medellín",
    coverage: "Itagüí",
    modality: ["presencial"],
    type: "Empleo operativo",
    source: "Vacante ficticia de demostración",
    verifiedAt: "2026-09-28",
    limitations: "Demo. Exigencias como examen médico no deberían condicionar la dignidad ni filtrar por historia personal.",
    salaryNote: "$1.100.000 aprox. (ficticio)",
  },
  {
    demo: true,
    id: "e3",
    kind: "empleo",
    title: "Jardinería y mantenimiento de zonas verdes",
    org: "Cooperativa Raíz (demo)",
    summary: "Contratos cortos por obra, ideales para retomar ritmo laboral sin presión de jornada completa.",
    city: "Cali",
    coverage: "Sur de la ciudad",
    modality: ["presencial"],
    type: "Trabajo flexible",
    source: "Cooperativa ficticia de demostración",
    verifiedAt: "2026-09-12",
    limitations: "Demo. Condiciones de pago y contrato serían distintas en la realidad.",
    salaryNote: "Por obra, pactado al inicio (ficticio)",
  },
  {
    demo: true,
    id: "e4",
    kind: "empleo",
    title: "Domicilios en bici — te prestamos la bici",
    org: "Reparto Vecinal (demo)",
    summary: "Flexibilidad total: conectas cuando puedas. Hay caja de herramientas y punto de descanso.",
    city: "Barranquilla",
    coverage: "Centro y norte",
    modality: ["presencial"],
    type: "Independiente con apoyo",
    source: "Plataforma ficticia de demostración",
    verifiedAt: "2026-08-25",
    limitations: "Demo. Las condiciones reales de este sector varían mucho; lee siempre el contrato.",
    salaryNote: "Por pedido + propinas (ficticio)",
  },
];

export const HV_GUIDE = [
  {
    step: "1",
    title: "Tu hoja de vida no necesita contar toda tu historia",
    body: "Para postularte basta con habilidades, disponibilidad y referencias. Lo que viviste no es una casilla obligatoria.",
  },
  {
    step: "2",
    title: "Encabezado simple",
    body: "Nombre, ciudad, teléfono, correo. Nada de foto si no la piden; nada de cédula publicada.",
  },
  {
    step: "3",
    title: "Habilidades primero si tienes huecos",
    body: "Si tus últimos años no aparecen en empleos, abre con una sección de habilidades y oficios (cocina, manejo de herramientas, atención al cliente…).",
  },
  {
    step: "4",
    title: "Los cursos cuentan",
    body: "Incluye formaciones cortas, aunque sean informales: dicen que estás construyendo algo ahora.",
  },
  {
    step: "5",
    title: "Referencias que respondan por ti",
    body: "Un vecino, un líder comunitario o un profe pueden servir. Pide permiso antes de dar su número.",
  },
];

/* ---------------------------- COMUNIDAD -------------------------- */
export const COMUNIDAD: Resource[] = [
  {
    demo: true,
    id: "c1",
    kind: "comunidad",
    title: "Liga de microfútbol de los sábados",
    org: "Club Barrio Unido (demo)",
    summary: "No importa si juegas mal. Se arma equipo por todos los niveles. After: limonada y tranquilidad.",
    city: "Cali",
    coverage: "Cancha de la Caney",
    modality: ["presencial"],
    type: "Actividad física",
    source: "Club ficticio de demostración",
    verifiedAt: "2026-09-19",
    limitations: "Demo.",
  },
  {
    demo: true,
    id: "c2",
    kind: "comunidad",
    title: "Voluntariado: sembrar y mantener huertas urbanas",
    org: "Manos a la Tierra (demo)",
    summary: "4 horas al mes, manos en la tierra y cosecha compartida. Ideal si necesitas estructura suave.",
    city: "Bogotá",
    coverage: "Parques de Teusaquillo y Engativá",
    modality: ["presencial"],
    type: "Voluntariado",
    source: "Grupo ficticio de demostración",
    verifiedAt: "2026-08-08",
    limitations: "Demo.",
  },
  {
    demo: true,
    id: "c3",
    kind: "comunidad",
    title: "Tertulia de los jueves: leer en voz alta",
    org: "Círculo Papel (demo)",
    summary: "Narrativa colombiana corta. Si un jueves solo vienes a escuchar, bienvenido.",
    city: "Medellín",
    coverage: "Biblioteca La Estrella + virtual",
    modality: ["presencial", "virtual"],
    type: "Cultura y arte",
    source: "Círculo ficticio de demostración",
    verifiedAt: "2026-09-30",
    limitations: "Demo.",
  },
  {
    demo: true,
    id: "c4",
    kind: "comunidad",
    title: "Grupo de familias que acompañan",
    org: "Familia Red (demo)",
    summary: "Espacio para madres, padres y parejas: qué hacer, qué no, y cómo cuidarse uno también.",
    city: "Barranquilla",
    coverage: "Virtual nacional",
    modality: ["virtual"],
    type: "Grupos de apoyo",
    source: "Grupo ficticio de demostración",
    verifiedAt: "2026-07-14",
    limitations: "Demo. Moderado por voluntarios: no es terapia familiar profesional.",
  },
  {
    demo: true,
    id: "c5",
    kind: "comunidad",
    title: "Coro popular del barrio",
    org: "Coro Guasá (demo)",
    summary: "Ensayo abierto, sin audición. La memoria de las canciones hace un trabajo silencioso.",
    city: "Bogotá",
    coverage: "Casa Cultural San Blas",
    modality: ["presencial"],
    type: "Cultura y arte",
    source: "Coro ficticio de demostración",
    verifiedAt: "2026-10-02",
    limitations: "Demo.",
  },
];

export const REGLAS_COMUNIDAD = [
  "Lo que se dice en el grupo, se queda en el grupo.",
  "Nadie exige explicaciones sobre el pasado de nadie.",
  "Abstinencia o reducción: cada quien define su meta. No se juzga.",
  "Sin proselitismo: religioso, político o comercial.",
  "Si alguien está en peligro inmediato, se activa ayuda profesional (123). El grupo acompaña, no trata.",
  "Un aviso respetuoso antes de salir del grupo; puedes volver cuando quieras.",
];

/* ----------------------------- FAMILIAS --------------------------- */
export const FAMILIAS: Resource[] = [
  {
    demo: true,
    id: "fa1",
    kind: "familias",
    title: "Guía: hablar sin pelear (frases que funcionan)",
    org: "BlumHelps Contenidos (demo)",
    summary:
      "Qué decir cuando vuelva tarde, qué no decir cuando prometas ayuda. Con guiones listos para usar.",
    city: "Todo el país",
    coverage: "Lectura en la app",
    modality: ["virtual"],
    type: "Guía para acompañar",
    source: "Contenido ficticio de demostración",
    verifiedAt: "2026-09-22",
    limitations: "Demo. Material educativo general; no sustituye orientación profesional.",
  },
  {
    demo: true,
    id: "fa2",
    kind: "familias",
    title: "Vigilar no es acompañar: cómo confiar sin ingenuidad",
    org: "BlumHelps Contenidos (demo)",
    summary:
      "Acuerdos de convivencia que protegen a todos sin convertir la casa en un control. Incluye ejemplos.",
    city: "Todo el país",
    coverage: "Lectura en la app",
    modality: ["virtual"],
    type: "Guía para acompañar",
    source: "Contenido ficticio de demostración",
    verifiedAt: "2026-09-22",
    limitations: "Demo.",
  },
  {
    demo: true,
    id: "fa3",
    kind: "familias",
    title: "Cuidar al que cuida",
    org: "BlumHelps Contenidos (demo)",
    summary:
      "El agotamiento de quien acompaña es real. Señales, pausas y formas de pedir relevo sin culpa.",
    city: "Todo el país",
    coverage: "Lectura en la app",
    modality: ["virtual"],
    type: "Auto cuidado familiar",
    source: "Contenido ficticio de demostración",
    verifiedAt: "2026-08-16",
    limitations: "Demo.",
  },
  {
    demo: true,
    id: "fa4",
    kind: "familias",
    title: "Cuando vuelve la confianza: un plan de 30 días en familia",
    org: "BlumHelps Contenidos (demo)",
    summary: "Rutinas pequeñas compartidas: mercado juntos, una comida sin celular, un paseo. Descargable.",
    city: "Todo el país",
    coverage: "Lectura en la app",
    modality: ["virtual"],
    type: "Guía práctica",
    source: "Contenido ficticio de demostración",
    verifiedAt: "2026-07-05",
    limitations: "Demo.",
  },
];

/* Helpers */
export const fmtDate = (iso: string) => {
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};
