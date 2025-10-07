import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import Home from "../Home";

vi.mock("../../state/useCurrentUser", () => ({
  useCurrentUser: () => ({
    data: {
      full_name: "Test User",
      team: "Direction",
      entitlements: [
        {
          year: 2025,
          vacation_days_remaining: 15,
          ta_hours_remaining: 40,
          personal_days_remaining: 4,
        },
      ],
    },
    isLoading: false,
  }),
}));

vi.mock("../../state/useRequests", () => ({
  useMyRequests: () => ({
    data: [
      {
        id: "1",
        type: "VAC",
        start_date: "2025-07-07",
        end_date: "2025-07-11",
        status: "draft",
        requestWeeks: [],
      },
    ],
    isLoading: false,
  }),
}));

const queryClient = new QueryClient();

describe("Home page", () => {
  it("affiche les soldes et les demandes", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Mes soldes")).toBeInTheDocument();
    expect(screen.getByText("Vacances: 15 jours")).toBeInTheDocument();
    expect(screen.getByText("Mes demandes")).toBeInTheDocument();
    expect(screen.getByText("VAC")).toBeInTheDocument();
  });
});
