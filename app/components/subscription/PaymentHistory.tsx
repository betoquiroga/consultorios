import { usePayments } from '../../hooks/usePayments';
import { Loader2 } from 'lucide-react';

export function PaymentHistory() {
  const { data: paymentsData, isLoading, error } = usePayments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
        Error al cargar el historial de pagos
      </div>
    );
  }

  const payments = paymentsData?.payments || [];

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-400">
        No hay pagos registrados
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Fecha
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Monto
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
              Período
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/50"
            >
              <td className="px-4 py-3 text-sm text-gray-300">
                {formatDate(payment.payment_date)}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-200">
                {formatAmount(payment.amount)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    payment.status === 'completed'
                      ? 'bg-teal-900/30 text-teal-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}
                >
                  {payment.status === 'completed' ? 'Completado' : 'Fallido'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {payment.subscription
                  ? `${formatDate(payment.subscription.start_date)} - ${formatDate(payment.subscription.end_date)}`
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

