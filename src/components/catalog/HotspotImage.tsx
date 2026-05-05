'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotspot } from '@/data/catalogData';
import { X } from 'lucide-react';

interface HotspotImageProps {
  src: string;
  hotspots: Hotspot[];
  activeHotspotId?: string | null;
  onHotspotClick?: (spot: Hotspot) => void;
  onBgClick?: () => void;
}

export default function HotspotImage({ src, hotspots, activeHotspotId, onHotspotClick, onBgClick }: HotspotImageProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
      <img 
        src={src} 
        alt="Overview" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', objectPosition: 'center 85%' }} 
        onClick={() => onBgClick?.()}
      />
      
      {hotspots.map((spot, idx) => {
        const isActive = activeHotspotId === spot.targetItemId;
        const isHovered = hoveredIdx === idx;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              zIndex: isHovered || isActive ? 100 : 10,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <button
              onClick={() => onHotspotClick?.(spot)}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                position: 'relative'
              }}
            >
              {/* Pulsing Waves for Inactive Hotspots */}
              {!isActive && (
                <>
                  <motion.div
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      pointerEvents: 'none'
                    }}
                  />
                  <motion.div
                    animate={{
                      scale: [1, 2],
                      opacity: [0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                    style={{
                      position: 'absolute',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      pointerEvents: 'none'
                    }}
                  />
                </>
              )}

              <motion.div
                whileTap={{ scale: 0.8 }}
                style={{
                  width: isActive ? '18px' : '14px',
                  height: isActive ? '18px' : '14px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  boxShadow: isHovered || isActive ? '0 0 15px rgba(185, 28, 28, 0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  zIndex: 2
                }}
              />
            </button>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    x: '-50%',
                    background: 'white',
                    padding: '8px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    width: '120px',
                    pointerEvents: 'none',
                    border: '1px solid #eee'
                  }}
                >
                  <img 
                    src={spot.quickInfo.thumbnail} 
                    alt={spot.quickInfo.name} 
                    style={{ width: '100px', height: '100px', objectFit: 'contain', background: '#f8f8f8', borderRadius: '8px' }} 
                  />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#333', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {spot.quickInfo.name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
