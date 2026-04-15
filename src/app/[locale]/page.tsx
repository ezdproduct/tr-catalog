'use client';
import Navbar from '@/components/layout/Navbar';
import CategoryCatalog from '@/components/layout/CategoryCatalog';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{ background: '#ffffff' }}>
      <Navbar />

      {/* Cinematic Video Hero Section */}
      <section className="hero-section" style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>

        {/* Responsive Background Video Player */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            poster="https://transformertable.com/cdn/shop/files/preview_images/11d3647621354c7cb208d78dc0da5852.thumbnail.0000000000_150x.jpg?v=1771353747"
          >
            {/* Desktop Video Source */}
            <source src="https://transformertable.com/cdn/shop/videos/c/vp/11d3647621354c7cb208d78dc0da5852/11d3647621354c7cb208d78dc0da5852.SD-480p-1.2Mbps-74470836.mp4?v=0" media="(min-width: 768px)" type="video/mp4" />
            {/* Mobile Video Source */}
            <source src="https://transformertable.com/cdn/shop/videos/c/vp/d8184e44b38d464cac31eba99df3b7fd/d8184e44b38d464cac31eba99df3b7fd.HD-1080p-3.3Mbps-74470985.mp4?v=0" media="(max-width: 767px)" type="video/mp4" />
          </video>
          {/* Black gradient overlay to ensure text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1 }} />
        </div>

        {/* Centered Overlay Content */}
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 2rem', width: '100%' }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              marginBottom: '2rem',
              color: '#ef4444',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              textTransform: 'uppercase'
            }}
          >
            TRANSFORMER<br />ROBOTICS
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            style={{ height: '4px', background: '#ef4444', margin: '0 auto 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.5)', width: '100px' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <p style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
              fontWeight: 500,
              color: '#f8fafc',
              opacity: 0.9,
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)'
            }}>
              Khám phá bộ sưu tập nội thất thông minh hàng đầu.
              <br />
              Thiết kế tinh xảo, công nghệ hiện đại.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Category & Product Catalog */}
      <CategoryCatalog />

      <style jsx>{`
        .hero-title { font-size: 5.5rem; }
        .hero-desc { font-size: 1.6rem; line-height: 1.6; }
        @media (max-width: 1024px) {
          .hero-title { font-size: 4.5rem; }
          .hero-desc { font-size: 1.4rem; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 3.5rem; letter-spacing: 0; }
          .hero-desc { font-size: 1.2rem; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2.5rem; }
          .hero-desc { font-size: 1.1rem; }
        }
      `}</style>
    </main>
  );
}
