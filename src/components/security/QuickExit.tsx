import React, { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { recoveryStorage } from '../../lib/recovery/storage';

export function QuickExit() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        exitNow(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const exitNow = (clearSensitive: boolean) => {
    try {
      sessionStorage.clear();
    } catch {}
    if (clearSensitive) {
      try {
        // Borrado solo de datos del módulo de recuperación (no borra todo BlumHelps automáticamente)
        recoveryStorage.deleteRecoveryModule();
      } catch (e) {
        console.warn('[QuickExit] No se pudieron borrar datos del módulo de recuperación', e);
      }
    }
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-col items-end gap-2">
      {open && (
        <div className="bg-gray-900/95 text-white rounded-xl shadow-2xl p-3 text-sm backdrop-blur space-y-2">
          <button
            onClick={() => exitNow(false)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Salir sin borrar
          </button>
          <button
            onClick={() => {
              const ok = confirm('¿Borrar datos sensibles del módulo de recuperación y salir? Esta acción no se puede deshacer.');
              if (ok) exitNow(true);
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Borrar datos sensibles y salir
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/90 text-white shadow-2xl hover:bg-black transition backdrop-blur"
        aria-label="Salida segura"
        title="Salida segura (ESC para salir sin borrar)"
      >
        <X className="w-4 h-4" />
        <span className="text-sm font-semibold">Salida segura</span>
      </button>
    </div>
  );
}
