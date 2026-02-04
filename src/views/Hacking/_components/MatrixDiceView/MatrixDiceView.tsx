import { Button } from "../../../../components/Button";
import { Die } from "../../../../components/Die";
import { Panel } from "../../../../components/Panel";
import { useHackingContext } from "../HackingContext";

export function MatrixDiceView() {
  const {
    breachCode,
    matrixSize,
    timer,
    timeLeft,
    attempts,
    attemptsRemaining,
    selectedDice,
    activeDice,
    removedDice,
    successDice,
    lockedDice,
    matrixDiceLength,
    showDeepHackChoice,
    deepHackMode,
    hackPaused,
    hackInProgress,
    hackComplete,
    noActiveDiceRemaining,
    timerExpired,
    hackEnded,
    outcome,
    rollMatrix,
    rerollActiveDice,
    togglePause,
    startDeepHack,
    endHackNow,
    applyModification,
    toggleDieSelection,
  } = useHackingContext();

  const disableAction =
    attemptsRemaining <= 0 ||
    timerExpired ||
    hackEnded ||
    hackPaused ||
    showDeepHackChoice ||
    noActiveDiceRemaining;

  return (
    <Panel className="matrix-panel">
      <div className="panel-content">
        <div className="panel-header matrix-header">
          <div className="matrix-title">
            <h2 className="matrix-title-heading">Matrix Dice</h2>
            <span className="matrix-meta-inline">
              {matrixSize}d6 • {timer === 0 ? "No timer" : `${timer}s`}
            </span>
          </div>
          <div className="matrix-header-actions">
            <Button onClick={rollMatrix}>
              {matrixDiceLength === 0 ? "Start Hack" : "Reset Hack"}
            </Button>
            {matrixDiceLength > 0 ? (
              <Button variant="ghost" onClick={rerollActiveDice} disabled={disableAction}>
                Reroll Unlocked
              </Button>
            ) : null}
            {hackInProgress && timer > 0 ? (
              <Button variant="ghost" onClick={togglePause}>
                {hackPaused ? "Resume Hack" : "Pause Hack"}
              </Button>
            ) : null}
          </div>
        </div>
        <div className="matrix-body">
          {timer === 0 ? null : (
            <div className="matrix-timer">
              <div className="matrix-timer__header">
                <span className="badge-label">Timer</span>
                {showDeepHackChoice ? (
                  <span className="muted">Stopped (Full Access)</span>
                ) : deepHackMode ? (
                  <span className="muted">Stopped (Deep Hack)</span>
                ) : hackPaused ? (
                  <span className="muted">Paused</span>
                ) : (
                  <span className="timer-bar__label">{timeLeft}s</span>
                )}
              </div>
              {deepHackMode || showDeepHackChoice || hackPaused ? null : (
                <div className="timer-bar">
                  <div
                    className="timer-bar__fill"
                    style={{
                      width: `${(timeLeft / timer) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <div className="matrix-meta">
            <div className="attempts-remaining">
              Attempts remaining: <strong>{attemptsRemaining}</strong> / {attempts}
            </div>
          </div>
          {showDeepHackChoice ? (
            <div className="deep-hack-prompt">
              <span>Full access achieved. Dive deeper into subsystems?</span>
              <div className="matrix-actions">
                <Button variant="ghost" onClick={startDeepHack}>
                  Hack Deeper
                </Button>
                <Button variant="ghost" onClick={endHackNow}>
                  End Hack
                </Button>
              </div>
            </div>
            ) : null}
          {selectedDice.length === 2 ? (
            <div className="matrix-actions">
              <Button variant="ghost" onClick={() => applyModification("add")} disabled={disableAction}>
                Add Selected
              </Button>
              <Button
                variant="ghost"
                onClick={() => applyModification("subtract")}
                disabled={disableAction}
              >
                Subtract Selected
              </Button>
            </div>
          ) : null}
          <div className="dice-grid">
            {matrixDiceLength === 0 ? (
              <div className="empty-state">Awaiting matrix roll.</div>
            ) : (
              activeDice.map((die) => (
                <button
                  key={die.id}
                  type="button"
                  className={`die-button ${selectedDice.includes(die.id) ? "die-button--selected" : ""}`}
                  onClick={() => toggleDieSelection(die.id)}
                >
                  <Die value={die.value} glow={die.value === breachCode} />
                </button>
              ))
            )}
          </div>
          <div className="dice-removed">
            <span className="badge-label">Locked + Success</span>
            <div className="dice-removed-grid">
              {removedDice.length === 0 ? (
                <span className="muted">None yet.</span>
              ) : (
                removedDice.map((die) => (
                  <div
                    key={die.id}
                    className={`die-removed ${die.status === "success" ? "die-removed--success" : ""}`}
                  >
                    <Die value={die.value} glow={die.status === "success"} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className={`outcome-overlay ${hackComplete ? "outcome-overlay--open" : ""}`}>
          <div className="outcome-card">
            <div className="outcome-card-header">
              <span className="badge-label">Outcome</span>
              <strong>{outcome}</strong>
            </div>
            <div className="outcome-dice">
              <div className="outcome-dice-group">
                <span className="badge-label">Success Dice</span>
                <div className="outcome-dice-grid">
                  {successDice.length === 0 ? (
                    <span className="muted">None</span>
                  ) : (
                    successDice.map((die) => (
                      <div key={`success-${die.id}`} className="outcome-die">
                        <Die value={die.value} glow />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="outcome-dice-group">
                <span className="badge-label">Locked Dice</span>
                <div className="outcome-dice-grid">
                  {lockedDice.length === 0 ? (
                    <span className="muted">None</span>
                  ) : (
                    lockedDice.map((die) => (
                      <div key={`locked-${die.id}`} className="outcome-die">
                        <Die value={die.value} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
