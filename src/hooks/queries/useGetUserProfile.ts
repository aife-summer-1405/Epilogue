import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/app/actions/user.actions";

export const useGetUserProfile = () =>
  useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await getCurrentUserAction();
      return result.success ? result.user : null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
