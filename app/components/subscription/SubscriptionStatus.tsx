import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { getDaysUntilExpiration, isSubscriptionActive } from '../../utils/subscription.utils';

export function SubscriptionStatus() {
  const router = useRouter();
  const { data: subscriptionData, isLoading } = useSubscription();

  if (isLoading) {
    return null;
  }

  const subscription = subscriptionData?.subscription || null;
  const active = isSubscriptionActive(subscription);
  const daysUntilExpiration = getDaysUntilExpiration(subscription);

  if (!active) {
    return (
      <div className="mb-6 rounded-lg border border-red-800 bg-red-900/20 p-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="flex-1">
            <h3 className="font-medium text-red-400">
              Suscripción Expirada
            </h3>
            <p className="text-sm text-red-300/80">
              Tu suscripción ha expirado. Renueva para continuar usando el servicio.
            </p>
          </div>
          <button
            onClick={() => router.push('/subscription/checkout')}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Renovar
          </button>
        </div>
      </div>
    );
  }

  if (daysUntilExpiration !== null && daysUntilExpiration <= 7) {
    return (
      <div className="mb-6 rounded-lg border border-yellow-800 bg-yellow-900/20 p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-yellow-400" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-400">
              Suscripción por Vencer
            </h3>
            <p className="text-sm text-yellow-300/80">
              Tu suscripción expira en {daysUntilExpiration}{' '}
              {daysUntilExpiration === 1 ? 'día' : 'días'}. Renueva ahora para
              evitar interrupciones.
            </p>
          </div>
          <button
            onClick={() => router.push('/subscription/checkout')}
            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
          >
            Renovar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-teal-800 bg-teal-900/20 p-4">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-teal-400" />
        <div className="flex-1">
          <h3 className="font-medium text-teal-400">
            Suscripción Activa
          </h3>
          <p className="text-sm text-teal-300/80">
            {daysUntilExpiration !== null
              ? `Tu suscripción está activa. Expira en ${daysUntilExpiration} ${daysUntilExpiration === 1 ? 'día' : 'días'}.`
              : 'Tu suscripción está activa.'}
          </p>
        </div>
        <button
          onClick={() => router.push('/subscription/payments')}
          className="rounded-lg border border-teal-700 bg-teal-900/30 px-4 py-2 text-sm font-medium text-teal-300 transition-colors hover:bg-teal-900/50"
        >
          Ver Pagos
        </button>
      </div>
    </div>
  );
}

