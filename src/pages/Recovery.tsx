import React, { useState } from 'react';
import { Phone, HeartHandshake, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { buildRoute, NavigatorInput, RecoveryRoute } from '../engines/recoveryNavigator';
import { generate24hPlan, savePlan, loadPlan } from '../engines/actionPlan24h';
import { getCrisisTel, getEmergencyTel } from '../engines/crisis';

export function Recovery() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<NavigatorInput>({
    needHelpNow: false,
    wantToChange: false,
    triedBefore: false,
    haveSupport: false,
    substance: 'unsure',
    forSomeone: false,
    riskNow: false
  });
  const [route, setRoute] = useState<RecoveryRoute | null>(null);
  const [savedPlan] = useState(() => loadPlan());

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const generate = () => {
    const r = buildRoute(input);
    setRoute(r);
    const plan = generate24hPlan(input);
    savePlan(plan);
    setStep(99);
  };

  if (step === 99 && route) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold serif">Mi Ruta de 24 Horas</h1>
          <p className="mt-2 text-gray-700">{route.title} • {route.message}</p>
        </header>

        <div className="grid gap-4">
          {route.steps.map((s, idx) => (
            <article key={s.id} className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--moss)]/10 text-[var(--moss)] flex items-center justify-center font-bold">{idx+1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-semibold">{s.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3"/>{s.time}</span>
                  </div>
                  <p className="mt-1 text-gray-700 leading-relaxed">{s.description}</p>
                  {s.priority === 'urgent' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a href={getCrisisTel()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"><Phone className="w-4 h-4"/> Llamar al 106</a>
                      <a href={getEmergencyTel()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700"><Phone className="w-4 h-4"/> Emergencias 123</a>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--moss)]/30 bg-[var(--moss)]/5 p-5">
          <div className="flex items-center gap-2 text-[var(--moss)] font-semibold"><CheckCircle2 className="w-5 h-5"/>{route.encouragement}</div>
          <p className="mt-2 text-sm text-gray-700">Guardado solo en este navegador (anónimo). Puedes volver aquí cuando quieras.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => { setStep(0); setRoute(null); }} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50">Hacer de nuevo</button>
          <a href="/ayuda" className="px-4 py-2 rounded-xl bg-[var(--moss)] text-white hover:bg-[var(--moss-deep)]">Ver Recursos Verificados</a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold serif">Mi Ruta</h1>
        <p className="mt-2 text-gray-700">3 preguntas. Anónimo. Sin registro. Genera tu plan de 24 horas.</p>
      </header>

      {step === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">¿Qué necesitas hoy?</h2>
          <button onClick={() => { setInput({...input, needHelpNow: true, forSomeone: false}); next(); }} className="w-full text-left p-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 flex items-center justify-between">
            <div>
              <div className="font-semibold text-red-700">Necesito ayuda AHORA</div>
              <div className="text-sm text-red-600/80">Crisis inmediata</div>
            </div>
            <ArrowRight className="w-5 h-5 text-red-600"/>
          </button>
          <button onClick={() => { setInput({...input, needHelpNow: false, forSomeone: false}); next(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-between">
            <div>
              <div className="font-semibold">Quiero salir adelante</div>
              <div className="text-sm text-gray-600">Buscar un camino paso a paso</div>
            </div>
            <ArrowRight className="w-5 h-5"/>
          </button>
          <button onClick={() => { setInput({...input, needHelpNow: false, forSomeone: true}); next(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HeartHandshake className="w-5 h-5 text-[var(--moss)]"/>
              <div>
                <div className="font-semibold">Quiero ayudar a alguien</div>
                <div className="text-sm text-gray-600">Familiar o acompañante</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5"/>
          </button>
        </div>
      )}

      {step === 1 && !input.needHelpNow && !input.forSomeone && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">¿Te sientes listo para dar un primer paso?</h2>
          <button onClick={() => { setInput({...input, wantToChange: true}); next(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50">Sí, quiero intentar</button>
          <button onClick={() => { setInput({...input, wantToChange: false}); next(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50">Aún no estoy seguro</button>
          <button onClick={prev} className="text-sm text-gray-600 underline">Volver</button>
        </div>
      )}

      {step === 1 && (input.needHelpNow || input.forSomeone) && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Listo para generar tu ruta</h2>
          <p className="text-gray-700">Con esto generamos un plan corto y realista.</p>
          <div className="flex gap-2">
            <button onClick={prev} className="px-4 py-2 rounded-xl border border-gray-300">Volver</button>
            <button onClick={generate} className="px-4 py-2 rounded-xl bg-[var(--moss)] text-white">Generar mi ruta</button>
          </div>
        </div>
      )}

      {step === 2 && !input.needHelpNow && !input.forSomeone && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">¿Tienes alguien de confianza que te pueda acompañar?</h2>
          <button onClick={() => { setInput({...input, haveSupport: true}); generate(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50">Sí</button>
          <button onClick={() => { setInput({...input, haveSupport: false}); generate(); }} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50">No</button>
          <button onClick={prev} className="text-sm text-gray-600 underline">Volver</button>
        </div>
      )}

      {savedPlan && step < 99 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-700">Tienes un plan guardado. <button onClick={() => setStep(99)} className="underline text-[var(--moss)]">Verlo</button></div>
        </div>
      )}
    </main>
  );
}
