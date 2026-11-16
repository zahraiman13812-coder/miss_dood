"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

let client: SupabaseClient | undefined;
export function getAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return undefined;
  client ??= createClient(url, key);
  return client;
}

export function useSignedInEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const auth = getAuthClient()?.auth;
    if (!auth) return;
    const { data } = auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return email;
}
