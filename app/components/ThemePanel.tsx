'use client';

import { useState, useEffect } from 'react';
import { THEMES, applyTheme, getSavedThemeId } from '@/lib/theme';

interface Props {
  onClose: () => void;
}

export default function ThemePanel({ onClose }: Props) {
  const [activeId, setActiveId] = useState('green');

  useEffect(() => {
    setActiveId(getSavedThemeId());
  }, []);

  function pick(id: string) {
    const t = THEMES.find(t => t.id === id);
    if (!t) return;
    applyTheme(t);
    setActiveId(id);
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
        </div>
      </div>
    </div>
  );
}
