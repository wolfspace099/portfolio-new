export interface Theme {
  id: string
  name: string
  accent: string
  primary: string
  primary2: string
  primary3: string
}

export const THEMES: Theme[] = [
  { id: 'green',  name: 'GREEN',  accent: '#4ade80', primary: '#f2f2f2', primary2: '#ffffff', primary3: '#bcbcbc' },
  { id: 'purple', name: 'PURPLE', accent: '#c084fc', primary: '#c084fc', primary2: '#d8b4fe', primary3: '#a855f7' },
  { id: 'blue',   name: 'BLUE',   accent: '#60a5fa', primary: '#60a5fa', primary2: '#93c5fd', primary3: '#3b82f6' },
  { id: 'cyan',   name: 'CYAN',   accent: '#22d3ee', primary: '#22d3ee', primary2: '#67e8f9', primary3: '#06b6d4' },
  { id: 'amber',  name: 'AMBER',  accent: '#fbbf24', primary: '#fbbf24', primary2: '#fcd34d', primary3: '#f59e0b' },
  { id: 'orange', name: 'ORANGE', accent: '#fb923c', primary: '#fb923c', primary2: '#fdba74', primary3: '#f97316' },
  { id: 'red',    name: 'RED',    accent: '#f87171', primary: '#f87171', primary2: '#fca5a5', primary3: '#ef4444' },
  { id: 'pink',   name: 'PINK',   accent: '#f472b6', primary: '#f472b6', primary2: '#f9a8d4', primary3: '#ec4899' },
]

const VARS_KEY = 'theme_vars'

export function applyTheme(t: Theme) {
  const r = document.documentElement
  const vars: Record<string, string> = {
    '--accent': t.accent,
    '--purple': t.primary,
    '--purple2': t.primary2,
    '--purple3': t.primary3,
    '--scroll-thumb': t.accent,
  }
  for (const [k, v] of Object.entries(vars)) r.style.setProperty(k, v)
  localStorage.setItem(VARS_KEY, JSON.stringify({ ...vars, __id: t.id }))
}

export function getSavedThemeId(): string {
  try {
    const raw = localStorage.getItem(VARS_KEY)
    if (!raw) return 'green'
    return JSON.parse(raw).__id || 'green'
  } catch { return 'green' }
}

export const THEME_INIT_SCRIPT = `(function(){try{var v=JSON.parse(localStorage.getItem('theme_vars')||'null');if(v){var r=document.documentElement;for(var k in v){if(k!=='__id')r.style.setProperty(k,v[k]);}}}catch(e){}})()`
