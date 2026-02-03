import { Link } from "react-router-dom";

export function Home() {
  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Kickstarter Transmission</p>
          <h1>
            NU_ORDR is a cyber-dystopian tabletop protocol for those who refuse
            to comply.
          </h1>
          <p className="lede">
            This SPA is the living rules console for the NU_ORDR project. Enter
            the hacking suite to tune breach matrices, time pressure, and dice
            outcomes.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/hacking">
              Enter Hacking Suite
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="scanline-card">
            <p className="label">Live Feed</p>
            <h3>City Node: Sector 12</h3>
            <p>
              Grid integrity: 68%. Memory leaks detected across the civic mesh.
              Breach protocols required.
            </p>
            <div className="status-grid">
              <div>
                <span className="status-label">Threat Index</span>
                <span className="status-value">CRITICAL</span>
              </div>
              <div>
                <span className="status-label">Signal</span>
                <span className="status-value">LOCKED</span>
              </div>
              <div>
                <span className="status-label">Node ID</span>
                <span className="status-value">NU-12X</span>
              </div>
            </div>
          </div>
          <div className="glyph-grid">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="glyph-cell">
                <span>▣</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
