
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2rem',
                        pointerEvents: 'auto',
                        overflow: 'hidden'
                    }}
                >
                    {/* Main Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', position: 'relative', zIndex: 10 }}>
                        {/* Table Image */}
                        <div style={{ position: 'relative' }}>
                            <img
                                src="/loading.webp"
                                alt="Loading Table"
                                style={{ width: '24rem', maxWidth: '80vw', height: 'auto' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            {/* Filling Logo Container */}
                            <div style={{ position: 'relative', width: '18rem', maxWidth: '70vw' }}>
                                {/* Base Grey Logo */}
                                <img
                                    src="/logo-moi.png"
                                    alt=""
                                    style={{ width: '100%', height: 'auto', filter: 'grayscale(100%)', opacity: 0.2 }}
                                />

                                {/* Filling Red Logo */}
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.8, ease: "linear" }}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        height: '100%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <img
                                        src="/logo-moi.png"
                                        alt=""
                                        style={{
                                            width: '18rem',
                                            maxWidth: 'none',
                                            height: 'auto',
                                            filter: "brightness(0) saturate(100%) invert(35%) sepia(82%) saturate(1455%) hue-rotate(331deg) brightness(85%) contrast(89%)"
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
