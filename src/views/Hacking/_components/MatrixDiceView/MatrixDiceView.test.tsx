import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HackingProvider } from "../HackingContext";
import { MatrixDiceView } from "./MatrixDiceView";

describe("MatrixDiceView", () => {
  it("renders matrix header and starts a hack", () => {
    render(
      <HackingProvider>
        <MatrixDiceView />
      </HackingProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start Hack" }));
    expect(screen.getByRole("button", { name: "Reset Hack" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reroll Unlocked" })).toBeInTheDocument();
  });

  it("shows awaiting state before hack starts", () => {
    render(
      <HackingProvider>
        <MatrixDiceView />
      </HackingProvider>,
    );

    expect(screen.getAllByText("Awaiting matrix roll.").length).toBeGreaterThan(0);
  });
});
