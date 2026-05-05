'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { catalogData } from '@/data/catalogData';

export default function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsScrolled(forceSolid || window.scrollY > 50);

    const handleScroll = () => {
      setIsScrolled(forceSolid || window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(event.target as Node)) {
        setIsShopOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [forceSolid]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsShopOpen(false);
    }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
      padding: isScrolled ? '0.5rem 1rem' : '0', width: '100%',
      transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
    }}>
      <div style={{
        maxWidth: isScrolled ? '1400px' : '100%',
        margin: '0 auto', width: '100%',
        transition: 'all 0.5s ease'
      }}>
        <nav style={{
          background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderRadius: isScrolled ? '1rem' : '0',
          border: isScrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
          padding: isScrolled ? '0.2rem 2rem' : '2rem 4rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
          marginTop: isScrolled ? '10px' : '0'
        }}>
          {/* Left: Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo-do.svg"
              alt="Transformer Robotics"
              style={{
                height: isScrolled ? '54px' : '68px',
                width: 'auto',
                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                transition: 'all 0.5s ease'
              }}
            />
          </Link>

          {/* Right side: Catalog Dropdown */}
          <div className="nav-right" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <div
              style={{ position: 'relative' }}
              ref={shopRef}
              onMouseLeave={() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                  setIsShopOpen(false);
                }
              }}
            >
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsShopOpen(!isShopOpen);
                }}
                onMouseEnter={() => {
                  if (window.matchMedia('(min-width: 1024px)').matches) {
                    setIsShopOpen(true);
                  }
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  color: isScrolled ? '#333' : '#fff',
                  fontSize: '0.85rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.1em'
                }}
              >
                PRODUCTS
                <motion.div animate={{ rotate: isShopOpen ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isShopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0,
                      paddingTop: '20px', zIndex: 1200
                    }}
                  >
                    <div style={{
                      background: 'white', border: '1px solid #e2e8f0',
                      borderRadius: '1.2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      padding: '0.6rem', width: '260px', display: 'grid', gridTemplateColumns: '1fr', gap: '2px'
                    }}>
                      {catalogData.map(line => (
                        <button
                          key={line.id}
                          onClick={() => scrollTo(line.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '5px 8px',
                            borderRadius: '10px', background: 'none', border: 'none', cursor: 'pointer',
                            textAlign: 'left', width: '100%',
                            color: '#334155', fontSize: '0.9rem', fontWeight: 700, transition: 'all 0.2s',
                            letterSpacing: '0.02em'
                          }}
                          className="hover-item"
                        >
                          <div style={{ 
                            width: '64px', height: '48px', borderRadius: '8px', overflow: 'hidden', 
                            flexShrink: 0
                          }}>
                            <img 
                              src={line.variants[0].overviewImage} 
                              alt={line.menuLabel} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>
                          <span>{line.menuLabel}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .hover-item:hover { background: #f8fafc !important; color: var(--primary) !important; }
        @media (max-width: 768px) {
          nav { padding: 0.8rem 1rem !important; }
          .nav-right { gap: 1rem !important; }
        }
      `}</style>
    </header>
  );
}
