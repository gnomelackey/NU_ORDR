export type DifficultyId = "easy" | "normal" | "hard" | "exceptional";

export const difficulties: Record<
  DifficultyId,
  {
    label: string;
    matrixSize: number;
    timer: number;
    examples: string;
  }
> = {
  easy: {
    label: "Easy",
    matrixSize: 2,
    timer: 0,
    examples: "Lights, speakers, printers, other small devices.",
  },
  normal: {
    label: "Normal",
    matrixSize: 4,
    timer: 30,
    examples: "Vending machines, Nechy stations, ticket booths.",
  },
  hard: {
    label: "Hard",
    matrixSize: 8,
    timer: 20,
    examples: "Electronic locks, car ignitions, security systems.",
  },
  exceptional: {
    label: "Exceptional",
    matrixSize: 16,
    timer: 10,
    examples: "Bank vaults, ATMs, military equipment, biotech.",
  },
};
