'use client';

import { PaymentHistory } from '../../components/subscription/PaymentHistory';
import { AppHeader } from '../../components/shared/AppHeader';

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      <div className="pt-24 p-6">
        <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">
            Historial de Pagos
          </h1>
          <p className="mt-2 text-gray-400">
            Visualiza todos tus pagos y suscripciones
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-950 p-6">
          <PaymentHistory />
        </div>
        </div>
      </div>
    </div>
  );
}

