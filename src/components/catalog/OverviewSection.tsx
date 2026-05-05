import { useState } from 'react';
import { ColorVariant, Hotspot } from '@/data/catalogData';
import HotspotImage from './HotspotImage';
import { motion, AnimatePresence } from 'framer-motion';

interface OverviewSectionProps {
  variant: ColorVariant;
  lineName: string;
}

export default function OverviewSection({ variant, lineName }: OverviewSectionProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  return (
    <section className="catalog-section overview" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <div className="overview-header" style={{ padding: '4rem 2rem 2rem', textAlign: 'center' }}>
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
          color: '#888', 
          fontWeight: 700, 
          letterSpacing: '0.05em',
          textTransform: 'uppercase', 
          margin: '0 0 0.5rem' 
        }}>
          {lineName}
        </h2>
        <span style={{ 
          color: '#000', 
          fontWeight: 800, 
          letterSpacing: '0.1em', 
          fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
          textTransform: 'uppercase', 
          display: 'block' 
        }}>
          {variant.colorName}
        </span>
      </div>
      
      {/* Main Content: 2 Columns */}
      <div className="main-content" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        width: '100%',
        background: '#fff'
      }}>
        {/* Left Column: Image with Hotspots */}
        <div style={{ flex: '1 1 50%', position: 'relative', overflow: 'hidden' }}>
          <HotspotImage 
            src={variant.overviewImage} 
            hotspots={variant.hotspots} 
            activeHotspotId={selectedHotspot?.targetItemId}
            onHotspotClick={(spot) => setSelectedHotspot(spot)}
            onBgClick={() => setSelectedHotspot(null)}
          />
        </div>

        {/* Right Column: Information Panel */}
        <div 
          className="info-panel"
          style={{ 
            flex: '1 1 50%', 
            padding: '2rem 4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="wait">
            {selectedHotspot ? (
              (() => {
                const activeItem = variant.items.find(i => i.id === selectedHotspot.targetItemId);
                const hasExtended = activeItem && activeItem.images.collapsed !== activeItem.images.extended;
                
                return (
                  <motion.div
                    key="detail-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="product-images-row" style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      marginBottom: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <div className="product-image-wrapper" style={{ 
                        maxWidth: hasExtended ? '220px' : '300px', 
                        width: '100%',
                        height: '240px', 
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={activeItem?.images.collapsed || selectedHotspot.quickInfo.thumbnail} 
                          alt={selectedHotspot.quickInfo.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                        />
                      </div>
                      {hasExtended && (
                        <div className="product-image-wrapper" style={{ 
                          maxWidth: '220px', 
                          width: '100%',
                          height: '240px', 
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={activeItem?.images.extended} 
                            alt={`${selectedHotspot.quickInfo.name} Extended`}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)' }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>
                      {selectedHotspot.quickInfo.name}
                    </h3>
                    
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>SKU</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>{selectedHotspot.quickInfo.sku}</div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Size</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>{selectedHotspot.quickInfo.dimension}</div>
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              <motion.div
                key="overview-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <p 
                  style={{ 
                    fontSize: '0.95rem', 
                    lineHeight: 1.6, 
                    color: '#555', 
                    margin: 0,
                    fontWeight: 400,
                    whiteSpace: 'pre-line'
                  }}
                  dangerouslySetInnerHTML={{ __html: variant.description || "" }}
                />
                
                <div className="overview-thumbnails" style={{ marginTop: '2.5rem', display: 'flex', gap: '0.5rem' }}>
                   {variant.items.slice(0, 4).map((item, i) => (
                     <div key={i} className="thumb-box" style={{ width: '100px', height: '100px', overflow: 'hidden', }}>
                       <img src={item.images.collapsed} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.1)', transition: 'transform 0.3s ease' }} />
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .info-panel :global(strong) {
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .overview-header {
            padding: 2.5rem 1rem 1rem !important;
          }
          .overview-header h2 {
            font-size: 1.08rem !important;
            line-height: 1.2 !important;
            max-width: 280px;
            margin: 0 auto 0.5rem !important;
          }
          .overview-header span {
            font-size: 1rem !important;
          }
          .main-content {
            flex-direction: column !important;
          }
          .main-content > div {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .info-panel {
            padding: 2rem 1rem !important;
          }
          .product-images-row {
            flex-wrap: nowrap !important;
            gap: 0.5rem !important;
          }
          .product-image-wrapper {
            height: 150px !important;
            max-width: 50% !important;
          }
          .overview-thumbnails {
            gap: 0.5rem !important;
            margin-top: 1.5rem !important;
            justify-content: center;
          }
          .thumb-box {
            width: 70px !important;
            height: 70px !important;
          }
        }
      `}</style>
    </section>

  );
}
