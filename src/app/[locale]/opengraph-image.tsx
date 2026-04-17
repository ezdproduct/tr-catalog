
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Transformer Robotics Product Catalog';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    // Array of premium images for rotation as requested
    const images = [
        'https://pub-3b3a4a779a3c4738b5f0d320cb3645b5.r2.dev/Outdoor%20Dining%20Set/Outdoor%20Dining%20Set%20-%20The%20Family/Dark%20Walnut%20-%20Black%20Frame/Transformer-outdoor-table-dark-oak-the-family-3-panels-2-models-4x3.webp',
        'https://transformertable.com/cdn/shop/files/PSD-rafale-hp.jpg?v=1771359656&width=2000',
        'https://pub-83ec56d99c0444bda304e97abb4edd21.r2.dev/Brand%20TR/hero-banner.jpg',
        'https://pub-83ec56d99c0444bda304e97abb4edd21.r2.dev/Brand%20TR/2.png'
    ];

    // Rotate based on current time (minutes) to ensure variety while keeping some stability for short-term caching
    const index = new Date().getMinutes() % images.length;
    const selectedImage = images[index];

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#000',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <img
                    src={selectedImage}
                    alt="Banner"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 60,
                        left: 60,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <p
                        style={{
                            fontSize: 68,
                            fontWeight: 900,
                            color: 'white',
                            margin: 0,
                            letterSpacing: '-0.03em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Transformer Robotics
                    </p>
                    <p
                        style={{
                            fontSize: 34,
                            fontWeight: 400,
                            color: '#CF4545',
                            margin: '12px 0 0',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        #1 Modular Furniture in the World
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
