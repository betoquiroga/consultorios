import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isSubscriptionActive } from './subscription.utils';
import type { Subscription } from '../interfaces/subscription.interface';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

async function getServerSupabaseClient() {
  const cookieStore = await cookies();
  const supabase = createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      // @ts-expect-error - Supabase types don't fully support cookies option in all contexts
      cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
  return supabase;
}

export async function validateSubscriptionForDoctor(
  doctorId: string
): Promise<{ valid: boolean; subscription: Subscription | null }> {
  const supabase = await getServerSupabaseClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('doctor_id', doctorId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    return { valid: false, subscription: null };
  }

  if (!data) {
    return { valid: false, subscription: null };
  }

  const subscription = data as Subscription;

  if (!isSubscriptionActive(subscription)) {
    await supabase
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', subscription.id);
    return { valid: false, subscription: null };
  }

  return { valid: true, subscription };
}

