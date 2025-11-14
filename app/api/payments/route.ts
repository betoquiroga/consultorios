import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { PaymentWithSubscription } from '@/app/interfaces/payment.interface';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

async function getServerSupabaseClient(request: Request) {
  const cookieStore = await cookies();
  const authHeader = request.headers.get('authorization');
  
  const supabase = createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      // @ts-expect-error - Supabase types don't fully support cookies option in all contexts
      cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: Record<string, unknown>) {
        cookieStore.set(name, value, options);
      },
      remove(name: string) {
        cookieStore.delete(name);
      },
    },
  });

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    
    if (user && !error) {
      return { supabase, user };
    }
  }

  return { supabase, user: null };
}

export async function GET(request: Request) {
  try {
    const { supabase, user: userFromToken } = await getServerSupabaseClient(request);
    
    let user = userFromToken;
    
    if (!user) {
      const {
        data: { user: userFromSession },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userFromSession) {
        return NextResponse.json(
          { error: 'No hay sesión activa' },
          { status: 401 }
        );
      }
      
      user = userFromSession;
    }

    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('doctor_id', user.id)
      .is('deleted_at', null);

    if (subscriptionsError) {
      return NextResponse.json(
        {
          error: 'Error al obtener suscripciones',
          details: subscriptionsError.message,
        },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        payments: [],
      });
    }

    const subscriptionIds = subscriptions.map((s) => s.id);

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(
        `
        *,
        subscription:subscriptions (
          id,
          start_date,
          end_date,
          status
        )
      `
      )
      .in('subscription_id', subscriptionIds)
      .is('deleted_at', null)
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      return NextResponse.json(
        {
          error: 'Error al obtener pagos',
          details: paymentsError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      payments: (payments as unknown as PaymentWithSubscription[]) || [],
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener pagos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

