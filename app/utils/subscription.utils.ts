import type { Subscription } from '../interfaces/subscription.interface';

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) {
    return false;
  }

  if (subscription.status !== 'active') {
    return false;
  }

  const now = new Date();
  const endDate = new Date(subscription.end_date);

  return endDate > now;
}

export function getDaysUntilExpiration(subscription: Subscription | null): number | null {
  if (!subscription || !isSubscriptionActive(subscription)) {
    return null;
  }

  const now = new Date();
  const endDate = new Date(subscription.end_date);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

