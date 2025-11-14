import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription', 'status'],
    queryFn: () => subscriptionService.getSubscriptionStatus(),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionService.createSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

