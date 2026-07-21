import { SKILLS } from '@/lib/data';

export default function SkillsApp() {
  return (
    <div className="kapp skills-app">
      {SKILLS.map(group => (
        <section key={group.group} className="skill-block">
          <h2 className="skill-block-title">{group.group}</h2>
          <ul className="skill-chips">
            {group.items.map(item => (
              <li key={item} className="skill-chip">{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
