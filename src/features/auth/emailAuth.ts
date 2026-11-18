"use client";
import { useEffect, useState } from "react";
/** Authentication is handled by the application's HttpOnly PostgreSQL-backed session cookie. */
export function useSignedInEmail() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/auth", {cache:"no-store"}).then(r => r.ok ? r.json() : null)
      .then(d => { if (active) setEmail(d?.user?.email ?? null); }).catch(() => {});
    return () => { active = false; };
  }, []);
  return email;
}
