import { FluentProvider } from "@fluentui/react-components";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppRoutes } from "./routes";
import { appTheme } from "./theme";
import { GameDataProvider } from "../hooks/GameDataContext";

function renderRoutes(path = "/") {
  return render(
    <FluentProvider theme={appTheme}>
      <GameDataProvider>
        <MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter>
      </GameDataProvider>
    </FluentProvider>,
  );
}

describe("app routes and navigation", () => {
  it("renders the seeded dashboard and navigates to all four client routes", async () => {
    const user = userEvent.setup();
    renderRoutes();
    expect(await screen.findByRole("heading", { name: /welcome back, jordan/i })).toBeInTheDocument();
    expect(screen.getByText("48")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Play" }));
    expect(await screen.findByRole("heading", { name: /make your next move/i })).toBeInTheDocument();
    expect(screen.getByText("Match #049")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Game History" }));
    expect(await screen.findByRole("heading", { name: /game history/i })).toBeInTheDocument();
    expect(screen.getByText("#048")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Settings" }));
    expect(await screen.findByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Make every match feel like yours.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Dashboard" }));
    expect(await screen.findByRole("heading", { name: /welcome back, jordan/i })).toBeInTheDocument();
  });

  it("supports board moves, AI response, and undo on the play route", async () => {
    const user = userEvent.setup();
    renderRoutes("/play");
    expect(await screen.findByRole("button", { name: "Top left, X" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Top right, open" }));
    expect(await screen.findByText("6 moves")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Undo move" })[0]);
    await waitFor(() => expect(screen.getByText("4 moves")).toBeInTheDocument());
  });

  it("shows filtered empty and loading states using the development state control", async () => {
    const user = userEvent.setup();
    renderRoutes("/history?previewState=empty");
    expect(await screen.findByRole("heading", { name: "No matches found" })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Preview state" }), "loading");
    expect(await screen.findByRole("status", { name: "Loading matches" })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "Preview state" }), "error");
    expect(await screen.findByText("Couldn’t load your matches")).toBeInTheDocument();
  });
});
