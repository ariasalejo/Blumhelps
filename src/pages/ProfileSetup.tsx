import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserProfile, UserProfile } from '../data/userProfile';
import { CheckCircle } from 'lucide-react';

export function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    needs: []
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Guardar perfil y redirigir
      const completeProfile: UserProfile = {
        ...profile,
        role: profile.role as any,
        city: profile.city || "No especificada",
        stage: profile.stage as any,
        needs: profile.needs as any,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      try {
        saveUserProfile(completeProfile);
        navigate('/recuperacion');
      } catch (error) {
        alert('Error guardando perfil. Por favor intenta de nuevo.');
      }
    }
  };

  const toggleNeed = (need: string) => {
    const currentNeeds = profile.needs || [];
    if (currentNeeds.includes(need as any)) {
      setProfile({ ...profile, needs: currentNeeds.filter(n => n !== need) });
    } else {
      setProfile({ ...profile, needs: [...currentNeeds, need as any] });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? 'bg-[var(--moss)]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Paso {step} de 4</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {step === 1 && (
            <>
              <h2 className="serif text-3xl font-bold mb-4">¿Cuál es tu rol?</h2>
              <p className="text-gray-600 mb-6">Esto nos ayuda a mostrarte los recursos más relevantes.</p>
              <div className="space-y-3">
                {[
                  { value: 'persona_en_recuperacion', label: 'Estoy en proceso de recuperación' },
                  { value: 'familiar', label: 'Soy familiar de alguien en recuperación' },
                  { value: 'profesional', label: 'Soy profesional de la salud o trabajo social' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProfile({ ...profile, role: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      profile.role === option.value
                        ? 'border-[var(--moss)] bg-[var(--moss)]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="serif text-3xl font-bold mb-4">¿En qué ciudad estás?</h2>
              <p className="text-gray-600 mb-6">Para mostrarte recursos locales.</p>
              <input
                type="text"
                value={profile.city || ''}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="Ej: Medellín, Bogotá, Cali..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[var(--moss)] focus:outline-none"
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="serif text-3xl font-bold mb-4">¿En qué etapa te encuentras?</h2>
              <p className="text-gray-600 mb-6">No hay respuestas correctas o incorrectas.</p>
              <div className="space-y-3">
                {[
                  { value: 'crisis', label: 'Estoy en crisis ahora mismo' },
                  { value: 'buscando_ayuda', label: 'Estoy buscando ayuda o información' },
                  { value: 'en_proceso', label: 'Ya estoy en un proceso de recuperación' },
                  { value: 'mantenimiento', label: 'Estoy en mantenimiento y quiero seguir avanzando' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setProfile({ ...profile, stage: option.value as any })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition ${
                      profile.stage === option.value
                        ? 'border-[var(--moss)] bg-[var(--moss)]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="serif text-3xl font-bold mb-4">¿Qué necesitas ahora?</h2>
              <p className="text-gray-600 mb-6">Puedes seleccionar varias opciones.</p>
              <div className="space-y-3">
                {[
                  { value: 'apoyo_emocional', label: 'Apoyo emocional' },
                  { value: 'empleo', label: 'Oportunidades de empleo' },
                  { value: 'informacion_familia', label: 'Información para mi familia' },
                  { value: 'tratamiento', label: 'Información sobre tratamientos' },
                  { value: 'reinsercion_social', label: 'Reinserción social' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleNeed(option.value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center gap-3 ${
                      profile.needs?.includes(option.value as any)
                        ? 'border-[var(--moss)] bg-[var(--moss)]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        profile.needs?.includes(option.value as any)
                          ? 'text-[var(--moss)]'
                          : 'text-gray-300'
                      }`}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !profile.role) ||
              (step === 2 && !profile.city) ||
              (step === 3 && !profile.stage) ||
              (step === 4 && (!profile.needs || profile.needs.length === 0))
            }
            className="w-full mt-8 bg-[var(--moss)] text-white py-4 rounded-xl font-semibold hover:bg-[var(--moss-deep)] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {step === 4 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
