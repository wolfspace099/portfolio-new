'use client';

import { useState, useEffect } from 'react';

const LINES = [
  '[  OK  ] Reached target Graphical Interface',
  '[  OK  ] Started Display Manager',
  '[  OK  ] Started Plasma Workspace',
  'Starting Cqt Desktop…',
  'Welcome.',
];

interface Props {
  onDone: () => void;
}

export default function BootSequence({ onDone }: Props) {
  const [visible, setVisible] = useState<number[]>([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= LINES.length) {
        clearInterval(interval);
        setTimeout(() => { setFading(true); setTimeout(onDone, 420); }, 320);
        return;
      }
      setVisible(prev => [...prev, i]);
      i++;
    }, 220);

    function skip() { clearInterval(interval); setFading(true); setTimeout(onDone, 420); }
    document.addEventListener('keydown', skip, { once: true });
    document.addEventListener('click', skip, { once: true });

    return () => { clearInterval(interval); document.removeEventListener('keydown', skip); document.removeEventListener('click', skip); };
  }, [onDone]);

  return (
    <div className={`boot-overlay${fading ? ' fade' : ''}`}>
      {LINES.map((line, i) => (
        <div key={line} className={`boot-line${visible.includes(i) ? ' show' : ''}`}>
          {line}
          {i === visible[visible.length - 1] && !fading && (
            <span className="boot-cursor" />
          )}
        </div>
      ))}
    </div>
  );
}
