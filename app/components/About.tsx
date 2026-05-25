export default function About() {
  return (
    <section id="about">
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">ABOUT<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn">-</div>
            <div className="win-btn">+</div>
            <div className="win-btn">x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">BIOGRAPHY</div>
          <div className="about-grid">
            <div className="pfp-side">
              <div className="pfp-wrap">
                <img className="pfp-img" src="/images/pfp.png" alt="Cqt" />
              </div>
              <div className="about-sep" />
              <div className="about-meta">
                <div className="meta-row">
                  <span className="lbl">STATUS</span>
                  <span className="val">OPEN FOR WORK</span>
                </div>
                <div className="meta-row">
                  <span className="lbl">LOCATION</span>
                  <span className="val">REMOTE.DDL</span>
                </div>
                <div className="meta-row">
                  <span className="lbl">PAYMENT</span>
                  <span className="val">PAYPAL</span>
                </div>
                <div className="meta-row">
                  <span className="lbl">PRONOUNS</span>
                  <span className="val">ULTRA/NERD</span>
                </div>
              </div>
            </div>
            <div className="about-text">
              <p>Hey! I&apos;m Cqt, a cat that just loves coding — so much that I made it my part-time (well, actually full-time) job.</p>
              <p>I&apos;m a college student, but that part of my life is quite boring. I do care, I just handle it with ease.</p>
              <p>One thing about me: perfectionism. Don&apos;t ask me to ship something drafty and half-baked — I just won&apos;t cope with it.</p>
              <p>Yes, I am a Linux user. Yes, I trash Apple. Yes, I want to kill Microslop — but I keep it out of my professional work. Mostly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
