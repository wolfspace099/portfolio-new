'use client';

import { useEffect, useRef, useState } from 'react';
import { PHRASES } from '@/lib/data';

const ASCII = ` ██████╗ ██████╗ ████████╗███████╗██╗  ██╗███████╗
██╔════╝██╔═══██╗╚══██╔══╝██╔════╝╚██╗██╔╝██╔════╝
██║     ██║   ██║   ██║   █████╗   ╚███╔╝ █████╗
██║     ██║▄▄ ██║   ██║   ██╔══╝   ██╔██╗ ██╔══╝
╚██████╗╚██████╔╝   ██║██╗███████╗██╔╝ ██╗███████╗
 ╚═════╝ ╚══▀▀═╝    ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚══════╝`;

const TAGS = ['MINECRAFT CODER', 'WEB DEV', 'DEVOPS'];

export default function Hero() {
  const [asciiLines, setAsciiLines] = useState<string[]>([]);
  const [typed, setTyped] = useState('');
  const [tagVisible, setTagVisible] = useState<boolean[]>([false, false, false]);
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const goingBack = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAsciiLines(ASCII.split('\n'));
      setTagVisible([true, true, true]);
      return;
    }
    const lines = ASCII.split('\n');
    let i = 0;
    const reveal = () => {
      if (i >= lines.length) {
        setTimeout(() => {
          TAGS.forEach((_, idx) => {
            setTimeout(() => setTagVisible(prev => { const n = [...prev]; n[idx] = true; return n; }), idx * 160);
          });
        }, 100);
        return;
      }
      setAsciiLines(prev => [...prev, lines[i]]);
      i++;
      setTimeout(reveal, 140);
    };
    setTimeout(reveal, 200);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = PHRASES[phraseIdx.current];
      if (!goingBack.current) {
        charIdx.current++;
        setTyped(phrase.slice(0, charIdx.current));
        if (charIdx.current === phrase.length) {
          goingBack.current = true;
          timer = setTimeout(tick, 1800);
          return;
        }
      } else {
        charIdx.current--;
        setTyped(phrase.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          goingBack.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % PHRASES.length;
        }
      }
      timer = setTimeout(tick, goingBack.current ? 55 : 95);
    };
    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="win">
      <div className="win-titlebar">
        <span className="win-title">HOME<span className="dim">.EXE</span></span>
        <div className="win-controls">
          <div className="win-btn">-</div>
          <div className="win-btn">+</div>
          <div className="win-btn">x</div>
        </div>
      </div>
      <div className="win-body">
        <section className="hero">
          <p className="hero-prompt">OPEN FOR WORK</p>
          <pre className="hero-ascii">{asciiLines.join('\n')}</pre>
          <div className="hero-tags">
            {TAGS.map((tag, i) => (
              <span key={tag} className={`hero-tag${tagVisible[i] ? ' visible' : ''}`}>{tag}</span>
            ))}
          </div>
          <p className="hero-sub">
            <span>{typed}</span>
            <span className="cursor" />
          </p>
          <div className="hero-btns">
            <a href="/work" className="btn btn-fill">VIEW WORK</a>
            <a href="/quote" className="btn btn-outline">GET A QUOTE</a>
          </div>
        </section>
      </div>
    </div>
  );
}
