'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseBrowser } from './supabase-browser';

export interface ClientUser {
  id: string;
  email: string;
  name: string;
}

export function useClientAuth() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb) { setLoading(false); return; }
    const { data } = await sb.auth.getSession();
    const session = data?.session;
    if (!session?.user) { setUser(null); setToken(null); setLoading(false); return; }
    const u = session.user;
    const isEmailUser = !u.identities?.some((i: { provider: string }) => i.provider === 'discord');
    if (!isEmailUser) { setUser(null); setToken(null); setLoading(false); return; }
    setUser({ id: u.id, email: u.email!, name: u.user_metadata?.full_name || u.email!.split('@')[0] });
    setToken(session.access_token);
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrate();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: { subscription } } = sb.auth.onAuthStateChange(() => hydrate());
    return () => subscription.unsubscribe();
  }, [hydrate]);

  async function signIn(email: string, password: string): Promise<{ error?: string }> {
    const sb = getSupabaseBrowser();
    if (!sb) return { error: 'SUPABASE NOT CONFIGURED — CHECK NEXT_PUBLIC_SUPABASE_ANON_KEY' };
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('not confirmed')) {
        return { error: 'CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT, THEN TRY AGAIN.' };
      }
      return { error: error.message.toUpperCase() };
    }
    if (data?.session) await hydrate();
    return {};
  }

  async function signUp(email: string, password: string, name: string): Promise<{ error?: string; confirm?: true }> {
    const sb = getSupabaseBrowser();
    if (!sb) return { error: 'SUPABASE NOT CONFIGURED — CHECK NEXT_PUBLIC_SUPABASE_ANON_KEY' };
    const { data, error } = await sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return { error: error.message.toUpperCase() };
    if (data?.session) {
      await hydrate();
      return {};
    }
    return { confirm: true };
  }

  async function signOut() {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    setUser(null);
    setToken(null);
  }

  return { user, token, loading, signIn, signUp, signOut };
}
