
'use client';

import React from 'react';

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#f4f4f4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <p style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '0.2em',
        color: '#1a1a1a',
        textTransform: 'uppercase',
        margin: 0,
        fontFamily: 'sans-serif',
      }}>
        Transformer Robotics
      </p>
      <img
        src="/loading.webp"
        alt="Loading..."
        style={{ width: '192px', height: 'auto', mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
