'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');

  return (
    <footer style={{ background: '#ffffff', padding: '6rem 0 3rem', borderTop: '1px solid #f1f5f9' }}>
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', color: '#1a1a1a' }}>ABOUT US</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              {t('footer.desc') || 'We bring excellence in furniture design and create something new, simply different and very own.'}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', color: '#1a1a1a' }}>CONTACT INFO</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', color: '#64748b', padding: 0 }}>
              <li>Phone:<br /><span style={{ color: '#1a1a1a' }}>+1 555 123 4567</span></li>
              <li>Email:<br /><span style={{ color: '#1a1a1a' }}>info@transformerrobotics.com</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', color: '#1a1a1a' }}>ADDRESS</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              Al Wasl Road, Al Badaa<br />
              Dubai Unit no. 6<br /><br />
              Bldg. Plot No. 333-1103<br />
              Dubai — United Arab Emirates
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '1px', color: '#1a1a1a' }}>SOCIAL MEDIA</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem', padding: 0 }}>
              <li><a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Instagram</a></li>
              <li><a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Facebook</a></li>
              <li><a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Twitter</a></li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
          <span>© 2026 Transformer Robotics. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span style={{ cursor: 'pointer' }}>Terms & Conditions</span>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 4rem;
        }
        li a:hover { color: #1a1a1a !important; }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }
      `}</style>
    </footer>
  );
}
