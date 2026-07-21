export type Scheme = 'dark' | 'light'

export type Accent = { id: string; name: string; color: string }

// 'mono' follows the active scheme (black/white); the rest override the accent.
export const ACCENTS: Accent[] = [
  { id: 'mono',   name: 'Mono',        color: 'linear-gradient(135deg,#0a0a0a 0 50%,#e8e8e8 50% 100%)' },
  { id: 'blue',   name: 'Breeze Blue', color: '#3daee9' },
  { id: 'green',  name: 'Green',       color: '#27ae60' },
  { id: 'amber',  name: 'Amber',       color: '#f6a700' },
  { id: 'purple', name: 'Purple',      color: '#9b59b6' },
  { id: 'red',    name: 'Red',         color: '#da4453' },
]

const SCHEME_KEY = 'kde_scheme'
const ACCENT_KEY = 'kde_accent'

export function applyScheme(scheme: Scheme) {
  document.documentElement.setAttribute('data-scheme', scheme)
  localStorage.setItem(SCHEME_KEY, scheme)
}

export function applyAccent(accent: Accent) {
  if (accent.id === 'mono') {
    document.documentElement.style.removeProperty('--accent')
  } else {
    document.documentElement.style.setProperty('--accent', accent.color)
  }
  localStorage.setItem(ACCENT_KEY, accent.id)
}

export function getSavedScheme(): Scheme {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(SCHEME_KEY) : null
  return v === 'light' ? 'light' : 'dark'
}

export function getSavedAccentId(): string {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(ACCENT_KEY) : null
  return ACCENTS.some(a => a.id === v) ? (v as string) : 'mono'
}

export const APPEARANCE_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var s=localStorage.getItem('kde_scheme');r.setAttribute('data-scheme',s==='light'?'light':'dark');var a=localStorage.getItem('kde_accent');var m={blue:'#3daee9',green:'#27ae60',amber:'#f6a700',purple:'#9b59b6',red:'#da4453'};if(m[a])r.style.setProperty('--accent',m[a]);}catch(e){}})()`
