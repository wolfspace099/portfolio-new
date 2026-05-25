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
    desc: 'DIY project plugin for a custom lasertag minigame in MC without mods, full coded in Java, with 9 gamemodes',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'link',
    link: '#quote',
    cardLink: '#quote',
  },
  {
    name: 'ELEVATOR WAND',
    desc: 'Plugin with abilities to make standstill, moving and cabin elevators. With smooth operation, call buttons and much more, all while keeping peak performance.',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'video',
    videoSrc: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    name: 'ARCANE MAGIC',
    desc: 'A powerful spellcasting plugin for Minecraft with a wide range of magical abilities and effects.',
    tags: ['Java', 'Maven', 'Minecraft'],
    category: 'minecraft',
    viewType: 'video',
    videoSrc: 'arcane-plugin.mp4',
  },
  {
    name: 'PORTFOLIO WEBSITE',
    desc: 'This very website you are on, built with Next.js, React, database + auth using Supabase, showcasing projects, skills, and client reviews.',
    tags: ['TypeScript', 'React', 'Next.js', 'Supabase'],
    category: 'web',
    viewType: 'link',
    link: 'https://github.com/wolfspace099/portfolio-new/',
  },
]

export type SkillGroup = {
  group: string
  items: { name: string; pct: number }[]
}

export const SKILLS: SkillGroup[] = [
  {
    group: 'DEVELOPMENT',
    items: [
      { name: 'JavaScript / TS', pct: 95 },
      { name: 'React / Next.js', pct: 92 },
      { name: 'Node.js', pct: 88 },
      { name: 'Python', pct: 82 },
      { name: 'PostgreSQL', pct: 78 },
    ],
  },
  {
    group: 'MINECRAFT',
    items: [
      { name: 'Java Plugins', pct: 90 },
      { name: 'Skript', pct: 95 },
      { name: 'Spigot / Paper', pct: 88 },
      { name: 'BungeeCord', pct: 72 },
    ],
  },
  {
    group: 'DEVOPS / TOOLS',
    items: [
      { name: 'Git', pct: 95 },
      { name: 'Linux / CLI', pct: 88 },
      { name: 'Docker / CI-CD', pct: 74 },
      { name: 'Supabase / Data', pct: 70 },
    ],
  },
]

export const PHRASES = [
  'Full-Stack developer',
  'Pussie lover <3',
  'Plugin developer',
  'Meow :3',
  'I like cat food',
]
