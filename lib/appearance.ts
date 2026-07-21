export type Scheme = 'dark' | 'light'

export type Accent = { id: string; name: string; color: string }

export const ACCENTS: Accent[] = [
  { id: 'blue',   name: 'Breeze Blue', color: '#3daee9' },
  { id: 'sky',    name: 'Sky',         color: '#1d99f3' },
  { id: 'green',  name: 'Green',       color: '#27ae60' },
  { id: 'purple', name: 'Purple',      color: '#9b59b6' },
  { id: 'orange', name: 'Orange',      color: '#f67400' },
  { id: 'red',    name: 'Red',         color: '#da4453' },
]

const SCHEME_KEY = 'kde_scheme'
const ACCENT_KEY = 'kde_accent'

export function applyScheme(scheme: Scheme) {
  document.documentElement.setAttribute('data-scheme', scheme)
  localStorage.setItem(SCHEME_KEY, scheme)
}

export function applyAccent(accent: Accent) {
  document.documentElement.style.setProperty('--accent', accent.color)
  localStorage.setItem(ACCENT_KEY, accent.id)
}

export function getSavedScheme(): Scheme {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(SCHEME_KEY) : null
  return v === 'light' ? 'light' : 'dark'
}

export function getSavedAccentId(): string {
  const v = typeof localStorage !== 'undefined' ? localStorage.getItem(ACCENT_KEY) : null
  return ACCENTS.some(a => a.id === v) ? (v as string) : 'blue'
}

export const APPEARANCE_INIT_SCRIPT = `(function(){try{var r=document.documentElement;var s=localStorage.getItem('kde_scheme');r.setAttribute('data-scheme',s==='light'?'light':'dark');var a=localStorage.getItem('kde_accent');var m={blue:'#3daee9',sky:'#1d99f3',green:'#27ae60',purple:'#9b59b6',orange:'#f67400',red:'#da4453'};if(m[a])r.style.setProperty('--accent',m[a]);}catch(e){}})()`
