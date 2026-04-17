
'use client';

import React from 'react';

export default function Loading() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            userSelect: 'none'
        }}>
            <div style={{ position: 'relative', marginBottom: '3rem' }}>
                {/* Orbiting rings */}
                <div className="orbit-ring-1"></div>
                <div className="orbit-ring-2"></div>

                {/* Main Spinner Ring */}
                <div className="main-spinner"></div>

                {/* Logo in Center */}
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
                            width: '60px',
                            height: 'auto',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            {/* Cinematic progress line at bottom */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                <div className="progress-line"></div>
            </div>

            <style jsx>{`
        .orbit-ring-1 {
          position: absolute;
          inset: -20px;
          border-top: 1px solid rgba(185, 28, 28, 0.2);
          border-bottom: 1px solid rgba(185, 28, 28, 0.2);
          border-radius: 50%;
          animation: spin 3s linear infinite;
        }
        .orbit-ring-2 {
          position: absolute;
          inset: -20px;
          border-left: 1px solid rgba(185, 28, 28, 0.1);
          border-right: 1px solid rgba(185, 28, 28, 0.1);
          border-radius: 50%;
          animation: spin 5s linear infinite reverse;
        }
        .main-spinner {
          width: 120px;
          height: 120px;
          border: 2px solid rgba(185, 28, 28, 0.1);
          border-top: 2px solid #b91c1c;
          border-radius: 50%;
          animation: spin 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
        }
        .progress-line {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, transparent, #b91c1c, transparent);
          animation: loadingLine 2.5s infinite ease-in-out;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes loadingLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}
