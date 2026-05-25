'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSupabaseBrowser } from './supabase-browser';

export interface DiscordUser {
  id: string;
  username: string;
}

export function useDiscord() {
  const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);
  const [discordToken, setDiscordToken] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    const session = data?.session;
    if (!session?.user) return;
    const user = session.user;
    const md = user.user_metadata || {};
    const ids = user.identities || [];
    const hasDiscord =
      md.preferred_username ||
      md.user_name ||
      ids.some((i: { provider: string }) => i.provider === 'discord');
    if (!hasDiscord) return;
    const username =
      md.preferred_username ||
      md.user_name ||
      md.full_name ||
      user.email?.split('@')[0] ||
      'discord_user';
    const discordId =
      ids.find((i: { provider: string; id: string }) => i.provider === 'discord')?.id ||
      md.provider_id ||
      user.id;
    setDiscordUser({ id: discordId, username });
    setDiscordToken(session.access_token);
  }, []);

  useEffect(() => {
    hydrate();
    const sb = getSupabaseBrowser();
    if (!sb) return;
    const { data: { subscription } } = sb.auth.onAuthStateChange(() => hydrate());
    return () => subscription.unsubscribe();
  }, [hydrate]);

  return { discordUser, discordToken };
}
