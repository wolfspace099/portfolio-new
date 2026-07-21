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
          <div className="win-label">WHAT I DO</div>
          <div className="special-intro">
            <p>No bloat, no half-finished work. I write code that runs on live servers with real players — the bar for &quot;good enough&quot; is not low.</p>
            <p>Communication is direct and reliable. Updates are clear, feedback gets applied quickly, and deadlines are respected. You always know where a project stands.</p>
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
              <div className="special-card-header"><span>CLEAN CODE</span></div>
              <p>Readable, maintainable, and documented where it matters. Each feature does one thing, so the codebase stays easy to extend and hand off.</p>
              <a className="special-btn" href="/about">ABOUT ME</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>HONEST COMMS</span></div>
              <p>If something is taking longer, I say so. If an idea has a flaw, I raise it early. No hidden costs and no vague timelines — just straight answers.</p>
              <a className="special-btn" href="/reviews">REVIEWS</a>
            </div>
            <div className="special-card big">
              <div className="special-card-header"><span>WEB + FULL STACK</span></div>
              <p>Beyond plugins, I build websites, dashboards and APIs. Same standards apply throughout — clean, deployed, and working in production.</p>
              <a className="special-btn" href="/work">SEE WORK</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
