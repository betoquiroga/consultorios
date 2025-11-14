import type { Subscription } from '../interfaces/subscription.interface';

type CreateSubscriptionResponse = {
  success: boolean;
  message: string;
  subscription?: Subscription;
};

type SubscriptionStatusResponse = {
  success: boolean;
  subscription: Subscription | null;
};

export const subscriptionService = {
  async createSubscription(): Promise<CreateSubscriptionResponse> {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        message: 'Error de configuración',
      };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        message: 'No hay sesión activa',
      };
    }

    const response = await fetch('/api/subscriptions/create', {
      method: 'POST',
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
        message: error.error || 'Error al crear la suscripción',
      };
    }

    const data = await response.json();
    return data;
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
    const { supabase } = await import('../lib/supabase');
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        success: false,
        subscription: null,
      };
    }

    const response = await fetch('/api/subscriptions/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      return {
        success: false,
        subscription: null,
      };
    }

    const data = await response.json();
    return data;
  },

  async checkSubscriptionActive(): Promise<boolean> {
    const status = await this.getSubscriptionStatus();
    if (!status.success || !status.subscription) {
      return false;
    }

    const now = new Date();
    const endDate = new Date(status.subscription.end_date);
    return endDate > now;
  },
};

