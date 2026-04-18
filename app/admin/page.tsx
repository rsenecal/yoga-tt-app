'use client';

import React, { useState, useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';
import { Flower2, Eye, EyeOff, Lock } from 'lucide-react';

const SESSION_KEY = 'ytb_admin_auth';

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [show,     setShow]     = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Check if already authenticated in this session
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved === 'true') setAuthed(true);
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAuthed(true);
      } else {
        const d = await res.json();
        setError(d.error || 'Incorrect password');
        setPassword('');
      }
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPassword('');
  };

  if (checking) return null;

  if (authed) return (
    <div>
      {/* Logout bar */}
      <div style={{
        position: 'fixed', top: 0, right: 0, zIndex: 200,
        padding: '8px 16px',
      }}>
        <button
          onClick={handleLogout}
          style={{
            fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
            padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Log out
        </button>
      </div>
      <AdminPanel />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#2c2c2a', fontFamily: "'DM Sans', system-ui, sans-serif",
      padding: 24,
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <div style={{
        width: '100%', maxWidth: 400,
        background: '#fff9f4', borderRadius: 24,
        padding: '48px 40px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#b85c38', margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Flower2 size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#2c2c2a', margin: '0 0 6px' }}>
            YTB Admin
          </h1>
          <p style={{ fontSize: 13, color: '#6b6b68', margin: 0 }}>
            Teacher Training Control Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6b6b68', marginBottom: 8, fontWeight: 500 }}>
              Admin Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#c4b49e' }}>
                <Lock size={15} />
              </div>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                autoFocus
                style={{
                  width: '100%', padding: '11px 44px 11px 42px',
                  border: `1.5px solid ${error ? '#dc2626' : '#e8ddd0'}`,
                  borderRadius: 12, fontSize: 15, color: '#2c2c2a',
                  background: '#faf7f2', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#c4b49e', padding: 4 }}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 8 }}>{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
              background: loading || !password ? '#c5d9c2' : '#4a6741',
              color: '#fff', fontSize: 14, fontWeight: 500,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'background 0.15s',
            }}
          >
            {loading ? 'Verifying…' : 'Enter Admin Panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#c4b49e', marginTop: 24 }}>
          Session expires when you close the browser tab.
        </p>
      </div>
    </div>
  );
}
