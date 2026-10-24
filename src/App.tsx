import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Recovery } from './pages/Recovery';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';
import { ProfileSetup } from './pages/ProfileSetup';
import { ScienceAndImpact } from './pages/ScienceAndImpact';
import { Familiares } from './pages/Familiares';
import { Oportunidades } from './pages/Oportunidades';
import { RecoveryDisclaimer } from './components/recovery/RecoveryDisclaimer';
import { A11yPanel } from './components/landing/A11yPanel';
import { RecoveryOnboarding } from "./pages/recovery/Onboarding";
import { Valores } from "./pages/recovery/Valores";
import { RecoveryHub } from "./pages/recovery/RecoveryHub";
import { RecoveryGuard } from "./components/recovery/RecoveryGuard";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Layout>
          {/* Disclaimer permanente para rutas de recuperación */}
          <RecoveryDisclaimer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<ProfileSetup />} />
            {/* Módulo nuevo de recuperación */}
            <Route path="/recuperacion" element={<RecoveryGuard><RecoveryHub /></RecoveryGuard>} />
            <Route path="/recuperacion/inicio" element={<RecoveryOnboarding />} />
            <Route path="/recuperacion/valores" element={<RecoveryGuard><Valores /></RecoveryGuard>} />
            <Route path="/recuperacion/*" element={<Recovery />} />
            {/* Wizard legacy intacto en /ruta */}
            <Route path="/ruta" element={<Recovery />} />
            <Route path="/ciencia" element={<ScienceAndImpact />} />
            <Route path="/ayuda" element={<Help />} />
            <Route path="/recursos" element={<Help />} />
            <Route path="/familiares" element={<Familiares />} />
            <Route path="/oportunidades" element={<Oportunidades />} />
            <Route path="/empleo" element={<Oportunidades />} />
            <Route path="/ajustes" element={<Settings />} />
          </Routes>
          {/* Accesibilidad disponible en todo el sitio; integrada para módulo de recuperación */}
          <A11yPanel />
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
}
