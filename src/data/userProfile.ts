import { z } from 'zod';

export const UserProfileSchema = z.object({
  role: z.enum(['persona_en_recuperacion', 'familiar', 'profesional'], {
    message: 'Debes seleccionar un rol válido'
  }),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  stage: z.enum(['crisis', 'buscando_ayuda', 'en_proceso', 'mantenimiento'], {
    message: 'Debes seleccionar una etapa válida'
  }),
  needs: z.array(z.enum([
    'apoyo_emocional',
    'empleo',
    'informacion_familia',
    'tratamiento',
    'reinsercion_social'
  ])).min(1, 'Debes seleccionar al menos una necesidad'),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

export function saveUserProfile(profile: UserProfile): void {
  const validated = UserProfileSchema.parse(profile);
  localStorage.setItem('blumhelps_profile', JSON.stringify(validated));
}

export function loadUserProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem('blumhelps_profile');
    if (!stored) return null;
    return UserProfileSchema.parse(JSON.parse(stored));
  } catch {
    return null;
  }
}
