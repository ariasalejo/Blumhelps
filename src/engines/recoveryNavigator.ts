// BLUMHELPS - RecoveryNavigator (Etapas del Cambio - Prochaska & DiClemente)
// Enfocado a Medellín - Antioquia | Anónimo | Sin juicios | Sin diagnóstico clínico

export type ChangeStage = 'precontemplation' | 'contemplation' | 'preparation' | 'action' | 'maintenance' | 'relapse';

export interface NavigatorInput {
  needHelpNow: boolean;
  wantToChange: boolean;
  triedBefore: boolean;
  haveSupport: boolean;
  substance: 'alcohol' | 'drugs' | 'both' | 'other' | 'unsure';
  forSomeone: boolean;
  riskNow: boolean;
}

export interface MicroStep {
  id: string;
  title: string;
  description: string;
  detail: string;
  time: string;
  priority: 'urgent' | 'high' | 'medium';
  actionType: 'call' | 'ask' | 'plan' | 'rest' | 'learn';
  tips?: string[];
}

export interface RecoveryRoute {
  stage: ChangeStage;
  title: string;
  subtitle: string;
  message: string;
  steps: MicroStep[];
  encouragement: string;
  crisisAdvice: string[];
  relapsePlan: string[];
}

export function assessStage(input: NavigatorInput): ChangeStage {
  if (input.riskNow || input.needHelpNow) return 'preparation';
  if (input.wantToChange && input.triedBefore) return 'action';
  if (input.wantToChange && input.haveSupport) return 'preparation';
  if (input.wantToChange && !input.haveSupport) return 'contemplation';
  if (input.triedBefore && !input.wantToChange) return 'relapse';
  return 'precontemplation';
}

