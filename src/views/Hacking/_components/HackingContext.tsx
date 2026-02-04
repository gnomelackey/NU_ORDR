import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { difficulties } from "../../../data/hacking";
import type { MatrixDie } from "./types";

const matrixSizes = [2, 4, 8, 16];

const timerOptions = [
  { label: "No timer", value: 0 },
  { label: "30 seconds", value: 30 },
  { label: "20 seconds", value: 20 },
  { label: "10 seconds", value: 10 },
];

const rollDie = (sides: number) => Math.floor(Math.random() * sides) + 1;

type HackingContextValue = {
  applyModification: (mode: "add" | "subtract") => void;
  endHackNow: () => void;
  handleAttemptRollChange: (value: number) => void;
  handleBreachInput: (value: string) => void;
  handleKnowledgeChange: (value: number) => void;
  handleMatrixSizeChange: (size: number) => void;
  handleTimerChange: (value: number) => void;
  rerollActiveDice: () => void;
  rollAttempts: () => void;
  rollBreach: () => void;
  rollKnowledge: () => void;
  rollMatrix: () => void;
  startDeepHack: () => void;
  toggleDieSelection: (id: string) => void;
  togglePause: () => void;
  activeDice: MatrixDie[];
  attemptRoll: number;
  attempts: number;
  attemptsRemaining: number;
  breachCode: number;
  deepHackMode: boolean;
  hackComplete: boolean;
  hackEnded: boolean;
  hackInProgress: boolean;
  hackPaused: boolean;
  knowledge: number;
  lockedDice: MatrixDie[];
  matrixDiceLength: number;
  matrixSize: number;
  matrixSizes: number[];
  noActiveDiceRemaining: boolean;
  outcome: string;
  removedDice: MatrixDie[];
  selectedDice: string[];
  showDeepHackChoice: boolean;
  successDice: MatrixDie[];
  timeLeft: number;
  timer: number;
  timerExpired: boolean;
  timerOptions: { label: string; value: number }[];
};

const HackingContext = createContext<HackingContextValue | null>(null);

function calculateDiceValue(
  die: MatrixDie,
  target: MatrixDie,
  breachCode: number,
  status: "locked" | "success",
  mode: "add" | "subtract",
): MatrixDie {
  const isAddition = mode === "add";
  const raw = isAddition ? target.value + die.value : target.value - die.value;

  const nextValue = Math.min(6, Math.max(1, raw));
  const matches = nextValue === breachCode;

  return {
    ...die,
    status: matches ? status : die.status,
  };
}

function matrixCompleted(dice: MatrixDie[]) {
  return dice.every(
    (die) => die.status === "locked" || die.status === "success",
  );
}

function buildMatrix(size: number, breach: number): MatrixDie[] {
  const matrix = Array.from({ length: size }, (_, index) => ({
    id: `deep-${Date.now()}-${index}`,
    value: rollDie(6),
    status: "active" as const,
  }));

  return matrix.map((die) => ({
    ...die,
    status: die.value === breach ? "success" : "active",
  }));
}

