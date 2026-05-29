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

export interface BgPreset {
  id: string
  name: string
  swatch: string
  vars: Record<string, string>
}

export const BG_PRESETS: BgPreset[] = [
  {
    id: 'void', name: 'VOID', swatch: '#050505',
    vars: { '--bg': '#050505', '--bg2': '#0c0c0c', '--win-bar': '#101010', '--win-bar-b': '#5f5f5f', '--topbar-bg': '#0b0b0b', '--hover-bg': '#161616', '--bar-bg': '#141414', '--panel-bg': '#161616', '--overlay-bg': 'rgba(3,3,3,.94)', '--scroll-track': '#101010' },
  },
  {
    id: 'obsidian', name: 'OBSIDIAN', swatch: '#000000',
    vars: { '--bg': '#000000', '--bg2': '#080808', '--win-bar': '#0c0c0c', '--win-bar-b': '#444444', '--topbar-bg': '#060606', '--hover-bg': '#111111', '--bar-bg': '#0e0e0e', '--panel-bg': '#111111', '--overlay-bg': 'rgba(0,0,0,.96)', '--scroll-track': '#0c0c0c' },
  },
  {
    id: 'navy', name: 'NAVY', swatch: '#040816',
    vars: { '--bg': '#040816', '--bg2': '#0a1026', '--win-bar': '#0d152e', '--win-bar-b': '#2a3a6a', '--topbar-bg': '#070d20', '--hover-bg': '#111a35', '--bar-bg': '#0e1528', '--panel-bg': '#111a35', '--overlay-bg': 'rgba(2,4,12,.94)', '--scroll-track': '#0d152e' },
  },
  {
    id: 'midnight', name: 'MIDNIGHT', swatch: '#090412',
    vars: { '--bg': '#090412', '--bg2': '#10091e', '--win-bar': '#140d24', '--win-bar-b': '#3a2060', '--topbar-bg': '#0c0718', '--hover-bg': '#1a112e', '--bar-bg': '#180e28', '--panel-bg': '#1a112e', '--overlay-bg': 'rgba(4,2,8,.94)', '--scroll-track': '#140d24' },
  },
  {
    id: 'forest', name: 'FOREST', swatch: '#020e05',
    vars: { '--bg': '#020e05', '--bg2': '#07140a', '--win-bar': '#0a180c', '--win-bar-b': '#1e5028', '--topbar-bg': '#061010', '--hover-bg': '#0f1e12', '--bar-bg': '#0d1a10', '--panel-bg': '#0f1e12', '--overlay-bg': 'rgba(1,5,2,.94)', '--scroll-track': '#0a180c' },
  },
  {
    id: 'ash', name: 'ASH', swatch: '#191919',
    vars: { '--bg': '#191919', '--bg2': '#212121', '--win-bar': '#252525', '--win-bar-b': '#606060', '--topbar-bg': '#1d1d1d', '--hover-bg': '#2a2a2a', '--bar-bg': '#282828', '--panel-bg': '#2a2a2a', '--overlay-bg': 'rgba(10,10,10,.94)', '--scroll-track': '#252525' },
  },
]

export interface NeonStep {
  bg: string; bg2: string; text: string; dim: string
  winBar: string; winBarB: string; hover: string; panel: string
  overlay: string; border: string
}

export const NEON_CYCLE: NeonStep[] = [
  { bg: '#000000', bg2: '#0a0a0a', text: '#c084fc', dim: '#7a7a7a', winBar: '#0c0c0c', winBarB: '#3a3a3a', hover: '#111111', panel: '#111111', overlay: 'rgba(0,0,0,.94)', border: '#5a5a5a' },
  { bg: '#ffffff', bg2: '#f0f0f0', text: '#000000', dim: '#555555', winBar: '#e0e0e0', winBarB: '#aaaaaa', hover: '#e4e4e4', panel: '#e4e4e4', overlay: 'rgba(240,240,240,.94)', border: '#888888' },
  { bg: '#39ff14', bg2: '#2ee010', text: '#1a0030', dim: '#0d4000', winBar: '#25c00a', winBarB: '#0f6600', hover: '#20aa08', panel: '#20aa08', overlay: 'rgba(20,140,5,.92)', border: '#0d5500' },
  { bg: '#ff00c8', bg2: '#d400aa', text: '#000000', dim: '#44002e', winBar: '#bb0099', winBarB: '#770060', hover: '#aa0088', panel: '#aa0088', overlay: 'rgba(170,0,120,.92)', border: '#550040' },
]

const VARS_KEY = 'theme_vars'
const BG_KEY   = 'bg_vars'

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

export function applyBg(preset: BgPreset) {
  const r = document.documentElement
  for (const [k, v] of Object.entries(preset.vars)) r.style.setProperty(k, v)
  localStorage.setItem(BG_KEY, JSON.stringify({ ...preset.vars, __id: preset.id }))
}

export function getSavedBgId(): string {
  try {
    const raw = localStorage.getItem(BG_KEY)
    if (!raw) return 'void'
    return JSON.parse(raw).__id || 'void'
  } catch { return 'void' }
}

export function applyNeonStep(step: NeonStep) {
  const r = document.documentElement
  r.style.setProperty('--bg', step.bg)
  r.style.setProperty('--bg2', step.bg2)
  r.style.setProperty('--text', step.text)
  r.style.setProperty('--shell-text', step.text)
  r.style.setProperty('--dim', step.dim)
  r.style.setProperty('--win-bar', step.winBar)
  r.style.setProperty('--win-bar-b', step.winBarB)
  r.style.setProperty('--topbar-bg', step.winBar)
  r.style.setProperty('--hover-bg', step.hover)
  r.style.setProperty('--bar-bg', step.panel)
  r.style.setProperty('--panel-bg', step.panel)
  r.style.setProperty('--overlay-bg', step.overlay)
  r.style.setProperty('--scroll-track', step.winBar)
  r.style.setProperty('--border', step.border)
}

export function restoreSavedAppearance() {
  const r = document.documentElement
  try {
    const raw = localStorage.getItem(BG_KEY)
    if (raw) {
      const vars = JSON.parse(raw)
      for (const [k, v] of Object.entries(vars)) {
        if (k !== '__id') r.style.setProperty(k, v as string)
      }
    }
  } catch {}
  try {
    const raw = localStorage.getItem(VARS_KEY)
    if (raw) {
      const vars = JSON.parse(raw)
      for (const [k, v] of Object.entries(vars)) {
        if (k !== '__id') r.style.setProperty(k, v as string)
      }
    }
  } catch {}
  r.style.setProperty('--text', '#f7f7f7')
  r.style.setProperty('--shell-text', '#f7f7f7')
  r.style.setProperty('--dim', '#9c9c9c')
  r.style.setProperty('--border', '#7a7a7a')
}

export const THEME_INIT_SCRIPT = `(function(){try{var v=JSON.parse(localStorage.getItem('theme_vars')||'null');if(v){var r=document.documentElement;for(var k in v){if(k!=='__id')r.style.setProperty(k,v[k]);}}}catch(e){}try{var b=JSON.parse(localStorage.getItem('bg_vars')||'null');if(b){var r=document.documentElement;for(var k in b){if(k!=='__id')r.style.setProperty(k,b[k]);}}}catch(e){}})()`
