/**
 * Integración con YouTube Data API v3.
 * Lista blanca estricta: solo canales oficiales verificados.
 * No se envían datos del usuario a servidores externos.
 */

// Lista blanca: solo canales oficiales de salud/bienestar en Colombia
export const VERIFIED_CHANNELS = {
  minSalud: { id: 'UCMinSaludColombia', name: 'MinSalud Colombia' },
  ops: { id: 'UCPAHO', name: 'OPS/OMS' },
  medellin: { id: 'UCAlcaldiaMedellin', name: 'Alcaldía de Medellín' },
  icbf: { id: 'UCICBF', name: 'ICBF Colombia' }
} as const;

export type ChannelKey = keyof typeof VERIFIED_CHANNELS;

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  isVerified: true; // Garantía de curaduría
}

/**
 * Obtiene videos de un canal verificado.
 * Requiere YOUTUBE_API_KEY en variables de entorno (no en el frontend).
 * En producción, esta llamada debe pasar por un backend proxy.
 */
export async function fetchVideosFromChannel(
  channelKey: ChannelKey,
  maxResults = 6
): Promise<YouTubeVideo[]> {
  const channel = VERIFIED_CHANNELS[channelKey];
  if (!channel) throw new Error(`Canal no verificado: ${channelKey}`);

  // En producción: llamar a /api/youtube?channel=<key> en backend
  // Aquí retornamos datos de demostración marcados explícitamente
  return [
    {
      id: `demo_${channelKey}_1`,
      title: `[Demo] Contenido de ${channel.name}`,
      description: 'Video demostrativo. En producción se obtiene vía YouTube Data API v3.',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      channelTitle: channel.name,
      isVerified: true
    }
  ].slice(0, maxResults);
}

/**
 * Valida que un canal esté en la lista blanca antes de hacer la petición.
 */
export function isChannelAllowed(channelKey: string): channelKey is ChannelKey {
  return channelKey in VERIFIED_CHANNELS;
}
