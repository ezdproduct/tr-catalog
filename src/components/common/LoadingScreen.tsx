
'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '400px',
      backgroundColor: '#f4f4f4',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      userSelect: 'none'
    }}>
      <p style={{
        fontSize: '1rem',
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
        style={{ width: '120px', height: 'auto', mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
