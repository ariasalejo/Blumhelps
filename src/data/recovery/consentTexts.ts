// ============================================================================
// BLUMHELPS — CONTRATOS DE CONSENTIMIENTO INFORMADO VERSIONADOS
// ============================================================================
// Cumple: Ley 1581 de 2012 (Colombia), Decreto 1377 de 2013, GDPR Art. 9,
//         Principios de Belmont, Declaración de Helsinki.
// El campo 'hash' se calcula en build mediante scripts/hash-consent.mjs.
// NO editar manualmente: cambiar el texto cambia el hash y fuerza
// re-consentimiento automático.
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
    version: "2.0.0",
    language: "es-CO",
    effectiveFrom: "2026-10-24T00:00:00-05:00",
    text: `## 1. IDENTIFICACIÓN DEL RESPONSABLE
El responsable del tratamiento de tus datos es el titular del proyecto
BlumHelps (en adelante, "el Responsable"). El tratamiento se realiza
íntegramente dentro de tu dispositivo local, sin transmisión a servidores.

Contacto del Responsable: [A COMPLETAR POR EL TITULAR]
Correo para ejercicio de derechos ARCO: [A COMPLETAR POR EL TITULAR]

## 2. NATURALEZA DE LA HERRAMIENTA
BlumHelps es una herramienta de acompañamiento psicoeducativo basada en
modelos validados: Modelo Transteórico de Prochaska, Terapia de Aceptación
y Compromiso (ACT), Mindfulness-Based Stress Reduction (MBSR), Prevención
de Recaídas de Marlatt y Entrevista Motivacional.

BlumHelps NO es un servicio médico, NO diagnostica, NO prescribe y NO
sustituye la atención de un profesional de salud mental.

## 3. DATOS QUE SE RECOLECTAN
3.1 Datos básicos de perfil: objetivo de uso, etapa autopercibida del
    proceso de cambio, preferencias de formato, idioma y accesibilidad.
3.2 Datos sensibles (categorías especiales, Ley 1581/2012 Art. 5):
    sustancias reportadas y frecuencia, desencadenantes emocionales y
    situacionales, registros de diario con estado de ánimo, eventos de
    crisis y respuestas, red de apoyo (nombres y teléfonos opcionales),
    valores personales y metas de vida.
3.3 Telemetría local sin envío: fechas de sesión, tiempo invertido,
    ítems completados, navegación interna.

## 4. LOCALIZACIÓN Y SOBERANÍA DE DATOS
Todos los datos se almacenan exclusivamente en tu dispositivo mediante
IndexedDB y localStorage del navegador.

NO se realiza: transmisión a servidores del Responsable; transmisión a
terceros (Google, Meta, etc.); telemetría con identificadores externos;
entrenamiento de modelos de IA con tus datos; venta, cesión o compartición
bajo ninguna modalidad.

## 5. MEDIDAS DE SEGURIDAD TÉCNICAS
5.1 Cifrado: los datos sensibles pueden cifrarse con AES-GCM de 256 bits;
    la clave se deriva de tu passphrase mediante PBKDF2 con 310.000
    iteraciones; la clave NUNCA sale del dispositivo.
5.2 Aislamiento: los datos sensibles usan el namespace exclusivo
    blumhelps.recovery.v1, separado de datos legados del sistema.
5.3 Borrado seguro: función de borrado total accesible desde la interfaz,
    con sobreescritura de 3 pasadas según DoD 5220.22-M cuando se solicita
    borrado completo con passphrase.
5.4 Sin telemetría externa: el Service Worker cachea únicamente recursos
    del propio dominio; una auditoría estática verifica la ausencia de
    llamadas a dominios externos.

## 6. BASES LEGÍTIMAS DEL TRATAMIENTO
a) Consentimiento explícito del titular (Ley 1581/2012 Art. 9).
b) Interés legítimo del usuario en su propio proceso de autocuidado.
c) Los datos nunca salen del dispositivo: el tratamiento equivale a un
   archivo personal cifrado bajo tu control exclusivo.

## 7. DERECHOS DEL TITULAR (ARCO)
De conformidad con la Ley 1581 de 2012 Art. 8, tienes derecho a:
7.1 Acceso: conocer, actualizar y rectificar tus datos personales.
7.2 Rectificación: solicitar corrección de datos inexactos o incompletos.
7.3 Cancelación (supresión): solicitar eliminación cuando consideres que
    no se requieren, hayas revocado el consentimiento, o haya transcurrido
    el plazo de retención.
7.4 Oposición: oponerte al tratamiento para fines específicos.

Ejercicio de derechos: todos los derechos ARCO se ejercen directamente
desde la interfaz mediante la función "Borrar mis datos". Al ser datos
locales, el ejercicio es inmediato y sin intermediación.

## 8. PLAZO DE RETENCIÓN
Los datos se conservan indefinidamente mientras no solicites su
eliminación, puesto que constituyen tu archivo personal de proceso.
Al eliminarlos desde la interfaz se sobrescriben y quedan irrecuperables.

## 9. TRANSFERENCIAS INTERNACIONALES
No se realizan transferencias internacionales. Los datos permanecen
exclusivamente en tu dispositivo, sin salir del territorio físico donde
éste se encuentre.

## 10. DECISIONES AUTOMATIZADAS
La herramienta utiliza un motor de recomendación local y explicable:
cada sugerencia incluye una lista visible de razones (reasons[]); los
pesos de cada razón son públicos y auditables en el código fuente; no
existen modelos opacos ni decisiones que afecten significativamente tus
derechos sin explicación; puedes consultar la razón de cualquier
recomendación en cualquier momento.

## 11. LIMITACIONES Y RIESGOS CONOCIDOS
Reconoces y aceptas que:
11.1 Limitaciones técnicas: el almacenamiento local puede perderse si
     borras los datos del navegador, cambias de dispositivo sin exportar,
     o navegas en modo privado. La seguridad del cifrado depende de la
     fortaleza de tu passphrase.
11.2 Limitaciones clínicas: esta herramienta no sustituye atención
     profesional. En crisis inmediata (ideación suicida, autolesiones,
     riesgo para terceros, intoxicación aguda) debes contactar al 123
     (emergencias nacionales Colombia), al 106 (línea de crisis emocional,
     alcance principalmente distrital), o a servicios de urgencia locales.
11.3 Riesgos residuales: un tercero con acceso físico a tu dispositivo
     desbloqueado podría acceder a datos no cifrados. Se recomienda
     activar la protección con passphrase.

## 12. MODIFICACIONES AL CONSENTIMIENTO
Toda modificación sustancial: se publica con nueva versión numerada
(semver); requiere nuevo consentimiento explícito; no tiene efectos
retroactivos sobre datos tratados bajo versiones previas; se notifica
dentro de la aplicación con descripción clara de los cambios.

## 13. RECLAMOS Y QUEJAS
Para reclamos sobre el tratamiento de tus datos: correo del Responsable
[A COMPLETAR]. Tiempo máximo de respuesta: 15 días hábiles (Ley 1581/2012
Art. 14). Si no recibes respuesta, puedes elevar queja ante la
Superintendencia de Industria y Comercio (SIC) de Colombia.

## 14. DECLARACIÓN DE ENTENDIMIENTO
Al aceptar este consentimiento declaras: haber leído y comprendido
íntegramente este documento; entender que BlumHelps es una herramienta
psicoeducativa y no médica; conocer los límites y riesgos de la Sección 11;
ser mayor de edad o contar con autorización del representante legal;
aceptar que tus datos se almacenan únicamente en tu dispositivo; conocer
tus derechos ARCO y cómo ejercerlos.

## 15. FIRMA ELECTRÓNICA
La aceptación se registra mediante: hash SHA-256 del texto aceptado;
marca de tiempo ISO-8601 del momento de aceptación; versión del
consentimiento aceptada. Esta triple información constituye la firma
electrónica del consentimiento y se almacena localmente como evidencia
de la relación jurídica establecida.`,
    summary: [
      "Acompañamiento psicoeducativo: no es servicio médico ni diagnóstico.",
      "Tus datos viven solo en tu dispositivo: soberanía digital total.",
      "Puedes borrar todo cuando quieras, sin penalización ni trámite.",
      "No compartimos, vendemos ni cedemos datos a ningún tercero.",
      "En crisis inmediata llama al 123 o al 106; la app no te atiende.",
      "Toda recomendación es explicable y auditable en el código fuente.",
    ],
    hash: "72feccaa33ca33a9b67aa7361da798568925f00ed8708cb8e4edb31b4ba0dcdf",
    audit: {
      approvedBy: "FIRU NINJA — Responsable de Producto y Arquitectura",
      legalBasis: [
        "Ley 1581 de 2012 (Colombia)",
        "Decreto 1377 de 2013",
        "GDPR Art. 9 (categorías especiales, por analogía)",
        "Principios de Belmont (beneficencia, autonomía, justicia)",
        "Declaración de Helsinki",
      ],
      specialCategories: [
        "Datos de salud mental (Ley 1581 Art. 5 literal a)",
        "Opiniones y creencias personales (valores ACT)",
        "Datos de contacto de red de apoyo",
      ],
      retentionDays: -1,
      internationalTransfers: false,
      automatedDecisions: true,
    },
    changesFromPrevious:
      "Versión inicial del módulo de acompañamiento en recuperación: " +
      "consentimiento específico para datos sensibles de salud, motor de " +
      "recomendación explicable, cifrado local con passphrase opcional y " +
      "protocolo de crisis con recursos verificados para Colombia.",
  },
] as const;

export const CURRENT_CONSENT: ConsentVersion =
  CONSENT_VERSIONS[CONSENT_VERSIONS.length - 1];

export const CONSENT_AUDIT_LOG = CONSENT_VERSIONS.map((v) => ({
  version: v.version,
  effectiveFrom: v.effectiveFrom,
  hash: v.hash,
}));
