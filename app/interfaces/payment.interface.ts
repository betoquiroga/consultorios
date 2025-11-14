export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  status: 'completed' | 'failed';
  payment_date: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface PaymentWithSubscription extends Payment {
  subscription: {
    id: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

