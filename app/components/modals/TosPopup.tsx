interface Props {
  onClose: () => void;
}

export default function TosPopup({ onClose }: Props) {
  return (
    <div className="tos-overlay show">
      <div className="tos-popup-win">
        <div className="win-titlebar">
          <span className="win-title">TOS<span className="dim">.TXT</span></span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="tos-popup-body">
          <div className="win-label">SERVICE AGREEMENT</div>
          <div className="tos-meta">
            <div className="tos-pill">LAST UPDATED: MARCH 24, 2026</div>
            <div className="tos-pill">OWNER: CQT.EXE</div>
            <div className="tos-pill">STATUS: ACTIVE</div>
          </div>
          <div className="tos-text">
            <div className="tos-block">
              <h3>1. SCOPE</h3>
              <p>These terms apply to any project, commission, quote request, review submission, or other service provided through this site or direct contact.</p>
            </div>
            <div className="tos-block">
              <h3>2. WORKFLOW</h3>
              <p>Work begins only after both sides agree on the scope. Requirements, timeline, and budget should be confirmed before development starts.</p>
            </div>
            <div className="tos-block">
              <h3>3. PAYMENT</h3>
              <p>Payment terms are negotiated per project. Deposits, milestones, and final delivery may be required depending on the size of the job.</p>
            </div>
            <div className="tos-block">
              <h3>4. CHANGES</h3>
              <p>Reasonable revisions are allowed during development. Large scope changes or extra features may require a new estimate or additional time.</p>
            </div>
            <div className="tos-block">
              <h3>5. OWNERSHIP</h3>
              <ul>
                <li>Final deliverables belong to the client once payment is completed, unless otherwise agreed.</li>
                <li>Reusable tools, templates, and internal methods remain the creator&apos;s property.</li>
                <li>Public portfolio display is allowed unless the client requests otherwise.</li>
              </ul>
            </div>
            <div className="tos-block">
              <h3>6. NO WARRANTY</h3>
              <p>Services are provided as-is. While every effort is made to deliver stable work, no guarantee is made for third-party services, hosting, or changes outside the project.</p>
            </div>
            <div className="tos-block">
              <h3>7. CONTACT</h3>
              <p>For questions, disputes, or project discussion, use the contact info on the main site or return to the homepage and submit a quote request.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
