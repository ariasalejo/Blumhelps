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

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<ProfileSetup />} />
            <Route path="/recuperacion" element={<Recovery />} />
            <Route path="/ciencia" element={<ScienceAndImpact />} />
            <Route path="/ayuda" element={<Help />} />
            <Route path="/ajustes" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
}
