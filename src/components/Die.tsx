type DieProps = {
  value: number;
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  label?: string;
};

const pipMap: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export function Die({ value, size = "md", glow, label }: DieProps) {
  const pips = pipMap[value] ?? [];

  return (
    <div className={`die die--${size} ${glow ? "die--glow" : ""}`}>
      {label ? <span className="die-label">{label}</span> : null}
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
