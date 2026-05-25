interface Props {
  onTosClick: () => void;
}

export default function Footer({ onTosClick }: Props) {
  const ascii = `##########################################
#                                        #
# ███╗   ███╗███████╗ ██████╗ ██╗    ██╗ #
# ████╗ ████║██╔════╝██╔═══██╗██║    ██║ #
# ██╔████╔██║█████╗  ██║   ██║██║ █╗ ██║ #
# ██║╚██╔╝██║██╔══╝  ██║   ██║██║███╗██║ #
# ██║ ╚═╝ ██║███████╗╚██████╔╝╚███╔███╔╝ #
# ╚═╝     ╚═╝╚══════╝ ╚═════╝  ╚══╝╚══╝  #
#                                        #
##########################################`;

  return (
    <div className="win footer-window">
      <div className="win-titlebar">
        <span className="win-title">FOOTER<span className="dim">.TXT</span></span>
        <div className="win-controls">
          <div className="win-btn">-</div>
          <div className="win-btn">+</div>
          <div className="win-btn">x</div>
        </div>
      </div>
      <div className="win-body footer-body">
        <footer className="footer">
          <pre className="footer-ascii">{ascii}</pre>
          CQT.EXE
          &nbsp;&bull;&nbsp;
          <a href="https://github.com/wolfspace099" target="_blank" rel="noopener noreferrer">GITHUB</a>
          &nbsp;&bull;&nbsp;
          <a href="#">DISCORD</a>
          &nbsp;&bull;&nbsp;
          <a href="#" onClick={e => { e.preventDefault(); onTosClick(); }}>TOS</a>
          <br />
          CODED BY HAND &mdash; 2026 &copy;
        </footer>
      </div>
    </div>
  );
}
