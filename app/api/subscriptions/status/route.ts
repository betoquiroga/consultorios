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

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('doctor_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        {
          error: 'Error al obtener la suscripción',
          details: error.message,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({
        success: true,
        subscription: null,
      });
    }

    const subscription = data as Subscription;

    if (!isSubscriptionActive(subscription)) {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id);

      if (!updateError) {
        return NextResponse.json({
          success: true,
          subscription: null,
        });
      }
    }

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Error al obtener estado de suscripción:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener el estado de suscripción',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

