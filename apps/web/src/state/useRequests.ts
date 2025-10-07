import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { TimeOffRequest } from "../types/models";

type ListRequestsResponse = {
  requests: TimeOffRequest[];
};

type CreateRequestPayload = {
  type: TimeOffRequest["type"];
  start_date: string;
  end_date: string;
  partial_day?: "AM" | "PM" | "FULL";
};

export function useMyRequests(year: number) {
  return useQuery({
    queryKey: ["requests", "me", year],
    queryFn: async () => {
      const response = await apiClient.get<ListRequestsResponse>(`/requests?mine=true&year=${year}`);
      return response.data.requests;
    },
  });
}

export function useCreateRequest(year: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRequestPayload) => {
      const response = await apiClient.post<{ request: TimeOffRequest }>("/requests", payload);
      return response.data.request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests", "me", year] });
    },
  });
}
