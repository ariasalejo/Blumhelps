import type {
  Accesibilidad,
  Etapa,
  Fuente,
  FuenteTipo,
  RecoveryItem,
} from '../../lib/recovery/types';

// Catálogo psicoeducativo local. No es un protocolo clínico ni un tratamiento.
// Todas las fuentes y licencias quedan marcadas como pendientes de verificación
// hasta que el equipo responsable las revise y documente antes de publicar.

const FECHA_REVISION = '2026-10-23';

const NOTA_FUENTE =
  'Referencia institucional. El enlace concreto, la fecha y la licencia del material deben verificarse antes de publicar.';

const DETALLE_LICENCIA =
  'Texto redactado para BlumHelps. La licencia de fuentes, imágenes, audio y video queda pendiente de verificación.';

const fuente = (tipo: FuenteTipo, url: string, nota = NOTA_FUENTE): Fuente => ({
  tipo,
  url,
  fecha: FECHA_REVISION,
  verificado: false,
  nota,
});

const fuenteOMS = fuente(
  'oms',
  'https://www.who.int/es/health-topics/mental-health',
);
const fuenteOPS = fuente('oms', 'https://www.paho.org/es/temas/salud-mental');
const fuenteNIDA = fuente('nida', 'https://nida.nih.gov/es');
const fuenteSAMHSA = fuente('samhsa', 'https://www.samhsa.gov/find-help');
const fuenteMinSalud = fuente('minsalud', 'https://www.minsalud.gov.co/');
const fuenteMBSR = fuente(
  'paper',
  'https://www.umassmed.edu/cfm/mindfulness-based-programs/mbsr-courses/',
);
const fuenteACT = fuente('paper', 'https://contextualscience.org/');
const fuentePubMed = fuente('paper', 'https://pubmed.ncbi.nlm.nih.gov/');
const fuentePropia = fuente(
  'propio',
  'https://blumhelps.vercel.app',
  'Visualización de progreso creada para BlumHelps. No es una intervención clínica ni una medición de eficacia.',
);

type NuevoItem = Omit<
  RecoveryItem,
  'licencia' | 'licenciaDetalle' | 'accesibilidad'
> & {
  accesibilidad?: Partial<Accesibilidad>;
};

function crearItem({ accesibilidad, ...item }: NuevoItem): RecoveryItem {
  return {
    ...item,
    licencia: 'PENDIENTE_VERIFICACION',
    licenciaDetalle: DETALLE_LICENCIA,
    accesibilidad: {
      subtitulos: false,
      audioDescripcion: false,
      transcript: item.guion,
      reduceMotion: true,
      ...accesibilidad,
    },
  };
}

const TODAS_LAS_ETAPAS: Etapa[] = [
  'precontemplacion',
  'contemplacion',
  'preparacion',
  'accion',
  'mantenimiento',
  'recaida',
];

