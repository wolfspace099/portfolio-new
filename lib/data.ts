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
  {
    name: 'planr',
    desc: 'A WIP app for students to schedule/organize their school life, and integrate it with their real life, built with React, Convex, Clerk and (soon) expo.',
    tags: ['TypeScript', 'React', 'Next.js', 'Convex', 'Clerk', 'Expo'],
    category: 'web',
    viewType: 'link',
    link: 'https://planr.cqtdev.cc',
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

export type ServicePackage = {
  id: string
  name: string
  desc: string
  price: string
  features: string[]
}

export const PACKAGES: Record<string, ServicePackage[]> = {
  minecraft: [
    { id: 'mc-starter', name: 'STARTER', desc: 'Single-feature plugin, clean delivery', price: '$25–$35', features: ['1 core feature', 'Basic config file', 'Bug-fix support'] },
    { id: 'mc-pro', name: 'PRO', desc: 'Multi-system plugin with custom gameplay', price: '$50–$200', features: ['Multiple systems', 'Custom config', 'Full support', 'Skript or Java'] },
    { id: 'mc-custom', name: 'CUSTOM', desc: 'Large-scale — priced after scoping', price: 'QUOTE', features: ['Any complexity', 'Full scope discussion', 'Price confirmed after spec'] },
  ],
  web: [
    { id: 'web-starter', name: 'STARTER', desc: 'Portfolio or landing page, deployed', price: '$30–$60', features: ['Responsive design', 'Deploy to Vercel', 'Contact form'] },
    { id: 'web-pro', name: 'PRO', desc: 'Full-stack app with auth, DB, and dashboard', price: '$80–$200', features: ['Auth system', 'Database + API', 'Admin panel', 'Deployed & monitored'] },
    { id: 'web-custom', name: 'CUSTOM', desc: 'Complex platforms — priced after scoping', price: 'QUOTE', features: ['Any stack', 'Full scope discussion', 'Price confirmed after spec'] },
  ],
  devops: [
    { id: 'dev-basic', name: 'BASIC', desc: 'VPS setup, Docker, basic CI/CD', price: '$20–$40', features: ['Server configuration', 'Docker setup', 'Basic CI/CD pipeline'] },
    { id: 'dev-pro', name: 'PRO', desc: 'Full infra — monitoring, automation, pipelines', price: '$50–$100', features: ['Full infrastructure', 'Monitoring setup', 'Automation scripts', 'Documentation'] },
    { id: 'dev-custom', name: 'CUSTOM', desc: 'Custom tooling — priced after scoping', price: 'QUOTE', features: ['Any complexity', 'Full scope discussion', 'Price confirmed after spec'] },
  ],
}

export const PHRASES = [
  'Full-Stack developer',
  'Pussie lover <3',
  'Plugin developer',
  'Meow :3',
  'I like cat food',
]
