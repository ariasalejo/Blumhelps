export const MOTIVATIONS = [
  "Buen trabajo — un paso a la vez.",
  "Lo estás haciendo bien. Sigue con esa constancia.",
  "Pequeños pasos suman grandes cambios.",
  "No te rindas: cada día cuenta.",
  "Celebra esto: te estás construyendo a ti mismo.",
  "Respira. Has hecho algo valioso hoy.",
  "Una acción por vez — sigues avanzando.",
];

export function pickMotivation() {
  return MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
}
