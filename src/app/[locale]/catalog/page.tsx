'use client';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Categories from '@/components/layout/Categories';
import FeaturedProducts from '@/components/layout/FeaturedProducts';
import { motion } from 'framer-motion';

export default function CatalogPage() {
  const t = useTranslations('catalog');

  return (
    <main>
      <Navbar forceSolid={true} />
      <div style={{ padding: '60px 0 60px', background: 'radial-gradient(circle at top, #f0f7ff 0%, #ffffff 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </div>
      <Categories />
      <FeaturedProducts />
      <div style={{ padding: '0 0 100px' }}>
        <FeaturedProducts />
      </div>
    </main>
  );
}
