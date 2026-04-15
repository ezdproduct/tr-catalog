'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryCatalog from '@/components/layout/CategoryCatalog';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{ background: '#ffffff' }}>

      {/* Cinematic Video Hero Section */}
      <section className="hero-section" style={{ position: 'relative', width: '100%', height: '85vh', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#000' }}>

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
            style={{ fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px', textTransform: 'uppercase', color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
          >
            Transformer <span style={{ color: '#ef4444' }}>Robotics</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ height: '4px', background: '#ef4444', margin: '0 auto 1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-desc"
            style={{ color: '#f8fafc', maxWidth: '700px', margin: '0 auto', fontWeight: 500, fontSize: '1.25rem', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
          >
            Khám phá bộ sưu tập nội thất thông minh hàng đầu.<br />Thiết kế tinh xảo, công nghệ hiện đại.
          </motion.p>
        </div>
      </section>

      {/* Modern Category & Product Catalog */}
      <CategoryCatalog />

      <Footer />

      <style jsx>{`
        .hero-title { font-size: 6.5rem; }
        .hero-desc { font-size: 1.8rem; line-height: 1.6; }
        @media (max-width: 1024px) {
          .hero-title { font-size: 5rem; }
          .hero-desc { font-size: 1.5rem; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 4rem; letter-spacing: 0; }
          .hero-desc { font-size: 1.3rem; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2.8rem; }
          .hero-desc { font-size: 1.15rem; }
        }
      `}</style>
    </main>
  );
}
