'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/routing';
import { Eye, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function FeaturedProducts() {
  const t = useTranslations('catalog');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(6); // Fetch more for better catalog feel
      if (data) setProducts(data);
    };
    fetchFeatured();
  }, []);

  return (
    <section className="featured-section" style={{ padding: '80px 0', background: '#ffffff' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase' }}>{t('featured')}</h2>
            <div style={{ width: '60px', height: '4px', background: '#ef4444', marginTop: '1rem' }}></div>
          </div>
          <Link href="/" style={{ color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem' }}>{t('viewAll')} →</Link>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}
            >
              <div style={{ position: 'relative', height: '280px', background: '#f8fafc', overflow: 'hidden' }}>
                {product.image_urls && product.image_urls.length > 0 ? (
                  <img src={product.image_urls[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                    [ No Image ]
                  </div>
                )}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                    {product.categories?.name || 'Furniture'}
                  </span>
                  <span style={{ fontWeight: 900, color: '#ef4444', fontSize: '1.2rem' }}>${product.price}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', color: '#000' }}>{product.name}</h3>

                <Link href={`/catalog/${product.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.8rem', borderRadius: '12px', background: '#000', color: 'white',
                  fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none'
                }}>
                  <Eye size={16} /> XEM CHI TIẾT
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>
    </section>
  );
}
