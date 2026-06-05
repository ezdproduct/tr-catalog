import { useState, useRef } from 'react';
import { ColorVariant, Hotspot } from '@/data/catalogData';
import HotspotImage from './HotspotImage';
import { motion, AnimatePresence } from 'framer-motion';

interface OverviewSectionProps {
  variant: ColorVariant;
  lineName: string;
}

export default function OverviewSection({ variant, lineName }: OverviewSectionProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showWoodTooltip, setShowWoodTooltip] = useState(false);
  const isWalnut = variant.colorName.toLowerCase().includes('walnut') || variant.id.toLowerCase().includes('acacia');
  const woodImage = isWalnut ? '/american-walnut.jpg' : '/scandinavian-oak.jpg';

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowWoodTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowWoodTooltip(false);
    }, 150);
  };

  const tooltipData = isWalnut ? {
    title: "American Walnut: Rich. Sophisticated. Timeless.",
    desc: "Elevate your space with the deep, luxurious warmth of premium American Walnut. Celebrated for its dramatic dark tones and fluid, wavy grain, this elite hardwood adds instant prestige and architectural contrast to any modern interior.",
    bullets: [
      { label: "Elite Aesthetic", text: "Deep chocolate-brown tones with striking, natural variegation." },
      { label: "Superior Workability", text: "Exceptionally stable, smooth-milled wood with high shock resistance." },
      { label: "Premium Application", text: "The gold standard for luxury cabinetry, executive furniture, and high-end B2B spaces." }
    ],
    footer: "Unmatched depth meets high-end sophistication."
  } : {
    title: "Scandinavian Oak: Minimalist Luxury, Built to Last.",
    desc: "Elevate your space with the timeless elegance of Nordic design. This premium European hardwood features bright, straw-blonde tones and a clean, linear grain—perfectly balancing organic warmth with modern minimalism.",
    bullets: [
      { label: "Premium Aesthetic", text: "Luminous, pale palette treated to resist yellowing." },
      { label: "Commercial Grade", text: "High-density wood built for heavy wear and scratch resistance." },
      { label: "Versatile Design", text: "The ultimate choice for luxury flooring, furniture, and B2B spaces." }
    ],
    footer: "Understated luxury meets uncompromising durability."
  };

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
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="wood-tooltip-container">
                    <div 
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundImage: `url(${woodImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '1.5px solid #eaeaea',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }} 
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#333' }}>
                        {isWalnut ? "American Walnut" : "Scandinavian Oak"}
                      </span>
                    </div>

                    <AnimatePresence>
                      {showWoodTooltip && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="wood-tooltip"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <img src={woodImage} alt={variant.colorName} className="wood-tooltip-image" />
                          <div className="wood-tooltip-content">
                            <h4 className="wood-tooltip-title">{tooltipData.title}</h4>
                            <p className="wood-tooltip-desc">{tooltipData.desc}</p>
                            <ul className="wood-tooltip-list">
                              {tooltipData.bullets.map((bullet, idx) => (
                                <li key={idx} className="wood-tooltip-item">
                                  <span className="wood-tooltip-bullet" />
                                  <span className="wood-tooltip-text">
                                    <strong className="wood-tooltip-strong">{bullet.label}:</strong> {bullet.text}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <p className="wood-tooltip-footer">{tooltipData.footer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
        .wood-tooltip-container {
          position: relative;
          display: block;
          width: 100%;
        }
        :global(.wood-tooltip) {
          position: absolute;
          bottom: 125%;
          left: 0;
          right: 0;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          border: 1px solid #eaeaea;
          padding: 1rem;
          display: flex;
          align-items: stretch;
          gap: 0.75rem;
          z-index: 100;
          text-align: left;
        }

        :global(.wood-tooltip-image) {
          width: 200px;
          border-radius: 12px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        :global(.wood-tooltip-content) {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        :global(.wood-tooltip-title) {
          font-weight: 700;
          font-size: 0.95rem;
          color: #111;
          margin: 0;
          line-height: 1.4;
        }
        :global(.wood-tooltip-desc) {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }
        :global(.wood-tooltip-list) {
          list-style-type: none;
          padding: 0;
          margin: 0.15rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        :global(.wood-tooltip-item) {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.85rem;
          line-height: 1.4;
        }
        :global(.wood-tooltip-bullet) {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: 1.5px solid #555;
          margin-top: 5px;
          flex-shrink: 0;
        }
        :global(.wood-tooltip-text) {
          color: #333;
        }
        :global(.wood-tooltip-strong) {
          font-weight: 700;
          color: #111;
        }
        :global(.wood-tooltip-footer) {
          font-weight: 700;
          font-size: 0.85rem;
          color: #111;
          margin: 0;
          margin-top: 0.25rem;
        }
        @media (max-width: 768px) {
          :global(.wood-tooltip) {
            width: auto;
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 0.75rem;
            padding: 1rem;
            max-height: none;
          }

          :global(.wood-tooltip-image) {
            width: 100%;
            height: 110px;
          }
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
