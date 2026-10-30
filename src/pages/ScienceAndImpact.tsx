import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HeartHandshake,
  Info,
  Microscope,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { scienceResearch } from '../data/scienceResearch';
import { helpDictionary } from '../data/scienceData';
import { PersonalJourney } from '../components/science/PersonalJourney';

const researchSource = {
  globalTreatmentGap: 'global-treatment-gap-2023',
  colombiaSurvey: 'colombia-self-reported-mental-health-2023',
} as const;

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-semibold text-[var(--moss)] underline underline-offset-4 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--moss)]"
    >
      {label} <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

function ResearchCard({
  item,
}: {
  item: (typeof scienceResearch)[number];
}) {
  const badge = item.kind === 'global-estimate'
    ? 'Estimación mundial'
    : item.kind === 'survey'
      ? 'Encuesta'
      : 'Recomendación clínica';

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-[var(--moss)]/10 px-3 py-1 text-xs font-semibold text-[var(--moss)]">{badge}</span>
        <span className="text-xs text-gray-500">Publicación: {item.publicationYear}</span>
      </div>
      <h3 className="text-xl font-bold text-[var(--ink)]">{item.title}</h3>
      <p className="mt-1 text-sm font-medium text-gray-600">{item.organization}</p>
      <p className="mt-3 leading-relaxed text-gray-700">{item.summary}</p>
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-amber-950">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span><strong>Cómo interpretar este dato:</strong> {item.interpretationLimit}</span>
        </p>
      </div>
      <p className="mt-4 text-xs text-gray-500">{item.population}</p>
      <div className="mt-4">
        <SourceLink label={item.sourceLabel} url={item.sourceUrl} />
      </div>
    </article>
  );
}

function GlobalTreatmentAccessChart() {
  const treated = (1 / 12) * 100;
  const notTreated = (11 / 12) * 100;

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="treatment-gap-title">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--moss)]/10 text-[var(--moss)]">
          <Users className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--moss)]">Gráfico científico · escala mundial</p>
          <h2 id="treatment-gap-title" className="mt-1 text-2xl font-bold text-[var(--ink)]">La brecha de acceso no es un fracaso personal</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            El Informe Mundial sobre las Drogas 2025 de UNODC estima que 64 millones de personas vivían con trastornos por consumo de drogas en 2023; solo una de cada doce recibió algún tipo de tratamiento relacionado con drogas.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-5" role="img" aria-label="Gráfico derivado del dato de UNODC: aproximadamente 8,3 por ciento recibió algún tratamiento y 91,7 por ciento no recibió tratamiento en 2023, a escala mundial.">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[var(--ink)]">Recibió algún tipo de tratamiento</span>
            <strong className="text-[var(--moss)]">≈ {treated.toLocaleString('es-CO', { maximumFractionDigits: 1 })} %</strong>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-[var(--moss)]" style={{ width: `${treated}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-[var(--ink)]">No recibió tratamiento</span>
            <strong className="text-gray-600">≈ {notTreated.toLocaleString('es-CO', { maximumFractionDigits: 1 })} %</strong>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-gray-500" style={{ width: `${notTreated}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-gray-500">
        Los porcentajes se calculan a partir de la proporción publicada de 1 en 12 y se redondean a una cifra decimal. El 91,7 % es el complemento aritmético de esa proporción; no es una medición independiente. No corresponde a Colombia ni a la probabilidad de recuperación de una persona.
      </p>
      <div className="mt-4">
        <SourceLink label="Consultar los hallazgos clave del Informe Mundial sobre las Drogas 2025" url="https://www.unodc.org/documents/data-and-analysis/WDR_2025/WDR25_B1_Key_findings.pdf" />
      </div>
    </section>
  );
}

function ColombiaSurveyChart() {
  const percent = 66.3;
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="colombia-survey-title">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--gold)]/20 text-[var(--ink)]">
          <Microscope className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--moss)]">Dato colombiano · encuesta de 2023</p>
          <h2 id="colombia-survey-title" className="mt-1 text-2xl font-bold text-[var(--ink)]">Hablar de salud mental también es hablar de experiencias reales</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            En los resultados divulgados por el Ministerio de Salud, el {percent.toLocaleString('es-CO')} % de las 3.430 personas adultas encuestadas declaró haber afrontado algún problema de salud mental alguna vez.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold text-[var(--ink)]">Personas que lo declararon</span>
          <strong className="text-[var(--moss)]">{percent.toLocaleString('es-CO')} %</strong>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-gray-100" role="img" aria-label="El 66,3 por ciento de participantes declaró haber afrontado algún problema de salud mental alguna vez.">
          <div className="h-full rounded-full bg-[var(--gold)]" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500"><span>0 %</span><span>100 %</span></div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-gray-500">
        La pregunta se refería a alguna vez en la vida. Es una declaración en encuesta, no un diagnóstico clínico ni una medida de la situación actual de toda persona en Colombia.
      </p>
      <div className="mt-4">
        <SourceLink label="Ver la publicación original del Ministerio de Salud" url="https://www.minsalud.gov.co/Comunicaciones/noticias/2023/Paginas/66-porciento-de-colombianos-declara-haber-enfrentado-algun-problema-de-salud-mental.aspx" />
      </div>
    </section>
  );
}

