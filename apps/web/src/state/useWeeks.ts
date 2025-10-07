import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Week } from "../types/models";

interface GetWeeksResponse {
  weeks: Week[];
}

export function useWeeks(year: number) {
  return useQuery({
    queryKey: ["weeks", year],
    queryFn: async () => {
      const response = await apiClient.get<GetWeeksResponse>(`/weeks?year=${year}`);
      return response.data.weeks;
    },
  });
}
