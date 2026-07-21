import type { ReactNode } from 'react'

export type AppId =
  | 'about'
  | 'work'
  | 'skills'
  | 'terminal'
  | 'reviews'
  | 'quote'
  | 'contact'
  | 'settings'

export type AppDef = {
  id: AppId
  title: string
  desc: string
  w: number
  h: number
  onDesktop: boolean
}

export const APPS: AppDef[] = [
  { id: 'about',    title: 'About Me',    desc: 'Who I am',              w: 680, h: 480, onDesktop: true },
  { id: 'work',     title: 'Projects',    desc: 'Things I have built',   w: 760, h: 560, onDesktop: true },
  { id: 'skills',   title: 'Skills',      desc: 'Tools and stack',       w: 640, h: 500, onDesktop: true },
  { id: 'terminal', title: 'Terminal',    desc: 'Konsole',               w: 660, h: 420, onDesktop: true },
  { id: 'reviews',  title: 'Reviews',     desc: 'Client testimonials',   w: 780, h: 560, onDesktop: true },
  { id: 'quote',    title: 'Get a Quote', desc: 'Start a project',       w: 720, h: 620, onDesktop: true },
  { id: 'contact',  title: 'Contact',     desc: 'Links and email',       w: 520, h: 420, onDesktop: true },
  { id: 'settings', title: 'Settings',    desc: 'Appearance',            w: 520, h: 460, onDesktop: false },
]

export function getApp(id: AppId): AppDef {
  return APPS.find(a => a.id === id) as AppDef
}

const ICONS: Record<AppId | 'launcher' | 'power', ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  work: (
    <>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  skills: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </>
  ),
  reviews: (
    <>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z" />
    </>
  ),
  quote: (
    <>
      <path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4M8 12h8M8 16h6" />
    </>
  ),
  contact: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M3 8h2M3 12h2M3 16h2" />
      <circle cx="12" cy="10" r="2.4" />
      <path d="M8.5 17c.6-2 2-3 3.5-3s2.9 1 3.5 3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  launcher: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  power: (
    <>
      <path d="M12 3v9" />
      <path d="M7.5 6.5a7 7 0 1 0 9 0" />
    </>
  ),
}

export function AppIcon({ id, size = 24 }: { id: AppId | 'launcher' | 'power'; size?: number }) {
  return (
    <svg
      className="app-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  )
}
