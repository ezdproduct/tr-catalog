'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/routing';
import { useState, useEffect } from 'react';
import { Menu, X, Globe, LogIn } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'vi' : locale === 'vi' ? 'fr' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/', label: t('catalog') },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ 
      background: '#ffffff', 
      height: '70px', display: 'flex', alignItems: 'center',
      borderBottom: '1px solid #f0f0f0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Link href="/" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', letterSpacing: '-1.5px', textTransform: 'uppercase' }}>
          TRANSFORMER<span style={{ color: '#000000' }}>CATALOG</span>
        </Link>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="desktop-only">
          {navLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.href as any}
              style={{ fontWeight: 600, color: '#000000', textTransform: 'uppercase', fontSize: '0.9rem' }}
            >
              {link.label}
            </Link>
          ))}
          
          <button onClick={toggleLanguage} style={{ 
            display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, 
            padding: '8px 12px', background: '#f8fafc', borderRadius: '8px'
          }}>
            <Globe size={16} />
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{locale}</span>
          </button>

          <Link href="/login" style={{ 
            background: '#ef4444', color: 'white', padding: '0.7rem 1.4rem', 
            fontWeight: 700, borderRadius: '8px', textTransform: 'uppercase', fontSize: '0.85rem'
          }}>
            <LogIn size={16} style={{ marginRight: '6px' }} />
            {t('login')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '8px' }}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ 
          position: 'absolute', top: '70px', left: 0, right: 0, 
          padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
          background: 'white', borderBottom: '1px solid #eee', zIndex: 2000
        }}>
          {navLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.href as any}
              onClick={() => setIsMenuOpen(false)}
              style={{ fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase' }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={toggleLanguage} style={{ fontWeight: 700, padding: '0.8rem', flex: 1, background: '#f8fafc', borderRadius: '8px' }}>
              <Globe size={18} /> {locale.toUpperCase()}
            </button>
            <Link href="/login" onClick={() => setIsMenuOpen(false)} style={{ background: '#ef4444', color: 'white', padding: '0.8rem', borderRadius: '8px', fontWeight: 700, flex: 2, textAlign: 'center' }}>
              LOGIN
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 769px) { .mobile-only { display: none; } }
        @media (max-width: 768px) { .desktop-only { display: none; } }
      `}</style>
    </nav>
  );
}