export function HackingProvider({ children }: { children: ReactNode }) {
  const [attemptRoll, setAttemptRoll] = useState(rollDie(4));
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [breachCode, setBreachCode] = useState(rollDie(6));
  const [deepHackMode, setDeepHackMode] = useState(false);
  const [hackEnded, setHackEnded] = useState(false);
  const [hackPaused, setHackPaused] = useState(false);
  const [knowledge, setKnowledge] = useState(0);
  const [matrixDice, setMatrixDice] = useState<MatrixDie[]>([]);
  const [matrixSize, setMatrixSize] = useState(difficulties.normal.matrixSize);
  const [selectedDice, setSelectedDice] = useState<string[]>([]);
  const [subsystemsHacked, setSubsystemsHacked] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulties.normal.timer);
  const [timer, setTimer] = useState(difficulties.normal.timer);

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

  const hasMatrix = matrixDice.length > 0;
  const noActiveDiceRemaining = hasMatrix && matrixCompleted(matrixDice);
  const fullAccessAchieved = hasMatrix && breachMatches === matrixSize;
  const timerExpired = !deepHackMode && timer > 0 && timeLeft === 0;
  const outOfAttempts = attemptsRemaining <= 0;

  const showDeepHackChoice =
    !deepHackMode && !hackEnded && fullAccessAchieved && !outOfAttempts;

  const hasEndCondition =
    hackEnded || outOfAttempts || timerExpired || noActiveDiceRemaining;

  const hackComplete = hasMatrix && !showDeepHackChoice && hasEndCondition;
  const hackInProgress = hasMatrix && !hackComplete && !showDeepHackChoice;

  const activeDice = matrixDice.filter((die) => die.status === "active");
  const successDice = matrixDice.filter((die) => die.status === "success");
  const lockedDice = matrixDice.filter((die) => die.status === "locked");
  const removedDice = matrixDice.filter((die) => {
    return die.status === "locked" || die.status === "success";
  });

  const outcome = useMemo(() => {
    if (!hasMatrix) {
      return "Awaiting matrix roll.";
    }
    if (deepHackMode) {
      return subsystemsHacked === 0
        ? "Deep hack failed — no subsystem breach achieved. Alert triggered."
        : `Deep hack complete — ${subsystemsHacked} subsystem(s) breached.`;
    }
    if (breachMatches === 0) {
      return `Safeguard Tripped — locked out + alert table + 1 stress.`;
    }
    if (breachMatches < Math.ceil(matrixSize / 2)) {
      return `Failure — locked out of the system.`;
    }
    if (breachMatches === matrixSize) {
      return `Complete Success — full access gained.`;
    }
    return "Success — limited access gained.";
  }, [
    hasMatrix,
    breachMatches,
    deepHackMode,
    matrixDice.length,
    matrixSize,
    subsystemsHacked,
  ]);

  const resetHackFromSetupChange = () => {
    setAttemptsUsed(0);
    setDeepHackMode(false);
    setHackEnded(false);
    setHackPaused(false);
    setMatrixDice([]);
    setSelectedDice([]);
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
    if (Number.isNaN(next)) return;

    const clamped = Math.min(6, Math.max(1, next));
    setBreachCode(clamped);
    resetHackFromSetupChange();
  };

  const rollMatrix = () => {
    const matrix = buildMatrix(matrixSize, breachCode);

    setAttemptsUsed(0);
    setDeepHackMode(false);
    setHackEnded(false);
    setHackPaused(false);
    setMatrixDice(matrix);
    setSelectedDice([]);
    setSubsystemsHacked(0);
    setTimeLeft(timer);
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
    const nextMatrix = buildMatrix(matrixSize, nextBreach);
    const subsystemsHacked = nextMatrix.filter(
      (die) => die.status === "success",
    ).length;

    setBreachCode(nextBreach);
    setDeepHackMode(true);
    setHackEnded(false);
    setHackPaused(false);
    setMatrixDice(nextMatrix);
    setSelectedDice([]);
    setSubsystemsHacked(subsystemsHacked);
    setTimeLeft(0);
  };

  const toggleDieSelection = (id: string) => {
    setSelectedDice((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const applyModification = (mode: "add" | "subtract") => {
    const noSelectedDice = selectedDice.length !== 2;

    if (
      outOfAttempts ||
      noSelectedDice ||
      timerExpired ||
      hackEnded ||
      hackPaused ||
      showDeepHackChoice
    ) {
      return;
    }

    const [targetId, modifierId] = selectedDice;

    setMatrixDice((prev) =>
      prev.map((die) => {
        if (die.id === targetId) {
          const modifier = prev.find((item) => item.id === modifierId);
          if (!modifier) return die;
          return calculateDiceValue(die, modifier, breachCode, "success", mode);
        }

        if (die.id === modifierId) {
          const target = prev.find((item) => item.id === targetId);
          if (!target) return die;
          return calculateDiceValue(die, target, breachCode, "locked", mode);
        }

        return die;
      }),
    );

    setAttemptsUsed((prev) => prev + 1);
    setSelectedDice([]);
  };

  const rerollActiveDice = () => {
    if (
      outOfAttempts ||
      !hasMatrix ||
      timerExpired ||
      hackEnded ||
      hackPaused ||
      showDeepHackChoice
    ) {
      return;
    }

    setMatrixDice((prev) =>
      prev.map((die) => {
        if (die.status !== "active") return die;

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
    if (timer === 0 || !hasMatrix) {
      setTimeLeft(timer);
      return;
    }

    const outOfTime = timeLeft === 0;

    if (
      outOfAttempts ||
      outOfTime ||
      deepHackMode ||
      hackEnded ||
      hackPaused ||
      noActiveDiceRemaining
    ) {
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
  }, [
    timer,
    matrixDice.length,
    attemptsRemaining,
    timeLeft,
    deepHackMode,
    hackEnded,
    hackPaused,
    noActiveDiceRemaining,
  ]);

  useEffect(() => {
    if (!deepHackMode) return;

    setSubsystemsHacked(
      matrixDice.filter((die) => die.status === "success").length,
    );
  }, [deepHackMode, matrixDice]);

  useEffect(() => {
    if (showDeepHackChoice && timeLeft > 0) setTimeLeft(0);
  }, [showDeepHackChoice, timeLeft]);

  const value: HackingContextValue = {
    applyModification,
    endHackNow,
    handleAttemptRollChange: (value) => {
      if (Number.isNaN(value)) return;
      setAttemptRoll(Math.min(4, Math.max(1, value)));
      resetHackFromSetupChange();
    },
    handleBreachInput,
    handleKnowledgeChange: (value) => {
      setKnowledge(value);
      resetHackFromSetupChange();
    },
    handleMatrixSizeChange: (size) => {
      setMatrixSize(size);
      resetHackFromSetupChange();
    },
    handleTimerChange: (value) => {
      setTimer(value);
      resetHackFromSetupChange();
    },
    rerollActiveDice,
    rollAttempts,
    rollBreach,
    rollKnowledge,
    rollMatrix,
    startDeepHack,
    toggleDieSelection,
    togglePause: () => setHackPaused((prev) => !prev),
    activeDice,
    attemptRoll,
    attempts,
    attemptsRemaining,
    breachCode,
    deepHackMode,
    hackComplete,
    hackEnded,
    hackInProgress,
    hackPaused,
    knowledge,
    lockedDice,
    matrixDiceLength: matrixDice.length,
    matrixSize,
    matrixSizes,
    noActiveDiceRemaining,
    outcome,
    removedDice,
    selectedDice,
    showDeepHackChoice,
    successDice,
    timeLeft,
    timer,
    timerExpired,
    timerOptions,
  };

  return (
    <HackingContext.Provider value={value}>{children}</HackingContext.Provider>
  );
}

export function useHackingContext() {
  const context = useContext(HackingContext);

  if (!context) {
    throw new Error("useHackingContext must be used within a HackingProvider");
  }

  return context;
}
