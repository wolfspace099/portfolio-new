'use client';

import { useState } from 'react';
import { apiPatch, apiDelete } from '@/lib/api';

interface Order {
  id: string;
  created_at: string;
  client_name: string;
  client_email: string;
  service_type: string;
  package_name: string;
  description: string;
  details?: Record<string, string>;
  status: string;
  quoted_price?: string;
  paypal_link?: string;
  eta?: string;
  progress_note?: string;
  decline_reason?: string;
}

interface Message {
  id: string;
  created_at: string;
  sender: string;
  content: string;
  is_price_quote?: boolean;
}

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

const STATUS_LABELS: Record<string, string> = {
  pending: 'PENDING',
  accepted: 'ACCEPTED',
  declined: 'DECLINED',
  quoted: 'QUOTED',
  awaiting_payment: 'AWAITING PMT',
  in_progress: 'IN PROGRESS',
  complete: 'COMPLETE',
  quote_declined: 'QUOTE DECLINED',
};

interface Props {
  orders: Order[];
  onRefresh: () => void;
}

export default function AdminOrders({ orders, onRefresh }: Props) {
  const [selected, setSelected] = useState<Order | null>(null);

  async function del(id: string) {
    if (!confirm('Delete this order?')) return;
    await apiDelete('/api/admin', { table: 'orders', id });
    onRefresh();
  }

  if (selected) {
    return <OrderDetail order={selected} onBack={() => setSelected(null)} onRefresh={() => { onRefresh(); setSelected(null); }} />;
  }

  return (
    <>
      <div className="win-label">ALL ORDERS</div>
      {!orders.length ? (
        <p className="empty">NO ORDERS YET</p>
      ) : (
        <div className="q-table-wrap">
          <table className="q-table">
            <thead>
              <tr><th>DATE</th><th>CLIENT</th><th>SERVICE</th><th>PACKAGE</th><th>STATUS</th><th>ACTIONS</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.client_name}</td>
                  <td>{o.service_type.toUpperCase()}</td>
                  <td>{o.package_name}</td>
                  <td><span className={`badge ${STATUS_BADGE[o.status] || 'badge-pending'}`}>{STATUS_LABELS[o.status] || o.status.toUpperCase()}</span></td>
                  <td>
                    <button className="tbl-btn" onClick={() => setSelected(o)}>MANAGE</button>
                    <button className="tbl-btn tbl-btn-reject" onClick={() => del(o.id)}>DEL</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function OrderDetail({ order, onBack, onRefresh }: { order: Order; onBack: () => void; onRefresh: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [price, setPrice] = useState('');
  const [paypal, setPaypal] = useState(order.paypal_link || '');
  const [declineReason, setDeclineReason] = useState('');
  const [note, setNote] = useState(order.progress_note || '');
  const [eta, setEta] = useState(order.eta || '');
  const [loading, setLoading] = useState(false);

  async function action(act: string, payload: Record<string, string> = {}) {
    setLoading(true);
    await apiPatch('/api/admin', { table: 'orders', id: order.id, action: act, payload });
    setLoading(false);
    onRefresh();
  }

  async function loadChat() {
    const res = await apiPatch('/api/admin', { table: 'orders', id: order.id, action: 'get_messages', payload: {} });
    if (res.messages) { setMessages(res.messages); setChatLoaded(true); }
  }

  async function sendMsg() {
    if (!draft.trim()) return;
    await apiPatch('/api/admin', { table: 'orders', id: order.id, action: 'message', payload: { content: draft.trim() } });
    setDraft('');
    loadChat();
  }

  return (
    <div>
      <button className="tbl-btn admin-back" onClick={onBack}>BACK TO LIST</button>

      <div className="order-detail-layout">
        <div className="order-detail-info">
          <div className="win-label">ORDER INFO</div>
          {[
            { lbl: 'CLIENT', val: `${order.client_name} (${order.client_email})` },
            { lbl: 'SERVICE', val: `${order.service_type.toUpperCase()} — ${order.package_name}` },
            { lbl: 'STATUS', val: STATUS_LABELS[order.status] || order.status.toUpperCase() },
            { lbl: 'DESCRIPTION', val: order.description },
          ].map(f => (
            <div key={f.lbl} className="detail-field">
              <span className="lbl">{f.lbl}</span>
              <span className="val admin-detail-val">{f.val}</span>
            </div>
          ))}
          {order.details && Object.entries(order.details).map(([k, v]) => v ? (
            <div key={k} className="detail-field">
              <span className="lbl">{k.toUpperCase()}</span>
              <span className="val">{v}</span>
            </div>
          ) : null)}

          <div className="win-label admin-section-label">ACTIONS</div>

          {order.status === 'pending' && (
            <div className="detail-actions">
              <button className="tbl-btn tbl-btn-approve" disabled={loading} onClick={() => action('accept')}>ACCEPT</button>
              <div className="admin-action-row">
                <input className="admin-input" type="text" placeholder="Decline reason..." value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)} />
                <button className="tbl-btn tbl-btn-reject" disabled={loading} onClick={() => action('decline', { reason: declineReason })}>DECLINE</button>
              </div>
            </div>
          )}

          {['accepted', 'quote_declined'].includes(order.status) && (
            <div className="detail-actions">
              <div className="admin-action-row">
                <input className="admin-input" type="text" placeholder="Price (e.g. $50)" value={price} onChange={e => setPrice(e.target.value)} />
                <input className="admin-input admin-input-wide" type="text" placeholder="PayPal link (optional)" value={paypal} onChange={e => setPaypal(e.target.value)} />
              </div>
              <button className="tbl-btn tbl-btn-approve" disabled={loading || !price} onClick={() => action('quote', { price, paypal })}>
                SEND PRICE QUOTE
              </button>
            </div>
          )}

          {order.status === 'awaiting_payment' && (
            <div className="detail-actions">
              <div className="admin-action-row">
                <input className="admin-input" type="text" placeholder="PayPal link" value={paypal} onChange={e => setPaypal(e.target.value)} />
                <button className="tbl-btn" disabled={loading || !paypal} onClick={() => action('send_paypal', { link: paypal })}>SEND PAYPAL</button>
              </div>
              <button className="tbl-btn tbl-btn-approve" disabled={loading} onClick={() => action('mark_paid')}>MARK PAID</button>
            </div>
          )}

          {['in_progress', 'paid'].includes(order.status) && (
            <div className="detail-actions">
              <textarea className="admin-textarea" placeholder="Progress note..." value={note} onChange={e => setNote(e.target.value)} />
              <div className="admin-action-row">
                <input className="admin-input" type="text" placeholder="ETA (e.g. 3 days)" value={eta} onChange={e => setEta(e.target.value)} />
                <button className="tbl-btn tbl-btn-approve" disabled={loading} onClick={() => action('update', { note, eta })}>POST UPDATE</button>
              </div>
              <button className="tbl-btn tbl-btn-complete" disabled={loading} onClick={() => action('complete')}>
                MARK COMPLETE
              </button>
            </div>
          )}
        </div>

        <div className="order-chat">
          <div className="order-chat-label win-label">
            CHAT
            {!chatLoaded && <button className="tbl-btn" onClick={loadChat}>LOAD CHAT</button>}
          </div>
          {chatLoaded && (
            <>
              <div className="chat-messages">
                {messages.map(m => (
                  <div key={m.id} className={`chat-msg chat-msg-${m.sender === 'admin' ? 'client' : m.sender}`}>
                    <div className="chat-bubble">
                      <span className="chat-sender">{m.sender === 'admin' ? 'YOU' : m.sender === 'client' ? 'CLIENT' : 'SYSTEM'}</span>
                      <span className="chat-content">{m.content}</span>
                      <span className="chat-time">{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input className="chat-input" type="text" value={draft} onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
                  placeholder="Message client..." />
                <button className="chat-send-btn" onClick={sendMsg} disabled={!draft.trim()}>SEND</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
