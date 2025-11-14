import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateSubscription } from '../../hooks/useSubscription';

export function CheckoutForm() {
  const router = useRouter();
  const createSubscription = useCreateSubscription();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await createSubscription.mutateAsync();

      if (result.success) {
        toast.success(result.message);
        router.push('/calendar');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al procesar el pago'
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-100">
          Suscripción Mensual
        </h1>
        <p className="text-gray-400">
          Accede a tu calendario y chat con pacientes
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-300">Plan Mensual</span>
          <span className="text-2xl font-bold text-gray-100">S/ 99.99</span>
        </div>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-teal-400">✓</span>
            <span>Calendario de citas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-400">✓</span>
            <span>Chat con pacientes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-400">✓</span>
            <span>Gestión de pacientes</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <CreditCard className="h-4 w-4" />
            <span>Información de Pago</span>
          </div>
          <p className="text-xs text-gray-500">
            Este es un entorno de prueba. El pago se procesará automáticamente.
          </p>
        </div>

        <button
          type="submit"
          disabled={createSubscription.isPending}
          className="w-full rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createSubscription.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Procesando...
            </span>
          ) : (
            'Procesar Pago'
          )}
        </button>
      </form>
    </div>
  );
}

