// ============================================================================
// BLUMHELPS — GUARDIAN DE FLUJO (Redirige a onboarding si falta consentimiento)
// ============================================================================
// Protege las rutas que requieren consentimiento previo. Si el usuario
// no ha aceptado el consentimiento vigente, lo redirige a /recuperacion/inicio.
// ============================================================================
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { recoveryStorage } from "../../lib/recovery/storage";
import { CURRENT_CONSENT } from "../../data/recovery/consentTexts";

interface RecoveryGuardProps {
  children: React.ReactNode;
}

export function RecoveryGuard({ children }: RecoveryGuardProps) {
  const location = useLocation();
  const [status, setStatus] = useState<"checking" | "ok" | "redirect">("checking");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const needsReconsent = await recoveryStorage.needsReconsent();
      if (cancelled) return;
      if (needsReconsent) {
        setStatus("redirect");
      } else {
        setStatus("ok");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--moss)]"></div>
      </div>
    );
  }

  if (status === "redirect") {
    return <Navigate to="/recuperacion/inicio" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
