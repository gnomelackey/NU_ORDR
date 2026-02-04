import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel";

describe("Panel", () => {
  it("renders content and panel class", () => {
    const { container } = render(<Panel>Panel Body</Panel>);
    expect(screen.getByText("Panel Body")).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass("panel");
  });

  it("merges custom classes", () => {
    const { container } = render(<Panel className="setup-panel">Body</Panel>);
    expect(container.firstElementChild).toHaveClass("setup-panel");
  });
});
