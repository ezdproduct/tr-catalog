'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');

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
                Tại Sao Đại Lý Nên Hợp Tác Với Chúng Tôi
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
