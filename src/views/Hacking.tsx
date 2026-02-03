import { useMemo, useState } from "react";
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
  const [matrixDice, setMatrixDice] = useState<number[]>([]);
  const [knowledge, setKnowledge] = useState(0);
  const [attemptRoll, setAttemptRoll] = useState(rollDie(4));

  const attempts = useMemo(
    () => Math.max(1, knowledge + attemptRoll),
    [knowledge, attemptRoll],
  );

  const breachMatches = useMemo(
    () => matrixDice.filter((value) => value === breachCode).length,
    [matrixDice, breachCode],
  );

  const outcome = useMemo(() => {
    if (matrixDice.length === 0) {
      return "Awaiting matrix roll.";
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
  }, [breachMatches, matrixDice.length, matrixSize]);

  const rollBreach = () => setBreachCode(rollDie(6));
  const rollKnowledge = () => setKnowledge(rollDie(4) - rollDie(4));
  const handleBreachInput = (value: string) => {
    const next = Number(value);
    if (Number.isNaN(next)) {
      return;
    }
    const clamped = Math.min(6, Math.max(1, next));
    setBreachCode(clamped);
  };

  const rollMatrix = () => {
    const next = Array.from({ length: matrixSize }, () => rollDie(6));
    setMatrixDice(next);
  };

  const rollAttempts = () => setAttemptRoll(rollDie(4));

  return (
    <section className="page hacking-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hacking Rule Set</p>
          <h1>System Breach Console</h1>
          <p className="lede">
            CY_BORG base protocol tuned for NU_ORDR. Configure the breach matrix
            and visualize your roll before you dive deeper.
          </p>
        </div>
      </div>

      <div className="setup-grid">
        <div className="panel setup-panel">
          <h2>Hack Setup</h2>
          <div className="callout">
            <span>Active Matrix</span>
            <strong>
              {matrixSize}d6 • {timer === 0 ? "No timer" : `${timer}s`}
            </strong>
          </div>
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
                  onChange={(event) => setKnowledge(Number(event.target.value))}
                />
              </label>
              <span className="equation-symbol">=</span>
              <div className="equation-field">
                <span className="equation-label">Attempts</span>
                <input
                  className="input equation-input"
                  type="number"
                  min={1}
                  max={4}
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
                      setMatrixDice([]);
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
                    onChange={() => setTimer(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Matrix Dice</h2>
            <button className="button" onClick={rollMatrix}>
              Roll Matrix
            </button>
          </div>
          <p className="muted">
            Matches to breach code: <strong>{breachMatches}</strong>
          </p>
          <div className="dice-grid">
            {matrixDice.length === 0 ? (
              <div className="empty-state">Awaiting matrix roll.</div>
            ) : (
              matrixDice.map((value, index) => (
                <Die
                  key={`${value}-${index}`}
                  value={value}
                  glow={value === breachCode}
                  sides={6}
                />
              ))
            )}
          </div>
          <div className="callout">
            <span>Outcome</span>
            <strong>{outcome}</strong>
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <h2>Performing the Hack</h2>
          <ul className="rule-list">
            <li>
              Each attempt allows one action: reroll, utilize a tool, or modify
              dice.
            </li>
            <li>
              After each attempt, locked or successful dice are set aside.
            </li>
            <li>
              Tools are single-use and shape the breach in different ways.
            </li>
          </ul>
          <div className="tool-grid">
            {[
              "Bit Shifter: adjust one die by ±1.",
              "Byte Shifter: adjust 2 by ±4, 4 by ±2, or 8 by ±1.",
              "Battering RAM: +d4 breaching attempts.",
              "Guide Dog: pre-roll matrix dice to lock early matches.",
              "Red Herring: double the time to hack.",
              "Jail Breaker: remove one lock.",
              "Buffer Stuffer: double dice next attempt and keep original count.",
              "Skeleton Key: add breach code or shrink matrix.",
              "Nuke: auto-access all subsystems on full access.",
            ].map((tool) => (
              <div key={tool} className="tool-card">
                {tool}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Setup + Resolution</h2>
          <ol className="rule-list">
            <li>PC needs a rootkit. Attempts = d4 + Knowledge (min 1).</li>
            <li>Roll d6 for breach code, select a challenge matrix.</li>
            <li>Set the timer, start the breach, and burn attempts.</li>
            <li>Hack ends when attempts, time, or the PC stops.</li>
            <li>
              Count matches to determine safeguard, failure, success, or full
              access.
            </li>
          </ol>
          <div className="callout">
            <span>Deep Hack</span>
            <strong>
              Full access before attempts end allows a subsystem dive with
              remaining attempts.
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
