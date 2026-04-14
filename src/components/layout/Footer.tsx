'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/routing';

export default function Footer() {
  const t = useTranslations('common');
  
  return (
    <footer style={{ background: '#f8fafc', padding: '4rem 0 2rem', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div className="grid grid-3">
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>TRANSFORMER ROBOTICS</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>{t('catalog')}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link href="/catalog">Living Room</Link></li>
              <li><Link href="/catalog">Bedroom</Link></li>
              <li><Link href="/catalog">Office</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>{t('contact')}</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>info@transformerrobotics.com</p>
            <p style={{ color: 'var(--text-muted)' }}>+1 (555) 123-4567</p>
          </div>
        </div>
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          © 2026 Transformer Robotics. {t('footer.rights')}
        </div>
      </div>
      <style jsx>{`
        li a { color: var(--text-muted); transition: color 0.2s; }
        li a:hover { color: var(--primary); }
      `}</style>
    </footer>
  );
}
