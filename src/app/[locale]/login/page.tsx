'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Eye, EyeOff, LogIn, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/routing';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const t = useTranslations('auth');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Simulate Auth or use real Supabase Auth
      // For this demo, we'll check if it's the admin email
      if (email === 'admin@transformer.com') {
         // In a real app, you'd do: await supabase.auth.signInWithPassword({ email, password })
         // Then check the profile.
         router.push('/admin/dashboard');
      } else {
         router.push('/');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect"
          style={{ 
            width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t('welcome')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Sign in to access your smart furniture</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('email')}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  placeholder="admin@transformer.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('password')}</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
             </div>

             <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem', marginTop: '1rem' }}>
                <LogIn size={20} /> {loading ? 'Checking credentials...' : t('signIn')}
             </button>

             <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
                <span style={{ background: 'white', padding: '0 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>OR</span>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border)' }}></div>
             </div>

             <button type="button" className="btn btn-outline" style={{ padding: '1rem' }}>
                <Globe size={20} /> Continue with Google
             </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {t('noAccount')} <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('signUp')}</Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
