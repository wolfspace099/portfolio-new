'use client';

import { useState, useEffect } from 'react';
import { useClientAuth } from '@/lib/useClientAuth';
import ClientAuthModal from '@/app/components/ClientAuthModal';

interface Order {
  id: string;
  created_at: string;
  service_type: string;
  package_name: string;
  status: string;
  quoted_price?: string;
  eta?: string;
  progress_note?: string;
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
  pending: 'badge-new',
  accepted: 'badge-approved',
  declined: 'badge-rejected',
  quoted: 'badge-pending',
  awaiting_payment: 'badge-pending',
  in_progress: 'badge-seen',
  complete: 'badge-done',
  quote_declined: 'badge-rejected',
};

export default function DashboardPage() {
  const { user, token, loading, signOut } = useClientAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!loading && !user) setShowAuth(true);
    if (user && token) loadOrders();
  }, [user, token, loading]);

  async function loadOrders() {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setFetching(false);
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <>
        <section>
          <div className="win">
            <div className="win-titlebar">
              <span className="win-title">DASHBOARD<span className="dim">.EXE</span></span>
              <div className="win-controls"><div className="win-btn">x</div></div>
            </div>
            <div className="win-body">
              <p className="empty">LOGIN TO VIEW YOUR ORDERS</p>
              <button className="form-submit dash-first-link" onClick={() => setShowAuth(true)}>LOGIN</button>
            </div>
          </div>
        </section>
        {showAuth && <ClientAuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <section>
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">DASHBOARD<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn">x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="dash-header">
            <div className="win-label">MY ORDERS</div>
            <div className="dash-header-actions">
              <a href="/order" className="btn btn-outline dash-action-link">+ NEW ORDER</a>
              <button className="btn btn-outline dash-action-btn" onClick={signOut}>LOGOUT</button>
            </div>
          </div>

          <p className="dash-user">LOGGED IN AS <span>{user.email}</span></p>

          {fetching ? (
            <p className="empty">LOADING...</p>
          ) : !orders.length ? (
            <div className="dash-empty">
              <p>NO ORDERS YET.</p>
              <a href="/order" className="form-submit dash-first-link">PLACE YOUR FIRST ORDER</a>
            </div>
          ) : (
            <div className="dash-orders">
              {orders.map(o => (
                <a key={o.id} href={`/orders/${o.id}`} className="dash-order-card">
                  <div className="dash-order-top">
                    <span className="dash-order-type">{o.service_type.toUpperCase()} — {o.package_name}</span>
                    <span className={`badge ${STATUS_BADGE[o.status] || 'badge-pending'}`}>{STATUS_LABELS[o.status] || o.status.toUpperCase()}</span>
                  </div>
                  {o.quoted_price && <div className="dash-order-detail">QUOTED: {o.quoted_price}</div>}
                  {o.eta && <div className="dash-order-detail">ETA: {o.eta}</div>}
                  {o.progress_note && <div className="dash-order-note">{o.progress_note}</div>}
                  <div className="dash-order-id">#{o.id.slice(0, 8)}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
