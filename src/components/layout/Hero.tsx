'use client';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/routing';
import { ArrowRight, Box, Cpu, Sparkles } from 'lucide-react';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="hero">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 600 }}>
            <Cpu size={20} />
            <span style={{ letterSpacing: '2px', fontSize: '0.8rem', textTransform: 'uppercase' }}>{t('badge')}</span>
          </div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '2rem', fontWeight: 900 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px' }}>
            {t('description')}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/catalog" className="btn btn-primary" style={{ padding: '1.2rem 2.5rem' }}>
              {t('cta')} <ArrowRight size={20} />
            </Link>
            <Link href="/about" className="btn btn-outline" style={{ padding: '1.2rem 2.5rem' }}>
              Learn More
            </Link>
          </div>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>50+</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('stats.patents')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>20k+</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('stats.homes')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative' }}
          className="desktop-only"
        >
          <div className="glass-effect" style={{ 
            width: '100%', height: '500px', borderRadius: '40px',
            background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4f8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
             <div style={{ textAlign: 'center' }}>
                <Box size={200} color="var(--primary)" style={{ opacity: 0.2 }} />
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  [ Premium Robotic Chair Image ]
                </p>
             </div>
          </div>
          
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ 
              position: 'absolute', top: '10%', right: '-5%', 
              padding: '1.5rem', borderRadius: '20px', background: 'white',
              boxShadow: 'var(--shadow-lg)', display: 'flex', gap: '1rem', alignItems: 'center'
            }}
          >
            <Sparkles color="var(--accent)" />
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{t('card.title')}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('card.desc')}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          section { padding-top: 100px; }
          .container { grid-template-columns: 1fr !important; }
          h1 { fontSize: 3rem !important; }
          .desktop-only { display: none; }
        }
      `}</style>
    </section>
  );
}
