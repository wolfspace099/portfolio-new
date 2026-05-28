interface Props {
  onAdminClick: () => void;
  onThemeClick: () => void;
}

export default function Nav({ onAdminClick, onThemeClick }: Props) {
  return (
    <div className="win-titlebar">
      <span className="win-title">
        <a className="topbar-logo topbar-logo-link" href="/">
          <span>CQT.EXE</span>
        </a>
      </span>
      <nav>
        <ul className="topbar-nav">
          <li><a href="/about">ABOUT</a></li>
          <li><a href="/work">WORK</a></li>
          <li><a href="/skills">SKILLS</a></li>
          <li><a href="/reviews">REVIEWS</a></li>
          <li><a href="/quote">QUOTE</a></li>
          <li><button className="topbar-theme" onClick={onThemeClick}>:3</button></li>
        </ul>
      </nav>
      <div className="topbar-actions">
        <button className="topbar-admin" onClick={onAdminClick}>ADMIN.EXE</button>
      </div>
    </div>
  );
}
