'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronRight, Box, X, Maximize2, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import OtherProductsCarousel from '@/components/layout/OtherProductsCarousel';
import LoadingScreen from '@/components/common/LoadingScreen';

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
    <div style={{ height: '100vh', background: '#ffffff' }}>
      <LoadingScreen />
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
      <Navbar forceSolid={true} />
      <div className="container" style={{ padding: '120px 1.5rem 100px' }}>
        <div className="detail-grid">

          {/* Left: Enhanced Image Gallery */}
          <div className="product-gallery">

            {/* Thumbnails list - Vertical Scroll */}
            <div className="thumbnails-container no-scrollbar">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  style={{
                    width: '80px',
                    height: '80px',
                    flex: '0 0 80px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: activeImg === idx ? '3px solid #ef4444' : '2px solid transparent',
                    background: '#f8fafc',
                    transition: 'all 0.3s ease',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: activeImg === idx ? '0 8px 16px rgba(239, 68, 68, 0.2)' : 'none'
                  }}
                >
                  <img
                    src={img}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: activeImg === idx ? 'none' : 'grayscale(0.3) opacity(0.7)'
                    }}
                    alt={`Thumbnail ${idx}`}
                  />
                </button>
              ))}
            </div>

            {/* Main Display Image */}
            <motion.div
              layoutId="main-img"
              onClick={() => setIsZoomed(true)}
              className="main-image-display"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }}
                  alt={product.name}
                />
              </AnimatePresence>
              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.8)', padding: '0.6rem', borderRadius: '12px', backdropFilter: 'blur(4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Maximize2 size={20} color="#1a1a1a" />
              </div>
            </motion.div>
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1rem' }}>
                {product.categories?.name || 'SẢN PHẨM'}
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1, letterSpacing: '-1px' }}>{product.name}</h1>
            </motion.div>

            {/* Color options removed per user request */}

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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

      <OtherProductsCarousel currentId={id as string} />

      <style jsx>{`
        .product-gallery {
          display: flex;
          gap: 2rem;
          height: auto;
          align-items: flex-start;
          flex-direction: column;
        }
        .thumbnails-container {
          width: 100%;
          height: 120px;
          display: flex;
          flex-direction: row;
          gap: 1rem;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 0.5rem;
          flex-shrink: 0;
        }
        .main-image-display {
          width: 100%;
          height: auto;
          aspect-ratio: 1/1;
          border-radius: 32px;
          background: #ffffff;
          overflow: hidden;
          cursor: zoom-in;
          position: relative;
          border: 1px solid #f1f5f9;
        }

        @media (min-width: 1024px) {
          .product-gallery {
            flex-direction: row;
            height: 650px;
          }
          .thumbnails-container {
            width: 110px;
            height: 464px;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .main-image-display {
            flex: 1;
            height: 100%;
          }
        }

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
