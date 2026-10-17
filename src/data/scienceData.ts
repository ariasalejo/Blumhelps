export interface CaseScenario {
  id: string;
  title: string;
  description: string;
  recoveryPath: string;
  noInterventionPath: string;
  scientificFact: string;
}

export const colombianScienceData: CaseScenario[] = [
  {
    id: 'caso-1',
    title: 'Consumo de inicio temprano (Adolescentes)',
    description: 'Cuando el consumo comienza antes de los 18 años, el cerebro en desarrollo es más vulnerable a cambios estructurales.',
    recoveryPath: 'Con intervención familiar temprana y terapia multidimensional, el 65% de los jóvenes logran abstinencia sostenida a 2 años y mejoran su rendimiento académico.',
    noInterventionPath: 'Sin apoyo, el riesgo de desarrollar trastornos de salud mental comórbidos (depresión, ansiedad) se triplica, y la deserción escolar aumenta drásticamente.',
    scientificFact: 'Estudios del Observatorio de Drogas de Colombia (2023) muestran que la intervención familiar reduce en un 40% la progresión a dependencia severa.'
  },
  {
    id: 'caso-2',
    title: 'Dependencia establecida en adultos',
    description: 'Patrones de consumo crónico que han afectado las relaciones laborales, familiares y la salud física.',
    recoveryPath: 'Los programas de tratamiento ambulatorio combinados con grupos de apoyo (como AA/NA) muestran que el 70% de las personas recuperan la estabilidad laboral y mejoran sus vínculos familiares en 18 meses.',
    noInterventionPath: 'El deterioro progresivo de la salud física (hígado, sistema cardiovascular) y el aislamiento social severo, con un riesgo significativamente mayor de sobredosis.',
    scientificFact: 'La OMS reporta que cada dólar invertido en tratamiento de adicciones ahorra hasta 7 dólares en costos de salud, justicia y pérdida de productividad.'
  },
  {
    id: 'caso-3',
    title: 'La Familia y la Codependencia',
    description: 'Cuando el entorno familiar, sin querer, facilita el consumo o descuida su propio bienestar emocional.',
    recoveryPath: 'Cuando la familia recibe psicoeducación y establece límites saludables, la tasa de éxito del tratamiento del paciente aumenta en un 50%. La familia sana, el paciente se recupera.',
    noInterventionPath: 'El ciclo de rescate y culpa se mantiene, generando burnout familiar, depresión en los cuidadores y recaídas constantes en la persona con consumo.',
    scientificFact: 'El modelo CRAFT (Community Reinforcement and Family Training) ha demostrado ser un 70% más efectivo para motivar el tratamiento que las intervenciones confrontacionales.'
  }
];

// Diccionario de "Cómo Ayudar"
export const helpDictionary = {
  'QUE_HACER': [
    'Escucha sin juzgar: "Estoy aquí para ti, no para criticarte".',
    'Ofrece acompañamiento a la primera cita médica o de apoyo.',
    'Celebra los pequeños logros (un día, una semana) sin presionar por el "para siempre".',
    'Infórmate: Conocer la enfermedad reduce el miedo y la estigmatización.'
  ],
  'QUE_NO_HACER': [
    'No des dinero en efectivo que pueda usarse para la sustancia.',
    'No mientas para cubrir sus faltas al trabajo o compromisos (eso es facilitar).',
    'No uses frases como "Si de verdad me quisieras, lo dejarías". La adicción es una enfermedad, no una falta de voluntad.',
    'No te aísles: Busca grupos de apoyo para familiares (Al-Anon, Nar-Anon).'
  ]
};
