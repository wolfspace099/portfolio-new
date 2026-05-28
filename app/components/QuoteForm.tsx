'use client';

import { useState, useEffect, useRef } from 'react';
import { apiPost } from '@/lib/api';
import { useDiscord } from '@/lib/useDiscord';
import DiscordVerify from './modals/DiscordVerify';

const DRAFT_KEY = 'quote_draft_v2';

const TILES = [
  {
    id: 'minecraft',
    name: 'MINECRAFT',
    desc: 'Plugins, mods, Skript scripts, custom gamemodes',
    subtypes: ['Java Plugin', 'Fabric / Forge Mod', 'Skript Script', 'Custom Gamemode', 'Other'],
  },
  {
    id: 'web',
    name: 'WEB / FULL STACK',
    desc: 'Websites, dashboards, APIs, full-stack apps',
    subtypes: ['Portfolio / Landing Page', 'Web Application', 'Dashboard', 'API / Backend', 'Other'],
  },
  {
    id: 'devops',
    name: 'DEVOPS / OTHER',
    desc: 'Docker, CI/CD, VPS setup, custom tooling',
    subtypes: ['VPS / Server Setup', 'Docker / CI/CD', 'Custom Tooling', 'Other'],
  },
];

const BUDGETS = ['Under $25', '$25–$50', '$50–$100', '$100–$250', '$250+', 'Not sure yet'];
const TIMELINES = ['ASAP', '1–2 weeks', '2–4 weeks', '1–2 months', 'Flexible'];

export default function QuoteForm() {
  const { discordUser, discordToken } = useDiscord();
  const [tile, setTile] = useState('');
  const [name, setName] = useState('');
  const [subtype, setSubtype] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [desc, setDesc] = useState('');
  const [refs, setRefs] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const mounted = useRef(false);

  const activeTile = TILES.find(t => t.id === tile);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowVerify(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.name) setName(d.name);
      if (d.tile) setTile(d.tile);
      if (d.subtype) setSubtype(d.subtype);
      if (d.budget) setBudget(d.budget);
      if (d.timeline) setTimeline(d.timeline);
      if (d.desc) setDesc(d.desc);
      if (d.refs) setRefs(d.refs);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!discordUser) return;
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      if (d.name && d.subtype && d.desc) {
        setName(d.name);
        setTile(d.tile || '');
        setSubtype(d.subtype);
        setBudget(d.budget || '');
        setTimeline(d.timeline || '');
        setDesc(d.desc);
        setRefs(d.refs || '');
        sessionStorage.removeItem(DRAFT_KEY);
        sessionStorage.removeItem('quote_oauth_pending_v1');
        doSubmit(d.name, d.subtype, d.budget || '', d.timeline || '', d.desc, d.refs || '');
      }
    } catch { /* ignore */ }
  }, [discordUser]);

  function saveDraft() {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name, tile, subtype, budget, timeline, desc, refs }));
  }

  async function doSubmit(n: string, t: string, b: string, tl: string, d: string, r: string) {
    if (!discordUser) { saveDraft(); setShowVerify(true); return; }
    setSubmitting(true);
    try {
      const extra: Record<string, string> = {};
      if (discordToken) extra['Authorization'] = `Bearer ${discordToken}`;
      const res = await apiPost('/api/quotes', {
        name: n,
        type: t,
        budget: b || 'Not specified',
        timeline: tl || 'Not specified',
        description: d,
        references: r || '',
        discord_username: discordUser.username,
      }, extra);
      if (res.error) { alert('Submit failed: ' + res.error); return; }
      sessionStorage.removeItem(DRAFT_KEY);
      setDone(true);
    } catch (e: unknown) {
      alert('Submit failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subtype || !desc.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    saveDraft();
    if (!discordUser) { setShowVerify(true); return; }
    doSubmit(name.trim(), subtype, budget, timeline, desc.trim(), refs.trim());
  }

  return (
    <>
      <section id="quote">
        <div className="win">
          <div className="win-titlebar">
            <span className="win-title">QUOTE<span className="dim">.EXE</span></span>
            <div className="win-controls">
              <div className="win-btn">-</div>
              <div className="win-btn">+</div>
              <div className="win-btn">x</div>
            </div>
          </div>
          <div className="win-body">
            <div className="win-label">REQUEST A QUOTE</div>
            {done ? (
              <div className="form-done show">
                REQUEST RECEIVED<br /><br />
                I WILL REVIEW YOUR PROJECT<br />
                AND REPLY WITHIN 24 HOURS.
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <div className="service-tiles">
                  {TILES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`service-tile${tile === t.id ? ' active' : ''}`}
                      onClick={() => { setTile(t.id); setSubtype(t.subtypes[0]); }}
                    >
                      <span className="service-tile-name">{t.name}</span>
                      <span className="service-tile-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>

                <div className={`form-expand${tile ? ' open' : ''}`}>
                  <div className="field qf-field">
                    <label>NAME</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Your name"
                    />
                  </div>

                  {discordUser && (
                    <div className="discord-bar visible qf-field">
                      DISCORD: <span>@{discordUser.username}</span>
                    </div>
                  )}

                  <div className="form-row2 qf-field">
                    <div className="field">
                      <label>PROJECT TYPE</label>
                      <select value={subtype} onChange={e => setSubtype(e.target.value)} required>
                        <option value="">SELECT...</option>
                        {activeTile?.subtypes.map(s => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>BUDGET</label>
                      <select value={budget} onChange={e => setBudget(e.target.value)}>
                        <option value="">SELECT...</option>
                        {BUDGETS.map(b => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="field qf-field">
                    <label>TIMELINE</label>
                    <select value={timeline} onChange={e => setTimeline(e.target.value)}>
                      <option value="">SELECT...</option>
                      {TIMELINES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="field qf-field">
                    <label>DESCRIPTION</label>
                    <textarea
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      required
                      placeholder="Describe your project, goals, and any specific requirements..."
                    />
                  </div>

                  <div className="field qf-field">
                    <label>REFERENCES <span className="qf-optional">(optional)</span></label>
                    <textarea
                      className="qf-refs"
                      value={refs}
                      onChange={e => setRefs(e.target.value)}
                      placeholder="Links, examples, or anything visual that shows what you're going for..."
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={submitting}>
                    {submitting ? 'SUBMITTING...' : !discordUser ? 'LOGIN WITH DISCORD TO SUBMIT' : 'SUBMIT REQUEST'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {showVerify && (
        <DiscordVerify
          context="quote"
          onClose={() => setShowVerify(false)}
          onAnon={() => setShowVerify(false)}
          onSaveDraft={saveDraft}
        />
      )}
    </>
  );
}
