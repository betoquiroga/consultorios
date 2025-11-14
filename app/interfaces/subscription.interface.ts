export interface Subscription {
  id: string;
  doctor_id: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

