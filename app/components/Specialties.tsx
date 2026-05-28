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
          <div className="win-label">WHAT I ACTUALLY DO</div>
          <div className="special-intro">
            <p>No bloat, no hand-holding, no half-finished mess. I write code that works on live servers with real players — the bar for &quot;good enough&quot; is not low.</p>
            <p>I talk to you like a person. Updates are direct, feedback gets applied fast, and I don&apos;t ghost you three days before deadline.</p>
          </div>
          <div className="special-head">THE RUNDOWN</div>
          <div className="special-grid">
            <div className="special-card big">
              <div className="special-card-header"><span>FAST TURNAROUND</span></div>
              <p>Most SMP plugins ship in 2–4 days. Complex systems take longer, but not by much. I don&apos;t sit on things.</p>
              <a className="special-btn" href="/quote">REQUEST</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>MINECRAFT FIRST</span></div>
              <p>Java plugins, Skript scripts, Fabric mods — been doing this long enough that most problems aren&apos;t new to me.</p>
              <a className="special-btn" href="/work">SEE WORK</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>CAT</span></div>
              <p>I am a cat. This objectively improves code quality by at least 40%. Science.</p>
              <a className="special-btn" href="/about">ABOUT ME</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>HONEST COMMS</span></div>
              <p>If something&apos;s taking longer, I tell you. If your idea has a flaw, I flag it. No corporate fluff, no empty reassurances.</p>
              <a className="special-btn" href="/reviews">REVIEWS</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>WEB + FULL STACK</span></div>
              <p>When I&apos;m not writing plugins I&apos;m building sites, dashboards and APIs. Same standards apply — clean, deployed, working.</p>
              <a className="special-btn" href="/work">SEE WORK</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
