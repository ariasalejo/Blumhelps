import { z } from 'zod';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
}

const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'https://api.blumhelps.co/v1',
  timeout: 8000,
  retries: 3,
};

export async function fetchWithRetry<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  config: ApiConfig = defaultConfig
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.retries!; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      const response = await fetch(`${config.baseURL}${endpoint}`, {
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Validación estricta del esquema (Zod)
      const validatedData = schema.parse(rawData);
      return validatedData;

    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError') {
        console.warn(`[API] Timeout en ${endpoint}, intento ${attempt}/${config.retries}`);
      } else {
        console.warn(`[API] Error en ${endpoint}, intento ${attempt}/${config.retries}:`, error.message);
      }
      
      // Exponential backoff: espera 1s, 2s, 4s...
      if (attempt < config.retries!) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  throw new Error(`Fallo definitivo en ${endpoint} tras ${config.retries} intentos. ${lastError?.message}`);
}

// Ejemplo de esquema para recursos de recuperación reales
export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  location: z.string(),
  isVerified: z.boolean(),
  contactInfo: z.string().optional(),
  lastVerified: z.string(),
});

export type Resource = z.infer<typeof ResourceSchema>;
