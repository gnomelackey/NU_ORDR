import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Die } from "./Die";

describe("Die", () => {
  it("renders value and highlighted pips for d6", () => {
    const { container } = render(<Die value={6} />);
    expect(container.querySelector(".die-value")?.textContent).toBe("6");
    expect(container.querySelectorAll(".pip--on").length).toBe(6);
  });

  it("supports d4 mapping", () => {
    const { container } = render(<Die value={4} sides={4} />);
    expect(container.querySelectorAll(".pip--on").length).toBe(4);
  });

  it("applies glow class when enabled", () => {
    const { container } = render(<Die value={3} glow />);
    expect(container.querySelector(".die")?.className).toContain("die--glow");
  });
});
