'use client';

import { useState, useEffect, useRef } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import AdminOverlay from './AdminOverlay';
import ThemePanel from './ThemePanel';
import TosPopup from './modals/TosPopup';
import EasterPopup from './modals/EasterPopup';
import BootSequence from './BootSequence';
import { NEON_CYCLE, applyNeonStep, restoreSavedAppearance } from '@/lib/theme';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showEaster, setShowEaster] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [neonActive, setNeonActive] = useState(false);
  const neonRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const neonIdx = useRef(0);

  useEffect(() => {
    if (!sessionStorage.getItem('boot_seen')) {
      setShowBoot(true);
    }
    if (localStorage.getItem('neon_mode') === '1') {
      startNeon();
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

  function startNeon() {
    neonIdx.current = 0;
    applyNeonStep(NEON_CYCLE[0]);
    neonRef.current = setInterval(() => {
      neonIdx.current = (neonIdx.current + 1) % NEON_CYCLE.length;
      applyNeonStep(NEON_CYCLE[neonIdx.current]);
    }, 700);
    setNeonActive(true);
    localStorage.setItem('neon_mode', '1');
  }

  function stopNeon() {
    if (neonRef.current) { clearInterval(neonRef.current); neonRef.current = null; }
    setNeonActive(false);
    localStorage.removeItem('neon_mode');
    restoreSavedAppearance();
  }

  function toggleNeon() {
    if (neonActive) stopNeon();
    else startNeon();
  }

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

      {showTheme && (
        <ThemePanel
          onClose={() => setShowTheme(false)}
          neonActive={neonActive}
          onNeonToggle={toggleNeon}
        />
      )}
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
