import "./Die.css";

export type DieProps = {
  value: number;
  glow?: boolean;
  sides?: 4 | 6;
};

const pipMapD6: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const pipMapD4: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
};

export function Die({ value, glow, sides = 6 }: DieProps) {
  const pips = sides === 4 ? pipMapD4[value] ?? [] : pipMapD6[value] ?? [];

  return (
    <div className={`die ${glow ? "die--glow" : ""}`}>
      <div className="die-face">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={`pip ${pips.includes(index) ? "pip--on" : ""}`}
          />
        ))}
      </div>
      <span className="die-value">{value}</span>
    </div>
  );
}
