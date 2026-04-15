'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, LogIn, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const languages = [
    { code: 'en', label: 'EN', flag: 'us', name: 'US' },
    { code: 'vi', label: 'VI', flag: 'vn', name: 'VN' },
  ];

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const handleLangChange = (code: string) => {
    router.replace(pathname, { locale: code as any });
    setIsLangOpen(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/', label: t('catalog') },
  ];

  return (
    <div style={{
      position: 'absolute', top: '20px', right: '20px', zIndex: 1100,
      display: 'flex', gap: '1rem', alignItems: 'center'
    }}>
      {/* Language Switcher Dropdown Only */}
      <div style={{ position: 'relative' }} ref={langRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 18px',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer', transition: 'all 0.3s',
            color: '#ffffff',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
        >
          <img
            src={`https://flagcdn.com/w40/${currentLang.flag}.png`}
            style={{ width: '22px', height: '16px', objectFit: 'cover', borderRadius: '3px' }}
            alt={currentLang.name}
          />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.5px' }}>{currentLang.label}</span>
          <motion.div animate={{ rotate: isLangOpen ? 180 : 0 }}>
            <ChevronDown size={14} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                position: 'absolute', top: '120%', right: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                border: '1px solid #ffffff', overflow: 'hidden',
                width: '180px', zIndex: 1200
              }}
            >
              {languages.map((lang, idx) => (
                <button
                  key={`${lang.code}-${idx}`}
                  onClick={() => handleLangChange(lang.code)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 22px', border: 'none', background: 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s', color: '#000000',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, width: '35px' }}>{lang.name}</span>
                  <img
                    src={`https://flagcdn.com/w40/${lang.flag}.png`}
                    style={{ width: '24px', height: '18px', objectFit: 'cover', borderRadius: '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                    alt={lang.name}
                  />
                  <span style={{ fontWeight: 900, fontSize: '0.9rem', width: '35px', textAlign: 'right' }}>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          div { top: 15px; right: 15px; }
        }
      `}</style>
    </div>
  );
}
