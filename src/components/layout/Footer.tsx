'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');

  return (
    <footer style={{ background: '#0a0a0a', padding: '6rem 1rem 3rem' }}>
      <div className="container">

        {/* Dark Rounded Container */}
        <div style={{
          background: '#141414',
          borderRadius: '30px',
          padding: '4rem 3rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div className="footer-grid">

            {/* Column 1: WHY RETAILERS PARTNER WITH US */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '0.5px', color: '#ffffff' }}>
                Why Retailers Partner With Us
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1rem', color: '#d1d5db', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>We offer dropshipping</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Free floor model + shipping included</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Minimum order quantity is 1 set</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Easy to demonstrate and sell</span>
                </li>
              </ul>
            </div>

            {/* Column 2: CONTACT INFO */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
                Contact Info
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.95rem', color: '#9ca3af', padding: 0 }}>
                <li>
                  Liên hệ:<br />
                  <span style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.1rem', display: 'inline-block', marginTop: '0.4rem' }}>Mr. Hồng</span>
                </li>
                <li>
                  <span style={{ color: '#ffffff', fontWeight: 500, fontSize: '1.2rem' }}>📞 0944 078 585</span>
                </li>
              </ul>
            </div>

            {/* Column 3: SOCIAL MEDIA */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
                Social Media
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem', padding: 0 }}>
                <li><a href="#" className="social-link">Instagram</a></li>
                <li><a href="#" className="social-link">Facebook</a></li>
                <li><a href="#" className="social-link">Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div style={{
          marginTop: '4rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#6b7280',
          fontWeight: 500
        }}>
          <div>© 2026 Transformer Robotics. All rights reserved.</div>
          <div style={{ marginTop: '0.5rem', letterSpacing: '1px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Supporting Retail Partners Globally
          </div>
        </div>

      </div>
      <style jsx>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 4rem;
        }
        .social-link {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.2s;
        }
        .social-link:hover {
          color: #ffffff;
        }
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
