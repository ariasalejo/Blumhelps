// ============================================================================
// BLUMHELPS — CONTRATOS DE CONSENTIMIENTO INFORMADO VERSIONADOS
// ============================================================================
// Este texto no certifica cumplimiento legal. La revisión jurídica y los
// datos de contacto del responsable siguen pendientes.
// El hash identifica el texto, no es una firma electrónica certificada.
// El build recalcula el hash mediante scripts/hash-consent.mjs.
// ============================================================================

export interface ConsentVersion {
  version: string;
  language: "es-CO";
  effectiveFrom: string;
  text: string;
  summary: readonly string[];
  hash: string;
  audit: {
    approvedBy: string;
    legalBasis: readonly string[];
    specialCategories: readonly string[];
    retentionDays: number;
    internationalTransfers: boolean;
    automatedDecisions: boolean;
  };
  changesFromPrevious?: string;
}

export const CONSENT_VERSIONS: readonly ConsentVersion[] = [
  {
    version: "2.1.0",
    language: "es-CO",
    effectiveFrom: "2026-10-24T00:00:00-05:00",
    text: `## 1. RESPONSABLE DEL TRATAMIENTO Y ESTADO DEL DOCUMENTO
BlumHelps es un proyecto de software de bienestar y orientación psicoeducativa. La identificación completa del responsable, los datos de contacto y el canal de privacidad deben completarse por el titular antes de utilizar esta versión como aviso público.

Responsable: [PENDIENTE DE COMPLETAR]
Contacto de privacidad: [PENDIENTE DE COMPLETAR]
Fecha de revisión jurídica: [PENDIENTE]

Este texto describe limitaciones técnicas conocidas. No certifica cumplimiento normativo ni sustituye una revisión jurídica independiente. No debe utilizarse como prueba de cumplimiento legal mientras falten los datos de contacto y la revisión correspondiente.

## 2. NATURALEZA DE LA HERRAMIENTA
BlumHelps ofrece recursos de reflexión, información y acompañamiento psicoeducativo. No diagnostica, no prescribe, no garantiza una recuperación y no sustituye la atención de profesionales de salud.

Las recomendaciones de la aplicación son orientación general. No deben utilizarse como base única para decisiones médicas, de empleo, prestaciones, elegibilidad o atención de urgencia.

## 3. DATOS QUE PUEDE GUARDAR EL MÓDULO DE RECUPERACIÓN
Según las funciones que la persona utilice, el navegador puede almacenar: objetivo y etapa autopercibida del proceso de cambio; preferencias de idioma y accesibilidad; valores y respuestas de reflexión; desencadenantes y estrategias declarados; texto de diario; autoobservaciones de ánimo e intensidad de impulso; recursos completados; eventos de crisis y contactos de apoyo que la persona decida introducir.

No es obligatorio introducir notas personales para usar todas las funciones. Evita escribir contraseñas, números de identificación, nombres completos o información sensible de otras personas.

## 4. DÓNDE SE GUARDAN LOS REGISTROS Y QUÉ SE HA VERIFICADO
El módulo de recuperación utiliza IndexedDB del navegador y puede recurrir a localStorage si IndexedDB no está disponible. Estos registros no se cifran con una clave personal en esta versión.

La función de registro de trayectoria no envía sus notas a un servicio de IA. Sin embargo, esto no constituye una auditoría completa de todas las solicitudes de red, recursos de terceros, configuración del alojamiento o extensiones del navegador. Por tanto, no se promete privacidad absoluta ni ausencia total de conexiones externas.

Al abrir enlaces a sitios externos o usar la salida rápida, el navegador puede conectarse a servicios ajenos a BlumHelps. Esos sitios pueden procesar los datos técnicos habituales de una conexión y se rigen por sus propias políticas.

## 5. MEDIDAS DE SEGURIDAD Y LIMITACIONES TÉCNICAS
5.1 Cifrado: la versión actual no implementa cifrado de los registros de recuperación mediante una clave personal o contraseña. No debe asumirse que los datos están protegidos criptográficamente dentro del navegador.
5.2 Acceso: cualquier persona que consiga acceso al perfil del navegador o al dispositivo desbloqueado podría acceder a los registros locales. La sincronización del navegador, las copias de seguridad y el software instalado también pueden afectar a la exposición.
5.3 Bloqueo: esta versión no ofrece un bloqueo propio con PIN o biometría para proteger el módulo de recuperación.
5.4 Borrado: las funciones de borrado eliminan datos mediante las API de almacenamiento del navegador. No pueden prometer una sobreescritura forense, eliminación de todas las copias del sistema operativo ni borrado de copias que el navegador o el dispositivo hayan realizado.
5.5 Recomendación prudente: usa un dispositivo y una cuenta de usuario protegidos, mantén el sistema actualizado y no registres información sensible si otras personas pueden acceder al navegador.

## 6. FINALIDAD Y CONSENTIMIENTO
La finalidad prevista es permitir que una persona organice sus reflexiones y consulte recursos educativos en su propio dispositivo. El consentimiento mostrado por la aplicación no certifica por sí solo que todos los requisitos jurídicos aplicables estén satisfechos.

La base jurídica, las finalidades detalladas, el responsable, los canales para ejercer derechos y el texto definitivo deben revisarse con asesoría jurídica competente antes de un lanzamiento público con datos sensibles.

## 7. CONTROLES DISPONIBLES PARA LA PERSONA
La función de salida rápida ofrece una opción para salir sin borrar y otra para borrar los datos del módulo de recuperación antes de salir. La eliminación del módulo no equivale a borrar todos los datos legados de cualquier función de BlumHelps.

En esta versión no debe asumirse que existe una herramienta completa de autoservicio para consultar, rectificar, exportar y suprimir todos los datos de todas las secciones. Estas capacidades y su alcance deben verificarse y completarse antes de producción.

## 8. RETENCIÓN Y ELIMINACIÓN
Los registros locales pueden permanecer en el navegador hasta que la persona los borre o el propio navegador, sistema operativo o dispositivo los elimine. Este módulo no tiene implementado un plazo automático de conservación.

La eliminación mediante la interfaz no permite garantizar que los datos sean irrecuperables en todos los medios físicos, instantáneas, sincronizaciones o copias de seguridad del dispositivo.

## 9. SERVICIOS EXTERNOS Y ALCANCE DE LA REVISIÓN
Los enlaces a fuentes, oportunidades y recursos pueden abrir páginas externas. No se ha completado una auditoría independiente de todo el tráfico de red de la aplicación ni de la infraestructura de alojamiento. Hasta terminar esa revisión, no se declara que el producto entero esté libre de transferencias o solicitudes a terceros.

La afirmación específica de esta pantalla es más limitada: el registro de trayectoria usa las funciones de almacenamiento local descritas y no integra por sí mismo un envío de las notas a un proveedor de IA.

## 10. RECOMENDACIONES AUTOMATIZADAS
Algunas funciones pueden ordenar recursos educativos a partir de respuestas que la persona introduce. Una recomendación automática no es un diagnóstico, no predice de forma validada el comportamiento futuro y no debe utilizarse como único criterio para una decisión que afecte derechos, salud o acceso a oportunidades.

La experiencia debe permitir a la persona ignorar una sugerencia, cambiar sus respuestas o dejar de usar la herramienta sin penalización.

## 11. LIMITACIONES Y SITUACIONES DE RIESGO
La aplicación puede perder los datos cuando se borra el almacenamiento del navegador, se usa navegación privada o se cambia de dispositivo. También existe riesgo de exposición si otra persona accede al dispositivo o al perfil del navegador.

BlumHelps no es un servicio de emergencias. Si existe peligro inmediato, intoxicación grave o una urgencia médica, contacta los servicios de emergencia locales o acude a un servicio de urgencias. La cobertura de líneas de apoyo puede variar por ciudad; verifica su alcance territorial.

## 12. CAMBIOS DEL DOCUMENTO
Los cambios sustanciales deben reflejarse en una nueva versión del texto y comunicarse claramente. El titular debe decidir, con revisión jurídica, cuándo corresponde solicitar de nuevo el consentimiento.

## 13. CONTACTO, SOLICITUDES Y QUEJAS
Los datos de contacto del responsable aún no están configurados en este documento. Deben completarse antes de ofrecer la aplicación como producto de producción. El titular debe establecer un proceso operativo para recibir y responder solicitudes de privacidad y quejas.

## 14. DECLARACIÓN DE ENTENDIMIENTO
Al continuar, la persona debe comprender que los registros se almacenan en el navegador sin cifrado mediante una clave personal; que la revisión global de privacidad y red está pendiente; que la salida rápida solo borra los datos del módulo de recuperación; y que la herramienta es educativa, no médica. Si estas condiciones no son aceptables, no introduzcas información sensible.

## 15. HASH Y TRAZABILIDAD DEL TEXTO
El hash SHA-256 identifica el contenido de este texto para ayudar a detectar cambios. Por sí solo no demuestra la identidad del responsable, no constituye una firma electrónica certificada y no acredita el cumplimiento de la legislación.`,
    summary: [
      "Los registros se guardan en el navegador y no están cifrados con una clave personal.",
      "No incluyas contraseñas ni datos que identifiquen a otras personas.",
      "La salida rápida borra el módulo de recuperación, no necesariamente todos los datos de la app.",
      "No se ha completado una auditoría independiente de toda la red y los servicios externos.",
      "BlumHelps es psicoeducativo; no es diagnóstico ni atención de emergencias.",
      "Faltan datos de contacto del responsable y revisión jurídica antes de un lanzamiento público.",
    ],
    hash: "6df7e5ee078ec4edc20f99cdbe22aaa0633d34d575a1e334ece39823462db5e5",
    audit: {
      approvedBy: "PENDIENTE: revisión jurídica independiente",
      legalBasis: [
        "Referencias normativas pendientes de revisión jurídica; este documento no certifica cumplimiento.",
      ],
      specialCategories: [
        "Datos de salud mental (Ley 1581 Art. 5 literal a)",
        "Opiniones y creencias personales (valores ACT)",
        "Datos de contacto de red de apoyo",
      ],
      retentionDays: -1,
      internationalTransfers: "not-audited",
      automatedDecisions: true,
    },
    changesFromPrevious:
      "Versión 2.1.0: se corrigen afirmaciones de cifrado, borrado, transferencia y cumplimiento que no estaban demostradas en el código. Requiere completar los contactos y revisar jurídicamente antes de producción.",
  },
] as const;

export const CURRENT_CONSENT: ConsentVersion =
  CONSENT_VERSIONS[CONSENT_VERSIONS.length - 1];

export const CONSENT_AUDIT_LOG = CONSENT_VERSIONS.map((v) => ({
  version: v.version,
  effectiveFrom: v.effectiveFrom,
  hash: v.hash,
}));
