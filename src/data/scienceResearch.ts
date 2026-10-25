/**
 * BlumHelps — investigación con procedencia explícita.
 *
 * Regla editorial: no publicar porcentajes de eficacia sin identificar
 * la fuente, población, año, método y límites de interpretación.
 * Los datos globales no deben presentarse como resultados colombianos.
 */

export type EvidenceFinding = {
  id: string;
  title: string;
  organization: string;
  publicationYear: number;
  population: string;
  summary: string;
  interpretationLimit: string;
  sourceLabel: string;
  sourceUrl: string;
  kind: 'global-estimate' | 'survey' | 'recommendation';
};

export const scienceResearch: EvidenceFinding[] = [
  {
    id: 'global-treatment-gap-2023',
    title: 'La brecha mundial de acceso al tratamiento',
    organization: 'Oficina de las Naciones Unidas contra la Droga y el Delito (UNODC)',
    publicationYear: 2025,
    population: 'Estimación mundial de personas con trastornos por consumo de drogas durante 2023.',
    summary:
      'El Informe Mundial sobre las Drogas 2025 estima que 64 millones de personas vivían con trastornos por consumo de drogas en 2023 y señala que solo una de cada doce recibió algún tipo de tratamiento relacionado con drogas.',
    interpretationLimit:
      'Es una estimación mundial y agrupada; no permite calcular la probabilidad individual de recuperación ni describe por sí sola la situación de Colombia. La proporción de 11 de cada 12 sin tratamiento se deriva aritméticamente del dato “1 de cada 12”, no es una medición aparte.',
    sourceLabel: 'Informe Mundial sobre las Drogas 2025 — hallazgos clave (PDF)',
    sourceUrl: 'https://www.unodc.org/documents/data-and-analysis/WDR_2025/WDR25_B1_Key_findings.pdf',
    kind: 'global-estimate',
  },
  {
    id: 'colombia-self-reported-mental-health-2023',
    title: 'Lo que las personas encuestadas en Colombia reportaron',
    organization: 'Ministerio de Salud y Protección Social de Colombia',
    publicationYear: 2023,
    population: 'Encuesta citada por el Ministerio: 3.430 personas adultas; aplicación del 6 al 9 de octubre de 2023.',
    summary:
      'El 66,3 % de las personas participantes declaró haber afrontado algún problema de salud mental en algún momento de su vida.',
    interpretationLimit:
      'Es una respuesta declarada en una encuesta, no un diagnóstico clínico ni una estimación de que el 66,3 % tenga actualmente un trastorno. No debe usarse para pronosticar el resultado de una persona.',
    sourceLabel: 'Comunicado oficial de resultados de la encuesta',
    sourceUrl: 'https://www.minsalud.gov.co/Comunicaciones/noticias/2023/Paginas/66-porciento-de-colombianos-declara-haber-enfrentado-algun-problema-de-salud-mental.aspx',
    kind: 'survey',
  },
  {
    id: 'who-recovery-oriented-services',
    title: 'Acompañamiento orientado a la recuperación',
    organization: 'Organización Mundial de la Salud (OMS)',
    publicationYear: 2023,
    population: 'Recomendación para personas adultas con dependencia de drogas; no es un porcentaje de resultados.',
    summary:
      'La OMS recomienda considerar, de forma voluntaria, la gestión de casos, la atención comunitaria continuada, las terapias centradas en la ocupación y los grupos de apoyo entre pares como componentes de la recuperación.',
    interpretationLimit:
      'La recomendación es condicional y la certeza de la evidencia se califica como baja. La decisión debe adaptarse a las necesidades, preferencias y circunstancias de cada persona; esto no sustituye la atención profesional.',
    sourceLabel: 'OMS — servicios orientados a la recuperación y perfil de evidencia',
    sourceUrl: 'https://www.who.int/teams/mental-health-and-substance-use/treatment-care/mental-health-gap-action-programme/evidence-centre/drug-use-disorders/recovery-oriented-services',
    kind: 'recommendation',
  },
];
