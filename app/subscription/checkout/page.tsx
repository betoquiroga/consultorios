'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutForm } from '../../components/subscription/CheckoutForm';
import { useSubscription } from '../../hooks/useSubscription';
import { isSubscriptionActive } from '../../utils/subscription.utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: subscriptionData, isLoading } = useSubscription();

  useEffect(() => {
    if (
      !isLoading &&
      subscriptionData?.subscription &&
      isSubscriptionActive(subscriptionData.subscription)
    ) {
      router.push('/calendar');
    }
  }, [subscriptionData, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-950 via-gray-950 to-black">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (
    subscriptionData?.subscription &&
    isSubscriptionActive(subscriptionData.subscription)
  ) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-950 via-gray-950 to-black px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-800 bg-gray-900/90 p-10 shadow-xl">
        <CheckoutForm />
      </div>
    </div>
  );
}

