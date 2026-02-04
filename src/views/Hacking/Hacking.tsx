import { HackingProvider } from "./_components/HackingContext";
import { HackSetupView } from "./_components/HackSetupView";
import { MatrixDiceView } from "./_components/MatrixDiceView";

export function Hacking() {
  return (
    <HackingProvider>
      <section className="page hacking-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Hacking Rule Set</p>
          </div>
        </div>
        <div className="setup-grid">
          <HackSetupView />
          <MatrixDiceView />
        </div>
      </section>
    </HackingProvider>
  );
}
