interface Props {
  onClose: () => void;
}

export default function EasterPopup({ onClose }: Props) {
  return (
    <div className="easter-overlay show">
      <div className="easter-win">
        <div className="easter-bar">
          <span className="easter-bar-title">
            ERROR<span style={{ color: "#bcbcbc" }}>.EXE</span>
          </span>
          <div className="easter-close" onClick={onClose}>x</div>
        </div>
        <div className="easter-body">
          <p>
            Nice try — but that is<br />
            not <span className="acc">the password.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
