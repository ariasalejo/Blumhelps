// BLUMHELPS - ActionPlan24h
import { buildRoute, NavigatorInput } from './recoveryNavigator';

export interface Action24h {
  timeBlock: 'ahora' | 'manana' | 'tarde' | 'noche';
  title: string;
  done: boolean;
}

export function generate24hPlan(input: NavigatorInput): Action24h[] {
  const route = buildRoute(input);
  const actions: Action24h[] = [];

  route.steps.forEach((step, idx) => {
    if (idx === 0) actions.push({ timeBlock: 'ahora', title: step.title, done: false });
    else if (idx === 1) actions.push({ timeBlock: 'tarde', title: step.title, done: false });
    else actions.push({ timeBlock: 'noche', title: step.title, done: false });
  });

  return actions;
}

export function savePlan(plan: Action24h[]) {
  try {
    localStorage.setItem('blumhelps:plan24h', JSON.stringify({ plan, updatedAt: new Date().toISOString() }));
  } catch {}
}

export function loadPlan(): Action24h[] | null {
  try {
    const raw = localStorage.getItem('blumhelps:plan24h');
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data.plan || null;
  } catch {
    return null;
  }
}
