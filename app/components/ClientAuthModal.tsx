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
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !pass) { setErr('EMAIL AND PASSWORD REQUIRED'); return; }
    if (mode === 'register' && !name) { setErr('NAME REQUIRED'); return; }
    setLoading(true); setErr(''); setNotice('');

    if (mode === 'login') {
      const res = await signIn(email, pass);
      setLoading(false);
      if (res.error) { setErr(res.error); return; }
      onSuccess();
    } else {
      const res = await signUp(email, pass, name);
      setLoading(false);
      if (res.error) { setErr(res.error); return; }
      if (res.confirm) {
        setNotice('ACCOUNT CREATED — CHECK YOUR EMAIL TO CONFIRM, THEN LOG IN.');
        setMode('login');
        setPass('');
        return;
      }
      onSuccess();
    }
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

          {notice && <p className="auth-notice">{notice}</p>}

          {mode === 'register' && (
            <div className="field auth-field">
              <label>NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
          )}
          <div className="field auth-field">
            <label>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} placeholder="you@email.com" />
          </div>
          <div className="field auth-field-last">
            <label>PASSWORD</label>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }} placeholder="••••••••" />
          </div>

          <button className="form-submit auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'LOADING...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>

          <button className="auth-switch-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); setNotice(''); }}>
            {mode === 'login' ? '> NO ACCOUNT? REGISTER' : '> HAVE AN ACCOUNT? LOGIN'}
          </button>

          {err && <p className="admin-err show auth-err">{err}</p>}
        </div>
      </div>
    </div>
  );
}
