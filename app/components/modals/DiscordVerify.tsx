'use client';

import { getSupabaseBrowser } from '@/lib/supabase-browser';

interface Props {
  context: 'review' | 'quote';
  onClose: () => void;
  onAnon: () => void;
  onSaveDraft: () => void;
}

export default function DiscordVerify({ context, onClose, onAnon, onSaveDraft }: Props) {
  const isQuote = context === 'quote';

  function handleDiscordLogin() {
    const sb = getSupabaseBrowser();
    if (!sb) {
      alert('Supabase not initialised. Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local and restart the dev server.');
      return;
    }
    onSaveDraft();
    if (isQuote) {
      sessionStorage.setItem('quote_oauth_pending_v1', '1');
    } else {
      sessionStorage.setItem('review_oauth_pending_v1', '1');
    }
    sb.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.href.split('#')[0], scopes: 'identify' },
    }).then((res) => {
      if (res.error) throw res.error;
    }).catch((err) => {
      sessionStorage.removeItem('review_oauth_pending_v1');
      sessionStorage.removeItem('quote_oauth_pending_v1');
      alert('Discord login failed: ' + (err?.message || 'Try again.'));
    });
  }

  return (
    <div className="verify-overlay show">
      <div className="verify-win">
        <div className="win-titlebar">
          <span className="win-title">VERIFY<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="verify-body">
          <div className="verify-title">
            {isQuote ? 'DISCORD REQUIRED FOR QUOTES' : 'NEED TO VERIFY YOUR IDENTITY'}
          </div>
          <p className="verify-desc">
            {isQuote
              ? 'Log in with Discord to submit a quote request.'
              : 'Log into Discord to ensure you are not a bot and verify you as a user'}
          </p>
          <button className="verify-discord-btn" onClick={handleDiscordLogin}>
            LOG IN WITH DISCORD
          </button>
          {!isQuote && (
            <button className="verify-anon-btn" onClick={onAnon}>
              Stay anonymous
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
