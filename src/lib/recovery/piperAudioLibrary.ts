// ============================================================================
// BLUMHELPS — LIBRERÍA DE AUDIO LOCAL PIPER DEL CATÁLOGO DE RECUPERACIÓN
// ============================================================================
// Busca MP3 pre-generados por ítem. No hace fetch externo. No envía datos del paciente.
// Usa import.meta.env.BASE_URL para ser compatible con GitHub Pages en subcarpeta.
// ============================================================================

import { recoveryPiperAudioManifest } from "../../data/recovery/piperAudioManifest";

export type RecoveryPiperAudioKind = "guion" | "micro";

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base : base + "/";
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanBase + cleanPath;
}

export function getRecoveryPiperAudio(
  itemId: string,
  kind: RecoveryPiperAudioKind = "guion",
): string | undefined {
  const item = recoveryPiperAudioManifest.items.find((x) => x.id === itemId);
  if (!item) return undefined;

  const files = item.files as Record<RecoveryPiperAudioKind, string | undefined>;
  const path = files[kind];

  return path ? withBase(path) : undefined;
}

export function hasRecoveryPiperAudio(
  itemId: string,
  kind: RecoveryPiperAudioKind = "guion",
): boolean {
  return Boolean(getRecoveryPiperAudio(itemId, kind));
}

export const RECOVERY_PIPER_VOICE = recoveryPiperAudioManifest.voice;
export const RECOVERY_PIPER_GENERATED_AT = recoveryPiperAudioManifest.generatedAt;
