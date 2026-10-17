import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error no capturado en la UI:', error, errorInfo);
    // Aquí podrías enviar el error a un servicio como Sentry
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 m-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Algo salió mal</h2>
          <p className="text-red-600 mb-4">No te preocupes, tus datos están seguros. Intenta recargar la página.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Recargar aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
