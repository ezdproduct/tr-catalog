'use client';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactSection() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section id="contact" style={{ padding: '100px 0', background: 'linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)' }}>
      <div className="container">
        <div className="grid grid-2" style={{ gap: '5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('title')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.1rem' }}>
              {t('desc')}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)' }}>
                  <Mail color="var(--primary)" size={24} />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Email Us</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>hello@transformerrobotics.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)' }}>
                  <Phone color="var(--primary)" size={24} />
                </div>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Call Us</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>+1 (888) SMART-HOME</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect" style={{ padding: '3rem', borderRadius: '40px', boxShadow: 'var(--shadow-lg)' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '80px', height: '80px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Send size={40} />
                </div>
                <h3>{t('form.success')}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>{t('form.successDesc')}</p>
                <button onClick={() => setStatus('idle')} className="btn btn-primary" style={{ marginTop: '2rem' }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('form.name')}</label>
                    <input type="text" className="form-input" required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('form.email')}</label>
                    <input type="email" className="form-input" required />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('form.message')}</label>
                  <textarea className="form-input" rows={5} required style={{ resize: 'none' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{ padding: '1rem' }}>
                  {status === 'sending' ? t('form.sending') : t('form.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
