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
      <rect x="6" y="2" width="4" height="4" />
      <rect x="5" y="8" width="6" height="2" />
      <rect x="4" y="10" width="8" height="4" />
    </>
  ),
  work: (
    <>
      <rect x="2" y="4" width="5" height="2" />
      <rect x="2" y="6" width="12" height="8" />
    </>
  ),
  skills: (
    <>
      <rect x="5" y="5" width="6" height="6" />
      <rect x="6" y="2" width="1" height="2" /><rect x="9" y="2" width="1" height="2" />
      <rect x="6" y="12" width="1" height="2" /><rect x="9" y="12" width="1" height="2" />
      <rect x="2" y="6" width="2" height="1" /><rect x="2" y="9" width="2" height="1" />
      <rect x="12" y="6" width="2" height="1" /><rect x="12" y="9" width="2" height="1" />
    </>
  ),
  terminal: (
    <>
      <rect x="2" y="3" width="12" height="1" /><rect x="2" y="12" width="12" height="1" />
      <rect x="2" y="3" width="1" height="10" /><rect x="13" y="3" width="1" height="10" />
      <rect x="4" y="6" width="1" height="1" /><rect x="5" y="7" width="1" height="1" /><rect x="4" y="8" width="1" height="1" />
      <rect x="7" y="9" width="4" height="1" />
    </>
  ),
  reviews: (
    <>
      <rect x="7" y="2" width="2" height="3" />
      <rect x="2" y="6" width="12" height="2" />
      <rect x="5" y="7" width="6" height="3" />
      <rect x="4" y="10" width="3" height="3" /><rect x="9" y="10" width="3" height="3" />
    </>
  ),
  quote: (
    <>
      <rect x="3" y="2" width="10" height="1" /><rect x="3" y="13" width="10" height="1" />
      <rect x="3" y="2" width="1" height="12" /><rect x="12" y="2" width="1" height="12" />
      <rect x="5" y="5" width="6" height="1" /><rect x="5" y="7" width="6" height="1" /><rect x="5" y="9" width="4" height="1" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="2" width="10" height="1" /><rect x="3" y="13" width="10" height="1" />
      <rect x="3" y="2" width="1" height="12" /><rect x="12" y="2" width="1" height="12" />
      <rect x="1" y="4" width="1" height="1" /><rect x="1" y="7" width="1" height="1" /><rect x="1" y="10" width="1" height="1" />
      <rect x="7" y="5" width="2" height="2" /><rect x="6" y="8" width="4" height="2" />
    </>
  ),
  settings: (
    <>
      <rect x="6" y="6" width="4" height="4" />
      <rect x="7" y="2" width="2" height="2" /><rect x="7" y="12" width="2" height="2" />
      <rect x="2" y="7" width="2" height="2" /><rect x="12" y="7" width="2" height="2" />
      <rect x="3" y="3" width="2" height="2" /><rect x="11" y="3" width="2" height="2" />
      <rect x="3" y="11" width="2" height="2" /><rect x="11" y="11" width="2" height="2" />
    </>
  ),
  launcher: (
    <>
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
      <rect x="9" y="9" width="5" height="5" />
    </>
  ),
  power: (
    <>
      <rect x="7" y="2" width="2" height="6" />
      <rect x="4" y="5" width="1" height="2" /><rect x="11" y="5" width="1" height="2" />
      <rect x="3" y="7" width="1" height="4" /><rect x="12" y="7" width="1" height="4" />
      <rect x="4" y="11" width="8" height="1" /><rect x="5" y="12" width="6" height="1" />
    </>
  ),
}

export function AppIcon({ id, size = 24 }: { id: AppId | 'launcher' | 'power'; size?: number }) {
  return (
    <svg
      className="app-icon"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  )
}
