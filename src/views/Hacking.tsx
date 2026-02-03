import { useMemo, useState } from "react";
import { Die } from "../components/Die";
import { difficulties, DifficultyId } from "../data/hacking";

const matrixSizes = [2, 4, 8, 16];
const timerOptions = [
  { label: "No timer", value: 0 },
  { label: "30 seconds", value: 30 },
  { label: "20 seconds", value: 20 },
  { label: "10 seconds", value: 10 },
];

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1;

export function Hacking() {
  const [difficultyId, setDifficultyId] = useState<DifficultyId>("normal");
  const [matrixSize, setMatrixSize] = useState(
    difficulties.normal.matrixSize
  );
  const [timer, setTimer] = useState(difficulties.normal.timer);
  const [breachCode, setBreachCode] = useState(rollDie(6));
  const [matrixDice, setMatrixDice] = useState<number[]>([]);
  const [knowledge, setKnowledge] = useState(2);
  const [attemptRoll, setAttemptRoll] = useState(rollDie(4));

  const attempts = useMemo(
    () => Math.max(1, knowledge + attemptRoll),
    [knowledge, attemptRoll]
  );

  const breachMatches = useMemo(
    () => matrixDice.filter((value) => value === breachCode).length,
    [matrixDice, breachCode]
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

  const handleDifficulty = (id: DifficultyId) => {
    setDifficultyId(id);
    setMatrixSize(difficulties[id].matrixSize);
    setTimer(difficulties[id].timer);
    setMatrixDice([]);
  };

  const rollBreach = () => setBreachCode(rollDie(6));

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
        <div className="badge-stack">
          <div className="badge">
            <span className="badge-label">Breach Code</span>
            <Die value={breachCode} size="lg" glow label="d6" />
            <button className="button button--ghost" onClick={rollBreach}>
              Roll Breach Code
            </button>
          </div>
          <div className="badge">
            <span className="badge-label">Attempts</span>
            <div className="attempts">
              <Die value={attemptRoll} size="sm" label="d4" />
              <div className="attempts-meta">
                <span>Knowledge</span>
                <input
                  className="input"
                  type="number"
                  value={knowledge}
                  onChange={(event) =>
                    setKnowledge(Number(event.target.value))
                  }
                />
              </div>
            </div>
            <div className="attempts-total">
              Attempts: <strong>{attempts}</strong>
            </div>
            <button className="button button--ghost" onClick={rollAttempts}>
              Roll Attempts
            </button>
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="panel">
          <h2>Difficulty Matrix</h2>
          <div className="difficulty-row">
            {(Object.keys(difficulties) as DifficultyId[]).map((id) => (
              <button
                key={id}
                className={`chip ${
                  difficultyId === id ? "chip--active" : ""
                }`}
                onClick={() => handleDifficulty(id)}
              >
                {difficulties[id].label}
              </button>
            ))}
          </div>
          <p className="muted">
            {difficulties[difficultyId].examples}
          </p>
          <div className="form-grid">
            <label className="field">
              Challenge Matrix (d6 count)
              <select
                value={matrixSize}
                onChange={(event) => {
                  setMatrixSize(Number(event.target.value));
                  setMatrixDice([]);
                }}
              >
                {matrixSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} dice
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Real-time Limit
              <select
                value={timer}
                onChange={(event) => setTimer(Number(event.target.value))}
              >
                {timerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="callout">
            <span>Active Matrix</span>
            <strong>
              {matrixSize}d6 • {timer === 0 ? "No timer" : `${timer}s`}
            </strong>
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
            <li>Each attempt allows one action: reroll, utilize a tool, or modify dice.</li>
            <li>After each attempt, locked or successful dice are set aside.</li>
            <li>Tools are single-use and shape the breach in different ways.</li>
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
            <li>Count matches to determine safeguard, failure, success, or full access.</li>
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
