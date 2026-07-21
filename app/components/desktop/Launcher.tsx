'use client';

import { useEffect, useRef, useState } from 'react';
import { APPS, AppId, AppIcon } from '@/lib/apps';
import { PROFILE } from '@/lib/data';

export type LeaveKind = 'logout' | 'restart' | 'shutdown';

interface Props {
  onOpen: (id: AppId) => void;
  onLeave: (kind: LeaveKind) => void;
  onClose: () => void;
}

export default function Launcher({ onOpen, onLeave, onClose }: Props) {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [onClose]);

  const results = APPS.filter(a => a.title.toLowerCase().includes(query.toLowerCase().trim()));

  return (
    <div className="krun" ref={ref} role="menu">
      <div className="krun-head">
        <div className="krun-avatar">{PROFILE.handle.charAt(0)}</div>
        <div className="krun-id">
          <span className="krun-name">{PROFILE.name}</span>
          <span className="krun-sub">{PROFILE.title}</span>
        </div>
      </div>

      <input
        className="krun-search"
        placeholder="Search…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus
        aria-label="Search applications"
      />

      <div className="krun-apps">
        {results.map(a => (
          <button key={a.id} className="krun-app" onClick={() => onOpen(a.id)} role="menuitem">
            <span className="krun-app-icon"><AppIcon id={a.id} size={26} /></span>
            <span className="krun-app-label">{a.title}</span>
          </button>
        ))}
        {!results.length && <p className="krun-empty">No applications found</p>}
      </div>

      <div className="krun-foot">
        <button className="krun-leave" onClick={() => onLeave('logout')}>
          <AppIcon id="power" size={16} /> Log out
        </button>
        <button className="krun-leave" onClick={() => onLeave('restart')}>Restart</button>
        <button className="krun-leave" onClick={() => onLeave('shutdown')}>Shut down</button>
      </div>
    </div>
  );
}
