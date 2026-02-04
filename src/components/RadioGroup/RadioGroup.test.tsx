import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  it("renders options and selected state", () => {
    render(
      <RadioGroup
        name="matrix"
        value={4}
        onChange={() => {}}
        options={[
          { label: "2 d6", value: 2 },
          { label: "4 d6", value: 4 },
        ]}
      />,
    );

    expect(screen.getByLabelText("2 d6")).not.toBeChecked();
    expect(screen.getByLabelText("4 d6")).toBeChecked();
  });

  it("calls onChange with the selected value", () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="timer"
        value={0}
        onChange={onChange}
        options={[
          { label: "No timer", value: 0 },
          { label: "30 seconds", value: 30 },
        ]}
      />,
    );

    fireEvent.click(screen.getByLabelText("30 seconds"));
    expect(onChange).toHaveBeenCalledWith(30);
  });
});
