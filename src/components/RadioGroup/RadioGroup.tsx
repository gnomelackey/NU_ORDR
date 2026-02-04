type RadioValue = string | number;

type Option<T extends RadioValue> = {
  label: string;
  value: T;
};

type RadioGroupProps<T extends RadioValue> = {
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  itemClassName?: string;
};

export function RadioGroup<T extends RadioValue>({
  name,
  options,
  value,
  onChange,
  className = "radio-group",
  itemClassName = "radio-item",
}: RadioGroupProps<T>) {
  return (
    <div className={className}>
      {options.map((option) => (
        <label key={`${name}-${String(option.value)}`} className={itemClassName}>
          <input
            type="radio"
            name={name}
            value={String(option.value)}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
