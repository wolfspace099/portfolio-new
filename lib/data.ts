export type Project = {
  name: string
  desc: string
  tags: string[]
  category: 'minecraft' | 'web' | 'devops'
  viewType: 'link' | 'video'
  link?: string
  cardLink?: string
  videoSrc?: string
}

export const PROJECTS: Project[] = [
  {
    name: 'CATS CAN BLAST!',
    desc: 'Custom lasertag minigame plugin — pure Java, zero mods, 9 gamemodes. Built for a server with a live playerbase that demanded it never break.',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'link',
    link: '#quote',
    cardLink: '#quote',
  },
  {
    name: 'ELEVATOR WAND',
    desc: 'Standstill, moving and cabin elevators in vanilla MC. Smooth operation, call buttons, multi-floor support — and it does not tank the TPS.',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'video',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    name: 'ARCANE MAGIC',
    desc: 'Full spellcasting system with custom abilities, cooldowns, particle effects and progression. The kind of thing that makes players ask "is this a mod?"',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'video',
    videoSrc: 'arcane-plugin.mp4',
  },
  {
    name: 'THIS WEBSITE',
    desc: 'The one you are looking at. Next.js, Supabase auth, Discord OAuth, admin panel, review system, quote flow. Built and iterated on publicly.',
    tags: ['TypeScript', 'React', 'Next.js', 'Supabase'],
    category: 'web',
    viewType: 'link',
    link: 'https://github.com/wolfspace099/portfolio-new/',
  },
  {
    name: 'PLANR',
    desc: 'Student scheduling app — syncs school timetables with real life. React, Convex, Clerk, with a mobile app in the works via Expo.',
    tags: ['TypeScript', 'React', 'Next.js', 'Convex', 'Clerk', 'Expo'],
    category: 'web',
    viewType: 'link',
    link: 'https://planr.cqtdev.cc',
  },
]

export type SkillGroup = {
  group: string
  items: string[]
}

export const SKILLS: SkillGroup[] = [
  {
    group: 'DEVELOPMENT',
    items: ['JavaScript / TypeScript', 'React / Next.js', 'Node.js', 'Python', 'PostgreSQL'],
  },
  {
    group: 'MINECRAFT',
    items: ['Java Plugins', 'Fabric / Forge Mods', 'Skript', 'Spigot / Paper', 'BungeeCord'],
  },
  {
    group: 'DEVOPS / TOOLS',
    items: ['Git', 'Linux / CLI', 'Docker / CI-CD', 'Supabase', 'Vercel'],
  },
]

export const PHRASES = [
  'Full-Stack developer',
  'Pussie lover <3',
  'Plugin developer',
  'Meow :3',
  'I like cat food',
]
