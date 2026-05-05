'use client';

import Navbar from '@/components/layout/Navbar';
import OverviewSection from '@/components/catalog/OverviewSection';
import DetailSection from '@/components/catalog/DetailSection';
import { catalogData } from '@/data/catalogData';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{ background: '#ffffff' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        position: 'relative', width: '100%', height: '100vh', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        overflow: 'hidden', background: '#000' 
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video
            autoPlay loop muted playsInline preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            poster="https://transformertable.com/cdn/shop/files/preview_images/11d3647621354c7cb208d78dc0da5852.thumbnail.0000000000_150x.jpg?v=1771353747"
          >
            <source src="https://transformertable.com/cdn/shop/videos/c/vp/11d3647621354c7cb208d78dc0da5852/11d3647621354c7cb208d78dc0da5852.SD-480p-1.2Mbps-74470836.mp4?v=0" media="(min-width: 768px)" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)', zIndex: 1 }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 style={{
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
              marginBottom: '1.5rem',
              fontFamily: "'Evolventa', sans-serif"
            }}>
              TRANSFORMER<br />
              <span style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>ROBOTICS</span>
            </h1>
            <p style={{
              fontSize: '1.1rem', color: '#fff', maxWidth: '700px', margin: '0 auto 2.5rem',
              opacity: 0.9, letterSpacing: '0.05em'
            }}>
              MODULAR FURNITURE REIMAGINED. DISCOVER THE FUTURE OF LIVING.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 12 Sections Layout */}
      <div className="catalog-sections-container">
        {catalogData.map((line) => (
          <div key={line.id} id={line.id}>
            {line.variants.map((variant) => (
              <div key={variant.id}>
                {/* Section 1: Overview */}
                <OverviewSection variant={variant} lineName={line.name} />
                
                {/* Section 2: Detail */}
                <DetailSection variant={variant} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <footer style={{ padding: '4rem 0', background: '#000', color: '#fff', textAlign: 'center' }}>
        <img src="/logo-do.svg" alt="TR" style={{ height: '40px', filter: 'brightness(0) invert(1)', marginBottom: '1.5rem' }} />
        <p style={{ opacity: 0.5, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          © 2024 TRANSFORMER ROBOTICS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
