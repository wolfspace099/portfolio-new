'use client';

import { useEffect, useRef, useState } from 'react';
import { PROFILE, PROJECTS, SKILLS } from '@/lib/data';
import type { AppId } from '@/lib/apps';

interface Props {
  onOpen?: (id: AppId) => void;
}

type Line = { text: string; cls?: string };

const PROMPT = `${PROFILE.handle.toLowerCase()}@plasma:~$`;

const NEOFETCH = [
  '        _____        ',
  '      /       \\      ',
  '     |  ^   ^  |     ',
  '     |    <    |     ',
  '      \\  \\_/  /      ',
  '       \\_____/       ',
];

export default function Terminal({ onOpen }: Props) {
  const [lines, setLines] = useState<Line[]>([
    { text: `${PROFILE.handle}OS 6.2  —  type "help" to list commands`, cls: 'term-dim' },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);

  function print(out: Line[]) {
    setLines(prev => [...prev, ...out]);
  }

  function run(raw: string) {
    const cmd = raw.trim();
    const echo: Line = { text: `${PROMPT} ${cmd}`, cls: 'term-cmd' };
    if (!cmd) { print([echo]); return; }

    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(' ');
    const out: Line[] = [echo];

    switch (name.toLowerCase()) {
      case 'help':
        out.push(
          { text: 'Available commands:' },
          { text: '  about      open the About window' },
          { text: '  projects   list projects' },
          { text: '  skills     list the tech stack' },
          { text: '  contact    show contact links' },
          { text: '  neofetch   system info' },
          { text: '  whoami     short bio' },
          { text: '  open <app> launch an app (about, work, skills, reviews, quote, contact)' },
          { text: '  clear      clear the screen' },
        );
        break;
      case 'whoami':
        out.push({ text: `${PROFILE.name} — ${PROFILE.title}.` }, { text: PROFILE.bio[0] });
        break;
      case 'about':
        out.push({ text: 'Opening About…', cls: 'term-dim' });
        onOpen?.('about');
        break;
      case 'projects':
      case 'work':
        PROJECTS.forEach(p => out.push({ text: `  ${p.name.padEnd(18)} ${p.tags.join(', ')}` }));
        out.push({ text: 'run "open work" for details', cls: 'term-dim' });
        break;
      case 'skills':
        SKILLS.forEach(g => out.push({ text: `  ${g.group}: ${g.items.join(', ')}` }));
        break;
      case 'contact':
        out.push({ text: `  GitHub: ${PROFILE.github}` });
        if (PROFILE.email) out.push({ text: `  Email:  ${PROFILE.email}` });
        if (PROFILE.discord) out.push({ text: `  Discord: ${PROFILE.discord}` });
        break;
      case 'neofetch': {
        const info = [
          `${PROFILE.handle.toLowerCase()}@plasma`,
          '-----------',
          'OS: CqtOS 6.2 x86_64',
          'DE: Plasma 6 (Breeze Dark)',
          'Shell: cqtsh',
          'Editor: nvim',
          `Role: ${PROFILE.title}`,
          'Languages: Java, TypeScript, Python',
          'Uptime: always shipping',
        ];
        const rows = Math.max(NEOFETCH.length, info.length);
        for (let i = 0; i < rows; i++) {
          out.push({ text: `${(NEOFETCH[i] || '').padEnd(22)}${info[i] || ''}`, cls: 'term-accent' });
        }
        break;
      }
      case 'open': {
        const valid: AppId[] = ['about', 'work', 'skills', 'reviews', 'quote', 'contact', 'settings'];
        const target = arg.toLowerCase() as AppId;
        if (valid.includes(target)) {
          out.push({ text: `Opening ${target}…`, cls: 'term-dim' });
          onOpen?.(target);
        } else {
          out.push({ text: `open: unknown app "${arg}"`, cls: 'term-err' });
        }
        break;
      }
      case 'ls':
        out.push({ text: 'about  projects  skills  reviews  quote  contact  secret.txt' });
        break;
      case 'cat':
        if (arg === 'secret.txt') out.push({ text: 'You found it. Now go hire me. :)', cls: 'term-accent' });
        else out.push({ text: `cat: ${arg || 'file'}: No such file`, cls: 'term-err' });
        break;
      case 'sudo':
        out.push({ text: `${PROFILE.handle} is not in the sudoers file. This incident will be reported.`, cls: 'term-err' });
        break;
      case 'rm':
        if (arg.includes('-rf')) out.push({ text: 'Nice try. Backups are on another continent.', cls: 'term-err' });
        else out.push({ text: 'rm: refusing to remove anything useful', cls: 'term-err' });
        break;
      case 'echo':
        out.push({ text: arg });
        break;
      case 'date':
        out.push({ text: new Date().toString() });
        break;
      case 'pwd':
        out.push({ text: `/home/${PROFILE.handle.toLowerCase()}` });
        break;
      case 'exit':
        out.push({ text: 'There is no escape. This is the portfolio now.', cls: 'term-dim' });
        break;
      case 'clear':
        setLines([]);
        return;
      default:
        out.push({ text: `${name}: command not found — try "help"`, cls: 'term-err' });
    }
    print(out);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      run(value);
      if (value.trim()) setHistory(h => [...h, value.trim()]);
      setValue('');
      setHIdx(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setValue(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < 0) return;
      const next = hIdx + 1;
      if (next >= history.length) { setHIdx(-1); setValue(''); }
      else { setHIdx(next); setValue(history[next]); }
    }
  }

  return (
    <div className="kapp term" onClick={() => inputRef.current?.focus()}>
      <div className="term-out">
        {lines.map((l, i) => (
          <div key={i} className={`term-line ${l.cls || ''}`}>{l.text || ' '}</div>
        ))}
        <div className="term-input-row">
          <span className="term-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="term-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoFocus
            aria-label="Terminal input"
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
