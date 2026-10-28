import { useRef } from "react";
import { BookOpen, CheckCircle2, Headphones, Moon, Pause, Play, Sparkles } from "lucide-react";
import "./PodcastSeries.css";

type PodcastEpisode = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  file: string;
  icon: typeof Headphones;
  tag: string;
};

const episodes: PodcastEpisode[] = [
  {
    id: "S01E01",
    eyebrow: "TEMPORADA 01 · EPISODIO 01",
    title: "Las etapas del cambio",
    description: "Reconocer dónde estás hoy, sin etiquetas ni presión por avanzar a una velocidad determinada.",
    file: "S01E01-etapas-del-cambio-salome.mp3",
    icon: Sparkles,
    tag: "Empezar",
  },
  {
    id: "S01E02",
    eyebrow: "TEMPORADA 01 · EPISODIO 02",
    title: "La ambivalencia",
    description: "Cuando una parte quiere cambiar y otra teme lo que ese cambio puede traer. Puedes escuchar ambas sin juzgarte.",
    file: "S01E02-la-ambivalencia.mp3",
    icon: Headphones,
    tag: "Comprender",
  },
  {
    id: "S01E03",
    eyebrow: "TEMPORADA 01 · EPISODIO 03",
    title: "El antojo no es una orden",
    description: "Una invitación a abrir un espacio entre el deseo de consumir y la decisión de qué hacer después.",
    file: "S01E03-el-antojo-no-es-una-orden.mp3",
    icon: Headphones,
    tag: "Atravesar el deseo",
  },
  {
    id: "S01E04",
    eyebrow: "TEMPORADA 01 · EPISODIO 04",
    title: "Un tropiezo no borra el camino",
    description: "Cómo volver a orientarte después de un día difícil, sin reducir todo tu proceso a un solo momento.",
    file: "S01E04-un-tropiezo-no-borra-el-camino.mp3",
    icon: CheckCircle2,
    tag: "Volver a empezar",
  },
  {
    id: "BONUS-SLEEP",
    eyebrow: "EPISODIO ESPECIAL",
    title: "Higiene del sueño",
    description: "Ideas prácticas para construir una rutina de descanso posible. No sustituye una valoración profesional si los problemas persisten.",
    file: "especial-higiene-del-sueno.mp3",
    icon: Moon,
    tag: "Descanso",
  },
];

const podcastBasePath = `${import.meta.env.BASE_URL}audio/podcast-series/`;

export function PodcastSeries() {
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);

  const stopOtherEpisodes = (activeIndex: number) => {
    audioRefs.current.forEach((audio, index) => {
      if (audio && index !== activeIndex && !audio.paused) {
        audio.pause();
      }
    });
  };

  return (
    <section className="bl-podcast-series" aria-labelledby="bl-podcast-series-title">
      <header className="bl-podcast-series__header">
        <div className="bl-podcast-series__heading">
          <p className="bl-podcast-series__eyebrow"><Headphones className="h-4 w-4" aria-hidden="true" /> BLUM ORIGINALS · PODCAST</p>
          <h2 id="bl-podcast-series-title">Historias y herramientas para escuchar con calma.</h2>
          <p>
            Episodios completos para explorar el cambio, comprender el antojo, retomar el camino
            y cuidar el descanso. Elige uno y escúchalo a tu ritmo.
          </p>
        </div>
        <div className="bl-podcast-series__count">
          <Headphones className="h-5 w-5" aria-hidden="true" />
          <strong>{episodes.length} audios</strong>
          <span>Reproductores independientes</span>
        </div>
      </header>

      <div className="bl-podcast-series__grid">
        {episodes.map((episode, index) => {
          const Icon = episode.icon;
          const src = `${podcastBasePath}${episode.file}`;
          return (
            <article key={episode.id} className={`bl-podcast-card ${index > 0 && index < 4 ? "bl-podcast-card--season" : ""}`}>
              <div className="bl-podcast-card__art" aria-hidden="true">
                <span className="bl-podcast-card__orb bl-podcast-card__orb--one" />
                <span className="bl-podcast-card__orb bl-podcast-card__orb--two" />
                <span className="bl-podcast-card__episode">{episode.id === "BONUS-SLEEP" ? "✦" : episode.id.slice(-2)}</span>
                <Icon className="bl-podcast-card__icon h-7 w-7" />
                <span className="bl-podcast-card__art-label">BLUM · AUDIO SERIES</span>
              </div>
              <div className="bl-podcast-card__body">
                <p className="bl-podcast-card__eyebrow">{episode.eyebrow}</p>
                <h3>{episode.title}</h3>
                <p className="bl-podcast-card__description">{episode.description}</p>
                <span className="bl-podcast-card__tag"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> {episode.tag}</span>
                <div className="bl-podcast-card__player">
                  <audio
                    ref={(element) => { audioRefs.current[index] = element; }}
                    controls
                    preload="none"
                    aria-label={`Reproducir podcast: ${episode.title}`}
                    onPlay={() => stopOtherEpisodes(index)}
                  >
                    <source src={src} type="audio/mpeg" />
                    Tu navegador no puede reproducir este audio. Prueba con un navegador actualizado.
                  </audio>
                  <p><Play className="h-3.5 w-3.5" aria-hidden="true" /> Audio completo · reproducción directa</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="bl-podcast-series__note">
        <Pause className="h-3.5 w-3.5" aria-hidden="true" />
        Si empiezas otro episodio, el audio anterior se pausa. No necesitas registrarte ni marcar un episodio como completado.
      </p>
    </section>
  );
}
