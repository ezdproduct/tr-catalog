
'use client';

import React from 'react';

export default function LoadingScreen() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            userSelect: 'none'
        }}>
            <div style={{ position: 'relative' }}>
                <div className="orbit-ring-1"></div>
                <div className="main-spinner"></div>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/logo-do.svg"
                        alt="Loading"
                        style={{
                            width: '40px',
                            height: 'auto',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        .orbit-ring-1 {
          position: absolute;
          inset: -15px;
          border-top: 1px solid rgba(185, 28, 28, 0.2);
          border-bottom: 1px solid rgba(185, 28, 28, 0.2);
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }
        .main-spinner {
          width: 80px;
          height: 80px;
          border: 2px solid rgba(185, 28, 28, 0.1);
          border-top: 2px solid #b91c1c;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
