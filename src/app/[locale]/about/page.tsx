'use client';
import { useTranslations } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Cpu, Globe, Rocket, Users } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('common');
  const h = useTranslations('hero');

  return (
    <main style={{ background: '#ffffff' }}>
      <Navbar />
      
      {/* Hero */}
      <div style={{ padding: '180px 0 100px', background: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '2rem' }}>About Transformer Robotics</motion.h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9 }}>
            Redefining human-furniture interaction through cutting-edge robotic engineering and timeless design.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="container" style={{ padding: '100px 1.5rem' }}>
        <div className="grid grid-2" style={{ gap: '5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Our Philosophy</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              We believe furniture shouldn't be static. As our lives evolve throughout the day—from deep work to relaxation, from hosting to sleeping—our environment should adapt intelligently.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              By integrating silent high-precision motors and AI sensors, we craft environments that anticipate your needs, optimize your health, and maximize your living space.
            </p>
          </div>
          <div className="glass-effect" style={{ height: '400px', borderRadius: '40px', background: '#f1f5f9' }}></div>
        </div>
      </div>

      {/* Values */}
      <div style={{ background: '#f8fafc', padding: '100px 0' }}>
         <div className="container">
            <div className="grid grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
               <ValueCard icon={<Cpu color="var(--primary)" />} title="Advanced Tech" desc="Aerospace-grade robotic components." />
               <ValueCard icon={<Rocket color="var(--primary)" />} title="Innovation" desc="Constant evolution of smart living." />
               <ValueCard icon={<Users color="var(--primary)" />} title="User-Centric" desc="Designed for the human rhythm." />
               <ValueCard icon={<Globe color="var(--primary)" />} title="Global Impact" desc="Sustainable and space-efficient." />
            </div>
         </div>
      </div>

      <Footer />
    </main>
  );
}

function ValueCard({ icon, title, desc }: any) {
  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '24px', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
       <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          {icon}
       </div>
       <h4 style={{ marginBottom: '1rem' }}>{title}</h4>
       <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}
