'use client';

import { useState, useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import AdminOverlay from './AdminOverlay';
import ThemePanel from './ThemePanel';
import TosPopup from './modals/TosPopup';
import EasterPopup from './modals/EasterPopup';
import BootSequence from './BootSequence';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showEaster, setShowEaster] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('boot_seen')) {
      setShowBoot(true);
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setShowAdmin(false);
      setShowTheme(false);
      setShowEaster(false);
      setShowTos(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {showBoot && (
        <BootSequence onDone={() => { sessionStorage.setItem('boot_seen', '1'); setShowBoot(false); }} />
      )}

      <main className="page">
        <section className="win top-window">
          <Nav onAdminClick={() => setShowAdmin(true)} onThemeClick={() => setShowTheme(true)} />
        </section>

        {children}

        <Footer onTosClick={() => setShowTos(true)} />
      </main>

      {showTheme && <ThemePanel onClose={() => setShowTheme(false)} />}
      {showAdmin && (
        <AdminOverlay
          onClose={() => setShowAdmin(false)}
          onEaster={() => { setShowAdmin(false); setShowEaster(true); }}
        />
      )}
      {showEaster && <EasterPopup onClose={() => setShowEaster(false)} />}
      {showTos && <TosPopup onClose={() => setShowTos(false)} />}
    </>
  );
}
