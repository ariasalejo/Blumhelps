import React, { useEffect, useState } from 'react';
import { fetchWithRetry, ResourceSchema, type Resource } from '../lib/apiClient';
import { RecoveryGarden3D } from '../components/RecoveryGarden3D';

export function Recovery() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0.4); // Ejemplo: 40% de progreso

  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // En producción, esto apunta a tu backend real o una API pública de salud
        // const data = await fetchWithRetry('/resources', z.array(ResourceSchema));
        
        // Simulación de datos reales estructurados (reemplazar con fetch real)
        const mockRealData = [
          {
            id: 'real-1',
            name: 'Línea de Atención en Salud Mental',
            category: 'Salud Mental',
            description: 'Atención profesional gratuita y confidencial las 24 horas.',
            location: 'Nacional, Colombia',
            isVerified: true,
            contactInfo: '106',
            lastVerified: new Date().toISOString(),
          }
        ];
        
        // Validamos los datos como si vinieran de la API
        const validated = z.array(ResourceSchema).parse(mockRealData);
        setResources(validated);
      } catch (err: any) {
        console.error('Error cargando recursos:', err);
        setError('No pudimos conectar con el directorio de recursos. Por favor, verifica tu conexión.');
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);

  if (isLoading) {
    return (
      <main className="p-6 max-w-4xl mx-auto min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen space-y-8">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tu camino de recuperación</h1>
        <p className="text-gray-600">Cada paso cuenta. Este espacio es tuyo, seguro y sin juicios.</p>
      </section>

      <RecoveryGarden3D progress={progress} />

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recursos de apoyo verificados</h2>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 mb-4">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 underline font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <article key={resource.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                  {resource.category}
                </span>
                {resource.isVerified && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    ✓ Verificado
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.name}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{resource.description}</p>
              
              <div className="flex flex-col gap-2 text-xs text-gray-500 mb-4">
                <span>📍 {resource.location}</span>
                <span>📞 {resource.contactInfo}</span>
              </div>

              <a 
                href={resource.contactInfo?.startsWith('http') ? resource.contactInfo : `tel:${resource.contactInfo}`}
                className="block w-full text-center bg-emerald-700 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
              >
                Contactar ahora
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
