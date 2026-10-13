export type EnergyLevel = "low" | "steady" | "high";
export type PlanFocus = "care" | "connection" | "learning" | "structure";
export type AdaptiveRequest = { energy: EnergyLevel; time_minutes: number; focus: PlanFocus; language: "es" | "en" };
export type AdaptiveStep = { title: string; detail: string };
export type AdaptivePlan = { title: string; minutes: number; steps: AdaptiveStep[]; rationale: string; safety_note: string };

const copy: Record<PlanFocus, { es: string; en: string; lowEs: string; lowEn: string; steadyEs: string; steadyEn: string; highEs: string; highEn: string; closeEs: string; closeEn: string }> = {
  care: { es:"Volver al cuerpo", en:"Return to your body", lowEs:"Respira con comodidad y toma un poco de agua.", lowEn:"Breathe comfortably and have some water.", steadyEs:"Haz una pausa breve y estira el cuerpo suavemente.", steadyEn:"Take a short pause and stretch gently.", highEs:"Sal a caminar o prepara algo nutritivo, si puedes.", highEn:"Take a walk or prepare something nourishing, if you can.", closeEs:"Elige solo lo que se sienta seguro y posible.", closeEn:"Choose only what feels safe and possible." },
  connection: { es:"Acercarte sin presión", en:"Connect without pressure", lowEs:"Piensa en una persona con quien te sientas a salvo.", lowEn:"Think of someone you feel safe with.", steadyEs:"Envía un mensaje breve a alguien de confianza.", steadyEn:"Send a short message to someone you trust.", highEs:"Propón una llamada o un encuentro sencillo.", highEn:"Suggest a call or simple get-together.", closeEs:"Comparte solo lo que quieras compartir.", closeEn:"Share only what you want to share." },
  learning: { es:"Abrir una ventana nueva", en:"Open a new window", lowEs:"Lee un párrafo o escucha algo tranquilo.", lowEn:"Read one paragraph or listen to something calm.", steadyEs:"Dedica unos minutos a un tema que te interese.", steadyEn:"Spend a few minutes on a topic that interests you.", highEs:"Explora una formación o practica una habilidad.", highEn:"Explore training or practise a skill.", closeEs:"Parar después de unos minutos también está bien.", closeEn:"Stopping after a few minutes is okay, too." },
  structure: { es:"Hacer espacio para lo importante", en:"Make room for what matters", lowEs:"Escoge una sola tarea de dos minutos.", lowEn:"Choose one two-minute task.", steadyEs:"Ordena un espacio pequeño o prepara algo para mañana.", steadyEn:"Tidy one small space or prepare something for tomorrow.", highEs:"Divide una tarea pendiente en tres pasos concretos.", highEn:"Break one pending task into three clear steps.", closeEs:"Puedes detenerte o cambiar el plan cuando lo necesites.", closeEn:"You can stop or change the plan whenever you need." }
};

export function makeLocalPlan(input: AdaptiveRequest): AdaptivePlan {
  const item = copy[input.focus];
  const es = input.language === "es";
  const first = input.energy === "low" ? (es ? item.lowEs : item.lowEn) : input.energy === "steady" ? (es ? item.steadyEs : item.steadyEn) : (es ? item.highEs : item.highEn);
  const second = es ? item.closeEs : item.closeEn;
  const steps = [{ title: es ? "Paso posible" : "Possible step", detail: first }];
  if (input.energy !== "low" && input.time_minutes >= 8) steps.push({ title: es ? "Cierre amable" : "Gentle close", detail: second });
  return {
    title: es ? item.es : item.en,
    minutes: input.energy === "low" ? Math.min(5, input.time_minutes) : input.time_minutes,
    steps,
    rationale: es ? "Usa solo las preferencias que acabas de elegir; no es un diagnóstico ni predice resultados." : "Uses only the preferences you just selected; it is not a diagnosis and does not predict outcomes.",
    safety_note: es ? "Puedes cambiar o ignorar cualquier paso. No sustituye atención profesional ni servicios de emergencia." : "You can change or ignore any step. This does not replace professional care or emergency services."
  };
}

export async function requestAdaptivePlan(input: AdaptiveRequest): Promise<AdaptivePlan> {
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\\/$/, "");
  const response = await fetch(base + "/api/v1/plan/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input)
  });
  if (!response.ok) throw new Error("Planner API unavailable");
  return response.json() as Promise<AdaptivePlan>;
}

export type PublicSupportResource = {
  id: string; title: string; summary: string; category: string; country: string;
  source_name: string; url: string; reviewed_on: string;
};

export async function requestPublicResources(country = "CO"): Promise<PublicSupportResource[]> {
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\\/$/, "");
  const response = await fetch(base + "/api/v1/resources?country=" + encodeURIComponent(country), {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error("Resource API unavailable");
  return response.json() as Promise<PublicSupportResource[]>;
}
