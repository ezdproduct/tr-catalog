'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  
  // Get reviews from translation file
  const reviews = [
    { name: t('reviews.0.name'), role: t('reviews.0.role'), content: t('reviews.0.content') },
    { name: t('reviews.1.name'), role: t('reviews.1.role'), content: t('reviews.1.content') },
    { name: t('reviews.2.name'), role: t('reviews.2.role'), content: t('reviews.2.content') },
  ];

  return (
    <section style={{ padding: '100px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('title')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        </div>

        <div className="grid grid-3">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              style={{ 
                padding: '2.5rem', borderRadius: '30px', border: '1px solid var(--border)',
                position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem'
              }}
            >
              <Quote size={40} color="var(--primary)" style={{ opacity: 0.1, position: 'absolute', top: '1.5rem', right: '1.5rem' }} />
              <p style={{ fontStyle: 'italic', color: 'var(--foreground)', fontSize: '1.1rem' }}>"{rev.content}"</p>
              <div>
                <p style={{ fontWeight: 'bold' }}>{rev.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
