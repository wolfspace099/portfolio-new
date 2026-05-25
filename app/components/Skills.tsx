'use client';

import { useEffect, useRef, useState } from 'react';
import { SKILLS } from '@/lib/data';

export default function Skills() {
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGo(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills">
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">SKILLS<span className="dim">.LST</span></span>
          <div className="win-controls">
            <div className="win-btn">-</div>
            <div className="win-btn">+</div>
            <div className="win-btn">x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">TECH STACK</div>
          <div className="skills-cols" ref={ref}>
            {SKILLS.map(grp => (
              <section key={grp.group} className="skill-group">
                <div className="skill-group-title">{grp.group}</div>
                {grp.items.map((item, i) => (
                  <div key={item.name} className="skill-item">
                    <div className="skill-item-row">
                      <span className="skill-name-txt">{item.name}</span>
                      <span className="skill-pct">{item.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className="skill-bar-fill"
                        style={{
                          width: go ? `${item.pct}%` : '0%',
                          transitionDelay: go ? `${i * 80}ms` : '0ms',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
