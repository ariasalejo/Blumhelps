import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Marquee } from '../components/landing/Marquee';
import { Resources } from '../components/landing/Resources';
import { Evidence } from '../components/landing/Evidence';
import { Goals } from '../components/landing/Goals';
import { Sources } from '../components/landing/Sources';
import { Footer } from '../components/landing/Footer';
import { A11yPanel } from '../components/landing/A11yPanel';

export function Home() {
  // Efecto para las animaciones de revelado al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Efecto de brillo en las tarjetas
    document.querySelectorAll('.card-shine').forEach(card => {
      card.addEventListener('mousemove', (e: any) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mesh-bg grain min-h-screen">
      <a href="#main" className="skip-link">Saltar al contenido principal</a>
      <div className="scroll-progress" id="scrollProgress"></div>
      
      <Navbar />
      
      <main id="main">
        <Hero />
        <Marquee />
        <Resources />
        <Evidence />
        <Goals />
        <Sources />
      </main>
      
      <Footer />
      <A11yPanel />
    </div>
  );
}
