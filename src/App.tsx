import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Recovery } from './pages/Recovery';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';
import { Comunidad } from './pages/Comunidad';
import { Empleo } from './pages/Empleo';
import { Historias } from './pages/Historias';

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recuperacion" element={<Recovery />} />
            <Route path="/ayuda" element={<Help />} />
            <Route path="/ajustes" element={<Settings />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/empleo" element={<Empleo />} />
            <Route path="/historias" element={<Historias />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
}
