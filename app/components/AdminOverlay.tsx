'use client';

import { useState } from 'react';
import { apiPost, apiPatch, apiDelete, apiGet, setAdminToken } from '@/lib/api';

interface Quote {
  id: number;
  date: string;
  name: string;
  email: string;
  type: string;
  budget: string;
  timeline?: string;
  description: string;
  refs?: string;
  status: string;
}

interface Review {
  id: number;
  date: string;
  name: string;
  rank: string;
  text: string;
  rating: number;
  status: string;
  discord_id?: string;
  discord_username?: string;
}


interface Props {
  onClose: () => void;
  onEaster: () => void;
}

export default function AdminOverlay({ onClose, onEaster }: Props) {
  const [view, setView] = useState<'login' | 'dash'>('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('quotes');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [pending, setPending] = useState<Review[]>([]);
  const [approved, setApproved] = useState<Review[]>([]);
  const [editor, setEditor] = useState<{ type: 'quote' | 'review'; data: Quote | Review } | null>(null);

  async function loadData() {
    const res = await apiGet('/api/admin');
    if (res.error) return;
    setQuotes(res.quotes || []);
    const all: Review[] = res.reviews || [];
    setPending(all.filter(r => r.status !== 'approved'));
    setApproved(all.filter(r => r.status === 'approved'));
  }

  async function handleLogin() {
    if (!email || !pass) { setErr('ENTER EMAIL AND PASSWORD'); return; }
    setLoading(true); setErr('');
    try {
      const res = await apiPost('/api/auth', { email, password: pass });
      if (res.easter) { setPass(''); onEaster(); return; }
      if (res.error || !res.token) {
        setErr(res.error ? res.error.toUpperCase() : 'WRONG PASSWORD');
        setPass('');
        return;
      }
      setAdminToken(res.token);
      await loadData();
      setView('dash');
    } catch (e: unknown) {
      setErr('ERROR: ' + (e instanceof Error ? e.message : 'Check server logs'));
    } finally {
      setLoading(false);
    }
  }

  async function delQuote(id: number) {
    if (!confirm('Delete this request?')) return;
    await apiDelete('/api/admin', { table: 'quotes', id });
    loadData();
  }

  async function approveReview(id: number) {
    await apiPatch('/api/admin', { table: 'reviews', id, payload: { status: 'approved' } });
    loadData();
  }

  async function deleteReview(id: number) {
    if (!confirm('Remove this review?')) return;
    await apiDelete('/api/admin', { table: 'reviews', id });
    loadData();
  }

  function findReview(id: number) {
    return [...pending, ...approved].find(r => r.id === id) || null;
  }

  function badgeClass(status: string) {
    return { new: 'badge-new', seen: 'badge-seen', done: 'badge-done', pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }[status] || 'badge-pending';
  }

  return (
    <div id="admin-overlay" className="show">
      {view === 'login' && (
        <div className="win admin-win">
          <div className="win-titlebar">
            <span className="win-title">ADMIN<span className="dim">.EXE</span></span>
            <div className="win-controls">
              <div className="win-btn" onClick={onClose}>x</div>
            </div>
          </div>
          <div className="win-body admin-login-body">
            <div className="win-label">AUTHENTICATE</div>
            <div className="field auth-field">
              <label>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                placeholder="admin@email.com"
              />
            </div>
            <div className="field auth-field-last">
              <label>PASSWORD</label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                placeholder="Enter password..."
              />
            </div>
            <div className="admin-login-btns">
              <button className="form-submit admin-login-btn" onClick={handleLogin} disabled={loading}>
                {loading ? 'CHECKING...' : 'LOGIN'}
              </button>
              <button className="btn btn-outline admin-login-cancel" onClick={onClose}>
                CANCEL
              </button>
            </div>
            {err && <p className="admin-err show">{err}</p>}
          </div>
        </div>
      )}

      {view === 'dash' && (
        <div className="win admin-win">
          <div className="win-titlebar">
            <span className="win-title">DASHBOARD<span className="dim">.EXE</span></span>
            <div className="win-controls">
              <div className="win-btn" onClick={onClose}>x</div>
            </div>
          </div>
          <div className="win-body">
            <div className="admin-toolbar">
              <button className="btn btn-outline admin-refresh-btn" onClick={loadData}>
                REFRESH DB
              </button>
            </div>
            <div className="admin-stats">
              <div className="stat-cell">
                <span className="n">{quotes.filter(q => q.status === 'new').length}</span>
                <span className="l">NEW QUOTES</span>
              </div>
              <div className="stat-cell">
                <span className="n">{quotes.length}</span>
                <span className="l">TOTAL QUOTES</span>
              </div>
              <div className="stat-cell">
                <span className="n">{pending.length}</span>
                <span className="l">REVIEWS</span>
              </div>
            </div>
            <div className="admin-tabs">
              <button className={`admin-tab${tab === 'quotes' ? ' active' : ''}`} onClick={() => setTab('quotes')}>QUOTES</button>
              <button className={`admin-tab${tab === 'reviews' ? ' active' : ''}`} onClick={() => setTab('reviews')}>REVIEWS</button>
            </div>

            <div className={`admin-tab-content${tab === 'quotes' ? ' active' : ''}`}>
              <div className="win-label">QUOTE REQUESTS</div>
              {!quotes.length ? (
                <p className="empty">NO QUOTE REQUESTS YET</p>
              ) : (
                <div className="q-table-wrap">
                  <table className="q-table">
                    <thead>
                      <tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>TYPE</th><th>STATUS</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {quotes.map(q => (
                        <tr key={q.id}>
                          <td>{q.date}</td>
                          <td>{q.name}</td>
                          <td>{q.email}</td>
                          <td>{q.type}</td>
                          <td><span className={`badge ${badgeClass(q.status)}`}>{q.status.toUpperCase()}</span></td>
                          <td>
                            <button className="tbl-btn" onClick={() => setEditor({ type: 'quote', data: q })}>VIEW</button>
                            <button className="tbl-btn" onClick={() => delQuote(q.id)}>DEL</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className={`admin-tab-content${tab === 'reviews' ? ' active' : ''}`}>
              <div className="win-label">PENDING REVIEWS</div>
              {!pending.length ? (
                <p className="empty">NO PENDING REVIEWS</p>
              ) : (
                <div className="q-table-wrap">
                  <table className="q-table">
                    <thead>
                      <tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {pending.map(r => (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{r.name}</td>
                          <td>
                            {r.discord_id ? (
                              <a href={`https://discord.com/users/${r.discord_id}`} target="_blank" rel="noopener" className="discord-link">
                                @{r.discord_username || r.discord_id}
                              </a>
                            ) : (
                              <span className="discord-anon">Anonymous</span>
                            )}
                          </td>
                          <td>{r.rank}</td>
                          <td className="review-text-cell">
                            {r.text.slice(0, 80)}{r.text.length > 80 ? '...' : ''}
                          </td>
                          <td>
                            <button className="tbl-btn" onClick={() => setEditor({ type: 'review', data: findReview(r.id)! })}>EDIT</button>
                            <button className="tbl-btn tbl-btn-approve" onClick={() => approveReview(r.id)}>APPROVE</button>
                            <button className="tbl-btn tbl-btn-reject" onClick={() => deleteReview(r.id)}>REJECT</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="win-label win-label-mt">APPROVED REVIEWS</div>
              {!approved.length ? (
                <p className="empty">NO APPROVED REVIEWS</p>
              ) : (
                <div className="q-table-wrap">
                  <table className="q-table">
                    <thead>
                      <tr><th>DATE</th><th>NAME</th><th>DISCORD</th><th>RANK</th><th>REVIEW</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {approved.map(r => (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{r.name}</td>
                          <td>
                            {r.discord_id ? (
                              <a href={`https://discord.com/users/${r.discord_id}`} target="_blank" rel="noopener" className="discord-link">
                                @{r.discord_username || r.discord_id}
                              </a>
                            ) : (
                              <span className="discord-anon">Anonymous</span>
                            )}
                          </td>
                          <td>{r.rank}</td>
                          <td className="review-text-cell">
                            {r.text.slice(0, 80)}{r.text.length > 80 ? '...' : ''}
                          </td>
                          <td>
                            <button className="tbl-btn" onClick={() => setEditor({ type: 'review', data: findReview(r.id)! })}>EDIT</button>
                            <button className="tbl-btn tbl-btn-reject" onClick={() => deleteReview(r.id)}>DEL</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editor && (
        <ReviewOrQuoteEditor
          editor={editor}
          onClose={() => setEditor(null)}
          onSaved={() => { setEditor(null); loadData(); }}
        />
      )}
    </div>
  );
}

function ReviewOrQuoteEditor({
  editor,
  onClose,
  onSaved,
}: {
  editor: { type: 'quote' | 'review'; data: Quote | Review };
  onClose: () => void;
  onSaved: () => void;
}) {
  if (editor.type === 'quote') {
    return <QuoteEditor q={editor.data as Quote} onClose={onClose} onSaved={onSaved} />;
  }
  return <ReviewEditor r={editor.data as Review} onClose={onClose} onSaved={onSaved} />;
}

function QuoteEditor({ q, onClose, onSaved }: { q: Quote; onClose: () => void; onSaved: () => void }) {
  return (
    <div className="detail-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="win detail-win">
        <div className="win-titlebar">
          <span className="win-title">QUOTE <span className="dim">#{q.id}</span></span>
          <div className="win-controls"><div className="win-btn" onClick={onClose}>x</div></div>
        </div>
        <div className="win-body">
          {[
            { lbl: 'NAME', val: q.name },
            { lbl: 'DISCORD', val: q.email },
            { lbl: 'TYPE', val: q.type },
            { lbl: 'BUDGET', val: q.budget },
            { lbl: 'TIMELINE', val: q.timeline || '—' },
            { lbl: 'DATE', val: q.date },
            { lbl: 'DESCRIPTION', val: q.description },
            { lbl: 'REFERENCES', val: q.refs || '—' },
          ].map(f => (
            <div key={f.lbl} className="detail-field">
              <span className="lbl">{f.lbl}</span>
              <span className="val">{f.val}</span>
            </div>
          ))}
          <div className="detail-actions">
            <button className="tbl-btn" onClick={async () => {
              await apiPatch('/api/admin', { table: 'quotes', id: q.id, payload: { status: 'seen' } });
              onSaved();
            }}>MARK SEEN</button>
            <button className="tbl-btn tbl-btn-done" onClick={async () => {
              await apiPatch('/api/admin', { table: 'quotes', id: q.id, payload: { status: 'done' } });
              onSaved();
            }}>MARK DONE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const RANKS = ['Client', 'Long-time Client', 'Meowtastic Client', 'Server Owner', 'Developer', 'Community Lead', 'Content Creator', 'VIP'];

function ReviewEditor({ r, onClose, onSaved }: { r: Review; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(r.name);
  const [rank, setRank] = useState(r.rank || 'Client');
  const [rating, setRating] = useState(r.rating || 5);
  const [status, setStatus] = useState(r.status || 'pending');
  const [text, setText] = useState(r.text);

  return (
    <div className="detail-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="win detail-win">
        <div className="win-titlebar">
          <span className="win-title">REVIEW <span className="dim">#{r.id}</span></span>
          <div className="win-controls"><div className="win-btn" onClick={onClose}>x</div></div>
        </div>
        <div className="win-body">
          <div className="detail-field">
            <span className="lbl">NAME</span>
            <span className="val"><input type="text" value={name} onChange={e => setName(e.target.value)} /></span>
          </div>
          <div className="detail-field">
            <span className="lbl">RANK</span>
            <span className="val">
              <select value={rank} onChange={e => setRank(e.target.value)}>
                {RANKS.map(rk => <option key={rk}>{rk}</option>)}
              </select>
            </span>
          </div>
          <div className="detail-field">
            <span className="lbl">RATING</span>
            <span className="val">
              <select value={rating} onChange={e => setRating(parseInt(e.target.value, 10))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}/5</option>)}
              </select>
            </span>
          </div>
          <div className="detail-field">
            <span className="lbl">STATUS</span>
            <span className="val">
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option>pending</option>
                <option>approved</option>
              </select>
            </span>
          </div>
          <div className="detail-field">
            <span className="lbl">REVIEW</span>
            <span className="val"><textarea className="review-edit-textarea" value={text} onChange={e => setText(e.target.value)} /></span>
          </div>
          <div className="detail-actions">
            <button className="tbl-btn tbl-btn-approve" onClick={async () => {
              const res = await apiPatch('/api/admin', { table: 'reviews', id: r.id, payload: { name, rank, rating, status, text } });
              if (res.error) { alert(res.error); return; }
              onSaved();
            }}>SAVE</button>
            <button className="tbl-btn" onClick={onClose}>CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}
