'use client';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import ContactSection from '@/components/layout/ContactSection';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <main>
      <Navbar />
      <div style={{ padding: '150px 0 60px', background: 'radial-gradient(circle at bottom, #f0f7ff 0%, #ffffff 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}
          >
            {t('desc')}
          </motion.p>
        </div>
      </div>
      <ContactSection />
      <div style={{ background: '#f8fafc', padding: '100px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
          <ContactInfo title="Support" email="support@transformer.com" hours="24/7 Available" />
          <ContactInfo title="Sales" email="sales@transformer.com" hours="Mon-Fri, 9am-6pm" />
          <ContactInfo title="Partners" email="partners@transformer.com" hours="Response in 48h" />
        </div>
      </div>

    </main>
  );
}

function ContactInfo({ title, email, hours }: any) {
  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
      <h4 style={{ marginBottom: '1rem' }}>{title}</h4>
      <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{email}</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hours}</p>
    </div>
  );
}
