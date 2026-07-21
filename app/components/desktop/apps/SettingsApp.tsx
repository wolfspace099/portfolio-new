'use client';

import { useEffect, useState } from 'react';
import {
  ACCENTS,
  Scheme,
  applyScheme,
  applyAccent,
  getSavedScheme,
  getSavedAccentId,
} from '@/lib/appearance';

export default function SettingsApp() {
  const [scheme, setScheme] = useState<Scheme>('dark');
  const [accentId, setAccentId] = useState('blue');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- saved values live in localStorage (client-only)
    setScheme(getSavedScheme());
    setAccentId(getSavedAccentId());
  }, []);

  function pickScheme(s: Scheme) {
    applyScheme(s);
    setScheme(s);
  }

  function pickAccent(id: string) {
    const a = ACCENTS.find(a => a.id === id);
    if (!a) return;
    applyAccent(a);
    setAccentId(id);
  }

  return (
    <div className="kapp settings-app">
      <section className="set-block">
        <h2 className="set-title">Color scheme</h2>
        <div className="set-schemes">
          {(['dark', 'light'] as Scheme[]).map(s => (
            <button
              key={s}
              className={`set-scheme set-scheme-${s}${scheme === s ? ' active' : ''}`}
              onClick={() => pickScheme(s)}
            >
              <span className="set-scheme-preview" />
              <span className="set-scheme-name">{s === 'dark' ? 'Breeze Dark' : 'Breeze Light'}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="set-block">
        <h2 className="set-title">Accent color</h2>
        <div className="set-accents">
          {ACCENTS.map(a => (
            <button
              key={a.id}
              className={`set-accent${accentId === a.id ? ' active' : ''}`}
              style={{ ['--swatch' as string]: a.color }}
              onClick={() => pickAccent(a.id)}
              title={a.name}
              aria-label={a.name}
            >
              <span className="set-accent-dot" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
