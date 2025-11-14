import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { isSubscriptionActive } from '@/app/utils/subscription.utils';
import type { Subscription } from '@/app/interfaces/subscription.interface';

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

export async function POST(request: Request) {
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

    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSubscription && isSubscriptionActive(existingSubscription as Subscription)) {
      return NextResponse.json(
        { error: 'Ya tienes una suscripción activa' },
        { status: 400 }
      );
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        doctor_id: user.id,
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      return NextResponse.json(
        {
          error: 'Error al crear la suscripción',
          details: subscriptionError.message,
        },
        { status: 500 }
      );
    }

    const { error: paymentError } = await supabase.from('payments').insert({
      subscription_id: subscription.id,
      amount: 99.99,
      status: 'completed',
      payment_date: startDate.toISOString(),
    });

    if (paymentError) {
      return NextResponse.json(
        {
          error: 'Error al registrar el pago',
          details: paymentError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Suscripción creada exitosamente',
      subscription: subscription as Subscription,
    });
  } catch (error) {
    console.error('Error al crear suscripción:', error);
    return NextResponse.json(
      {
        error: 'Error al crear la suscripción',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

