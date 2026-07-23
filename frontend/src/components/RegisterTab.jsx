import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowRight, Sprout, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterTab({ setActiveTab, darkMode }) {
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    const userPayload = {
      id: "USR-" + Math.floor(Math.random() * 10000),
      name: fullName,
      email: email,
      phone: phone,
      role: role,
      token: "jwt_mock_token_signature"
    };

    login(userPayload);
    setActiveTab('form'); // Auto redirect user straight to Optimization Form
  };

  return (
    <div className="animate-fade" style={{ width: '100%', maxWidth: '480px', padding: '1rem 0' }}>
      <div style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Sprout size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Create Portal Account</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Register to save field queries and receive automated recommendations
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <User size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input 
                type="text" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
                placeholder="Ramesh Kumar" 
                style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <Mail size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="farmer@kisan.in" 
                style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Phone Number (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <Phone size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="+91 98765 43210" 
                style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', backgroundColor: 'var(--bg-primary)' }}>
              <Lock size={16} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="Create password" 
                style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '13px' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>Account Role Designation</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-main)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="farmer">Farmer / Land Owner</option>
              <option value="agronomist">Agricultural Officer / Agronomist</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)' }}
          >
            <UserPlus size={16} />
            <span>Complete Registration</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          Already have an account?{' '}
          <button 
            onClick={() => setActiveTab('login')} 
            style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', marginLeft: '4px' }}
          >
            Log In Here
          </button>
        </div>

      </div>
    </div>
  );
}