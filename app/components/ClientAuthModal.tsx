'use client';

import { useState } from 'react';
import { useClientAuth } from '@/lib/useClientAuth';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClientAuthModal({ onClose, onSuccess }: Props) {
  const { signIn, signUp } = useClientAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !pass) { setErr('EMAIL AND PASSWORD REQUIRED'); return; }
    if (mode === 'register' && !name) { setErr('NAME REQUIRED'); return; }
    setLoading(true); setErr('');
    const res = mode === 'login'
      ? await signIn(email, pass)
      : await signUp(email, pass, name);
    setLoading(false);
    if (res.error) { setErr(res.error.toUpperCase()); return; }
    onSuccess();
  }

  return (
    <div className="auth-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="win auth-win">
        <div className="win-titlebar">
          <span className="win-title">
            {mode === 'login' ? 'LOGIN' : 'REGISTER'}<span className="dim">.EXE</span>
          </span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">CLIENT PORTAL</div>

          {mode === 'register' && (
            <div className="field" style={{ marginBottom: '16px' }}>
              <label>NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div className="field" style={{ marginBottom: '16px' }}>
            <label>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} placeholder="you@email.com" />
          </div>
          <div className="field" style={{ marginBottom: '20px' }}>
            <label>PASSWORD</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} placeholder="••••••••" />
          </div>

          <button className="form-submit" onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginBottom: '12px' }}>
            {loading ? 'LOADING...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>

          <button className="auth-switch-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
            {mode === 'login' ? '> NO ACCOUNT? REGISTER' : '> HAVE AN ACCOUNT? LOGIN'}
          </button>

          {err && <p className="admin-err show" style={{ marginTop: '12px' }}>{err}</p>}
        </div>
      </div>
    </div>
  );
}