export function buildRoute(input: NavigatorInput): RecoveryRoute {
  const stage = assessStage(input);

  // CRISIS INMEDIATA
  if (input.riskNow || input.needHelpNow) {
    return {
      stage,
      title: 'PRIORIDAD: Seguridad inmediata',
      subtitle: 'Tu vida y bienestar van primero',
      message: 'No estás exagerando por pedir ayuda. Prioricemos tu seguridad AHORA.',
      steps: [
        {
          id: 'crisis-1',
          title: 'Llamar a una línea de ayuda 24/7',
          description: 'Llama al 106 (Línea Calma). Es gratuito, anónimo y confidencial.',
          detail: 'Desde cualquier celular o fijo en Colombia. Te escuchan sin juzgarte.',
          time: 'AHORA',
          priority: 'urgent',
          actionType: 'call',
          tips: ['Si hay riesgo vital inmediato llama al 123', 'Puedes pedir que te acompañen', 'No tienes que dar todos los datos']
        },
        {
          id: 'crisis-2',
          title: 'Buscar un lugar seguro',
          description: 'Ve a un lugar tranquilo, con luz o con alguien de confianza.',
          detail: 'Alejarte de lo que te genere mayor urgencia puede ayudarte a calmarte un poco.',
          time: 'AHORA',
          priority: 'urgent',
          actionType: 'rest',
          tips: ['Respira lento: 4-4-4 (inhalar-agarrar-exhalar)', 'Bebe agua si puedes', 'Pide compañía si hay alguien cerca']
        },
        {
          id: 'crisis-3',
          title: 'Pedir que te acompañen',
          description: 'Llama a esa persona de confianza aunque te dé vergüenza.',
          detail: 'Pedir compañía no es molestar. Es cuidarte.',
          time: 'AHORA',
          priority: 'urgent',
          actionType: 'ask',
          tips: ['Puedes decir: "Necesito que te quedes conmigo un rato"', 'Si no hay nadie ahora, quédate con la línea hasta sentirte un poco más tranquilo']
        }
      ],
      encouragement: 'Pedir ayuda es un acto de coraje. No estás solo(a).',
      crisisAdvice: [
        'Línea 106: 24/7 - Atención en crisis emocional',
        'Emergencias 123: Si hay riesgo vital inmediato',
        'Quédate en línea hasta sentirte más seguro(a)'
      ],
      relapsePlan: [
        'Un mal momento NO borra todo lo que has intentado',
        'Retomar es parte del camino, no un fracaso',
        'Llama al 106 hoy mismo sin culpas'
      ]
    };
  }

  // FAMILIARES / ACOMPAÑANTES
  if (input.forSomeone) {
    return {
      stage,
      title: 'Guía para acompañar con amor',
      subtitle: 'Cuidar a otros empieza también cuidándote',
      message: 'Escuchar sin juzgar, poner límites sanos y buscar apoyo para ti también.',
      steps: [
        {
          id: 'fam-1',
          title: 'Escuchar sin presionar',
          description: 'Pregunta "¿Quieres hablar?" y escucha más de lo que hablas.',
          detail: 'Evita sermones. Muchas veces lo primero que necesitan es sentirse escuchados.',
          time: 'HOY',
          priority: 'high',
          actionType: 'ask',
          tips: ['Usa silencio respetuoso', 'Valida emociones: "Veo que esto te duele"', 'No interrumpas']
        },
        {
          id: 'fam-2',
          title: 'Buscar recursos juntos',
          description: 'Explora Líneas 106, Proyecto Hombre, grupos familiares o centros de Medellín.',
          detail: 'Hacerlo juntos quita peso. No tienes que tener todas las respuestas.',
          time: 'HOY',
          priority: 'high',
          actionType: 'plan',
          tips: ['Lleva celular y anota teléfonos', 'Pregunta por atención a familiares', 'Prioriza líneas 24/7']
        },
        {
          id: 'fam-3',
          title: 'Cuidarte a ti mismo(a)',
          description: 'Acompañar puede agotar. Busca un espacio para hablar contigo mismo(a) o con alguien.',
          detail: 'Tú también mereces apoyo. No eres egoísta por cuidarte.',
          time: 'HOY',
          priority: 'medium',
          actionType: 'rest',
          tips: ['Descansa aunque sea 10 minutos', 'Habla con alguien de confianza sobre cómo te sientes', 'No cargues todo solo(a)']
        },
        {
          id: 'fam-4',
          title: 'Informarte con calma',
          description: 'Lee la guía "Cómo hablarle a un ser querido" y guarda teléfonos clave.',
          detail: 'Con información clara tomas decisiones más tranquilas.',
          time: 'HOY',
          priority: 'medium',
          actionType: 'learn',
          tips: ['Guarda 106 y 123 en favoritos', 'Comparte solo lo necesario', 'Respeta la dignidad siempre']
        }
      ],
      encouragement: 'Acompañar con amor, respeto y paciencia ya es una gran ayuda.',
      crisisAdvice: ['Si hay riesgo inmediato llama al 106 o 123', 'Busca apoyo para familiares en las líneas'],
      relapsePlan: ['Un tropiezo no significa rendirse', 'Sigue acompañando con calma', 'Cuídate también en esos momentos']
    };
  }

  // QUIERE SALIR ADELANTE
  return {
    stage,
    title: 'Tu camino paso a paso',
    subtitle: 'Pequeños pasos. Avance real.',
    message: 'No tienes que cambiarlo todo hoy. Elige UNA sola acción y ejecútala.',
    steps: [
      {
        id: 'p1',
        title: 'Dar el primer contacto',
        description: 'Llama al 106. Es anónimo, gratuito y te escuchan sin juicios.',
        detail: 'Puedes decir solo "Necesito hablar". No tienes que explicar todo.',
        time: 'EN LAS PRÓXIMAS 2 HORAS',
        priority: 'high',
        actionType: 'call',
        tips: ['Puedes llamar desde cualquier lugar', 'Si cuelgas y vuelves a llamar, está bien', 'No hay "preguntas incorrectas"']
      },
      {
        id: 'p2',
        title: 'Elegir una persona de confianza',
        description: 'Piensa en alguien con quien te sientas seguro(a) para hablar.',
        detail: 'Puede ser un familiar, amigo(a) o alguien que te haya escuchado antes.',
        time: 'HOY',
        priority: 'high',
        actionType: 'ask',
        tips: ['No tiene que ser la persona "perfecta"', 'Puedes pedirle solo que te acompañe', 'Si no hay nadie ahora, usa la línea 106']
      },
      {
        id: 'p3',
        title: 'Un plan mínimo para hoy',
        description: 'Elige UNA acción práctica: comer algo, beber agua, descansar o llamar.',
        detail: 'Lo pequeño cuenta. Cuidarte hoy ya es avanzar.',
        time: 'HOY',
        priority: 'high',
        actionType: 'plan',
        tips: ['Menor esfuerzo = mayor probabilidad de hacerlo', 'Celebra ese pequeño paso', 'Mañana puedes dar el siguiente']
      },
      {
        id: 'p4',
        title: 'Mirar oportunidades reales',
        description: 'Explora SENA, Comfama o Agencia de Empleo Medellín para aprender algo o buscar apoyo.',
        detail: 'Capacitarte abre puertas. Hay rutas gratuitas para reinserción laboral.',
        time: 'ESTA SEMANA',
        priority: 'medium',
        actionType: 'learn',
        tips: ['Empieza con un curso corto', 'Pregunta por rutas para reinserción', 'No necesitas experiencia para preguntar']
      },
      {
        id: 'p5',
        title: 'Cuidar tu motivación',
        description: 'Anota TU razón para seguir. Lee algo que te dé esperanza.',
        detail: 'Los días difíciles llegan, pero también pasan. Un nuevo intento vale.',
        time: 'SEMANAL',
        priority: 'medium',
        actionType: 'rest',
        tips: ['Sé amable contigo', 'No te castigues por un mal día', 'Retomar siempre es válido']
      }
    ],
    encouragement: 'El primer paso, por más pequeño que sea, ya te acercó a algo mejor.',
    crisisAdvice: [
      '106 Línea Calma - 24/7',
      '123 Emergencias - Si hay riesgo inmediato',
      'Proyecto Hombre / CAPS Medellín - Atención presencial'
    ],
    relapsePlan: [
      'Si caes, NO significa que fracasaste. Significa que eres humano(a).',
      'Para, respira, llama al 106 sin culpa.',
      'Vuelve al paso 1. Solo eso. Un paso a la vez.'
    ]
  };
}
