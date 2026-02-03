import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="page">
      <div className="panel">
        <h2>Signal Lost</h2>
        <p>That node is offline or has been wiped from the grid.</p>
        <Link className="button button--ghost" to="/">
          Return to Overview
        </Link>
      </div>
    </section>
  );
}
