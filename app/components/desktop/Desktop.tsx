'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { APPS, AppId, getApp, AppIcon } from '@/lib/apps';
import Window, { WinState } from './Window';
import Panel from './Panel';
import { LeaveKind } from './Launcher';
import AboutApp from './apps/AboutApp';
import WorkApp from './apps/WorkApp';
import SkillsApp from './apps/SkillsApp';
import ContactApp from './apps/ContactApp';
import SettingsApp from './apps/SettingsApp';
import Terminal from './apps/Terminal';
import Reviews from '../Reviews';
import QuoteForm from '../QuoteForm';
import AdminOverlay from '../AdminOverlay';
import BootSequence from '../BootSequence';
import EasterPopup from '../modals/EasterPopup';

const LEAVE_MESSAGES: Record<LeaveKind, { title: string; body: string }> = {
  logout: { title: 'Log out?', body: 'You can’t log out of a portfolio. That’s kind of the point.' },
  restart: { title: 'Restart', body: 'Have you tried turning it off and on again? It’s fine. Everything is fine.' },
  shutdown: { title: 'Shut down', body: 'Nice try — but I’m open for work, so this stays on. Send me a message instead.' },
};

interface Props {
  initialApp?: AppId;
}

export default function Desktop({ initialApp }: Props) {
  const [windows, setWindows] = useState<WinState[]>([]);
  const [focusedKey, setFocusedKey] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showEaster, setShowEaster] = useState(false);
  const [leave, setLeave] = useState<LeaveKind | null>(null);
  const keySeq = useRef(1);
  const zSeq = useRef(10);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const openApp = useCallback((id: AppId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.appId === id);
      const z = ++zSeq.current;
      if (existing) {
        setFocusedKey(existing.key);
        return prev.map(w => (w.key === existing.key ? { ...w, z, minimized: false } : w));
      }
      const def = getApp(id);
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const w = Math.min(def.w, vw - 24);
      const h = Math.min(def.h, vh - 120);
      const cascade = (prev.length % 6) * 26;
      const x = Math.max(12, Math.round((vw - w) / 2) + cascade - 60);
      const y = Math.max(12, Math.round((vh - h - 48) / 3) + cascade);
      const key = keySeq.current++;
      setFocusedKey(key);
      return [...prev, { key, appId: id, title: def.title, x, y, w, h, z, minimized: false, maximized: false }];
    });
  }, []);

  useEffect(() => {
    if (initialApp) openApp(initialApp);
  }, [initialApp, openApp]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- boot flag is client-only (sessionStorage)
    if (!sessionStorage.getItem('boot_seen')) setShowBoot(true);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setShowAdmin(false);
      setShowEaster(false);
      setLeave(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const focus = (key: number) =>
    setWindows(prev => {
      const z = ++zSeq.current;
      setFocusedKey(key);
      return prev.map(w => (w.key === key ? { ...w, z, minimized: false } : w));
    });

  const close = (key: number) => setWindows(prev => prev.filter(w => w.key !== key));
  const minimize = (key: number) => {
    setWindows(prev => prev.map(w => (w.key === key ? { ...w, minimized: true } : w)));
    setFocusedKey(null);
  };
  const toggleMax = (key: number) =>
    setWindows(prev => prev.map(w => (w.key === key ? { ...w, maximized: !w.maximized } : w)));
  const move = (key: number, x: number, y: number) =>
    setWindows(prev => prev.map(w => (w.key === key ? { ...w, x, y } : w)));

  const taskClick = (key: number) => {
    const w = windows.find(w => w.key === key);
    if (!w) return;
    if (focusedKey === key && !w.minimized) minimize(key);
    else focus(key);
  };

  function renderApp(id: AppId) {
    switch (id) {
      case 'about': return <AboutApp />;
      case 'work': return <WorkApp onOpenQuote={() => openApp('quote')} />;
      case 'skills': return <SkillsApp />;
      case 'contact': return <ContactApp />;
      case 'settings': return <SettingsApp />;
      case 'terminal': return <Terminal onOpen={openApp} />;
      case 'reviews': return <Reviews />;
      case 'quote': return <QuoteForm />;
    }
  }

  const desktopIcons = APPS.filter(a => a.onDesktop);

  return (
    <div className="pdesk">
      {showBoot && (
        <BootSequence onDone={() => { sessionStorage.setItem('boot_seen', '1'); setShowBoot(false); }} />
      )}

      <div className="pdesk-wall" aria-hidden="true" />

      <div className="pdesk-note">
        <span className="pdesk-note-bar">note.txt</span>
        <p className="pdesk-note-body">
          No microslop.<br />No copilot.<br /><span className="pdesk-note-hi">Just privacy here.</span>
        </p>
      </div>

      <div className="pdesk-icons">
        {desktopIcons.map(a => (
          <button
            key={a.id}
            className="dicon"
            onDoubleClick={() => !mobile && openApp(a.id)}
            onClick={() => mobile && openApp(a.id)}
            aria-label={`Open ${a.title}`}
          >
            <span className="dicon-glyph"><AppIcon id={a.id} size={30} /></span>
            <span className="dicon-label">{a.title}</span>
          </button>
        ))}
      </div>

      {windows.map(w => (
        <Window
          key={w.key}
          win={w}
          focused={focusedKey === w.key}
          mobile={mobile}
          onFocus={() => focus(w.key)}
          onClose={() => close(w.key)}
          onMinimize={() => minimize(w.key)}
          onToggleMax={() => toggleMax(w.key)}
          onMove={(x, y) => move(w.key, x, y)}
        >
          {renderApp(w.appId)}
        </Window>
      ))}

      <Panel
        windows={windows}
        focusedKey={focusedKey}
        onOpen={openApp}
        onTaskClick={taskClick}
        onOpenSettings={() => openApp('settings')}
        onOpenAdmin={() => setShowAdmin(true)}
        onLeave={setLeave}
      />

      {leave && (
        <div className="leave-overlay" onClick={() => setLeave(null)}>
          <div className="leave-dialog" onClick={e => e.stopPropagation()}>
            <h2>{LEAVE_MESSAGES[leave].title}</h2>
            <p>{LEAVE_MESSAGES[leave].body}</p>
            <button className="leave-ok" onClick={() => setLeave(null)}>Stay</button>
          </div>
        </div>
      )}

      {showAdmin && (
        <AdminOverlay
          onClose={() => setShowAdmin(false)}
          onEaster={() => { setShowAdmin(false); setShowEaster(true); }}
        />
      )}
      {showEaster && <EasterPopup onClose={() => setShowEaster(false)} />}
    </div>
  );
}
