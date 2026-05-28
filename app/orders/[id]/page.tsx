'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useClientAuth } from '@/lib/useClientAuth';
import ClientAuthModal from '@/app/components/ClientAuthModal';

interface Order {
  id: string;
  service_type: string;
  package_name: string;
  status: string;
  quoted_price?: string;
  paypal_link?: string;
  eta?: string;
  progress_note?: string;
  decline_reason?: string;
  description: string;
}

interface Message {
  id: string;
  created_at: string;
  sender: 'client' | 'admin' | 'system';
  content: string;
  is_price_quote?: boolean;
  quoted_price?: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'PENDING REVIEW',
  accepted: 'ACCEPTED',
  declined: 'DECLINED',
  quoted: 'PRICE QUOTED',
  awaiting_payment: 'AWAITING PAYMENT',
  in_progress: 'IN PROGRESS',
  complete: 'COMPLETE',
  quote_declined: 'QUOTE DECLINED',
};

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-pending',
  accepted: 'badge-approved',
  declined: 'badge-rejected',
  quoted: 'badge-pending',
  awaiting_payment: 'badge-pending',
  in_progress: 'badge-approved',
  complete: 'badge-done',
  quote_declined: 'badge-rejected',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, token, loading } = useClientAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [err, setErr] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loading && !user) setShowAuth(true);
    if (user && token) {
      load();
      pollRef.current = setInterval(loadMessages, 5000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, token, loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function load() {
    if (!token) return;
    const res = await fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.order) setOrder(data.order);
    if (data.messages) setMessages(data.messages);
  }

  async function loadMessages() {
    if (!token) return;
    const res = await fetch(`/api/orders/${id}/messages`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.messages) setMessages(data.messages);
  }

  async function sendMessage() {
    if (!draft.trim() || !token) return;
    setSending(true);
    try {
      const res = await fetch(`/api/orders/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: draft.trim() }),
      });
      const data = await res.json();
      if (data.error) { setErr(data.error); return; }
      setDraft('');
      await loadMessages();
    } finally {
      setSending(false);
    }
  }

  async function respondToQuote(action: 'accept_quote' | 'decline_quote') {
    if (!token) return;
    await fetch(`/api/orders/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action }),
    });
    await load();
  }

  if (loading) return null;

  if (!user) {
    return (
      <>
        <section>
          <div className="win">
            <div className="win-titlebar">
              <span className="win-title">ORDER<span className="dim">.EXE</span></span>
            </div>
            <div className="win-body">
              <p className="empty">LOGIN TO VIEW THIS ORDER</p>
              <button className="form-submit dash-first-link" onClick={() => setShowAuth(true)}>LOGIN</button>
            </div>
          </div>
        </section>
        {showAuth && <ClientAuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      </>
    );
  }

  const canChat = order && ['accepted', 'quoted', 'awaiting_payment', 'in_progress', 'quote_declined'].includes(order.status);

  return (
    <section>
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">ORDER <span className="dim">#{id.slice(0, 8)}</span></span>
          <div className="win-controls">
            <a href="/dashboard" className="win-btn order-win-close">x</a>
          </div>
        </div>
        <div className="win-body">
          {!order ? (
            <p className="empty">LOADING...</p>
          ) : (
            <div className="order-detail-layout">
              <div className="order-detail-info">
                <div className="win-label">ORDER INFO</div>
                <div className="detail-field">
                  <span className="lbl">TYPE</span>
                  <span className="val">{order.service_type.toUpperCase()} — {order.package_name}</span>
                </div>
                <div className="detail-field">
                  <span className="lbl">STATUS</span>
                  <span className="val">
                    <span className={`badge ${STATUS_BADGE[order.status] || 'badge-pending'}`}>
                      {STATUS_LABELS[order.status] || order.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                {order.quoted_price && (
                  <div className="detail-field">
                    <span className="lbl">QUOTED</span>
                    <span className="val">{order.quoted_price}</span>
                  </div>
                )}
                {order.eta && (
                  <div className="detail-field">
                    <span className="lbl">ETA</span>
                    <span className="val">{order.eta}</span>
                  </div>
                )}
                {order.paypal_link && order.status === 'awaiting_payment' && (
                  <a href={order.paypal_link} target="_blank" rel="noopener" className="form-submit order-paypal-btn">
                    PAY VIA PAYPAL
                  </a>
                )}
                {order.decline_reason && (
                  <div className="detail-field">
                    <span className="lbl">REASON</span>
                    <span className="val order-decline-reason">{order.decline_reason}</span>
                  </div>
                )}
                {order.progress_note && (
                  <div className="order-progress-section">
                    <div className="win-label">PROGRESS</div>
                    <p className="order-progress-text">{order.progress_note}</p>
                  </div>
                )}
              </div>

              <div className="order-chat">
                <div className="win-label">CHAT</div>
                {!canChat && order.status === 'pending' && (
                  <p className="chat-pending-note">Chat opens once your order is accepted.</p>
                )}
                <div className="chat-messages">
                  {messages.map(m => (
                    <div key={m.id} className={`chat-msg chat-msg-${m.sender}`}>
                      {m.is_price_quote ? (
                        <div className="chat-quote-prompt">
                          <div className="chat-quote-text">{m.content}</div>
                          {order.status === 'quoted' && (
                            <div className="chat-quote-actions">
                              <button className="form-submit" onClick={() => respondToQuote('accept_quote')}>
                                ACCEPT
                              </button>
                              <button className="btn btn-outline" onClick={() => respondToQuote('decline_quote')}>
                                DECLINE
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="chat-bubble">
                          <span className="chat-sender">{m.sender === 'client' ? 'YOU' : m.sender === 'admin' ? 'CQT' : 'SYSTEM'}</span>
                          <span className="chat-content">{m.content}</span>
                          <span className="chat-time">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {canChat && (
                  <div className="chat-input-row">
                    <input
                      className="chat-input"
                      type="text"
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Type a message..."
                    />
                    <button className="chat-send-btn" onClick={sendMessage} disabled={sending || !draft.trim()}>
                      SEND
                    </button>
                  </div>
                )}
                {err && <p className="chat-err">{err}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
