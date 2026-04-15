'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronRight, Box, X, Maximize2, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProductDetailPage() {
  const t = useTranslations('product');
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

      if (data) setProduct(data);
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <h2 style={{ fontWeight: 900, color: '#ef4444' }}>{t('loading')}</h2>
    </div>
  );

  if (!product) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <h2 style={{ fontWeight: 900 }}>{t('notFound')}</h2>
    </div>
  );

  const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [null];
  const metadata = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;

  const nextImg = () => setActiveImg(prev => (prev + 1) % images.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + images.length) % images.length);

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '20px 1.5rem 0' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '1rem 0', color: '#64748b', fontWeight: 700,
            fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'
          }}
        >
          <ChevronLeft size={18} /> {t('back')}
        </button>
      </div>

      <div className="container" style={{ padding: '0 1.5rem 100px' }}>
        <div className="detail-grid">

          {/* Left: Enhanced Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div
              layoutId="main-img"
              onClick={() => setIsZoomed(true)}
              style={{
                width: '100%', height: '550px', borderRadius: '32px', background: '#ffffff',
                overflow: 'hidden', cursor: 'zoom-in', position: 'relative'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  alt={product.name}
                />
              </AnimatePresence>
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.6rem', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
                <Maximize2 size={20} color="#1a1a1a" />
              </div>
            </motion.div>

            {/* Thumbnails with Horizontal Scroll */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex', gap: '1rem', overflowX: 'auto',
                  paddingBottom: '1rem', scrollSnapType: 'x mandatory'
                }}
                className="no-scrollbar"
              >
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    style={{
                      width: '110px', height: '110px', flex: '0 0 110px', borderRadius: '20px',
                      overflow: 'hidden', border: 'none',
                      background: 'white', transition: '0.2s', padding: 0, cursor: 'pointer',
                      scrollSnapAlign: 'start', opacity: activeImg === idx ? 1 : 0.4
                    }}
                  >
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1rem' }}>
                {product.categories?.name || 'SẢN PHẨM'}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px' }}>{product.name}</h1>
            </motion.div>

            {metadata?.variants && metadata.variants.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#1a1a1a' }}>{t('colorOptions')}</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {metadata.variants.map((v: any) => (
                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 1rem', background: '#f8fafc', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} className="variant-btn">
                      {v.swatch && <img src={v.swatch} alt={v.name} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />}
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div>
                <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {product.description || metadata?.meta?.vi?.description || metadata?.meta?.en?.description || 'Sản phẩm cao cấp từ Transformer Robotics.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {metadata && Object.entries(metadata).filter(([_, v]) => typeof v === 'string' || typeof v === 'number').map(([key, value], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.8rem 0', borderBottom: '1px dashed #f1f5f9' }}>
                    <div style={{ fontWeight: 800, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', minWidth: '120px' }}>{key}</div>
                    <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem', textAlign: 'right', flex: 1, paddingLeft: '1rem' }}>{value as any}</div>
                  </div>
                ))}

                {(!metadata || Object.entries(metadata).filter(([_, v]) => typeof v === 'string' || typeof v === 'number').length === 0) && (
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}>{t('noSpecs')}</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <button onClick={() => setIsZoomed(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'white', border: 'none', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <button onClick={prevImg} style={{ position: 'absolute', left: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '1.5rem', borderRadius: '50%', color: 'white' }}>
              <ChevronLeft size={30} />
            </button>

            <img src={images[activeImg]} style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />

            <button onClick={nextImg} style={{ position: 'absolute', right: '2rem', background: 'rgba(255,255,255,0.1)', border: 'none', padding: '1.5rem', borderRadius: '50%', color: 'white' }}>
              <ChevronRight size={30} />
            </button>

            <div style={{ position: 'absolute', bottom: '3rem', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
              {activeImg + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .variant-btn:hover {
          background: #f1f5f9 !important;
        }
        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr; gap: 4rem; }
        }
        @media (max-width: 640px) {
          .detail-grid h1 { font-size: 2.8rem !important; }
        }
      `}</style>
    </main >
  );
}
