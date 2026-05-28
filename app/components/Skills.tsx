'use client';

import { SKILLS } from '@/lib/data';

export default function Skills() {
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
          <div className="skills-cols">
            {SKILLS.map(grp => (
              <section key={grp.group} className="skill-group">
                <div className="skill-group-title">{grp.group}</div>
                <div className="skill-cards">
                  {grp.items.map(item => (
                    <div key={item} className="skill-card">{item}</div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
