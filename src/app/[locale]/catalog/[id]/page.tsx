'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronRight, Settings, Info, Box, X, Maximize2, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ProductDetailPage() {
  const { id } = useParams();
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
      <h2 style={{ fontWeight: 900, color: '#ef4444' }}>ĐANG TẢI...</h2>
    </div>
  );

  if (!product) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <h2 style={{ fontWeight: 900 }}>Sản phẩm không tồn tại.</h2>
    </div>
  );

  const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [null];
  const metadata = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;

  const nextImg = () => setActiveImg(prev => (prev + 1) % images.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + images.length) % images.length);

  return (
    <main style={{ background: '#ffffff', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '40px 1.5rem 100px' }}>
        <div className="detail-grid">
          
          {/* Left: Enhanced Image Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div
              layoutId="main-img"
              onClick={() => setIsZoomed(true)}
              style={{ 
                width: '100%', height: '550px', borderRadius: '32px', background: '#f8fafc',
                overflow: 'hidden', border: '1px solid #f1f5f9', cursor: 'zoom-in', position: 'relative'
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
                      overflow: 'hidden', border: activeImg === idx ? '3px solid #ef4444' : '1px solid #e2e8f0',
                      background: 'white', transition: '0.2s', padding: 0, cursor: 'pointer',
                      scrollSnapAlign: 'start'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1rem' }}>
                 <Box size={18} /> {product.categories?.name || 'CHI TIẾT'}
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1, letterSpacing: '-2px' }}>{product.name}</h1>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#ef4444' }}>
                $ {(product.price || 0).toLocaleString()}
              </div>
            </motion.div>

            <div style={{ borderTop: '2.5px solid #f1f5f9', paddingTop: '2rem' }}>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Info size={22} color="#64748b" /> MÔ TẢ SẢN PHẨM
               </h3>
               <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {product.description || 'Sản phẩm cao cấp từ Transformer Robotics.'}
               </p>
            </div>

            {metadata && Object.keys(metadata).length > 0 && (
              <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '40px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                   <Settings size={22} color="#ef4444" /> THÔNG SỐ KỸ THUẬT
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem 2.5rem' }}>
                  {Object.entries(metadata).map(([key, value]: [string, any]) => (
                    <div key={key} style={{ display: 'contents' }}>
                       <div style={{ fontWeight: 800, color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>{key}</div>
                       <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1rem' }}>{value}</div>
                       <div style={{ gridColumn: '1/-1', height: '1.5px', background: '#e2e8f0' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
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

      <Footer />

      <style jsx>{`
        .detail-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 1024px) {
          .detail-grid { grid-template-columns: 1fr; gap: 4rem; }
        }
        @media (max-width: 640px) {
          .detail-grid h1 { font-size: 2.8rem !important; }
        }
      `}</style>
    </main>
  );
}