export const recoveryCatalog: RecoveryItem[] = [
  crearItem({
    id: 'etapas-del-cambio',
    titulo: 'Las etapas del cambio, sin juicios',
    formato: 'lectura',
    tema: 'modelo_transteorico',
    subtemas: ['prochaska', 'ambivalencia', 'proceso'],
    etapas: TODAS_LAS_ETAPAS,
    duracionMin: 6,
    nivelEvidencia: 'cohortes',
    fuente: fuenteOMS,
    descripcion:
      'Entender que el cambio tiene etapas ayuda a bajar la culpa. No tienes que estar listo para todo hoy; reconocer dónde estás ya es información útil.',
    guion:
      'El modelo transteórico describe el cambio como un proceso, no como un interruptor. Hay personas que todavía no se plantean cambiar, otras que lo están pensando, otras que se preparan, actúan o sostienen lo logrado. Una recaída no borra el proceso. Este contenido es psicoeducativo y no sustituye una evaluación profesional.',
    tags: ['prochaska', 'etapas', 'psicoeducacion'],
    microAccion:
      'Escribe en una frase: «Hoy me reconozco en la etapa ___ porque ___».',
  }),
  crearItem({
    id: 'ambivalencia-no-es-resistencia',
    titulo: 'La ambivalencia no es resistencia',
    formato: 'audio',
    tema: 'modelo_transteorico',
    subtemas: ['entrevista_motivacional', 'ambivalencia'],
    etapas: ['precontemplacion', 'contemplacion', 'preparacion', 'recaida'],
    duracionMin: 5,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteOPS,
    descripcion:
      'Sentir dos cosas a la vez —querer cambiar y querer seguir igual— es parte del proceso. La ambivalencia no es falta de voluntad; es una conversación interna que merece escucha.',
    guion:
      'La entrevista motivacional propone explorar la ambivalencia sin pelear con ella. Puedes escuchar sin decidir todavía. Piensa en una razón para cambiar y en una razón para no hacerlo; ambas merecen ser escuchadas. No tienes que resolverlo todo hoy. Si hay riesgo, busca apoyo inmediato.',
    tags: ['entrevista-motivacional', 'ambivalencia', 'escucha'],
    microAccion:
      'Nombra una razón para cambiar y una para no hacerlo. No tienes que resolverlas hoy.',
    notaMedia:
      'Audio disponible mediante la voz TTS del navegador a partir del guion. No se descarga ni se envía a terceros.',
  }),
  crearItem({
    id: 'craving-como-ola',
    titulo: 'El craving como una ola',
    formato: 'audio',
    tema: 'craving_como_ola',
    subtemas: ['craving', 'urgencia', 'tolerancia_al_malestar'],
    etapas: ['contemplacion', 'preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 4,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteNIDA,
    descripcion:
      'El craving suele sentirse como una ola: sube, alcanza un pico y baja. No es una orden. Aprender a observarlo sin obedecerlo es una habilidad que se practica.',
    guion:
      'Un craving es una experiencia corporal y mental que cambia con el tiempo. Puede sentirse como urgencia, pero no tiene que decidir por ti. Respira, nota dónde lo sientes y ponle un nombre. Si el deseo es intenso o hay riesgo, busca ayuda y no te quedes solo. Este audio es una guía breve, no una terapia.',
    tags: ['craving', 'ola', 'urgencia'],
    microAccion:
      'Cuando llegue un craving, ponle un nombre y un temporizador de 8 minutos. Solo observa.',
    notaMedia:
      'Audio disponible mediante la voz TTS del navegador a partir del guion. No se descarga ni se envía a terceros.',
  }),
  crearItem({
    id: 'surfear-el-craving',
    titulo: 'Surfear el craving durante 8 minutos',
    formato: 'video',
    tema: 'craving_como_ola',
    subtemas: ['craving', 'respiracion', 'micro-pausa'],
    etapas: ['preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 8,
    nivelEvidencia: 'PENDIENTE_VERIFICACION',
    fuente: fuenteNIDA,
    descripcion:
      'Una práctica breve para atravesar el pico del craving sin luchar contra él: notar, respirar, nombrar y elegir el siguiente paso.',
    guion:
      'Siéntate con los pies en el suelo. Nota dónde aparece el craving en el cuerpo. Respira lento, sin forzar. Nombra la emoción y recuerda una razón importante para cuidarte. Al terminar, elige una acción pequeña y segura para los próximos minutos. Si hay riesgo vital, llama a urgencias o a una línea de ayuda.',
    tags: ['craving', 'video', 'ejercicio-guiado'],
    microAccion:
      'Haz la práctica de 8 minutos y anota cómo cambió la intensidad del craving del 1 al 10.',
    contraindicaciones: [
      'Si hay riesgo vital, dolor torácico, dificultad para respirar o síntomas médicos graves, no practiques a solas: llama a urgencias.',
    ],
    accesibilidad: { subtitulos: true },
    notaMedia:
      'Video pendiente de producción y verificación de licencia. Por ahora se ofrece el guion y la transcripción accesible.',
  }),
  crearItem({
    id: 'activacion-conductual-primer-paso',
    titulo: 'Activación conductual: el primer paso pequeño',
    formato: 'lectura',
    tema: 'activacion_conductual',
    subtemas: ['animo_bajo', 'accion', 'activacion'],
    etapas: ['preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 5,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuenteOPS,
    descripcion:
      'Cuando el ánimo está bajo, esperar a tener ganas puede perpetuar el estancamiento. La activación conductual propone empezar con una acción pequeña y realista.',
    guion:
      'La activación conductual no pide grandes cambios. Pide una acción concreta, breve y posible. Elige algo de cinco minutos: abrir la ventana, caminar, preparar agua, escribir un mensaje. La acción puede venir antes que la motivación. Si la inmovilidad es intensa o hay riesgo, busca apoyo profesional.',
    tags: ['activacion-conductual', 'animo', 'accion'],
    microAccion:
      'Elige una acción de 5 minutos que puedas hacer hoy, aunque no tengas ganas.',
    contraindicaciones: [
      'Si la inmovilidad es severa, hay desesperanza intensa o riesgo, busca apoyo profesional o llama a una línea de ayuda.',
    ],
  }),
  crearItem({
    id: 'plan-de-una-sola-accion',
    titulo: 'Plan de una sola acción',
    formato: 'journaling',
    tema: 'activacion_conductual',
    subtemas: ['planificacion', 'micro-paso', 'journaling'],
    etapas: ['preparacion', 'accion'],
    duracionMin: 5,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteOPS,
    descripcion:
      'Un plan mínimo reduce la parálisis: una acción, un momento del día y un lugar. No es una promesa de resultados; es una forma de cuidar el proceso.',
    guion:
      'Escribe una sola acción para hoy. Define cuándo, dónde y durante cuántos minutos. Identifica un obstáculo posible y un plan B. Si no la haces, no eres un fracaso: ajustas el plan y vuelves a intentarlo sin castigarte.',
    tags: ['plan', 'micro-accion', 'journaling'],
    microAccion:
      'Completa: «Hoy, a las ___, en ___, haré ___ durante ___ minutos».',
  }),
  crearItem({
    id: 'respiracion-anclaje-4-7-8',
    titulo: 'Respiración de anclaje 4-7-8',
    formato: 'meditacion',
    tema: 'mindfulness',
    subtemas: ['respiracion', 'regulacion', 'pausa'],
    etapas: TODAS_LAS_ETAPAS,
    duracionMin: 3,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuenteOMS,
    descripcion:
      'Una respiración lenta puede ayudar a bajar la activación fisiológica. No es una cura ni reemplaza atención; es una pausa para recuperar margen de elección.',
    guion:
      'Inhala por la nariz contando cuatro. Sostén suavemente contando siete. Exhala por la boca contando ocho. Repite cuatro veces. Si te marea o te incomoda, vuelve a tu respiración natural. No fuerces. La respiración es una herramienta de regulación, no una prueba de control.',
    tags: ['respiracion', 'mindfulness', 'regulacion'],
    microAccion:
      'Haz 4 ciclos de respiración 4-7-8 y nota una diferencia pequeña.',
    contraindicaciones: [
      'Mareo, ansiedad intensa o afecciones respiratorias: usa respiración natural y consulta a un profesional.',
      'No practiques mientras conduces o realizas una tarea que requiera atención.',
    ],
  }),
  crearItem({
    id: 'escaneo-corporal-breve',
    titulo: 'Escaneo corporal breve',
    formato: 'meditacion',
    tema: 'mindfulness',
    subtemas: ['escaneo_corporal', 'sensaciones', 'presente'],
    etapas: ['contemplacion', 'preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 6,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuenteMBSR,
    descripcion:
      'Un escaneo breve para notar sensaciones sin juzgarlas. Sirve para reconocer señales tempranas de estrés y elegir una respuesta en lugar de reaccionar.',
    guion:
      'Cierra los ojos si te resulta cómodo. Recorre pies, piernas, abdomen, pecho, manos, cuello y rostro. No busques relajarte; solo nota lo que hay. Si aparece malestar, abre los ojos y vuelve al presente. Puedes detenerte en cualquier momento.',
    tags: ['mindfulness', 'escaneo-corporal', 'estres'],
    microAccion:
      'Haz un escaneo de 6 minutos y anota una sensación corporal que notaste.',
    contraindicaciones: [
      'Si el silencio o el cuerpo te resultan difíciles, abre los ojos y usa una práctica de anclaje externa.',
    ],
  }),
  crearItem({
    id: 'defusion-cognitiva',
    titulo: 'Defusión cognitiva: notar el pensamiento',
    formato: 'ejercicio_guiado',
    tema: 'defusion_cognitiva',
    subtemas: ['act', 'pensamientos', 'defusion'],
    etapas: ['contemplacion', 'preparacion', 'accion', 'mantenimiento'],
    duracionMin: 5,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuenteACT,
    descripcion:
      'No se trata de eliminar pensamientos incómodos, sino de notarlos como pensamientos. La defusión cognitiva crea distancia y devuelve capacidad de elección.',
    guion:
      'Cuando aparezca un pensamiento difícil, añade: «Estoy notando que tengo el pensamiento de que...». Repítelo sin discutir con él. El pensamiento puede estar ahí y tú puedes elegir el siguiente paso. Esto no elimina el malestar por arte de magia; entrena una relación distinta con él.',
    tags: ['act', 'defusion', 'pensamientos'],
    microAccion:
      'Escribe un pensamiento difícil y reformúlalo empezando con «Estoy notando que...».',
  }),
  crearItem({
    id: 'valores-act-brujula',
    titulo: 'Tus valores como brújula',
    formato: 'journaling',
    tema: 'valores_personales',
    subtemas: ['act', 'valores', 'direccion'],
    etapas: ['contemplacion', 'preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 7,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuenteACT,
    descripcion:
      'Los valores son direcciones, no metas que se tachan. Este ejercicio ayuda a elegir acciones alineadas con lo que importa, incluso en días difíciles.',
    guion:
      'Elige tres áreas: vínculos, salud, trabajo, comunidad, creatividad o espiritualidad. Para cada una, escribe una cualidad que quieras encarnar. Luego elige una acción pequeña de hoy que exprese uno de esos valores. No se trata de hacerlo perfecto; se trata de orientarte.',
    tags: ['act', 'valores', 'journaling'],
    microAccion:
      'Escribe tus 3 valores principales y una acción de 5 minutos alineada con uno.',
  }),
  crearItem({
    id: 'higiene-del-sueno',
    titulo: 'Higiene del sueño: una rutina posible',
    formato: 'lectura',
    tema: 'higiene_sueno',
    subtemas: ['sueno', 'rutina', 'descanso'],
    etapas: ['preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 5,
    nivelEvidencia: 'cohortes',
    fuente: fuenteNIDA,
    descripcion:
      'El sueño y el ánimo se afectan mutuamente. Una rutina sencilla y repetible puede reducir la vulnerabilidad al estrés y al craving.',
    guion:
      'Intenta acostarte y levantarte a horas similares. Reduce pantallas y luces intensas antes de dormir. Evita cafeína tarde. Si no puedes dormir, no te castigues: mañana ajustas una sola cosa. Si hay insomnio persistente o síntomas graves, consulta a un profesional.',
    tags: ['sueno', 'rutina', 'descanso'],
    microAccion:
      'Elige un solo cambio para esta noche: hora fija, menos pantalla o luz baja.',
    contraindicaciones: [
      'Si hay insomnio persistente, apnea sospechada o síntomas graves, consulta a un profesional.',
    ],
  }),
  crearItem({
    id: 'apoyo-social-una-llamada',
    titulo: 'Una llamada de apoyo',
    formato: 'ejercicio',
    tema: 'apoyo_social',
    subtemas: ['red_de_apoyo', 'conexion', 'pedir_ayuda'],
    etapas: ['preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 3,
    nivelEvidencia: 'cohortes',
    fuente: fuenteOPS,
    descripcion:
      'El aislamiento aumenta la vulnerabilidad. Una llamada breve a una persona segura puede ser una acción de cuidado, no una carga para el otro.',
    guion:
      'Piensa en una persona de confianza. Envía un mensaje simple: «Estoy pasando por un momento difícil, ¿tienes cinco minutos para escucharme?». No necesitas explicar todo. Si la relación es violenta o insegura, elige otra persona o una línea de ayuda.',
    tags: ['apoyo-social', 'llamada', 'conexion'],
    microAccion:
      'Envía un mensaje a una persona de apoyo y pide 5 minutos.',
    contraindicaciones: [
      'Si la relación es violenta o insegura, elige otra persona o una línea de ayuda.',
    ],
  }),
  crearItem({
    id: 'mapa-de-red-de-apoyo',
    titulo: 'Mapa de tu red de apoyo',
    formato: 'journaling',
    tema: 'apoyo_social',
    subtemas: ['red_de_apoyo', 'mapa', 'contactos'],
    etapas: ['preparacion', 'accion', 'mantenimiento'],
    duracionMin: 6,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteOPS,
    descripcion:
      'Identificar a quién puedes acudir antes de necesitarlo reduce la carga en momentos difíciles. La red puede incluir familia, amistades, grupos y profesionales.',
    guion:
      'Dibuja tres círculos: personas cercanas, personas de la comunidad y profesionales o líneas de ayuda. Escribe un nombre y un contacto en cada uno. Pregúntate a quién puedes llamar hoy. No incluyas personas que ejerzan violencia o presión.',
    tags: ['red-de-apoyo', 'mapa', 'journaling'],
    microAccion:
      'Agrega un contacto a tu red y guarda su número en el teléfono.',
    contraindicaciones: [
      'No incluyas personas que ejerzan violencia o presión; prioriza tu seguridad.',
    ],
  }),
  crearItem({
    id: 'prevencion-de-recaidas-plan',
    titulo: 'Plan de prevención de recaídas',
    formato: 'lectura',
    tema: 'manejo_recaidas',
    subtemas: ['marlatt', 'situaciones_de_riesgo', 'plan'],
    etapas: ['preparacion', 'accion', 'mantenimiento'],
    duracionMin: 7,
    nivelEvidencia: 'cohortes',
    fuente: fuenteNIDA,
    descripcion:
      'Prevenir no es evitar todo riesgo, sino anticipar situaciones difíciles y decidir de antemano qué hacer. Un plan escrito puede ayudar a actuar con menos carga.',
    guion:
      'Identifica tres situaciones de riesgo. Para cada una, escribe una señal temprana, una acción de cuidado y a quién llamar. Un plan no es una garantía; es una herramienta para reducir la improvisación. Revísalo cuando cambien tus circunstancias.',
    tags: ['recaidas', 'prevencion', 'plan'],
    microAccion:
      'Escribe una situación de riesgo y un plan de acción de tres pasos.',
  }),
  crearItem({
    id: 'recaida-no-es-fracaso',
    titulo: 'Una recaída no es un fracaso',
    formato: 'audio',
    tema: 'manejo_recaidas',
    subtemas: ['recaida', 'autocompasion', 'retomar'],
    etapas: ['recaida', 'contemplacion', 'accion', 'mantenimiento'],
    duracionMin: 4,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteNIDA,
    descripcion:
      'Una recaída puede ser un momento de información, no una sentencia sobre tu valor. Retomar el proceso es posible; lo importante es cuidarte y buscar apoyo.',
    guion:
      'Si tuviste una recaída, no estás solo. La culpa puede ser una señal, no un veredicto. Respira, busca apoyo y retoma una acción pequeña. Si hay riesgo de sobredosis o síntomas graves, busca atención médica inmediata. Este contenido no reemplaza esa atención.',
    tags: ['recaida', 'culpa', 'retomar'],
    microAccion:
      'Escribe una frase compasiva para ti y una acción para las próximas 24 horas.',
    contraindicaciones: [
      'Si hay riesgo de sobredosis, intoxicación o síntomas graves, busca atención médica inmediata.',
    ],
    notaMedia:
      'Audio disponible mediante la voz TTS del navegador a partir del guion. No se descarga ni se envía a terceros.',
  }),
  crearItem({
    id: 'regulacion-emocional-ola',
    titulo: 'Regular la emoción como una ola',
    formato: 'ejercicio_guiado',
    tema: 'regulacion_emocional',
    subtemas: ['emociones', 'regulacion', 'necesidades'],
    etapas: ['contemplacion', 'preparacion', 'accion', 'mantenimiento', 'recaida'],
    duracionMin: 5,
    nivelEvidencia: 'cohortes',
    fuente: fuenteOPS,
    descripcion:
      'Las emociones intensas suben y bajan. Nombrar lo que sientes y bajar la activación puede abrir espacio para elegir una respuesta que te cuide.',
    guion:
      'Pon nombre a la emoción. Nota dónde está en el cuerpo. Respira lento. Pregunta: ¿qué necesito ahora? Elige una acción segura y concreta. No tienes que resolver la emoción; puedes acompañarla sin lastimarte.',
    tags: ['emociones', 'regulacion', 'pausa'],
    microAccion:
      'Nombra la emoción actual y una necesidad detrás de ella.',
  }),
  crearItem({
    id: 'comunicacion-asertiva',
    titulo: 'Pedir ayuda con claridad',
    formato: 'lectura',
    tema: 'comunicacion_asertiva',
    subtemas: ['asertividad', 'pedir_ayuda', 'limites'],
    etapas: ['preparacion', 'accion', 'mantenimiento'],
    duracionMin: 5,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteOPS,
    descripcion:
      'Pedir ayuda con claridad no es debilidad. Una frase breve, concreta y respetuosa aumenta la probabilidad de recibir el apoyo que necesitas.',
    guion:
      'Usa una estructura simple: «Me siento ___. Necesito ___. ¿Puedes ___?». Evita justificarte de más. La otra persona puede decir no; eso no define tu valor. Si pedir ayuda puede exponerte a violencia, prioriza un recurso externo y un lugar seguro.',
    tags: ['asertividad', 'comunicacion', 'ayuda'],
    microAccion:
      'Escribe una petición de ayuda usando la estructura y envíala a alguien seguro.',
    contraindicaciones: [
      'Si pedir ayuda puede exponerte a violencia, prioriza un recurso externo y un lugar seguro.',
    ],
  }),
  crearItem({
    id: 'autocompasion-voz-interna',
    titulo: 'Autocompasión: otra voz interna',
    formato: 'audio',
    tema: 'autocompasion',
    subtemas: ['autocompasion', 'culpa', 'humanidad'],
    etapas: TODAS_LAS_ETAPAS,
    duracionMin: 4,
    nivelEvidencia: 'ensayo_controlado',
    fuente: fuentePubMed,
    descripcion:
      'La autocompasión no es excusar todo; es hablarte con la misma humanidad con la que hablarías a alguien que quieres. Puede reducir la culpa que alimenta el ciclo.',
    guion:
      'Piensa en un momento difícil. Reconoce: esto duele. Recuerda: no estás solo. Pregunta: ¿qué necesito ahora? Ofrécele una frase amable. No tienes que sentir nada especial; la práctica es intentarlo, no forzar una emoción.',
    tags: ['autocompasion', 'culpa', 'voz-interna'],
    microAccion:
      'Escribe una frase que le dirías a alguien que quieres y léela en voz alta para ti.',
    notaMedia:
      'Audio disponible mediante la voz TTS del navegador a partir del guion. No se descarga ni se envía a terceros.',
  }),
  crearItem({
    id: 'senales-de-alerta-tempranas',
    titulo: 'Señales de alerta tempranas',
    formato: 'imagen',
    tema: 'prevencion_sintomas',
    subtemas: ['señales', 'autocuidado', 'prevencion'],
    etapas: ['accion', 'mantenimiento', 'recaida'],
    duracionMin: 5,
    nivelEvidencia: 'expert_opinion',
    fuente: fuenteNIDA,
    descripcion:
      'Aprender a reconocer señales tempranas —aislamiento, cambios de sueño, irritabilidad, craving— permite pedir apoyo antes de que la situación escale.',
    guion:
      'Las señales son personales. Anota las tuyas con ejemplos concretos: dormir mal, aislarte, irritarte, dejar de responder mensajes o sentir un craving más frecuente. Si notas varias a la vez, no esperes a estar en crisis: habla con alguien y ajusta tu plan.',
    tags: ['señales-tempranas', 'prevencion', 'infografia'],
    microAccion:
      'Anota tres señales tempranas personales y una acción para cada una.',
    notaMedia:
      'Infografía pendiente de diseño y verificación. Por ahora se ofrece la descripción y la transcripción accesible.',
  }),
  crearItem({
    id: 'jardin-de-progreso',
    titulo: 'El jardín de tu progreso',
    formato: 'visualizacion_3d',
    tema: 'valores_personales',
    subtemas: ['progreso', 'visualizacion', 'autocompasion'],
    etapas: TODAS_LAS_ETAPAS,
    duracionMin: 3,
    nivelEvidencia: 'PENDIENTE_VERIFICACION',
    fuente: fuentePropia,
    descripcion:
      'Una visualización simbólica del proceso: no mide tu valor ni tu éxito clínico. El jardín crece con tus acciones de cuidado, no con una racha perfecta.',
    guion:
      'Observa el jardín. Cada acción pequeña deja una huella. No necesitas comparar tu jardín con el de otros. La meta es cuidarte, no competir. Si prefieres menos movimiento, usa la versión estática o desactiva las animaciones.',
    tags: ['progreso', 'visualizacion', 'jardin'],
    microAccion:
      'Elige un elemento del jardín que represente tu acción de hoy y nómbralo.',
    accesibilidad: { reduceMotion: true },
  }),
];

export const recoveryCatalogById: ReadonlyMap<string, RecoveryItem> = new Map(
  recoveryCatalog.map((item) => [item.id, item]),
);

export function getRecoveryItem(id: string): RecoveryItem | undefined {
  return recoveryCatalogById.get(id);
}

export const RECOVERY_THEMES = Array.from(
  new Set(recoveryCatalog.map((item) => item.tema)),
);
