import React from 'react';
import { Sprout, Sun, Moon, Globe, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, lang, setLang, languagesList, isTranslating, content }) {
  const { user, logout } = useAuth();

  return (
    <nav style={{ width: '100%', borderBottom: '1px solid var(--border)', backgroundColor: darkMode ? '#0f172a' : '#ffffff', position: 'sticky', top: 0, zIndex: 100, padding: '1rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--primary)', fontWeight: 900, fontSize: '1.25rem' }} onClick={() => setActiveTab('home')}>
          <Sprout size={24} />
          <span>{content.navTitle}</span>
          {isTranslating && <span style={{ fontSize: '10px', color: '#f59e0b', marginLeft: '6px' }}>• Translating...</span>}
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-tint)', padding: '4px', borderRadius: '10px' }}>
          <button onClick={() => setActiveTab('home')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'home' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'home' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabHome}</button>
          <button onClick={() => setActiveTab('form')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'form' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'form' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabForm}</button>
          <button onClick={() => setActiveTab('dashboard')} style={{ padding: '6px 16px', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'dashboard' ? (darkMode ? '#334155' : '#ffffff') : 'transparent', color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-muted)' }}>{content.tabDashboard}</button>
        </div>

        {/* Global Action Tools & Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-tint)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <Globe size={14} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ background: 'transparent', border: 'none', fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}>
              {languagesList.map(l => <option key={l.code} value={l.code} style={{ color: '#000000' }}>{l.name}</option>)}
            </select>
          </div>

          <button onClick={() => setDarkMode(!darkMode)} style={{ border: '1px solid var(--border)', background: 'var(--bg-tint)', padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Auth Buttons / Status Badge */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: 900 }}>{user.name}</span>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>{user.role}</span>
              </div>
              <button onClick={logout} title="Sign Out" style={{ border: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}>
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setActiveTab('login')} 
                style={{ 
                  border: '1px solid var(--border)', 
                  backgroundColor: activeTab === 'login' ? 'var(--bg-tint)' : 'transparent', 
                  color: 'var(--text-main)', 
                  padding: '7px 12px', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}
              >
                <LogIn size={13} />
                <span>Log In</span>
              </button>

              <button 
                onClick={() => setActiveTab('register')} 
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '7px 12px', 
                  borderRadius: '8px', 
                  fontSize: '12px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}
              >
                <UserPlus size={13} />
                <span>Register</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </nav>
  );
}