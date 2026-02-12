import { useMemo, useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { RadioGroup } from "../../components/RadioGroup";

import "./pursuit.css";

type PursuitType = "running" | "netrunning" | "driving" | "other";

type PC = {
  id: string;
  name: string;
  stat: number;
  active: boolean;
};

type RollResult = {
  pcRolls: { id: string; name: string; total: number }[];
  npcRoll: number;
  highestPc: { id: string; name: string; total: number } | null;
  baseDelta: number;
  attackDelta: number;
  defenseDelta: number;
  totalDelta: number;
};

const pursuitOptions = [
  { value: "running", label: "Running (Agility)" },
  { value: "netrunning", label: "Netrunning (Knowledge)" },
  { value: "driving", label: "Driving (Presence)" },
  { value: "other", label: "Everything Else (Strength)" },
];

const attackOptions = [
  { value: "none", label: "No Attack" },
  { value: "hit", label: "Hit (+d6)" },
  { value: "crit", label: "Crit (+2d6)" },
  { value: "fumble", label: "Fumble (-d6)" },
];

const defenseOptions = [
  { value: "none", label: "No Defense Roll" },
  { value: "fail", label: "Fail (-d6)" },
  { value: "fumble", label: "Fumble (-2d6)" },
  { value: "crit", label: "Crit (+d6)" },
];

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function PursuitSimulator() {
  const [pursuitType, setPursuitType] = useState<PursuitType>("running");
  const [pcs, setPcs] = useState<PC[]>([
    { id: "pc-1", name: "PC 1", stat: 2, active: true },
    { id: "pc-2", name: "PC 2", stat: 1, active: true },
  ]);
  const [npcStat, setNpcStat] = useState(2);
  const [tracker, setTracker] = useState(10);
  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [hotPursuit, setHotPursuit] = useState(false);
  const [attackOutcome, setAttackOutcome] = useState("none");
  const [defenseOutcome, setDefenseOutcome] = useState("none");
  const [aidPcId, setAidPcId] = useState<string>("");

  const activePcs = useMemo(() => pcs.filter((pc) => pc.active), [pcs]);
  const pursuitLabel =
    pursuitOptions.find((option) => option.value === pursuitType)?.label ??
    "Pursuit";

  const updatePc = (id: string, patch: Partial<PC>) => {
    setPcs((prev) =>
      prev.map((pc) => (pc.id === id ? { ...pc, ...patch } : pc)),
    );
  };

  const addPc = () => {
    setPcs((prev) => [
      ...prev,
      {
        id: `pc-${prev.length + 1}`,
        name: `PC ${prev.length + 1}`,
        stat: 0,
        active: true,
      },
    ]);
  };

  const removePc = (id: string) => {
    setPcs((prev) => prev.filter((pc) => pc.id !== id));
  };

  const computeBaseDeltaDetailed = (pcTotal: number, npcTotal: number) => {
    if (npcTotal > pcTotal * 2) {
      const rolls = [rollDie(6), rollDie(6)];
      return { delta: -(rolls[0] + rolls[1]), rolls, label: "2d6" };
    }
    if (npcTotal < pcTotal / 2) {
      const rolls = [rollDie(6), rollDie(6)];
      return { delta: rolls[0] + rolls[1], rolls, label: "2d6" };
    }
    if (npcTotal > pcTotal) {
      const rolls = [rollDie(6)];
      return { delta: -rolls[0], rolls, label: "d6" };
    }
    if (npcTotal < pcTotal) {
      const rolls = [rollDie(6)];
      return { delta: rolls[0], rolls, label: "d6" };
    }
    return { delta: 0, rolls: [], label: "-" };
  };

  const computeHotDeltaDetailed = (type: "attack" | "defense") => {
    if (!hotPursuit) {
      return {
        delta: 0,
        rolls: [],
        label: type === "attack" ? "Attack" : "Defense",
      };
    }
    const outcome = type === "attack" ? attackOutcome : defenseOutcome;
    if (outcome === "hit") {
      const rolls = [rollDie(6)];
      return {
        delta: rolls[0],
        rolls,
        label: type === "attack" ? "Attack d6" : "Defense d6",
      };
    }
    if (outcome === "crit") {
      const rolls = [rollDie(6), rollDie(6)];
      return {
        delta: rolls[0] + rolls[1],
        rolls,
        label: type === "attack" ? "Attack 2d6" : "Defense 2d6",
      };
    }
    if (outcome === "fumble" && type === "defense") {
      const rolls = [rollDie(6), rollDie(6)];
      return { delta: -(rolls[0] + rolls[1]), rolls, label: "Defense 2d6" };
    }
    if (outcome === "fumble" || outcome === "fail") {
      const rolls = [rollDie(6)];
      return {
        delta: -rolls[0],
        rolls,
        label: type === "attack" ? "Attack d6" : "Defense d6",
      };
    }
    return {
      delta: 0,
      rolls: [],
      label: type === "attack" ? "Attack" : "Defense",
    };
  };

  const formatRolls = (label: string, rolls: number[]) => {
    if (!rolls.length) {
      return "";
    }
    return `${label} [${rolls.join("+")}]`;
  };

  const rollSetup = () => {
    const pcRolls = activePcs.map((pc) => ({
      id: pc.id,
      name: pc.name,
      total: rollDie(20) + pc.stat,
    }));
    const npcRoll = rollDie(20) + npcStat;
    const highest = pcRolls.sort((a, b) => b.total - a.total)[0] ?? null;

    let start = 10;
    if (highest) {
      if (npcRoll > highest.total * 2) {
        start = 5;
      } else if (npcRoll < highest.total / 2) {
        start = 15;
      }
    }

    setTracker(start);
    setLastRoll({
      pcRolls,
      npcRoll,
      highestPc: highest,
      baseDelta: 0,
      attackDelta: 0,
      defenseDelta: 0,
      totalDelta: 0,
    });
    setLog((prev) => [
      `Setup: ${highest?.name ?? "No PC"} vs NPC (${npcRoll}) → Tracker ${start}.`,
      ...prev,
    ]);
  };

  const runRound = () => {
    if (tracker <= 1 || tracker >= 20) {
      return;
    }
    const pcRolls = activePcs.map((pc) => ({
      id: pc.id,
      name: pc.name,
      total: rollDie(20) + pc.stat,
    }));
    const npcRoll = rollDie(20) + npcStat;
    const highest = pcRolls.sort((a, b) => b.total - a.total)[0] ?? null;

    const baseDetail = highest
      ? computeBaseDeltaDetailed(highest.total, npcRoll)
      : (() => {
          const roll = rollDie(6);
          return { delta: -roll, rolls: [roll], label: "d6" };
        })();
    const attackDetail = computeHotDeltaDetailed("attack");
    const defenseDetail = computeHotDeltaDetailed("defense");
    const baseDelta = baseDetail.delta;
    const attackDelta = attackDetail.delta;
    const defenseDelta = defenseDetail.delta;
    const totalDelta = baseDelta + attackDelta + defenseDelta;
    const nextTracker = clamp(tracker + totalDelta, 1, 20);

    const rollDetails = [
      formatRolls(baseDetail.label, baseDetail.rolls),
      formatRolls(attackDetail.label, attackDetail.rolls),
      formatRolls(defenseDetail.label, defenseDetail.rolls),
    ]
      .filter(Boolean)
      .join(" · ");

    setTracker(nextTracker);
    setLastRoll({
      pcRolls,
      npcRoll,
      highestPc: highest,
      baseDelta,
      attackDelta,
      defenseDelta,
      totalDelta,
    });
    setLog((prev) => {
      const detailSuffix = rollDetails ? ` | Rolls: ${rollDetails}` : "";
      return [
        `Round: ${highest?.name ?? "No PC"} ${highest?.total ?? 0} vs NPC ${npcRoll} → ${totalDelta >= 0 ? "+" : ""}${totalDelta} (tracker ${nextTracker}).${detailSuffix}`,
        ...prev,
      ];
    });
  };

  const applyAid = () => {
    if (!lastRoll?.highestPc || !aidPcId) {
      return;
    }
    const aidingPc = pcs.find((pc) => pc.id === aidPcId);
    if (!aidingPc) {
      return;
    }

    const reroll =
      rollDie(20) +
      (pcs.find((pc) => pc.id === lastRoll.highestPc?.id)?.stat ?? 0);
    const highestTotal = Math.max(lastRoll.highestPc.total, reroll);
    const baseDetail = computeBaseDeltaDetailed(highestTotal, lastRoll.npcRoll);
    const baseDelta = baseDetail.delta;
    const totalDelta = baseDelta + lastRoll.attackDelta + lastRoll.defenseDelta;
    const nextTracker = clamp(
      tracker + (totalDelta - lastRoll.totalDelta),
      1,
      20,
    );

    setTracker(nextTracker);
    setLastRoll({
      ...lastRoll,
      highestPc: {
        ...lastRoll.highestPc,
        total: highestTotal,
      },
      baseDelta,
      totalDelta,
    });
    setPcs((prev) =>
      prev.map((pc) => (pc.id === aidPcId ? { ...pc, active: false } : pc)),
    );
    setAidPcId("");
    setLog((prev) => [
      `Aid: ${aidingPc.name} assists. Reroll to ${highestTotal}. Tracker ${nextTracker}.`,
      ...prev,
    ]);
  };

  const trackerState =
    tracker <= 1 ? "NPCs escape" : tracker >= 20 ? "PCs catch NPCs" : "Ongoing";
  const trackerStateClass =
    trackerState === "PCs catch NPCs"
      ? "tracker-card--success"
      : trackerState === "NPCs escape"
        ? "tracker-card--fail"
        : "tracker-card--ongoing";

  return (
    <section className="page pursuit-page">
      <div className="page-header">
        <p className="eyebrow">Pursuit Simulator</p>
      </div>

      <div className="setup-grid pursuit-grid">
        <div className="panel setup-panel panel-content">
          <h2>Setup</h2>
          <div className="setup-section">
            <span className="badge-label">Pursuit Type</span>
            <RadioGroup
              name="pursuit-type"
              value={pursuitType}
              options={pursuitOptions}
              onChange={(value) => setPursuitType(value as PursuitType)}
            />
          </div>

          <div className="setup-section">
            <span className="badge-label">NPC Modifier</span>
            <Input
              type="number"
              value={npcStat}
              max={6}
              min={-3}
              onChange={(event) => setNpcStat(Number(event.target.value))}
            />
          </div>

          <div className="setup-section">
            <div className="pc-row pc-row--header">
              <span className="badge-label">PCs</span>
              <span className="badge-label">Mod</span>
              <span className="badge-label" aria-hidden="true" />
              <span className="badge-label" aria-hidden="true" />
            </div>
            <div className="pc-list">
              {pcs.map((pc) => (
                <div key={pc.id} className="pc-row">
                  <Input
                    value={pc.name}
                    onChange={(event) =>
                      updatePc(pc.id, { name: event.target.value })
                    }
                  />
                  <Input
                    type="number"
                    value={pc.stat}
                    onChange={(event) =>
                      updatePc(pc.id, { stat: Number(event.target.value) })
                    }
                  />
                  <Button
                    variant="ghost"
                    onClick={() => updatePc(pc.id, { active: !pc.active })}
                  >
                    {pc.active ? "Active" : "Out"}
                  </Button>
                  <Button variant="ghost" onClick={() => removePc(pc.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="ghost" onClick={addPc}>
              Add PC
            </Button>
          </div>

          <div className="setup-section">
            <label className="radio-item">
              <input
                type="checkbox"
                checked={hotPursuit}
                onChange={(event) => setHotPursuit(event.target.checked)}
              />
              <span>Hot Pursuit</span>
            </label>
          </div>

          {hotPursuit ? (
            <div className="setup-section">
              <span className="badge-label">Hot Pursuit Actions</span>
              <RadioGroup
                name="attack-outcome"
                value={attackOutcome}
                options={attackOptions}
                onChange={setAttackOutcome}
              />
              <RadioGroup
                name="defense-outcome"
                value={defenseOutcome}
                options={defenseOptions}
                onChange={setDefenseOutcome}
              />
            </div>
          ) : null}

          <div className="setup-section">
            <Button onClick={rollSetup}>Roll Setup</Button>
          </div>
        </div>

        <div className="panel matrix-panel">
          <div className="panel-content">
            <div className="panel-header pursuit-header">
              <div className="matrix-title">
                <h2 className="matrix-title-heading">Pursuit Tracker</h2>
                <span className="matrix-meta-inline">{pursuitLabel}</span>
              </div>
              <div className="matrix-header-actions">
                <Button onClick={runRound}>Run Round</Button>
              </div>
            </div>
            <div className="pursuit-content">
              <div className={`tracker-card ${trackerStateClass}`}>
                <div className="tracker-value">{tracker}</div>
                <div className="tracker-status">{trackerState}</div>
              </div>

              {lastRoll ? (
                <div className="panel pursuit-panel">
                  <span className="badge-label">Last Roll</span>
                  <div className="roll-summary">
                    {lastRoll.pcRolls.map((pc) => (
                      <span key={pc.id}>
                        {pc.name}: {pc.total}
                      </span>
                    ))}
                    <span>NPC: {lastRoll.npcRoll}</span>
                  </div>
                  <div className="roll-summary">
                    Base Δ: {lastRoll.baseDelta} | Hot Δ:{" "}
                    {lastRoll.attackDelta + lastRoll.defenseDelta} | Total Δ:{" "}
                    {lastRoll.totalDelta}
                  </div>
                </div>
              ) : null}

              {lastRoll &&
              lastRoll.highestPc &&
              lastRoll.highestPc.total <= lastRoll.npcRoll &&
              activePcs.length > 1 ? (
                <div className="panel pursuit-panel">
                  <span className="badge-label">Aid</span>
                  <select
                    className="pursuit-select"
                    value={aidPcId}
                    onChange={(event) => setAidPcId(event.target.value)}
                  >
                    <option value="">Select aiding PC</option>
                    {activePcs
                      .filter((pc) => pc.id !== lastRoll.highestPc?.id)
                      .map((pc) => (
                        <option key={pc.id} value={pc.id}>
                          {pc.name}
                        </option>
                      ))}
                  </select>
                  <Button variant="ghost" onClick={applyAid}>
                    Apply Aid
                  </Button>
                </div>
              ) : null}

              <div className="panel pursuit-panel">
                <span className="badge-label">Log</span>
                <ul className="log-list">
                  {log.length === 0 ? (
                    <li className="muted">No rounds yet.</li>
                  ) : (
                    log.map((entry, index) => <li key={index}>{entry}</li>)
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
