import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HackingProvider } from "../HackingContext";
import { HackSetupView } from "./HackSetupView";

describe("HackSetupView", () => {
  it("renders setup sections and updates matrix radio state", () => {
    render(
      <HackingProvider>
        <HackSetupView />
      </HackingProvider>,
    );

    expect(screen.getByText("Hack Setup")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("8 d6"));
    expect(screen.getByLabelText("8 d6")).toBeChecked();
  });
});
