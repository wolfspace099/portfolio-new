'use client';

import { useState, useEffect } from 'react';
import { THEMES, BG_PRESETS, applyTheme, applyBg, getSavedThemeId, getSavedBgId } from '@/lib/theme';

interface Props {
  onClose: () => void;
  neonActive: boolean;
  onNeonToggle: () => void;
}

export default function ThemePanel({ onClose, neonActive, onNeonToggle }: Props) {
  const [activeId, setActiveId] = useState('green');
  const [activeBgId, setActiveBgId] = useState('void');

  useEffect(() => {
    setActiveId(getSavedThemeId());
    setActiveBgId(getSavedBgId());
  }, []);

  function pick(id: string) {
    const t = THEMES.find(t => t.id === id);
    if (!t) return;
    applyTheme(t);
    setActiveId(id);
  }

  function pickBg(id: string) {
    const p = BG_PRESETS.find(p => p.id === id);
    if (!p) return;
    applyBg(p);
    setActiveBgId(id);
  }

  return (
    <div className="theme-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="win theme-win">
        <div className="win-titlebar">
          <span className="win-title">THEME<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">PICK A COLOUR</div>
          <div className="theme-grid">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-swatch${activeId === t.id ? ' active' : ''}`}
                style={{ '--swatch-color': t.accent } as React.CSSProperties}
                onClick={() => pick(t.id)}
              >
                <span className="theme-swatch-dot" />
                <span className="theme-swatch-name">{t.name}</span>
              </button>
            ))}
          </div>

          <div className="win-label win-label-mt">BACKGROUND</div>
          <div className="theme-bg-grid">
            {BG_PRESETS.map(p => (
              <button
                key={p.id}
                className={`theme-swatch bg-swatch${activeBgId === p.id ? ' active' : ''}`}
                style={{ '--swatch-color': p.swatch } as React.CSSProperties}
                onClick={() => pickBg(p.id)}
              >
                <span className="theme-swatch-dot" />
                <span className="theme-swatch-name">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="win-label win-label-mt">SPECIAL</div>
          <button
            className={`theme-neon-btn${neonActive ? ' active' : ''}`}
            onClick={onNeonToggle}
          >
            <span className="theme-neon-label">NEON</span>
            <span className="theme-neon-status">{neonActive ? 'ON' : 'OFF'}</span>
          </button>
          {neonActive && (
            <p className="theme-neon-hint">BG CYCLING — BLACK / WHITE / GREEN / PINK</p>
          )}
        </div>
      </div>
    </div>
  );
}
