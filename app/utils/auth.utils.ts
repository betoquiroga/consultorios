import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export async function getServerSession() {
  const cookieStore = await cookies();
  
  const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // No-op for server-side
      },
      remove() {
        // No-op for server-side
      },
    },
  } as any);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

