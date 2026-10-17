import React from 'react';

export function Settings() {
  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración y Privacidad</h1>
      
      <div className="space-y-4">
        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Almacenamiento</h2>
          <p className="text-sm text-gray-600">
            Tus metas se guardan solo en este dispositivo. Ten en cuenta que el almacenamiento local no está cifrado.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Seguridad</h2>
          <p className="text-sm text-gray-600">
            Por el momento, la aplicación no incluye bloqueo de pantalla con PIN o biometría.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Notificaciones</h2>
          <p className="text-sm text-gray-600">
            No hay recordatorios programados activos en esta versión para evitar presiones no deseadas.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">Idioma</h2>
          <p className="text-sm text-gray-600">
            Los otros idiomas todavía no cambian los textos. La interfaz está disponible únicamente en español.
          </p>
        </div>
      </div>
    </main>
  );
}
