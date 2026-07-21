import { PROFILE } from '@/lib/data';

type Link = { label: string; value: string; href: string };

function buildLinks(): Link[] {
  const links: Link[] = [];
  if (PROFILE.github) links.push({ label: 'GitHub', value: PROFILE.github.replace(/^https?:\/\//, ''), href: PROFILE.github });
  if (PROFILE.linkedin) links.push({ label: 'LinkedIn', value: PROFILE.linkedin.replace(/^https?:\/\//, ''), href: PROFILE.linkedin });
  if (PROFILE.discord) links.push({ label: 'Discord', value: PROFILE.discord, href: PROFILE.discord.startsWith('http') ? PROFILE.discord : '#' });
  if (PROFILE.email) links.push({ label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}` });
  return links;
}

export default function ContactApp() {
  const links = buildLinks();
  return (
    <div className="kapp contact-app">
      <p className="contact-lead">
        Available for freelance projects and full-time roles. The fastest way to
        reach me is below.
      </p>
      <ul className="contact-list">
        {links.map(l => (
          <li key={l.label} className="contact-row">
            <span className="contact-label">{l.label}</span>
            <a
              className="contact-value"
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {l.value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
