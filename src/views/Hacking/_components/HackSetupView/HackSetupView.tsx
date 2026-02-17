import { Input } from "../../../../components/Input";
import { RadioGroup } from "../../../../components/RadioGroup";
import { Tooltip } from "../../../../components/Tooltip";
import { matrixSizes } from "../../_constants/matrix";
import { timerOptions } from "../../_constants/timer";
import { useHackingContext } from "../../_contexts/HackingContext";

import "./HackSetupView.css";

export function HackSetupView() {
  const {
    breachCode,
    attemptRoll,
    knowledge,
    attempts,
    matrixSize,
    timer,
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
    <div className="panel setup-panel panel-content">
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
            diceAction={{ label: "Roll d6", onClick: rollBreach }}
          />
        </div>
      </div>
      <div className="setup-section">
        <span className="badge-label">
          Breaching Attempts
          <Tooltip content="Attempts = max(1, Knowledge + d4 roll). Knowledge can be rolled as d4 - d4.">
            <span className="info-icon" aria-label="Attempts info">
              i
            </span>
          </Tooltip>
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
              diceAction={{ label: "Roll d4", onClick: rollAttempts }}
            />
          </label>
          <span className="equation-symbol">+</span>
          <label className="equation-field">
            <span className="equation-label">Knowledge</span>
            <Input
              className="equation-input"
              type="number"
              max={6}
              min={-3}
              value={knowledge}
              onChange={(event) =>
                handleKnowledgeChange(Number(event.target.value))
              }
              diceAction={{ label: "Roll d4 - d4", onClick: rollKnowledge }}
            />
          </label>
          <span className="equation-symbol">=</span>
          <div className="equation-field">
            <span className="equation-label">Attempts</span>
            <Input
              className="equation-input"
              type="number"
              value={attempts}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="setup-section">
        <span className="badge-label">Challenge Matrix</span>
        <RadioGroup
          name="matrix-size"
          value={matrixSize}
          options={matrixSizes.map((size) => ({
            value: size,
            label: `${size} d6`,
          }))}
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
    </div>
  );
}
