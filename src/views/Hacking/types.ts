export type MatrixDieStatus = "active" | "locked" | "success";

export type MatrixDie = {
  id: string;
  value: number;
  status: MatrixDieStatus;
};

export type HackingContextValue = {
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
  noActiveDiceRemaining: boolean;
  outcome: string;
  removedDice: MatrixDie[];
  selectedDice: string[];
  showDeepHackChoice: boolean;
  successDice: MatrixDie[];
  timeLeft: number;
  timer: number;
  timerExpired: boolean;
};
