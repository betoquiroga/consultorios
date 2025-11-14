import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Subscription } from '@/app/interfaces/subscription.interface';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

async function getServerSupabaseClient(request: NextRequest) {
  const supabase = createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      // @ts-expect-error - Supabase types don't fully support cookies option in all contexts
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );
  return supabase as ReturnType<typeof createClient>;
}

async function checkSubscriptionActive(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('doctor_id', userId)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  const subscription = data as Subscription;
  const now = new Date();
  const endDate = new Date(subscription.end_date);

  if (endDate <= now) {
    await supabase
      .from('subscriptions')
      // @ts-expect-error - Type inference issue with Supabase after @ts-expect-error on createClient
      .update({ status: 'expired' })
      .eq('id', subscription.id);
    return false;
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/subscription/checkout',
    '/api',
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const supabase = await getServerSupabaseClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const hasActiveSubscription = await checkSubscriptionActive(
    supabase,
    session.user.id
  );

  if (!hasActiveSubscription) {
    const url = request.nextUrl.clone();
    url.pathname = '/subscription/checkout';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

