'use client';

import { useState, useRef, useEffect } from 'react';
import { apiPost } from '@/lib/api';

const DRAFT_KEY = 'review_draft_v1';

interface Props {
  discordUser: { id: string; username: string } | null;
  discordToken: string | null;
  onClose: () => void;
  onVerify: () => void;
  onSubmitted: () => void;
}

export default function ReviewPopup({
  discordUser,
  discordToken,
  onClose,
  onVerify,
  onSubmitted,
}: Props) {
  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAnon, setShowAnon] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.name) setName(d.name);
      if (d.rank) setRank(d.rank);
      if (d.text) setText(d.text);
      if (d.rating) setRating(parseInt(d.rating, 10));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (discordUser && !name) {
      setName(discordUser.username);
    }
  }, [discordUser]);

  function saveDraft() {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name, rank, text, rating }));
  }

  function clearDraft() {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem('review_oauth_pending_v1');
  }

  async function submit(isAnon: boolean) {
    if (!isAnon && (!name.trim() || !rank.trim() || !text.trim())) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: isAnon ? 'Anonymous' : name.trim(),
        rank: isAnon ? 'Unknown' : rank.trim(),
        text: text.trim(),
        rating,
      };
      if (!isAnon && discordUser) {
        payload.discord_id = discordUser.id;
        payload.discord_username = discordUser.username;
      }
      const extra: Record<string, string> = {};
      if (!isAnon && discordToken) extra['Authorization'] = `Bearer ${discordToken}`;
      const res = await apiPost('/api/reviews', payload, extra);
      if (res.error) { alert('Submit failed: ' + res.error); return; }
      clearDraft();
      setDone(true);
      onSubmitted();
      setTimeout(onClose, 2200);
    } catch (e: unknown) {
      alert('Submit failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmitClick() {
    if (!name.trim() || !rank.trim() || !text.trim()) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    saveDraft();
    if (discordUser) { submit(false); return; }
    onVerify();
  }

  if (showAnon) {
    return (
      <div className="anon-overlay show">
        <div className="anon-win">
          <div className="win-titlebar">
            <span className="win-title">ANONYMOUS<span className="dim">.EXE</span></span>
            <div className="win-controls">
              <div className="win-btn" onClick={() => setShowAnon(false)}>x</div>
            </div>
          </div>
          <div className="anon-body">
            <div className="anon-label">// ANONYMOUS REVIEW</div>
            <p className="anon-desc">
              Your review will be submitted anonymously. Your name will appear as{' '}
              <span style={{ color: 'var(--text)' }}>Anonymous</span> and your rank will be shown
              as <span style={{ color: 'var(--text)' }}>Unknown</span>. No Discord login is
              needed.
            </p>
            <div className="anon-actions">
              <button className="anon-confirm-btn" onClick={() => { setShowAnon(false); clearDraft(); submit(true); }}>
                CONTINUE ANONYMOUS
              </button>
              <button className="anon-back-btn" onClick={() => setShowAnon(false)}>BACK</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-overlay show">
      <div className="review-popup-win">
        <div className="win-titlebar">
          <span className="win-title">REVIEW<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="review-popup-body">
          <div className="win-label">LEAVE A REVIEW</div>
          {discordUser && (
            <div className="discord-bar visible">
              LOGGED IN AS <span>@{discordUser.username}</span>
            </div>
          )}
          {done ? (
            <div className="rform-done show">
              REVIEW SUBMITTED!<br /><br />
              IT WILL APPEAR AFTER APPROVAL.
            </div>
          ) : (
            <div className="rform">
              <div className="form-row2">
                <div className="field">
                  <label>YOUR NAME</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" />
                </div>
                <div className="field">
                  <label>FLAG / RANK</label>
                  <input type="text" value={rank} onChange={e => setRank(e.target.value)} required placeholder="e.g. Developer" />
                </div>
              </div>
              <div className="field">
                <label>STAR RATING</label>
                <div className="field-stars">
                  {[5, 4, 3, 2, 1].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn${rating === n ? ' active' : ''}`}
                      onClick={() => setRating(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="star-value">{rating} star{rating === 1 ? '' : 's'}</div>
              </div>
              <div className="field">
                <label>REVIEW</label>
                <textarea value={text} onChange={e => setText(e.target.value)} required placeholder="Share your experience working with Cqt..." />
              </div>
              <button
                type="button"
                className="form-submit"
                onClick={handleSubmitClick}
                disabled={submitting}
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
