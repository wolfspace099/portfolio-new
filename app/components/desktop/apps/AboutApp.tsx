import { PROFILE } from '@/lib/data';

const META: [string, string][] = [
  ['Name', PROFILE.name],
  ['Role', PROFILE.title],
  ['Location', PROFILE.location],
  ['Status', PROFILE.status],
];

export default function AboutApp() {
  return (
    <div className="kapp about-app">
      <div className="about-hero">
        <div className="about-avatar" aria-hidden="true">
          <span>{PROFILE.handle.charAt(0)}</span>
        </div>
        <div className="about-id">
          <h1>{PROFILE.name}</h1>
          <p className="about-role">{PROFILE.title}</p>
          <span className="about-status">
            <span className="status-dot" /> {PROFILE.status}
          </span>
        </div>
      </div>

      <dl className="about-meta">
        {META.map(([k, v]) => (
          <div key={k} className="about-meta-row">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="about-bio">
        {PROFILE.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
