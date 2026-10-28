import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Headphones, HeartHandshake, Route as RouteIcon } from "lucide-react";
import "./ProgressPathMap.css";

const pathSteps = [
  {
    id: "ruta",
    number: "01",
    eyebrow: "ORIENTARTE",
    title: "Elegir un paso posible",
    short: "Poner el día en perspectiva",
    description: "No necesitas resolverlo todo. Elige una acción pequeña y flexible para las próximas 24 horas.",
    action: "Preparar mi ruta",
    to: "/ruta",
    icon: RouteIcon,
  },
  {
    id: "voz",
    number: "02",
    eyebrow: "PRACTICAR",
    title: "Escuchar y practicar",
    short: "Encontrar una herramienta",
    description: "Una práctica breve o un episodio de audio puede ayudarte a hacer una pausa y decidir qué necesitas.",
    action: "Abrir Voz",
    to: "/voz",
    icon: Headphones,
  },
  {
    id: "valores",
    number: "03",
    eyebrow: "RECORDAR",
    title: "Volver a lo importante",
    short: "Conectar con tus valores",
    description: "Tus valores pueden servirte de brújula para elegir el siguiente paso, incluso cuando el día se complica.",
    action: "Ver mi brújula",
    to: "/recuperacion/valores",
    icon: Compass,
  },
  {
    id: "apoyo",
    number: "04",
    eyebrow: "CONECTAR",
    title: "Buscar apoyo",
    short: "No hacerlo a solas",
    description: "Puedes consultar recursos, hablar con alguien de confianza o revisar opciones de apoyo disponibles.",
    action: "Encontrar apoyo",
    to: "/ayuda",
    icon: HeartHandshake,
  },
];

export function ProgressPathMap() {
  const [selectedId, setSelectedId] = useState("ruta");
  const selected = pathSteps.find((step) => step.id === selectedId) ?? pathSteps[0];
  const SelectedIcon = selected.icon;

  return (
    <section className="bl-progress-path-map" aria-label="Mapa interactivo de pasos posibles">
      <div className="bl-progress-path-map__steps" role="group" aria-label="Elige el tipo de apoyo que te serviría">
        {pathSteps.map((step, index) => {
          const Icon = step.icon;
          const active = step.id === selectedId;
          return (
            <button
              key={step.id}
              type="button"
              className={"bl-progress-path-map__step" + (active ? " is-active" : "")}
              aria-pressed={active}
              onClick={() => setSelectedId(step.id)}
            >
              <span className="bl-progress-path-map__node" aria-hidden="true">
                <span>{step.number}</span>
                <Icon className="bl-progress-path-map__node-icon" />
              </span>
              <span className="bl-progress-path-map__step-copy">
                <span className="bl-progress-path-map__eyebrow">{step.eyebrow}</span>
                <strong>{step.short}</strong>
              </span>
              {index < pathSteps.length - 1 && <span className="bl-progress-path-map__connector" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="bl-progress-path-map__detail" aria-live="polite" aria-atomic="true">
        <span className="bl-progress-path-map__detail-icon" aria-hidden="true">
          <SelectedIcon />
        </span>
        <div className="bl-progress-path-map__detail-copy">
          <p className="bl-progress-path-map__detail-kicker">PASO {selected.number} · {selected.eyebrow}</p>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
        </div>
        <Link className="bl-progress-path-map__action" to={selected.to}>
          {selected.action} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <p className="bl-progress-path-map__hint">
        Elige un nodo para explorar el mapa. Seleccionarlo no marca nada como completado ni guarda una decisión personal.
      </p>
    </section>
  );
}
