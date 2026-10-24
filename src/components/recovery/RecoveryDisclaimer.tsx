import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function RecoveryDisclaimer() {
  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-center">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Acompañamiento psicoeducativo. No sustituye atención profesional. Si estás en crisis, llama al <a href="tel:106" className="underline font-semibold">106</a> o al <a href="tel:123" className="underline font-semibold">123</a>.
          </span>
        </div>
      </div>
    </div>
  );
}
