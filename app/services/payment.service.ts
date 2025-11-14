import type { PaymentWithSubscription } from '../interfaces/payment.interface';

type GetPaymentsResponse = {
  success: boolean;
  payments: PaymentWithSubscription[];
  message?: string;
};

export const paymentService = {
  async getPayments(): Promise<GetPaymentsResponse> {
    const { supabase } = await import('../lib/supabase');
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        payments: [],
        message: 'No hay sesión activa',
      };
    }

    const response = await fetch('/api/payments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        payments: [],
        message: error.error || 'Error al obtener pagos',
      };
    }

    const data = await response.json();
    return data;
  },
};

