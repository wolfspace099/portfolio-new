'use client';

import { useEffect, useState } from 'react';
import { AppIcon, AppId } from '@/lib/apps';
import Launcher, { LeaveKind } from './Launcher';
import type { WinState } from './Window';

interface Props {
  windows: WinState[];
  focusedKey: number | null;
  onOpen: (id: AppId) => void;
  onTaskClick: (key: number) => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onLeave: (kind: LeaveKind) => void;
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock starts client-side to avoid hydration mismatch
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <div className="panel-clock" aria-hidden="true" />;
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="panel-clock">
      <span className="panel-time">{time}</span>
      <span className="panel-date">{date}</span>
    </div>
  );
}

export default function Panel({
  windows, focusedKey, onOpen, onTaskClick, onOpenSettings, onOpenAdmin, onLeave,
}: Props) {
  const [launcherOpen, setLauncherOpen] = useState(false);

  return (
    <>
      {launcherOpen && (
        <Launcher
          onOpen={id => { onOpen(id); setLauncherOpen(false); }}
          onLeave={kind => { onLeave(kind); setLauncherOpen(false); }}
          onClose={() => setLauncherOpen(false)}
        />
      )}
      <footer className="panel">
        <button
          className={`panel-launcher${launcherOpen ? ' active' : ''}`}
          onClick={() => setLauncherOpen(o => !o)}
          aria-label="Application launcher"
        >
          <AppIcon id="launcher" size={22} />
        </button>

        <div className="panel-tasks">
          {windows.map(w => (
            <button
              key={w.key}
              className={`panel-task${focusedKey === w.key && !w.minimized ? ' active' : ''}`}
              onClick={() => onTaskClick(w.key)}
              title={w.title}
            >
              <AppIcon id={w.appId} size={16} />
              <span className="panel-task-label">{w.title}</span>
            </button>
          ))}
        </div>

        <div className="panel-tray">
          <button className="panel-tray-btn" onClick={onOpenSettings} aria-label="Settings" title="Settings">
            <AppIcon id="settings" size={18} />
          </button>
          <button className="panel-tray-btn panel-admin" onClick={onOpenAdmin} aria-label="Admin" title="Admin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </button>
          <Clock />
        </div>
      </footer>
    </>
  );
}
