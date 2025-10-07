import { describe, expect, it } from "vitest";
import { computeDaysInWeek, weekBoundsFromMonday } from "./weekUtils";

describe("week utilities", () => {
  it("calculates 5 working days when no holidays", () => {
    const monday = new Date("2025-07-07T00:00:00Z");
    const bounds = weekBoundsFromMonday(monday);
    const result = computeDaysInWeek(monday, bounds.end, {
      weekId: "1",
      start: bounds.start,
      end: bounds.end,
    });
    expect(result).toBe(5);
  });

  it("excludes holidays", () => {
    const monday = new Date("2025-06-23T00:00:00Z");
    const bounds = weekBoundsFromMonday(monday);
    const result = computeDaysInWeek(monday, bounds.end, {
      weekId: "2",
      start: bounds.start,
      end: bounds.end,
    }, [{ date: new Date("2025-06-24T00:00:00Z") }]);
    expect(result).toBe(4);
  });
});
