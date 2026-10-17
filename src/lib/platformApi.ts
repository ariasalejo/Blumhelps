export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  isOfflineFallback?: boolean;
}

const DEFAULT_TIMEOUT = 8000;

export async function fetchWithResilience<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    if (!navigator.onLine) throw new Error('Sin conexión a internet. Usando modo offline.');

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es un JSON válido.');
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { success: false, error: 'La solicitud tardó demasiado. Verifica tu conexión.' };
    }
    if (error.message.includes('Sin conexión')) {
      return { success: false, error: 'Modo offline activado.', isOfflineFallback: true };
    }
    return { success: false, error: error.message || 'Error inesperado.' };
  }
}
