export default function Specialties() {
  return (
    <section id="specialties">
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">SPECIALTIES<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn">-</div>
            <div className="win-btn">+</div>
            <div className="win-btn">x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">WHY I&apos;M THE BEST OPTION</div>
          <div className="special-intro">
            <p>I deliver fast, clean and reliable work. I listen to feedback and edit immediately and eliminate bugs as effectively as possible.</p>
            <p>Maintaining good communication throughout the job is important as it saves time, gets me to work more effectively and is just funsies.</p>
          </div>
          <div className="special-head">TOP QUALITIES</div>
          <div className="special-grid">
            <div className="special-card big">
              <div className="special-card-header"><span>FAST DELIVERY</span></div>
              <p>Moves quickly without turning the code into a mess. If not too busy, SMP plugins ship in 2 days.</p>
              <a className="special-btn" href="#quote">REQUEST</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>FULL STACK</span></div>
              <p>Can handle front-end, back-end, and everything between. And a whole lot more you ain&apos;t care about.</p>
              <a className="special-btn" href="#projects">SEE WORK</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>CAT</span></div>
              <p>I am a cat, so that automatically makes me smarter than the average human.</p>
              <a className="special-btn" href="#about">ABOUT ME</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>DIRECT COMM</span></div>
              <p>Clear updates, no fluff, no confusion, no wasted time. Straight buglog and good insight on what&apos;s done and what&apos;s not.</p>
              <a className="special-btn" href="#reviews">REVIEWS</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>DEVOPS / INFRA</span></div>
              <p>Docker, CI/CD, VPS setup and server management. Full deployment pipeline from local to production.</p>
              <a className="special-btn" href="#quote">REQUEST</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
