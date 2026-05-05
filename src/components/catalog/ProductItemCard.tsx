'use client';

import { useState } from 'react';
import { ProductItem } from '@/data/catalogData';
import { motion } from 'framer-motion';

interface ProductItemCardProps {
  item: ProductItem;
}

export default function ProductItemCard({ item }: ProductItemCardProps) {
  const [isExtended, setIsExtended] = useState(false);

  return (
    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee'}} className="product-card-hover">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <motion.img
          key={isExtended ? 'extended' : 'collapsed'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={isExtended ? item.images.extended : item.images.collapsed}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.2)' }}
        />
        
        {item.images.collapsed !== item.images.extended && (
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setIsExtended(false)}
              style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700,
                background: !isExtended ? 'var(--primary)' : 'white',
                color: !isExtended ? 'white' : '#666',
                border: !isExtended ? 'none' : '1px solid #ddd',
                textTransform: 'uppercase'
              }}
            >
              Collapsed
            </button>
            <button
              onClick={() => setIsExtended(true)}
              style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700,
                background: isExtended ? 'var(--primary)' : 'white',
                color: isExtended ? 'white' : '#666',
                border: isExtended ? 'none' : '1px solid #ddd',
                textTransform: 'uppercase'
              }}
            >
              Extended
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', borderTop: '0.5px solid #f0f0f0' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111', letterSpacing: '0.02em' }}>{item.name}</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 2px', fontWeight: 600 }}>SKU: {item.sku}</p>
            <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>Size: {item.dimension}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
