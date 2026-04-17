
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Link } from '@/routing';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function OtherProductsCarousel({ currentId }: { currentId: string }) {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchOthers = async () => {
            const { data } = await supabase
                .from('products')
                .select('*, categories(name)')
                .neq('id', currentId)
                .limit(10);
            if (data) setProducts(data);
        };
        if (currentId) fetchOthers();
    }, [currentId]);

    if (products.length === 0) return null;

    return (
        <section style={{ padding: '80px 0', background: '#f8fafc', overflow: 'hidden' }}>
            <div className="container" style={{ maxWidth: '1600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', padding: '0 1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                            Sản phẩm khác
                        </h2>
                        <div style={{ width: '40px', height: '4px', background: '#ef4444', marginTop: '0.8rem' }}></div>
                    </div>
                    <Link href="/catalog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
                        XEM TẤT CẢ <ArrowRight size={16} />
                    </Link>
                </div>

                <div
                    className="no-scrollbar"
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        overflowX: 'auto',
                        padding: '1rem 1.5rem 3rem',
                        scrollSnapType: 'x mandatory'
                    }}
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/catalog/${product.id}`}
                            style={{ textDecoration: 'none', flex: '0 0 350px', scrollSnapAlign: 'start' }}
                        >
                            <motion.div
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'white',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <div style={{ height: '300px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                                    {product.image_urls?.[0] ? (
                                        <img
                                            src={product.image_urls[0]}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
                                        />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                            [ No Image ]
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        {product.categories?.name || 'SẢN PHẨM'}
                                    </span>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                                        {product.name}
                                    </h3>
                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', color: '#333' }}>
                                        Chi tiết <ChevronRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          [style*="flex: 0 0 350px"] { flex: 0 0 280px !important; }
        }
      `}</style>
        </section>
    );
}
