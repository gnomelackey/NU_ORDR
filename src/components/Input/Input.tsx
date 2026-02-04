import type { InputHTMLAttributes } from "react";

type DiceAction = {
  label: string;
  onClick: () => void;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  diceAction?: DiceAction;
};

export function Input({ className = "", diceAction, ...props }: InputProps) {
  if (!diceAction) {
    return <input className={`input ${className}`.trim()} {...props} />;
  }

  return (
    <div className="input-with-dice">
      <input className={`input input--with-dice ${className}`.trim()} {...props} />
      <button
        type="button"
        className="input-dice"
        onClick={diceAction.onClick}
        aria-label={diceAction.label}
        title={diceAction.label}
      >
        <span className="input-dice-face" aria-hidden="true" />
      </button>
    </div>
  );
}
