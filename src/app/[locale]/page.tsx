'use client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryCatalog from '@/components/layout/CategoryCatalog';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{ background: '#ffffff' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ padding: '60px 0 60px', background: '#ffffff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-title"
            style={{ fontWeight: 900, marginBottom: '1rem', letterSpacing: '-2px', textTransform: 'uppercase' }}
          >
            Transformer <span style={{ color: '#ef4444' }}>Robotics</span>
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            style={{ height: '4px', background: '#ef4444', margin: '0 auto 1.5rem' }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-desc"
            style={{ color: '#64748b', maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}
          >
            Khám phá bộ sưu tập nội thất thông minh hàng đầu. Thiết kế tinh xảo, công nghệ hiện đại.
          </motion.p>
        </div>
      </section>

      {/* Modern Category & Product Catalog */}
      <CategoryCatalog />

      <Footer />

      <style jsx>{`
        .hero-title { font-size: 3.5rem; }
        .hero-desc { font-size: 1.2rem; }
        @media (max-width: 768px) {
          .hero-title { font-size: 2.5rem; letter-spacing: -1px; }
          .hero-desc { font-size: 1rem; padding: 0 1rem; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: 2rem; }
        }
      `}</style>
    </main>
  );
}
