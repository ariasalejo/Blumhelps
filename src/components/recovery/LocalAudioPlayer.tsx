// ============================================================================
// BLUMHELPS — REPRODUCTOR DE AUDIO LOCAL ACCESIBLE
// ============================================================================
// Reproduce MP3 locales del catálogo. No hace requests externos.
// Pausa otros audios al iniciar para evitar choques.
// ============================================================================

import React from "react";
import { Volume2 } from "lucide-react";

interface LocalAudioPlayerProps {
  src: string;
  label: string;
  className?: string;
}

export function LocalAudioPlayer({
  src,
  label,
  className = "",
}: LocalAudioPlayerProps) {
  const handlePlay = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const current = event.currentTarget;

    if (typeof document === "undefined") return;

    document.querySelectorAll("audio").forEach((el) => {
      if (el !== current) {
        el.pause();
      }
    });
  };

  return (
    <div className={"rounded-xl border border-gray-200 bg-white p-3 " + className}>
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
        <Volume2 className="h-3.5 w-3.5 text-[var(--moss)]" aria-hidden="true" />
        <span className="font-medium">{label}</span>
      </div>

      <audio
        controls
        preload="metadata"
        className="w-full"
        aria-label={label}
        onPlay={handlePlay}
      >
        <source src={src} type="audio/mpeg" />
        Tu navegador no puede reproducir este audio local.
      </audio>
    </div>
  );
}
