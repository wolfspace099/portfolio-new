'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  onAdminClick: () => void;
  onThemeClick: () => void;
}

const LINKS = [
  { href: '/about',   label: 'ABOUT'   },
  { href: '/work',    label: 'WORK'    },
  { href: '/skills',  label: 'SKILLS'  },
  { href: '/reviews', label: 'REVIEWS' },
  { href: '/quote',   label: 'QUOTE'   },
];

export default function Nav({ onAdminClick, onThemeClick }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="win-titlebar">
        <span className="win-title">
          <a className="topbar-logo topbar-logo-link" href="/">
            <span>CQT.EXE</span>
          </a>
        </span>
        <nav>
          <ul className="topbar-nav">
            {LINKS.map(l => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="topbar-actions">
          <button className="topbar-theme" onClick={onThemeClick}>:3</button>
          <button className="topbar-admin" onClick={onAdminClick}>ADMIN.EXE</button>
          <button
            className={`mob-menu-btn${open ? ' active' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? '[X]' : '[=]'}
          </button>
        </div>
      </div>

      {open && (
        <div className="mob-dropdown">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`mob-nav-link${pathname === l.href ? ' active' : ''}`}
            >
              <span className="mob-nav-arrow">&gt;</span>
              {l.label}
            </a>
          ))}
          <div className="mob-dropdown-actions">
            <button className="mob-dropdown-btn" onClick={() => { setOpen(false); onThemeClick(); }}>
              :3 THEME
            </button>
            <button className="mob-dropdown-btn" onClick={() => { setOpen(false); onAdminClick(); }}>
              ADMIN.EXE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
