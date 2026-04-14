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
        <div style={{ marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#000' }}>Shop By Category</h2>
        </div>

        {/* Clean Grid Categories */}
        <div className="category-grid" style={{ marginBottom: '5rem' }}>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{ 
                cursor: 'pointer',
                textAlign: 'center',
                transition: '0.3s'
              }}
            >
              <div style={{ 
                width: '100%', aspectRatio: '1/1', 
                overflow: 'hidden', margin: '0 auto 1.2rem',
                background: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: '0.2s',
                opacity: selectedCat === cat.id ? 1 : 0.6,
                transform: selectedCat === cat.id ? 'scale(1.05)' : 'scale(1)'
              }}>
                 {cat.image_url ? (
                   <img 
                    src={cat.image_url} 
                    alt={cat.name} 
                    style={{ 
                        width: '90%', height: '90%', objectFit: 'contain',
                    }} 
                   />
                 ) : (
                   <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                     <LayoutGrid size={40} />
                   </div>
                 )}
              </div>
              <h3 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: selectedCat === cat.id ? 700 : 500, 
                  color: '#000',
                  marginTop: '0.5rem'
              }}>
                  {cat.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Product Divider or Header */}
        <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '3rem' }} />

        {/* Dynamic Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#000', fontWeight: 900, letterSpacing: '2px' }}>LOADING CATALOG...</div>
        ) : (
          <div className="catalog-grid">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <Link key={product.id} href={`/catalog/${product.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ 
                      background: 'transparent', border: 'none', 
                      padding: '0.2rem', cursor: 'pointer', transition: '0.3s', textAlign: 'center' 
                    }}
                    className="product-card-frame"
                  >
                    <div style={{ 
                      aspectRatio: '1/1', background: '#f8fafc', borderRadius: '8px', 
                      overflow: 'hidden', marginBottom: '0.8rem', border: 'none'
                    }}>
                      {product.image_urls?.[0] ? (
                        <img src={product.image_urls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><LayoutGrid size={24} /></div>
                      )}
                    </div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase', lineHeight: 1.2, margin: '0 auto' }}>
                       {product.name}
                    </h3>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style jsx>{`
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 3rem 2rem;
        }
        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 2.5rem 1rem;
        }
        .product-card-frame:hover {
           transform: translateY(-5px);
        }
        @media (max-width: 1200px) {
          .category-grid { grid-template-columns: repeat(4, 1fr); }
          .catalog-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (max-width: 900px) {
          .category-grid { grid-template-columns: repeat(3, 1fr); }
          .catalog-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 640px) {
          .category-grid { grid-template-columns: repeat(2, 1fr); }
          .catalog-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem 0.5rem; }
        }
      `}</style>
    </section>
  );
}
