'use client';

import { useState, useEffect } from 'react';
import { catalogData } from '@/data/catalogData';

export default function CatalogMenu() {
  const [activeId, setActiveId] = useState(catalogData[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    catalogData.forEach((line) => {
      const el = document.getElementById(line.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120; // Navbar + Menu height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="catalog-menu-wrapper" style={{
      position: 'sticky',
      top: '70px',
      zIndex: 1050,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      padding: '0.8rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
        {catalogData.map((line) => (
          <button
            key={line.id}
            onClick={() => scrollTo(line.id)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: activeId === line.id ? 'var(--primary)' : '#666',
              borderBottom: activeId === line.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all 0.3s'
            }}
          >
            {line.menuLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
