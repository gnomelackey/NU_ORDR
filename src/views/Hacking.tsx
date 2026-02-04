import { useEffect, useMemo, useState } from "react";
import { Die } from "../components/Die";
import { difficulties } from "../data/hacking";

const matrixSizes = [2, 4, 8, 16];
const timerOptions = [
  { label: "No timer", value: 0 },
  { label: "30 seconds", value: 30 },
  { label: "20 seconds", value: 20 },
  { label: "10 seconds", value: 10 },
];

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1;

export function Hacking() {
  const [matrixSize, setMatrixSize] = useState(difficulties.normal.matrixSize);
  const [timer, setTimer] = useState(difficulties.normal.timer);
  const [breachCode, setBreachCode] = useState(rollDie(6));
  const [matrixDice, setMatrixDice] = useState<
    { id: string; value: number; status: "active" | "locked" | "success" }[]
  >([]);
  const [knowledge, setKnowledge] = useState(0);
  const [attemptRoll, setAttemptRoll] = useState(rollDie(4));
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [selectedDice, setSelectedDice] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [deepHackMode, setDeepHackMode] = useState(false);
  const [hackEnded, setHackEnded] = useState(false);
  const [subsystemsHacked, setSubsystemsHacked] = useState(0);

  const attempts = useMemo(
    () => Math.max(1, knowledge + attemptRoll),
    [knowledge, attemptRoll],
  );

  const attemptsRemaining = Math.max(0, attempts - attemptsUsed);

  const breachMatches = useMemo(
    () =>
      matrixDice.filter(
        (die) => die.status === "success" && die.value === breachCode,
      ).length,
    [matrixDice, breachCode],
  );

  const fullAccessAchieved = matrixDice.length > 0 && breachMatches === matrixSize;
  const timerExpired = !deepHackMode && timer > 0 && timeLeft === 0;
  const showDeepHackChoice =
    !deepHackMode && !hackEnded && fullAccessAchieved && attemptsRemaining > 0;

  const outcome = useMemo(() => {
    if (matrixDice.length === 0) {
      return "Awaiting matrix roll.";
    }
    if (deepHackMode) {
      if (subsystemsHacked === 0) {
        return "Deep hack failed — no subsystem breach achieved. Alert triggered.";
      }
      return `Deep hack complete — ${subsystemsHacked} subsystem(s) breached.`;
    }
    if (breachMatches === 0) {
      return "Safeguard Tripped — locked out + alert table + 1 stress.";
    }
    if (breachMatches < Math.ceil(matrixSize / 2)) {
      return "Failure — locked out of the system.";
    }
    if (breachMatches === matrixSize) {
      return "Complete Success — full access gained.";
    }
    return "Success — limited access gained.";
  }, [breachMatches, deepHackMode, matrixDice.length, matrixSize, subsystemsHacked]);

  const resetHackFromSetupChange = () => {
    setMatrixDice([]);
    setAttemptsUsed(0);
    setSelectedDice([]);
    setDeepHackMode(false);
    setHackEnded(false);
    setSubsystemsHacked(0);
    setTimeLeft(0);
  };

  const rollBreach = () => {
    setBreachCode(rollDie(6));
    resetHackFromSetupChange();
  };
  const rollKnowledge = () => {
    setKnowledge(rollDie(4) - rollDie(4));
    resetHackFromSetupChange();
  };
  const handleBreachInput = (value: string) => {
    const next = Number(value);
    if (Number.isNaN(next)) {
      return;
    }
    const clamped = Math.min(6, Math.max(1, next));
    setBreachCode(clamped);
    resetHackFromSetupChange();
  };

  const rollMatrix = () => {
    const next = Array.from({ length: matrixSize }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      value: rollDie(6),
      status: "active" as const,
    }));
    setMatrixDice(
      next.map((die) => ({
        ...die,
        status: die.value === breachCode ? "success" : "active",
      })),
    );
    setSelectedDice([]);
    setAttemptsUsed(0);
    setTimeLeft(timer);
    setDeepHackMode(false);
    setHackEnded(false);
    setSubsystemsHacked(0);
  };

  const rollAttempts = () => {
    setAttemptRoll(rollDie(4));
    resetHackFromSetupChange();
  };

  const endHackNow = () => {
    setHackEnded(true);
    setSelectedDice([]);
  };

  const startDeepHack = () => {
    const nextBreach = rollDie(6);
    const nextMatrix = Array.from({ length: matrixSize }, (_, index) => ({
      id: `deep-${Date.now()}-${index}`,
      value: rollDie(6),
      status: "active" as const,
    })).map((die) => ({
      ...die,
      status: (die.value === nextBreach ? "success" : "active") as
        | "active"
        | "success",
    }));

    setDeepHackMode(true);
    setHackEnded(false);
    setBreachCode(nextBreach);
    setMatrixDice(nextMatrix);
    setSubsystemsHacked(nextMatrix.filter((die) => die.status === "success").length);
    setTimeLeft(0);
    setSelectedDice([]);
  };

  const toggleDieSelection = (id: string) => {
    setSelectedDice((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const applyModification = (mode: "add" | "subtract") => {
    if (
      attemptsRemaining <= 0 ||
      selectedDice.length !== 2 ||
      timerExpired ||
      hackEnded ||
      showDeepHackChoice
    ) {
      return;
    }
    const [targetId, modifierId] = selectedDice;
    setMatrixDice((prev) =>
      prev.map((die) => {
        if (die.id === targetId) {
          const modifier = prev.find((item) => item.id === modifierId);
          if (!modifier) {
            return die;
          }
          const raw =
            mode === "add"
              ? die.value + modifier.value
              : die.value - modifier.value;
          const nextValue = Math.min(6, Math.max(1, raw));
          const matches = nextValue === breachCode;
          return {
            ...die,
            value: nextValue,
            status: matches ? "success" : die.status,
          };
        }
        if (die.id === modifierId) {
          const target = prev.find((item) => item.id === targetId);
          if (!target) {
            return die;
          }
          const raw =
            mode === "add"
              ? target.value + die.value
              : target.value - die.value;
          const nextValue = Math.min(6, Math.max(1, raw));
          const matches = nextValue === breachCode;
          return {
            ...die,
            status: matches ? "locked" : die.status,
          };
        }
        return die;
      }),
    );
    setAttemptsUsed((prev) => prev + 1);
    setSelectedDice([]);
  };

  const rerollActiveDice = () => {
    if (
      attemptsRemaining <= 0 ||
      matrixDice.length === 0 ||
      timerExpired ||
      hackEnded ||
      showDeepHackChoice
    ) {
      return;
    }
    setMatrixDice((prev) =>
      prev.map((die) => {
        if (die.status !== "active") {
          return die;
        }
        const nextValue = rollDie(6);
        return {
          ...die,
          value: nextValue,
          status: nextValue === breachCode ? "success" : "active",
        };
      }),
    );
    setAttemptsUsed((prev) => prev + 1);
    setSelectedDice([]);
  };

  useEffect(() => {
    if (timer === 0 || matrixDice.length === 0) {
      setTimeLeft(timer);
      return;
    }
    if (attemptsRemaining === 0 || timeLeft === 0 || deepHackMode || hackEnded) {
      return;
    }
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timer, matrixDice.length, attemptsRemaining, timeLeft, deepHackMode, hackEnded]);

  useEffect(() => {
    if (!deepHackMode) {
      return;
    }
    setSubsystemsHacked(
      matrixDice.filter((die) => die.status === "success").length,
    );
  }, [deepHackMode, matrixDice]);

  useEffect(() => {
    if (showDeepHackChoice && timeLeft > 0) {
      setTimeLeft(0);
    }
  }, [showDeepHackChoice, timeLeft]);

  const activeDice = matrixDice.filter((die) => die.status === "active");
  const removedDice = matrixDice.filter(
    (die) => die.status === "locked" || die.status === "success",
  );

  return (
    <section className="page hacking-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hacking Rule Set</p>
        </div>
      </div>

      <div className="setup-grid">
        <div className="panel setup-panel">
          <h2>Hack Setup</h2>
          <div className="setup-section">
            <span className="badge-label">Breach Code</span>
            <div className="breach-input">
              <input
                className="input"
                type="number"
                min={1}
                max={6}
                value={breachCode}
                onChange={(event) => handleBreachInput(event.target.value)}
              />
              <button className="button button--ghost" onClick={rollBreach}>
                Roll d6
              </button>
            </div>
          </div>

          <div className="setup-section">
            <span className="badge-label">
              Breaching Attempts
              <span
                className="info-icon"
                data-tooltip="Attempts = max(1, Knowledge + d4 roll). Knowledge can be rolled as d4 - d4."
                aria-label="Attempts info"
              >
                i
              </span>
            </span>
            <div className="attempts-equation">
              <label className="equation-field">
                <span className="equation-label">d4 Roll</span>
                <input
                  className="input equation-input"
                  type="number"
                  min={1}
                  max={4}
                  value={attemptRoll}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isNaN(next)) {
                      return;
                    }
                    setAttemptRoll(Math.min(4, Math.max(1, next)));
                    resetHackFromSetupChange();
                  }}
                />
              </label>
              <span className="equation-symbol">+</span>
              <label className="equation-field">
                <span className="equation-label">Knowledge</span>
                <input
                  className="input equation-input"
                  type="number"
                  value={knowledge}
                  onChange={(event) => {
                    setKnowledge(Number(event.target.value));
                    resetHackFromSetupChange();
                  }}
                />
              </label>
              <span className="equation-symbol">=</span>
              <div className="equation-field">
                <span className="equation-label">Attempts</span>
                <input
                  className="input equation-input"
                  type="number"
                  value={attempts}
                  disabled
                />
              </div>
            </div>
            <div className="attempt-actions">
              <button className="button button--ghost" onClick={rollAttempts}>
                Roll d4
              </button>
              <button className="button button--ghost" onClick={rollKnowledge}>
                Roll Knowledge (d4 - d4)
              </button>
            </div>
          </div>

          <div className="setup-section">
            <span className="badge-label">Challenge Matrix</span>
            <div className="radio-group">
              {matrixSizes.map((size) => (
                <label key={size} className="radio-item">
                  <input
                    type="radio"
                    name="matrix-size"
                    value={size}
                    checked={matrixSize === size}
                    onChange={() => {
                      setMatrixSize(size);
                      resetHackFromSetupChange();
                    }}
                  />
                  <span>{size} d6</span>
                </label>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <span className="badge-label">Real-time Limit</span>
            <div className="radio-group">
              {timerOptions.map((option) => (
                <label key={option.value} className="radio-item">
                  <input
                    type="radio"
                    name="timer"
                    value={option.value}
                    checked={timer === option.value}
                    onChange={() => {
                      setTimer(option.value);
                      resetHackFromSetupChange();
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="matrix-title">
              <h2 className="matrix-title-heading">Matrix Dice</h2>
              <span className="matrix-meta-inline">
                {matrixSize}d6 • {timer === 0 ? "No timer" : `${timer}s`}
              </span>
            </div>
            <div className="matrix-header-actions">
              <button className="button" onClick={rollMatrix}>
                {matrixDice.length === 0 ? "Start Hack" : "Reset Hack"}
              </button>
              <button
                className="button button--ghost"
                onClick={rerollActiveDice}
                disabled={
                  matrixDice.length === 0 ||
                  attemptsRemaining <= 0 ||
                  timerExpired ||
                  hackEnded ||
                  showDeepHackChoice
                }
              >
                Reroll Unlocked
              </button>
            </div>
          </div>
          <div className="matrix-timer">
            <div className="matrix-timer__header">
              <span className="badge-label">Timer</span>
              {showDeepHackChoice ? (
                <span className="muted">Stopped (Full Access)</span>
              ) : deepHackMode ? (
                <span className="muted">Stopped (Deep Hack)</span>
              ) : timer === 0 ? (
                <span className="muted">No timer</span>
              ) : (
                <span className="timer-bar__label">{timeLeft}s</span>
              )}
            </div>
            {timer === 0 || deepHackMode || showDeepHackChoice ? null : (
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
          <div className="matrix-meta">
            <div className="attempts-remaining">
              Attempts remaining: <strong>{attemptsRemaining}</strong> /{" "}
              {attempts}
            </div>
          </div>
          {showDeepHackChoice ? (
            <div className="deep-hack-prompt">
              <span>
                Full access achieved. Dive deeper into subsystems?
              </span>
              <div className="matrix-actions">
                <button className="button button--ghost" onClick={startDeepHack}>
                  Hack Deeper
                </button>
                <button className="button button--ghost" onClick={endHackNow}>
                  End Hack
                </button>
              </div>
            </div>
          ) : null}
          {selectedDice.length === 2 ? (
            <div className="matrix-actions">
              <button
                className="button button--ghost"
                onClick={() => applyModification("add")}
                disabled={
                  attemptsRemaining <= 0 ||
                  timerExpired ||
                  hackEnded ||
                  showDeepHackChoice
                }
              >
                Add Selected
              </button>
              <button
                className="button button--ghost"
                onClick={() => applyModification("subtract")}
                disabled={
                  attemptsRemaining <= 0 ||
                  timerExpired ||
                  hackEnded ||
                  showDeepHackChoice
                }
              >
                Subtract Selected
              </button>
            </div>
          ) : null}
          <div className="dice-grid">
            {matrixDice.length === 0 ? (
              <div className="empty-state">Awaiting matrix roll.</div>
            ) : (
              activeDice.map((die) => (
                <button
                  key={die.id}
                  type="button"
                  className={`die-button ${
                    selectedDice.includes(die.id) ? "die-button--selected" : ""
                  }`}
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
                    className={`die-removed ${
                      die.status === "success" ? "die-removed--success" : ""
                    }`}
                  >
                    <Die value={die.value} glow={die.status === "success"} />
                  </div>
                ))
              )}
            </div>
          </div>
          {matrixDice.length > 0 &&
          !showDeepHackChoice &&
          (hackEnded || attemptsRemaining === 0 || timerExpired) ? (
            <div className="callout">
              <span>Outcome</span>
              <strong>{outcome}</strong>
            </div>
          ) : null}
        </div>
      </div>

    </section>
  );
}
