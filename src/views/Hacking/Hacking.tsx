import { HackSetupView } from "./_components/HackSetupView";
import { MatrixDiceView } from "./_components/MatrixDiceView";
import { HackingProvider } from "./_contexts/HackingContext";

import "./hacking.css";

export function Hacking() {
  return (
    <HackingProvider>
      <section className="page hacking-page">
        <div className="page-header">
          <p className="eyebrow">Hacking Rule Set</p>
        </div>
        <div className="setup-grid">
          <HackSetupView />
          <MatrixDiceView />
        </div>
      </section>
    </HackingProvider>
  );
}
