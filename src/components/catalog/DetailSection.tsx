import { ColorVariant } from '@/data/catalogData';
import ProductItemCard from './ProductItemCard';

interface DetailSectionProps {
  variant: ColorVariant;
}

export default function DetailSection({ variant }: DetailSectionProps) {
  return (
    <section className="catalog-section detail" style={{ padding: '4rem 0', background: '#fafafa' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PRODUCT DETAILS
          </h3>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary)', marginTop: '0.5rem' }}></div>
        </div>

        <div className="details-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem' 
        }}>
          {variant.items.map((item) => (
            <ProductItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
