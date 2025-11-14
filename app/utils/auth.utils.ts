import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export async function getServerSession() {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set(_name: string, _value: string, _options?: Record<string, unknown>) {
        // No-op for server-side
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      remove(_name: string) {
        // No-op for server-side
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

