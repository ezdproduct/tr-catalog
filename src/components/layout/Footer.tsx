'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');

  // Custom Brand Icons (SVGs for consistent branding)
  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  const LinkedInIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.981 0 1.771-.773 1.771-1.729V1.729C24 .774 23.206 0 22.225 0z" />
    </svg>
  );

  const TikTokIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );

  const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
    </svg>
  );

  return (
    <footer style={{ background: '#0a0a0a', padding: '4rem 1rem 2rem' }}>
      <div className="container">

        {/* Dark Rounded Container */}
        <div style={{
          background: '#141414',
          borderRadius: '30px',
          padding: '4rem 3rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div className="footer-grid">

            {/* Column 1: LÝ DO HỢP TÁC CÙNG CHÚNG TÔI */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '0.5px', color: '#ffffff' }}>
                TẠI SAO ĐẠI LÝ NÊN HỢP TÁC VỚI CHÚNG TÔI
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1rem', color: '#d1d5db', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Hỗ trợ mô hình dropshipping</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Miễn phí hàng trưng bày, bao gồm phí vận chuyển</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Số lượng đặt hàng tối thiểu chỉ từ 1 bộ</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✓</span>
                  <span>Dễ dàng trưng bày và tư vấn khách hàng</span>
                </li>
              </ul>
            </div>

            {/* Column 2: THÔNG TIN LIÊN HỆ */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
                Thông tin liên hệ
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

            {/* Column 3: MẠNG XÃ HỘI */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '1px', color: '#ffffff', textTransform: 'uppercase' }}>
                Mạng xã hội
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'row', gap: '1.5rem', padding: 0, flexWrap: 'wrap' }}>
                <li>
                  <a href="#" className="social-link" title="Facebook">
                    <FacebookIcon />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link" title="Instagram">
                    <InstagramIcon />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link" title="TikTok">
                    <TikTokIcon />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link" title="LinkedIn">
                    <LinkedInIcon />
                  </a>
                </li>
                <li>
                  <a href="#" className="social-link" title="Twitter (X)">
                    <XIcon />
                  </a>
                </li>
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
          <div>© 2026 Transformer Robotics. Mọi quyền được bảo lưu.</div>
          <div style={{ marginTop: '0.5rem', letterSpacing: '1px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
            Đồng hành cùng các đối tác đại lý trên toàn cầu
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
