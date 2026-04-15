'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { LayoutGrid } from 'lucide-react';
import { Link } from '@/routing';

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
      if (cats && cats.length > 0) {
        setCategories(cats);
        setSelectedCat(cats[0].id);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedCat) return;
    const fetchProducts = async () => {
      setLoading(true);

      let query = supabase.from('products').select('*');

      // If the selected category is the first one, show all products
      if (selectedCat !== categories[0]?.id) {
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
                    background: isSelected ? 'var(--primary)' : '#f8fafc',
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
                      filter: isSelected ? 'brightness(1)' : 'brightness(0.7) grayscale(0.5)',
                      transition: 'all 0.5s ease'
                    }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isSelected ? 'transparent' : 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  transition: 'background 0.5s'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
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
          <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)', fontFamily: "'Evolventa', sans-serif", letterSpacing: '0.2em' }}>{t_common('loading')}</div>
        ) : (
          <div className="catalog-grid" style={{ marginTop: '2rem' }}>
            <AnimatePresence mode="popLayout">
              {products.map((product) => {
                return (
                  <Link key={product.id} href={`/catalog/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
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
                        transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                      }}
                      className="product-card-new"
                    >
                      {/* Image Frame */}
                      <div className="product-image-frame" style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        overflow: 'hidden',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {product.image_urls?.[0] ? (
                          <img
                            src={product.image_urls[0]}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '2rem',
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
                          transform: 'translateY(100%)',
                          transition: 'transform 0.3s ease'
                        }}>
                          Xem chi tiết
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div style={{ padding: '1.5rem 0' }}>
                        <h3 style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#1a1a1a',
                          margin: '0',
                          lineHeight: 1.4,
                          fontFamily: "'Montserrat', sans-serif",
                          textAlign: 'center'
                        }}>
                          {product.name}
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
          gap: 2rem;
        }

        .product-card-new:hover {
          transform: translateY(-8px);
        }
        .product-card-new:hover .hover-action {
          transform: translateY(0);
        }

        @media (max-width: 1200px) {
          .catalog-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .category-section { padding: 40px 0 60px; }
          .catalog-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
          .category-item-new { width: 220px !important; }
        }

        @media (max-width: 480px) {
          .catalog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
