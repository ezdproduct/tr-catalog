'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/routing';
import LoadingScreen from '@/components/common/LoadingScreen';
import Image from 'next/image';

// Optimized sub-component that only renders children when in view
function LazyRow({ subName, products }: { subName: string, products: any[] }) {
  const [isInView, setIsInView] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Load slightly before it comes into view
    );

    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef} style={{ minHeight: isInView ? 'auto' : '300px' }}>
      {isInView ? <SubCategoryRow subName={subName} products={products} /> : null}
    </div>
  );
}

// Sub-component for each sub-category row with enhanced UI
function SubCategoryRow({ subName, products }: { subName: string, products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const displayItems = products.flatMap(p =>
    (p.image_urls || []).map((url: string, idx: number) => ({
      ...p,
      displayImage: url,
      displayId: `${p.id}-${idx}`,
    }))
  );

  if (displayItems.length === 0) return null;

  const cleanName = subName
    .replace(/^Round Dining Set - /g, '')
    .replace(/^Dining Set-? /g, '')
    .replace(/^Outdoor Dining Set - /g, '')
    .replace(/^Table to Desk -? /g, '')
    .replace(/^Transformer Round Sideboard - /g, '');

  return (
    <div className="sub-category-row" style={{ marginBottom: '2.5rem', position: 'relative' }}>
      {/* Sub-category Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '1.5rem',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: 0,
            color: '#111',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            {cleanName}
          </h3>
        </div>

        <div className="discovery-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#888', transition: 'color 0.3s' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>View Details</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* Custom Scroll Controls - Floating */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="scroll-nav-btn left"
          style={{ left: '1rem' }}
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="scroll-nav-btn right"
          style={{ right: '1rem' }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Horizontal Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1.5rem',
          padding: '1.5rem 2rem 1rem',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        } as React.CSSProperties}
      >
        {displayItems.map((item, idx) => (
          <Link key={item.displayId} href={`/catalog/${item.id}`} style={{ textDecoration: 'none', flexShrink: 0, width: '320px', scrollSnapAlign: 'start' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx % 4 * 0.1 }}
              whileHover={{ y: -8 }}
              className="product-card-premium"
              style={{ width: '100%' }}
            >
              <div className="card-image-wrapper" style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '75%', // Robust 4:3 Aspect Ratio
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                background: '#f9fafb'
              }}>
                <Image
                  src={item.displayImage.startsWith('//') ? `https:${item.displayImage}` : item.displayImage}
                  alt={item.name}
                  fill
                  sizes="320px"
                  quality={80}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="main-image"
                  loading="lazy"
                />

                {/* Status Badge if applicable */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                  <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, color: '#000', letterSpacing: '0.1em' }}>
                    NEW
                  </div>
                </div>

                {/* Glass Overlay on Hover */}
                <div className="card-overlay">
                  <div style={{ transform: 'translateY(10px)', transition: 'transform 0.4s' }} className="overlay-content">
                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 500, opacity: 0.8, color: '#fff' }}>COLLECTION</p>
                    <h4 style={{ margin: '4px 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{item.name}</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

type GroupedData = {
  category: string;
  subCategories: { name: string; products: any[] }[];
};

export default function CategoryCatalog() {
  const locale = useLocale();
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryOrder = [
    'Round Dining Set',
    'Dining Set',
    'Outdoor Dining Set',
    'Table to Desk',
    'Transformer Round Sideboard',
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: products } = await supabase
        .from('products')
        .select('id, name, image_urls, metadata, sort_order')
        .order('sort_order', { ascending: true });

      if (products) {
        const catMap: Record<string, Record<string, any[]>> = {};

        products.forEach(p => {
          const cat = p.metadata?.original_category || (locale === 'vi' ? 'Khác' : 'Other');
          const folder = p.metadata?.original_folder || p.name;

          if (!catMap[cat]) catMap[cat] = {};
          if (!catMap[cat][folder]) catMap[cat][folder] = [];
          catMap[cat][folder].push(p);
        });

        const sorted: GroupedData[] = Object.entries(catMap)
          .sort(([a], [b]) => {
            const ia = categoryOrder.indexOf(a);
            const ib = categoryOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
          })
          .map(([category, subs]) => ({
            category,
            subCategories: Object.entries(subs).map(([name, products]) => ({ name, products }))
          }));

        setGroupedData(sorted);
      }
      setLoading(false);
    };
    fetchData();
  }, [locale]);

  if (loading) return <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LoadingScreen /></div>;

  return (
    <section id="catalog" style={{ background: '#ffffff', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>

        {groupedData.map((group, idx) => (
          <div key={group.category} style={{
            background: idx % 2 === 1 ? '#fafafa' : 'transparent',
            padding: idx === 0 ? '0 0 5rem 0' : '5rem 0',
            borderTop: idx % 2 === 1 ? '1px solid #f0f0f0' : 'none',
            borderBottom: idx % 2 === 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            {/* Main Category Header with Parallax-like decoration */}
            <div style={{ padding: '0 2rem', marginBottom: '3rem', position: 'relative' }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  margin: 0,
                  color: '#000',
                  lineHeight: 0.9,
                  fontFamily: "'Montserrat', sans-serif"
                }}>
                  {group.category}
                </h2>
                <div style={{ marginTop: '0.8rem', maxWidth: '800px', borderLeft: '2px solid #eee', paddingLeft: '1rem' }}>
                  <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                    Nâng tầm không gian sống với công nghệ biến hình đột phá. Thiết kế tinh xảo, chất liệu thượng hạng.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sub-categories - Now using LazyRow for performance */}
            {group.subCategories.map((sub) => (
              <LazyRow key={sub.name} subName={sub.name} products={sub.products} />
            ))}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scroll-nav-btn {
          position: absolute;
          top: 60%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          color: #000;
        }

        .scroll-nav-btn:hover {
          background: #000;
          color: #fff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }

        .scroll-nav-btn:active { transform: translateY(-50%) scale(0.95); }

        .product-card-premium:hover .card-image-wrapper {
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
        }

        .product-card-premium:hover .main-image {
          transform: scale(1.1);
        }

        .product-card-premium:hover .card-overlay {
          opacity: 1;
        }

        .product-card-premium:hover .overlay-content {
           transform: translateY(0) !important;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
          display: flex;
          align-items: flex-end;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 5;
        }

        .discovery-link:hover {
            color: #000 !important;
        }
        
        .discovery-link:hover .lucide {
            transform: translateX(4px);
            transition: transform 0.3s;
        }

        @media (max-width: 768px) {
          .scroll-nav-btn { display: none !important; }
          h2 { font-size: 2.5rem !important; }
          .category-section { padding: 0 1rem !important; }
        }
      `}</style>
    </section>
  );
}
