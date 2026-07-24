import React, { useState } from 'react';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function LoginTab({ setActiveTab, darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setActiveTab('form');
    }
  };

  return (
    <div className="animate-fade" style={{ width: '100%', maxWidth: '440px', padding: '1rem 0' }}>
      <div style={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem 2rem', boxShadow: 'var(--shadow)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Welcome Back</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Sign in to access AI crop diagnostics</p>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="farmer@kisan.in" style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogIn size={16} />
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          Don't have an account?{' '}
          <button onClick={() => setActiveTab('register')} style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>Register Here</button>
        </div>

      </div>
    </div>
  );
}