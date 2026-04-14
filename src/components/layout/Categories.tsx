'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sofa, Bed, Briefcase, Lamp } from 'lucide-react';

export default function Categories() {
  const t = useTranslations('catalog');

  const cats = [
    { icon: <Sofa size={32} />, name: t('categories.living'), count: '24 Products', color: '#f9fafb' },
    { icon: <Bed size={32} />, name: t('categories.bedroom'), count: '18 Products', color: '#f9fafb' },
    { icon: <Briefcase size={32} />, name: t('categories.office'), count: '12 Products', color: '#f9fafb' },
    { icon: <Lamp size={32} />, name: t('categories.dining'), count: '15 Products', color: '#f9fafb' },
  ];

  return (
    <section className="categories-section" style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase' }}>{t('title')}</h2>
          <div style={{ width: '60px', height: '4px', background: '#ef4444', margin: '1rem auto' }}></div>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>{t('subtitle')}</p>
        </div>
        
        <div className="cats-grid">
          {cats.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              style={{ 
                padding: '2.5rem 1.5rem', borderRadius: '24px', background: cat.color,
                textAlign: 'center', cursor: 'pointer', border: '1px solid #f1f5f9'
              }}
            >
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '16px', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem',
                color: '#ef4444', boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>{cat.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{cat.count}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .cats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .cats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cats-grid { grid-template-columns: 1fr; }
          h2 { fontSize: '1.8rem' !important; }
        }
      `}</style>
    </section>
  );
}
