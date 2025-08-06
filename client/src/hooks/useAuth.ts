import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user?.user || null,
    isLoading,
    isAuthenticated: !!user?.user,
    error,
  };
}