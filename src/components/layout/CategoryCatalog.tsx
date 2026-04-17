'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { LayoutGrid } from 'lucide-react';
import { Link } from '@/routing';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function CategoryCatalog() {
  const t_common = useTranslations('common');
  const t_catalog = useTranslations('catalog');
  const locale = useLocale();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      const allProductsCat = {
        id: 'all',
        name: locale === 'vi' ? 'TẤT CẢ SẢN PHẨM' : 'ALL PRODUCTS',
        bannerImage: 'https://pub-83ec56d99c0444bda304e97abb4edd21.r2.dev/Brand%20TR/hero-banner.jpg'
      };

      if (cats) {
        setCategories([allProductsCat, ...cats]);
        setSelectedCat('all');
      }
    };
    init();
  }, [locale]);

  useEffect(() => {
    if (!selectedCat) return;
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase.from('products').select('*');

      if (selectedCat && selectedCat !== 'all') {
        query = query.eq('category_id', selectedCat);
      }

      const { data } = await query.order('created_at', { ascending: false });

      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCat, categories]);

  return (
    <section id="catalog" className="category-section" style={{ background: '#ffffff', borderTop: '1px solid #eee' }}>
      <div className="container" style={{ maxWidth: '1600px' }}>

        {/* Header Section Removed as requested */}

        {/* Minimalist Horizontal Categories Slider */}
        <div
          className="no-scrollbar category-slider"
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '2rem'
          }}
        >
          {categories.map((cat, idx) => {
            const isSelected = selectedCat === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`category-item-new ${isSelected ? 'active' : ''}`}
                style={{
                  cursor: 'pointer',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  width: '320px',
                  marginRight: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '16/10',
                  borderRadius: '12px',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? '0 20px 40px rgba(0,0,0,0.15)' : 'none',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid #eee'
                }}
              >
                {idx === 0 ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    transition: 'all 0.5s ease'
                  }} />
                ) : (
                  <img
                    src={cat.bannerImage || cat.image_url}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isSelected ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.7) grayscale(0.5)',
                      transition: 'all 0.5s ease'
                    }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isSelected ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  transition: 'background 0.5s'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: isSelected ? 'var(--primary)' : '#fff',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: isSelected ? 'none' : '0 2px 10px rgba(0,0,0,0.5)',
                    textAlign: 'center'
                  }}>
                    {idx === 0 ? (locale === 'vi' ? 'TẤT CẢ SẢN PHẨM' : 'ALL PRODUCTS') : cat.name}
                  </h3>
                </div>
              </div>
            )
          }
          )}
        </div>

        {/* Product Divider or Header */}
        <div className="category-divider" style={{ height: '1px', background: '#f1f5f9' }} />

        {/* Dynamic Product Grid */}
        {loading ? (
          <div style={{ height: '400px' }}><LoadingScreen /></div>
        ) : (
          <div className="catalog-grid" style={{ marginTop: '2rem' }}>
            <AnimatePresence mode="popLayout">
              {products.flatMap(p => (p.image_urls || []).map((url: string, idx: number) => ({ ...p, displayImage: url, displayId: `${p.id}-${idx}` }))).map((item) => {
                return (
                  <Link key={item.displayId} href={`/catalog/${item.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        background: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                        border: '1px solid #f1f5f9',
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                      }}
                      className="product-card-new"
                    >
                      {/* Image Frame */}
                      <div className="product-image-frame" style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        overflow: 'hidden',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.displayImage ? (
                          <img
                            src={item.displayImage}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.6s ease'
                            }}
                            className="product-img"
                          />
                        ) : (
                          <div style={{ color: '#cbd5e1' }}><LayoutGrid size={48} /></div>
                        )}

                        {/* Hover Overlay */}
                        <div className="hover-action" style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          background: 'var(--primary)',
                          color: '#fff',
                          padding: '0.8rem',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          transform: 'translateY(10px)',
                          opacity: 0,
                          transition: 'all 0.3s ease'
                        }}>
                          Xem chi tiết
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div style={{ padding: '1rem 0.5rem' }}>
                        <h3 style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#1a1a1a',
                          margin: '0',
                          lineHeight: 1.4,
                          fontFamily: "'Montserrat', sans-serif",
                          textAlign: 'center'
                        }}>
                          {item.name}
                        </h3>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .category-section {
          padding: 80px 0 100px;
        }
        .category-slider {
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding: 0 1rem 2rem;
          cursor: grab;
        }
        .category-slider:active { cursor: grabbing; }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .product-card-new:hover {
          transform: translateY(-8px);
        }
        .product-card-new:hover .hover-action {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }

        @media (max-width: 1200px) {
          .catalog-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .category-section { padding: 40px 0 60px; }
          .catalog-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
          .category-item-new { width: 220px !important; }
        }

        @media (max-width: 480px) {
          .catalog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
