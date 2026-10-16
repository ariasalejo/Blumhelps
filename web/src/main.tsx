import "./index.css";
import React, { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { AppProvider, useApp } from "./state/app";
import { Sidebar, BottomBar, TopBarMobile, Toaster } from "./components/ui";
import Inicio from "./pages/Inicio";
import { AyudaList, AyudaDetalle, Emergencia } from "./pages/Ayuda";
import Bienestar from "./pages/Bienestar";
import { FormacionList, FormacionDetalle } from "./pages/Formacion";
import { EmpleoList, EmpleoDetalle, HojaDeVida } from "./pages/Empleo";
import { ComunidadList, ComunidadDetalle, FamiliasList, FamiliasDetalle } from "./pages/Comunidad";
import Guardados from "./pages/Guardados";
import Ajustes from "./pages/Ajustes";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl">🌿</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">Por aquí no había nada</h1>
      <p className="mt-2 text-muted text-sm max-w-sm mx-auto">El enlace puede estar viejo. Respira: el camino sigue existiendo.</p>
      <Link to="/inicio" className="btn-primary mt-6">Volver al inicio</Link>
    </div>
  );
}

function Shell() {
  const { settings } = useApp();
  const { pathname } = useLocation();
  const isImmersiveHome = pathname === "/inicio" || pathname === "/";
  return (
    <MotionConfig reducedMotion={settings.reduceMotion ? "always" : "user"}>
      <div className={`min-h-screen bg-base flex ${isImmersiveHome ? "bh-app-home" : ""}`} style={{ fontSize: `${settings.textScale * 100}%` }}>
        <ScrollToTop />
        {!isImmersiveHome && <Sidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {!isImmersiveHome && <TopBarMobile />}
          <main id="main-content" className={isImmersiveHome ? "flex-1 min-w-0 w-full max-w-none p-0" : "flex-1 px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-5xl w-full mx-auto pb-24 lg:pb-10"}>
            <Routes>
              <Route path="/" element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/ayuda" element={<AyudaList />} />
              <Route path="/ayuda/emergencia" element={<Emergencia />} />
              <Route path="/ayuda/recurso/:id" element={<AyudaDetalle />} />
              <Route path="/bienestar" element={<Bienestar />} />
              <Route path="/formacion" element={<FormacionList />} />
              <Route path="/formacion/curso/:id" element={<FormacionDetalle />} />
              <Route path="/empleo" element={<EmpleoList />} />
              <Route path="/empleo/vacante/:id" element={<EmpleoDetalle />} />
              <Route path="/empleo/hoja-de-vida" element={<HojaDeVida />} />
              <Route path="/comunidad" element={<ComunidadList />} />
              <Route path="/comunidad/grupo/:id" element={<ComunidadDetalle />} />
              <Route path="/familias" element={<FamiliasList />} />
              <Route path="/familias/guia/:id" element={<FamiliasDetalle />} />
              <Route path="/guardados" element={<Guardados />} />
              <Route path="/ajustes" element={<Ajustes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {!isImmersiveHome && <footer className="hidden lg:block px-10 py-6 text-xs text-muted border-t border-[#E7DFCC]">BlumHelps · orientación para Colombia. No reemplaza atención profesional. Emergencias: Línea 123 (Colombia).</footer>}
        </div>
        {!isImmersiveHome && <BottomBar />}
        <Toaster />
      </div>
    </MotionConfig>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider><Shell /></AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
