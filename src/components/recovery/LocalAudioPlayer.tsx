// ============================================================================
// BLUMHELPS — REPRODUCTOR LOCAL DE AUDIO PIPER
// ============================================================================
// Reproduce MP3 locales. No envía texto ni datos personales a servicios externos.
// Informa carga/errores para no dejar controles silenciosamente inutilizables.
// ============================================================================
import React, { useEffect, useRef, useState } from "react";
import { Volume2, AlertCircle, LoaderCircle, CheckCircle2 } from "lucide-react";

interface LocalAudioPlayerProps {
  src: string;
  label: string;
  className?: string;
}

type AudioStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

export function LocalAudioPlayer({
  src,
  label,
  className = "",
}: LocalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setStatus("idle");
    setErrorMessage("");
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.load();
  }, [src]);

  const handlePlay = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const current = event.currentTarget;
    if (typeof document !== "undefined") {
      document.querySelectorAll("audio").forEach((other) => {
        if (other !== current) other.pause();
      });
    }
    setStatus("playing");
    setErrorMessage("");
  };

  const handleError = () => {
    setStatus("error");
    const audio = audioRef.current;
    const code = audio?.error?.code;
    if (code === 2) {
      setErrorMessage("No se pudo leer el archivo local. Comprueba la conexión con el servidor.");
    } else if (code === 3 || code === 4) {
      setErrorMessage("Este audio no se pudo decodificar o no está disponible. Prueba otro recurso.");
    } else {
      setErrorMessage("No se pudo cargar el audio. Comprueba el archivo y vuelve a intentarlo.");
    }
  };

  return (
    <div className={"rounded-xl border border-[var(--line,#dce4dc)] bg-white/95 p-3 " + className}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--ink,#18332f)]">
        <Volume2 className="h-4 w-4 shrink-0 text-[var(--moss,#217d63)]" aria-hidden="true" />
        <span className="min-w-0 flex-1 font-semibold">{label}</span>
        {status === "loading" && <span className="inline-flex items-center gap-1 text-[var(--moss,#217d63)]"><LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />Cargando</span>}
        {status === "ready" && <span className="inline-flex items-center gap-1 text-[var(--moss,#217d63)]"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Listo</span>}
        {status === "playing" && <span role="status" className="text-[var(--moss,#217d63)]">Reproduciendo Piper</span>}
        {status === "error" && <span className="inline-flex items-center gap-1 text-red-700"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />Error de audio</span>}
      </div>
      <audio
        ref={audioRef}
        controls
        preload="metadata"
        className="w-full"
        aria-label={label}
        onLoadStart={() => setStatus("loading")}
        onCanPlay={() => setStatus((current) => current === "playing" ? current : "ready")}
        onPlay={handlePlay}
        onPause={() => setStatus((current) => current === "error" ? current : "paused")}
        onEnded={() => setStatus("ready")}
        onError={handleError}
      >
        <source src={src} type="audio/mpeg" />
        Tu navegador no puede reproducir este audio local.
      </audio>
      {status === "error" && (
        <p role="alert" className="mt-2 text-xs leading-5 text-red-800">{errorMessage}</p>
      )}
      <p className="mt-1 break-all text-[10px] leading-4 text-gray-500">Audio local · {src}</p>
    </div>
  );
}
