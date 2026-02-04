import { Button } from "../../../../components/Button";
import { Input } from "../../../../components/Input";
import { Panel } from "../../../../components/Panel";
import { RadioGroup } from "../../../../components/RadioGroup";
import { useHackingContext } from "../HackingContext";

export function HackSetupView() {
  const {
    breachCode,
    attemptRoll,
    knowledge,
    attempts,
    matrixSize,
    timer,
    matrixSizes,
    timerOptions,
    handleBreachInput,
    rollBreach,
    handleAttemptRollChange,
    handleKnowledgeChange,
    rollAttempts,
    rollKnowledge,
    handleMatrixSizeChange,
    handleTimerChange,
  } = useHackingContext();

  return (
    <Panel className="setup-panel panel-content">
      <h2>Hack Setup</h2>
      <div className="setup-section">
        <span className="badge-label">Breach Code</span>
        <div className="breach-input">
          <Input
            type="number"
            min={1}
            max={6}
            value={breachCode}
            onChange={(event) => handleBreachInput(event.target.value)}
          />
          <Button variant="ghost" onClick={rollBreach}>
            Roll d6
          </Button>
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
            <Input
              className="equation-input"
              type="number"
              min={1}
              max={4}
              value={attemptRoll}
              onChange={(event) =>
                handleAttemptRollChange(Number(event.target.value))
              }
            />
          </label>
          <span className="equation-symbol">+</span>
          <label className="equation-field">
            <span className="equation-label">Knowledge</span>
            <Input
              className="equation-input"
              type="number"
              value={knowledge}
              onChange={(event) =>
                handleKnowledgeChange(Number(event.target.value))
              }
            />
          </label>
          <span className="equation-symbol">=</span>
          <div className="equation-field">
            <span className="equation-label">Attempts</span>
            <Input className="equation-input" type="number" value={attempts} disabled />
          </div>
        </div>
        <div className="attempt-actions">
          <Button variant="ghost" onClick={rollAttempts}>
            Roll d4
          </Button>
          <Button variant="ghost" onClick={rollKnowledge}>
            Roll Knowledge (d4 - d4)
          </Button>
        </div>
      </div>

      <div className="setup-section">
        <span className="badge-label">Challenge Matrix</span>
        <RadioGroup
          name="matrix-size"
          value={matrixSize}
          options={matrixSizes.map((size) => ({ value: size, label: `${size} d6` }))}
          onChange={handleMatrixSizeChange}
        />
      </div>

      <div className="setup-section">
        <span className="badge-label">Real-time Limit</span>
        <RadioGroup
          name="timer"
          value={timer}
          options={timerOptions}
          onChange={handleTimerChange}
        />
      </div>
    </Panel>
  );
}
