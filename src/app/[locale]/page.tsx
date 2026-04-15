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
            <source src="https://transformertable.com/cdn/shop/videos/c/vp/11d3647621354c7cb208d78dc0da5852/11d3647621354c7cb208d78dc0da5852.SD-480p-1.2Mbps-74470836.mp4?v=0" media="(min-width: 768px)" type="video/mp4" />
            <source src="https://transformertable.com/cdn/shop/videos/c/vp/d8184e44b38d464cac31eba99df3b7fd/d8184e44b38d464cac31eba99df3b7fd.HD-1080p-3.3Mbps-74470985.mp4?v=0" media="(max-width: 767px)" type="video/mp4" />
          </video>
          {/* Elegant overlay gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)', zIndex: 1 }} />
        </div>

        {/* Cinematic Content Overlay */}
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '1200px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h1 className="hero-title" style={{
              fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 0.85,
              marginBottom: '1rem',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontFamily: "'Evolventa', sans-serif"
            }}>
              TRANSFORMER<br />
              <span style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>ROBOTICS</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              color: '#f3f4f6',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
              fontWeight: 400,
              letterSpacing: '0.05em',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Nâng tầm không gian sống với công nghệ biến hình đột phá.
            Thiết kế tinh xảo, chất liệu thượng hạng.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <a href="#catalog" className="btn btn-primary" style={{
              padding: '1rem 3rem',
              fontSize: '1rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              borderRadius: '0',
              fontWeight: 700,
              boxShadow: '0 10px 20px rgba(185, 28, 28, 0.3)'
            }}>
              Khám phá bộ sưu tập
            </a>
          </motion.div>
        </div>
      </section>

      {/* Nova Featured Section */}
      <section style={{ background: '#000', padding: '6rem 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '4rem', maxWidth: '1400px' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.3em', fontSize: '0.8rem', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>SANG TRỌNG BẬC NHẤT</span>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', marginBottom: '1.5rem', lineHeight: 1 }}>BỘ SƯU TẬP<br />NOVA</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px' }}>
              Bản giao hưởng giữa nghệ thuật cơ khí và thiết kế nội thất. Nova không chỉ là một chiếc bàn, mà là một biểu tượng của lối sống hiện đại.
            </p>
            <a href="#catalog" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff', borderRadius: '0', padding: '1rem 3rem' }}>KHÁM PHÁ NGAY</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ position: 'relative', aspectRatio: '4/5' }}
          >
            <img
              src="https://transformertable.com/cdn/shop/files/PSD-rafale-hp.jpg?v=1771359656&width=1000"
              alt="Nova Collection"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Modern Category & Product Catalog */}
      <CategoryCatalog />

      {/* Materials & Craftsmanship Section */}
      <section style={{ padding: '100px 0', background: '#fcfcfc' }}>
        <div className="container" style={{ maxWidth: '1400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>TUYỆT TÁC TỪ THIÊN NHIÊN</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tuyển chọn những loại gỗ quý hiếm, xử lý thủ công đạt độ bền thế kỷ.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {[
              { id: 1, name: 'Scandinavian Oak', img: 'https://transformertable.com/cdn/shop/files/TT-4.0-WB-0646.jpg?v=1693241096' },
              { id: 2, name: 'Smoked Hickory', img: 'https://transformertable.com/cdn/shop/files/TT-4.0-WB-0652.jpg?v=1693241095' },
              { id: 3, name: 'American Walnut', img: 'https://transformertable.com/cdn/shop/files/American_Walnut_solo.jpg?v=1729876765' },
              { id: 4, name: 'Canadian Birch', img: 'https://transformertable.com/cdn/shop/files/TT-4.0-WB-0654.jpg?v=1693241095' }
            ].map(mat => (
              <motion.div
                key={mat.id}
                whileHover={{ y: -10 }}
                style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', cursor: 'pointer' }}
              >
                <img src={mat.img} alt={mat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                  display: 'flex', alignItems: 'flex-end', padding: '2rem'
                }}>
                  <span style={{ color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>{mat.name.toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-title { font-size: 6.5rem; }
        @media (max-width: 1024px) {
          .hero-title { font-size: 5rem; }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 3.5rem; }
          section div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
