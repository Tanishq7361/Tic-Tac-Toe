import { describe, expect, it } from "vitest";
import { createSeedData, loadLocalData, saveLocalData, STORAGE_KEY } from "./storage";
import { getPlayerOutcome } from "../hooks/GameDataContext";

describe("local game storage", () => {
  it("seeds the approved statistics, recent matches, and in-progress match #049", () => {
    const data = createSeedData();
    expect(data.matches).toHaveLength(48);
    expect(data.matches.filter((match) => getPlayerOutcome(match) === "Win")).toHaveLength(31);
    expect(data.matches.filter((match) => match.outcome === "draw")).toHaveLength(8);
    expect(data.currentStreak).toBe(3);
    expect(data.matches.slice(0, 4).map((match) => match.number)).toEqual([48, 47, 46, 45]);
    expect(data.activeGame).toMatchObject({
      number: 49,
      mode: "ai",
      playerMark: "X",
      moves: [
        { mark: "X", cell: 0 }, { mark: "O", cell: 1 },
        { mark: "X", cell: 4 }, { mark: "O", cell: 5 },
      ],
    });
  });

  it("loads defaults, persists updates, and falls back on malformed records", () => {
    const storage = window.localStorage;
    storage.removeItem(STORAGE_KEY);
    expect(loadLocalData(storage).settings).toEqual({ mode: "ai", difficulty: "Smart", playerMark: "X", sound: true, motion: true });
    const data = createSeedData();
    saveLocalData(data, storage);
    expect(loadLocalData(storage)).toEqual(data);
    storage.setItem(STORAGE_KEY, "{not json");
    expect(loadLocalData(storage).matches).toHaveLength(48);
  });

  it("returns a clean seed when browser storage is unavailable", () => {
    expect(loadLocalData(null).activeGame.number).toBe(49);
    expect(() => saveLocalData(createSeedData(), null)).toThrow("Browser storage is unavailable.");
  });
});
