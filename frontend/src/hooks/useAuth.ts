import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { User } from '../types/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: authData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth_me'],
    queryFn: async () => {
      const token = localStorage.getItem('ecosphere_token');
      if (!token) return null;
      try {
        const response = await authApi.getMe();
        return response.data.user;
      } catch (err) {
        localStorage.removeItem('ecosphere_token');
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('ecosphere_token', data.data.token);
      queryClient.setQueryData(['auth_me'], data.data.user);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('ecosphere_token', data.data.token);
      queryClient.setQueryData(['auth_me'], data.data.user);
      queryClient.invalidateQueries();
    },
  });

  const logout = () => {
    localStorage.removeItem('ecosphere_token');
    queryClient.setQueryData(['auth_me'], null);
    queryClient.clear();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const user: User | null = authData || null;
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
    refetchMe: refetch,
  };
}
