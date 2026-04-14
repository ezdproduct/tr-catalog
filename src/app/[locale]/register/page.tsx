'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Eye, EyeOff, UserPlus, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/routing';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/login');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect"
          style={{ 
            width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('createAccount')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Join the future of robotics</p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('email')}</label>
                <input type="email" className="form-input" required placeholder="you@example.com" />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('password')}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
             </div>

             <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                <UserPlus size={20} /> {t('signUp')}
             </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {t('hasAccount')} <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('loginHere')}</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
