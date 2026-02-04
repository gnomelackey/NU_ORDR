import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with default input class", () => {
    render(<Input aria-label="Knowledge" value="2" onChange={() => {}} />);
    expect(screen.getByLabelText("Knowledge")).toHaveClass("input");
  });

  it("forwards onChange", () => {
    const onChange = vi.fn();
    render(<Input aria-label="Breach" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Breach"), {
      target: { value: "4" },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
