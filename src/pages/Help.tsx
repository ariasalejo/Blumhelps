import React from 'react';

export function Help() {
  const requestPublicResources = async () => {
    console.log("Solicitando recursos públicos verificados...");
  };

  return (
    <main className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ayuda y Recursos Oficiales</h1>
      
      <button 
        onClick={requestPublicResources}
        className="mb-8 px-6 py-3 bg-emerald-700 text-white font-medium rounded-xl hover:bg-emerald-800 transition"
      >
        Actualizar Directorio
      </button>

      <div className="space-y-4">
        <a 
          href="https://www.minsalud.gov.co" 
          target="_blank" rel="noopener noreferrer"
          className="block p-5 border border-gray-200 rounded-xl hover:bg-gray-50 transition bg-white"
        >
          <h3 className="font-semibold text-gray-900">Ministerio de Salud</h3>
          <p className="text-sm text-gray-600 mt-1">Sitio oficial del gobierno colombiano</p>
        </a>
        
        <a 
          href="https://www.icbf.gov.co" 
          target="_blank" rel="noopener noreferrer"
          className="block p-5 border border-gray-200 rounded-xl hover:bg-gray-50 transition bg-white"
        >
          <h3 className="font-semibold text-gray-900">ICBF</h3>
          <p className="text-sm text-gray-600 mt-1">Instituto Colombiano de Bienestar Familiar</p>
        </a>
      </div>
    </main>
  );
}
