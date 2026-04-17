'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/routing';
import { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(forceSolid);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsScrolled(forceSolid || window.scrollY > 50);

    const fetchCats = async () => {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    };
    fetchCats();

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
  }, []);

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
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderRadius: isScrolled ? '1rem' : '0',
          boxShadow: isScrolled ? '0 4px 30px rgba(0,0,0,0.05)' : 'none',
          border: isScrolled ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          padding: isScrolled ? '0.8rem 2rem' : '2rem 4rem',
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
                height: isScrolled ? '38px' : '46px',
                width: 'auto',
                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                transition: 'all 0.5s ease'
              }}
            />
          </Link>

          {/* Right side: Shop Dropdown & Language */}
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>

            {/* Shop Dropdown Trigger */}
            <div
              style={{ position: 'relative' }}
              ref={shopRef}
              onMouseEnter={() => setIsShopOpen(true)}
              onMouseLeave={() => setIsShopOpen(false)}
            >
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                color: isScrolled ? '#333' : '#fff',
                fontSize: '0.85rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em'
              }}>
                CATALOG
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
                      position: 'absolute', top: '100%', left: '50%', x: '-50%',
                      paddingTop: '20px', zIndex: 1200
                    }}
                  >
                    <div style={{
                      background: 'white', border: '1px solid #f1f5f9',
                      borderRadius: '1.2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                      padding: '1.5rem', width: '320px', display: 'grid', gridTemplateColumns: '1fr', gap: '5px'
                    }}>
                      {categories.map(cat => (
                        <Link
                          key={cat.id}
                          href="/#catalog"
                          onClick={() => setIsShopOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                            borderRadius: '10px', textDecoration: 'none', color: '#64748b',
                            fontSize: '0.9rem', transition: 'all 0.2s'
                          }}
                          className="hover-item"
                        >
                          <img src={cat.image_url || cat.bannerImage} style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                          <span>{cat.name}</span>
                        </Link>
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
        .hover-bg-gray:hover { background: #f1f5f9 !important; }
        .hover-item:hover { background: #f8fafc !important; color: #1a1a1a !important; }
        @media (max-width: 768px) {
          nav { padding: ${isScrolled ? '0.6rem 1rem' : '1rem 2rem'} !important; }
        }
      `}</style>
    </header>
  );
}
