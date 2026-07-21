'use client';

import { useEffect, useState } from 'react';
import { useDiscord } from '@/lib/useDiscord';
import ReviewPopup from './modals/ReviewPopup';
import DiscordVerify from './modals/DiscordVerify';

interface Review {
  id: number;
  name: string;
  rank: string;
  text: string;
  rating: number;
  date: string;
}

export default function Reviews() {
  const { discordUser, discordToken } = useDiscord();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => { if (!d.error) setReviews(d.reviews || []); else setError(d.error); })
      .catch(() => setError('COULD NOT LOAD REVIEWS'));
  }, [refreshKey]);

  useEffect(() => {
    if (discordUser && sessionStorage.getItem('review_oauth_pending_v1') === '1') {
      sessionStorage.removeItem('review_oauth_pending_v1');
      setShowReview(true);
    }
  }, [discordUser]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setShowReview(false);
      setShowVerify(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const visible = expanded ? reviews : reviews.slice(0, 6);
  const counts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const n = Math.min(5, Math.max(1, parseInt(String(r.rating || 5), 10)));
    counts[n - 1]++;
  });
  const total = reviews.length || 1;

  return (
    <>
      <div className="kapp reviews-app">
            <div className="reviews-head">
              <div className="win-label">CLIENT TESTIMONIALS</div>
              <button
                className="btn btn-outline reviews-load-btn"
                onClick={() => setShowReview(true)}
              >
                + LEAVE A REVIEW
              </button>
            </div>
            <div className="reviews-summary">
              {[5, 4, 3, 2, 1].map(n => {
                const pct = Math.round((counts[n - 1] / total) * 100);
                return (
                  <div key={n} className="review-stat">
                    <span className="n">{n}</span>
                    <div className="bar">
                      <div className="fill review-fill-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="pct">{counts[n - 1]}</span>
                  </div>
                );
              })}
            </div>
            <div className="reviews-list">
              {error ? (
                <p className="empty reviews-err">{error}</p>
              ) : !reviews.length ? (
                <p className="empty">NO REVIEWS YET</p>
              ) : (
                visible.map(r => (
                  <div key={r.id} className="review-item">
                    <div className="review-meta">
                      <div>
                        <span className="review-author-name">{r.name}</span>
                        <span className="review-author-rank">{r.rank || r.date}</span>
                      </div>
                    </div>
                    <p className="review-text">{r.text}</p>
                    <div className="review-rating">
                      <div className="review-rating-label">RATING</div>
                      <div className="review-badge">{r.rating}/5</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {reviews.length > 6 && (
              <div className="reviews-footer">
                <button className="reviews-toggle" onClick={() => setExpanded(e => !e)}>
                  {expanded ? 'SHOW LESS' : 'SHOW MORE'}
                </button>
              </div>
            )}
      </div>

      {showReview && (
        <ReviewPopup
          discordUser={discordUser}
          discordToken={discordToken}
          onClose={() => setShowReview(false)}
          onVerify={() => { setShowReview(false); setShowVerify(true); }}
          onSubmitted={() => setRefreshKey(k => k + 1)}
        />
      )}
      {showVerify && (
        <DiscordVerify
          context="review"
          onClose={() => setShowVerify(false)}
          onAnon={() => { setShowVerify(false); setShowReview(true); }}
          onSaveDraft={() => {}}
        />
      )}
    </>
  );
}
