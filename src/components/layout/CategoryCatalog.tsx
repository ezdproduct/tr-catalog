'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { LayoutGrid } from 'lucide-react';
import { Link } from '@/routing';

export default function CategoryCatalog() {
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
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', selectedCat)
        .order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCat]);

  return (
    <section className="category-section" style={{ background: '#ffffff' }}>
      <div className="container">

        {/* Title */}
        <div className="category-title-wrapper">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 400, color: '#535252ff', margin: 0 }}>Danh mục sản phẩm</h2>
        </div>

        {/* Minimalist Horizontal Categories Slider */}
        <div
          className="no-scrollbar category-slider"
          style={{
            display: 'flex',
            alignItems: 'center',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`category-item ${isSelected ? 'selected' : ''}`}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.4s ease-in-out'
                }}
              >
                <div
                  className="category-image-wrapper"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.4s ease-in-out'
                  }}
                >
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      style={{
                        width: '100%', height: '100%', objectFit: 'contain',
                        mixBlendMode: 'darken',
                        filter: 'brightness(1.05) contrast(1.05)',
                        transformOrigin: 'center bottom',
                        transition: 'all 0.4s ease-in-out'
                      }}
                    />
                  ) : (
                    <LayoutGrid className="category-icon" color={isSelected ? '#ef4444' : '#94a3b8'} style={{ transition: 'all 0.4s ease-in-out' }} />
                  )}
                </div>

                <div className="category-name-wrapper" style={{
                  overflow: 'hidden',
                  transition: 'all 0.4s ease-in-out'
                }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#ef4444',
                      paddingTop: '0.8rem',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name}
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
          <div style={{ textAlign: 'center', padding: '5rem', color: '#000', fontWeight: 900, letterSpacing: '2px' }}>LOADING CATALOG...</div>
        ) : (
          <div className="catalog-grid" style={{ borderTop: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9', background: '#fff' }}>
            <AnimatePresence mode="popLayout">
              {products.map((product) => {
                const catName = categories.find(c => c.id === selectedCat)?.name || 'CONSOLE';
                return (
                  <Link key={product.id} href={`/catalog/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        background: '#ffffff',
                        borderRight: '1px solid #f1f5f9',
                        borderBottom: '1px solid #f1f5f9',
                        padding: '1.5rem 1.2rem',
                        cursor: 'pointer', transition: 'background 0.3s',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        height: '100%', minHeight: '300px'
                      }}
                      className="product-card-frame"
                    >
                      {/* Top Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <span>{catName}</span>
                        <span style={{ fontSize: '1rem', lineHeight: 0, paddingBottom: '4px' }}>•</span>
                      </div>

                      {/* Image Center */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                        {product.image_urls?.[0] ? (
                          <img src={product.image_urls[0]} alt={product.name} style={{ width: '100%', height: '100%', maxHeight: '180px', objectFit: 'contain', mixBlendMode: 'darken', filter: 'brightness(1.05) contrast(1.05)' }} />
                        ) : (
                          <div style={{ color: '#cbd5e1' }}><LayoutGrid size={24} /></div>
                        )}
                      </div>

                      {/* Name Bottom */}
                      <h3 className="product-name" style={{ fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', margin: 0, textAlign: 'left', transition: 'color 0.2s' }}>
                        {product.name}
                      </h3>
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
        .category-title-wrapper {
          margin-bottom: 2rem;
        }
        .category-slider {
          -ms-overflow-style: none;
          scrollbar-width: none;
          gap: 3rem;
          padding: 0 1rem;
          margin-bottom: 3rem;
        }
        .category-item {
          width: 120px;
          opacity: 0.4;
        }
        .category-item.selected {
          width: 380px;
          opacity: 1;
        }
        .category-image-wrapper {
          width: 100%;
          height: 120px;
        }
        .category-item.selected .category-image-wrapper {
          height: 240px;
        }
        .category-name-wrapper {
          height: 0;
          opacity: 0;
        }
        .category-item.selected .category-name-wrapper {
          height: 50px;
          opacity: 1;
        }
        .category-icon { width: 30px; height: 30px; }
        .category-item.selected .category-icon { width: 60px; height: 60px; }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .product-card-frame:hover {
           background: #fafafa !important;
        }
        .product-card-frame:hover .product-name {
           color: #ef4444 !important;
        }

        .category-divider {
          margin-bottom: 3rem;
        }

        @media (max-width: 1024px) {
          .catalog-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .category-section {
            padding: 40px 0 60px;
          }
          .category-title-wrapper {
            margin-bottom: 1rem;
          }
          .category-slider {
            gap: 1.5rem;
            margin-bottom: 1.5rem;
            padding: 0 0.5rem;
          }
          .category-item {
            width: 80px;
          }
          .category-item.selected {
            width: 180px;
          }
          .category-image-wrapper {
            height: 80px;
          }
          .category-item.selected .category-image-wrapper {
            height: 160px;
          }
          .category-item.selected .category-name-wrapper {
            height: 40px;
          }
          .category-item.selected h3 {
            font-size: 0.8rem !important;
          }
          .category-divider {
            margin-bottom: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
