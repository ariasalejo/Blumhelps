import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Recovery } from './pages/Recovery';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';

export function App() {
  return (
    // MotionConfig respeta la preferencia de movimiento reducido del sistema operativo
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recuperacion" element={<Recovery />} />
            <Route path="/ayuda" element={<Help />} />
            <Route path="/ajustes" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
}