export function ScienceAndImpact() {
  const treatmentFinding = scienceResearch.find((item) => item.id === researchSource.globalTreatmentGap);
  const surveyFinding = scienceResearch.find((item) => item.id === researchSource.colombiaSurvey);
  const recommendations = scienceResearch.filter((item) => item.kind === 'recommendation');

  return (
    <main className="bl-science-page mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <header className="relative overflow-hidden rounded-[2rem] bg-[var(--ink)] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[var(--moss)]/30 blur-3xl" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Microscope className="h-4 w-4" aria-hidden="true" /> Ciencia, contexto y experiencia
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
            La ciencia de la <span className="text-[var(--gold)]">esperanza</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Recuperarse no es seguir una curva perfecta. Aquí separamos los datos publicados, sus límites y tu experiencia personal. Cada cifra importante debe conducir a su fuente.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> Sin promesas de curación</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" aria-hidden="true" /> Fuentes rastreables</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="why-evidence-title" className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--moss)]/10 text-[var(--moss)]">
            <HeartHandshake className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="why-evidence-title" className="text-2xl font-bold text-[var(--ink)]">Qué puede y qué no puede decirnos la evidencia</h2>
            <p className="text-sm text-gray-600">Una estadística grupal no predice el destino de una persona.</p>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {treatmentFinding && <ResearchCard item={treatmentFinding} />}
          {surveyFinding && <ResearchCard item={surveyFinding} />}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlobalTreatmentAccessChart />
        <ColombiaSurveyChart />
      </div>

      <section aria-labelledby="supports-title" className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--moss)]">Acompañamiento respetuoso</p>
          <h2 id="supports-title" className="mt-1 text-2xl font-bold text-[var(--ink)]">Acciones pequeñas, dignidad intacta</h2>
          <p className="mt-2 max-w-3xl text-gray-700">
            BlumHelps no determina quién se recupera ni cuánto tarda. Puede ayudar a encontrar información, organizar un siguiente paso y reconocer apoyos que la persona elija.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--moss)]/20 bg-[var(--moss)]/5 p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--moss)]">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Formas de apoyar
            </h3>
            <ul className="space-y-3">
              {helpDictionary.QUE_HACER.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--moss)]" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--ink)]">
              <Info className="h-5 w-5" aria-hidden="true" /> Cosas que debemos evitar
            </h3>
            <ul className="space-y-3">
              {helpDictionary.QUE_NO_HACER.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                  <span className="mt-0.5 font-bold text-[var(--terra)]" aria-hidden="true">×</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {recommendations.map((item) => <ResearchCard key={item.id} item={item} />)}
      </section>

      <section className="bl-science-method" aria-labelledby="method-title">
        <div className="max-w-3xl">
          <p className="bl-science-kicker">Cómo evaluamos la información</p>
          <h2 id="method-title" className="text-3xl font-bold text-[#0b3452]">Una cifra sin contexto puede confundir. Aquí mostramos el contexto.</h2>
          <p className="mt-3 leading-relaxed text-slate-600">BLUMHelps separa estimaciones poblacionales, encuestas, recomendaciones y experiencias personales. No las presenta como si fueran el mismo tipo de evidencia.</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <article><span>01</span><h3>Procedencia</h3><p>Identificamos la organización, el documento o la publicación original y dejamos un enlace para consultarla.</p></article>
          <article><span>02</span><h3>Población y fecha</h3><p>Indicamos a quiénes se refiere el dato y el año de publicación o del periodo estudiado cuando esa información está disponible.</p></article>
          <article><span>03</span><h3>Límites</h3><p>Explicamos qué no permite concluir una cifra. Una asociación o promedio no predice lo que ocurrirá a una persona.</p></article>
        </div>
        <div className="mt-6 rounded-2xl border border-cyan-900/10 bg-white/75 p-5">
          <h3 className="font-bold text-[#0b3452]">Antes de compartir un hallazgo, comprueba:</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-slate-600 sm:grid-cols-2">
            <li>• ¿La fuente original está disponible y abre correctamente?</li>
            <li>• ¿El año y la población corresponden a lo que afirma el texto?</li>
            <li>• ¿Se distingue una encuesta de un diagnóstico clínico?</li>
            <li>• ¿Se explican incertidumbre, limitaciones y contexto territorial?</li>
            <li>• ¿El dato está actualizado para el uso que se le quiere dar?</li>
            <li>• ¿Se evita convertir una estadística en promesa individual?</li>
          </ul>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">Alcance editorial: esta página presenta una selección pequeña de fuentes, no una revisión sistemática ni una guía de tratamiento. La evidencia puede cambiar; consulta siempre la publicación original y a profesionales cualificados para decisiones clínicas.</p>
      </section>

      <PersonalJourney />

      <section className="bl-science-rules rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-[var(--ink)]">Reglas de verdad para BlumHelps</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-gray-700 md:grid-cols-2">
          <li>• No publicar tasas de éxito sin fuente, población, año y límites.</li>
          <li>• No convertir autoobservaciones en diagnósticos ni predicciones.</li>
          <li>• No presentar un ejemplo hipotético como un “caso real”.</li>
          <li>• Las referencias y los datos deben poder abrirse y revisarse.</li>
          <li>• Los cambios personales se muestran solo con registros que la persona haya decidido guardar.</li>
          <li>• En una crisis, los gráficos no sustituyen ayuda profesional ni servicios de emergencia.</li>
        </ul>
      </section>
    </main>
  );
}
