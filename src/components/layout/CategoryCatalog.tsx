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
    <section style={{ padding: '60px 0 100px', background: '#ffffff' }}>
      <div className="container">

        {/* Title */}
        <div style={{ marginBottom: '0rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 400, color: '#535252ff' }}>Danh mục sản phẩm</h2>
        </div>

        {/* Minimalist Horizontal Categories Slider */}
        <div
          className="no-scrollbar category-slider"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            overflowX: 'auto',
            padding: '2rem 1rem 4rem',
            marginBottom: '3rem',
            scrollSnapType: 'x mandatory'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: isSelected ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '250px' : '380px') : '120px',
                  opacity: isSelected ? 1 : 0.4,
                  transition: 'all 0.4s ease-in-out'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: isSelected ? '240px' : '120px',
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
                    <LayoutGrid size={isSelected ? 60 : 30} color={isSelected ? '#ef4444' : '#94a3b8'} style={{ transition: 'all 0.4s ease-in-out' }} />
                  )}
                </div>

                <div style={{
                  height: isSelected ? '50px' : '0px',
                  opacity: isSelected ? 1 : 0,
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
        <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '3rem' }} />

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
        .category-slider {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
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
        @media (max-width: 1200px) {
          .catalog-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1024px) {
          .catalog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .catalog-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
