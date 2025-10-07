import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { EmployeeProfile } from "../types/models";

interface GetMeResponse {
  profile: EmployeeProfile;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await apiClient.get<GetMeResponse>("/me");
      return response.data.profile;
    },
  });
}
