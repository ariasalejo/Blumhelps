export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  isVerified: boolean; // Cambiado de 'true' a 'boolean'
}

export async function fetchYouTubeVideos(channel: string): Promise<YouTubeVideo[]> {
  // En producción, aquí conectarías con la API real de YouTube
  // Por ahora, devolvemos datos de demostración basados en canales reales
  
  const mockVideos: YouTubeVideo[] = [
    {
      id: 'video-1',
      title: 'Línea 106: Apoyo psicológico gratuito 24/7',
      description: 'Conoce cómo la Línea 106 del MinSalud brinda orientación psicológica gratuita a todas las personas en Colombia.',
      thumbnail: 'https://img.youtube.com/vi/demo1/maxresdefault.jpg',
      publishedAt: '2026-01-15',
      channelTitle: 'MinSalud Colombia',
      isVerified: true
    },
    {
      id: 'video-2',
      title: 'Centros de Escucha en Medellín',
      description: 'Atención psicológica comunitaria en las 16 comunas y 5 corregimientos de Medellín. Gratis y confidencial.',
      thumbnail: 'https://img.youtube.com/vi/demo2/maxresdefault.jpg',
      publishedAt: '2026-02-10',
      channelTitle: 'Alcaldía de Medellín',
      isVerified: true
    },
    {
      id: 'video-3',
      title: 'Reducción de daños: Enfoque pragmático',
      description: 'La OPS explica el enfoque de reducción de daños para personas con consumo de sustancias psicoactivas.',
      thumbnail: 'https://img.youtube.com/vi/demo3/maxresdefault.jpg',
      publishedAt: '2026-03-05',
      channelTitle: 'OPS/OMS',
      isVerified: true
    },
    {
      id: 'video-4',
      title: 'Rutas de atención para NNA',
      description: 'El ICBF presenta las rutas de atención integral para niños, niñas y adolescentes con consumo de sustancias.',
      thumbnail: 'https://img.youtube.com/vi/demo4/maxresdefault.jpg',
      publishedAt: '2026-04-20',
      channelTitle: 'ICBF Colombia',
      isVerified: true
    }
  ];
  
  return mockVideos.filter(v => v.channelTitle === channel || channel === 'all');
}
