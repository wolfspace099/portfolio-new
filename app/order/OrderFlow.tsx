'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PACKAGES } from '@/lib/data';
import { useClientAuth } from '@/lib/useClientAuth';
import ClientAuthModal from '@/app/components/ClientAuthModal';

const SERVICE_TYPES = [
  { id: 'minecraft', label: 'MINECRAFT PLUGIN', desc: 'Java plugins, Skript scripts, custom gamemodes' },
  { id: 'web', label: 'WEB / FULL STACK', desc: 'Websites, dashboards, APIs, full-stack apps' },
  { id: 'devops', label: 'DEVOPS / OTHER', desc: 'Docker, CI/CD, VPS setup, custom tooling' },
];

const DETAIL_FIELDS: Record<string, { label: string; key: string; placeholder: string; type?: 'select'; options?: string[] }[]> = {
  minecraft: [
    { label: 'SERVER SOFTWARE', key: 'software', type: 'select', placeholder: '', options: ['Spigot / Paper', 'BungeeCord / Velocity', 'Fabric / Forge', 'Other'] },
    { label: 'JAVA OR SKRIPT', key: 'lang', type: 'select', placeholder: '', options: ['Java Plugin', 'Skript Script', "Don't mind"] },
    { label: 'PLAYER COUNT (EST.)', key: 'players', placeholder: 'e.g. 50–200 players' },
    { label: 'TIMELINE', key: 'timeline', placeholder: 'e.g. 2 weeks, ASAP' },
  ],
  web: [
    { label: 'TECH PREFERENCES', key: 'stack', placeholder: 'e.g. React, Next.js, no preference...' },
    { label: 'HOSTING', key: 'hosting', type: 'select', placeholder: '', options: ['Deploy for me (Vercel)', 'I handle hosting', 'Not sure yet'] },
    { label: 'APPROX. PAGE COUNT', key: 'pages', placeholder: 'e.g. 5 pages, dashboard + landing...' },
    { label: 'TIMELINE', key: 'timeline', placeholder: 'e.g. 3 weeks, ASAP' },
  ],
  devops: [
    { label: 'OS / PROVIDER', key: 'os', placeholder: 'e.g. Ubuntu 22 on Hetzner' },
    { label: 'SERVICES TO SET UP', key: 'services', placeholder: 'e.g. Nginx, Docker, Postgres, GitHub Actions...' },
    { label: 'TIMELINE', key: 'timeline', placeholder: 'e.g. 1 week, flexible' },
  ],
};

export default function OrderFlow() {
  const router = useRouter();
  const { user, token, loading } = useClientAuth();

  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState('');
  const [packageId, setPackageId] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState<Record<string, string>>({});
  const [showAuth, setShowAuth] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const pkgs = serviceType ? PACKAGES[serviceType] || [] : [];
  const selectedPkg = pkgs.find(p => p.id === packageId);
  const fields = serviceType ? DETAIL_FIELDS[serviceType] || [] : [];

  useEffect(() => {
    if (step === 3 && !loading && !user) setShowAuth(true);
    else if (step === 3 && user) setShowAuth(false);
  }, [step, user, loading]);

  function nextStep() { setStep(s => s + 1); }
  function prevStep() { setStep(s => s - 1); }

  async function handleSubmit() {
    if (!user || !token) { setShowAuth(true); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          client_name: user.name,
          service_type: serviceType,
          package_id: packageId,
          package_name: selectedPkg?.name || '',
          description,
          details,
        }),
      });
      const data = await res.json();
      if (data.error) { alert('Error: ' + data.error); return; }
      setDone(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="order-flow">
        <div className="order-done">
          <div className="order-done-title">ORDER SUBMITTED</div>
          <div className="order-done-sub">Redirecting to your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="order-flow">
        <div className="order-progress">
          {['SERVICE', 'PACKAGE', 'DETAILS', 'CONFIRM'].map((label, i) => (
            <div key={label} className={`order-step-dot${i === step ? ' active' : i < step ? ' done' : ''}`}>
              <span className="order-step-num">{i < step ? '✓' : i + 1}</span>
              <span className="order-step-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="order-panel">
          {step === 0 && (
            <>
              <div className="order-section-title">SELECT SERVICE TYPE</div>
              <div className="order-type-grid">
                {SERVICE_TYPES.map(t => (
                  <button key={t.id}
                    className={`order-type-card${serviceType === t.id ? ' active' : ''}`}
                    onClick={() => { setServiceType(t.id); setPackageId(''); }}
                  >
                    <span className="order-type-name">{t.label}</span>
                    <span className="order-type-desc">{t.desc}</span>
                  </button>
                ))}
              </div>
              <div className="order-actions">
                <button className="form-submit order-next" onClick={nextStep} disabled={!serviceType}>
                  NEXT: CHOOSE PACKAGE
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="order-section-title">SELECT PACKAGE</div>
              <div className="order-pkg-grid">
                {pkgs.map(pkg => (
                  <button key={pkg.id}
                    className={`order-pkg-card${packageId === pkg.id ? ' active' : ''}`}
                    onClick={() => setPackageId(pkg.id)}
                  >
                    <div className="order-pkg-top">
                      <span className="order-pkg-name">{pkg.name}</span>
                      <span className="order-pkg-price">{pkg.price}</span>
                    </div>
                    <p className="order-pkg-desc">{pkg.desc}</p>
                    <ul className="order-pkg-features">
                      {pkg.features.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="order-actions">
                <button className="btn btn-outline order-back" onClick={prevStep}>BACK</button>
                <button className="form-submit order-next" onClick={nextStep} disabled={!packageId}>
                  NEXT: DETAILS
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="order-section-title">PROJECT DETAILS</div>
              <div className="field" style={{ marginBottom: '20px' }}>
                <label>DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your project, goals, and any specific requirements..."
                  style={{ minHeight: '120px' }}
                />
              </div>
              {fields.map(f => (
                <div key={f.key} className="field" style={{ marginBottom: '16px' }}>
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={details[f.key] || ''} onChange={e => setDetails(d => ({ ...d, [f.key]: e.target.value }))}>
                      <option value="">SELECT...</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={details[f.key] || ''} onChange={e => setDetails(d => ({ ...d, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <div className="order-actions">
                <button className="btn btn-outline order-back" onClick={prevStep}>BACK</button>
                <button className="form-submit order-next" onClick={nextStep} disabled={!description.trim()}>
                  NEXT: CONFIRM
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="order-section-title">CONFIRM ORDER</div>
              {user ? (
                <>
                  <div className="order-summary">
                    <div className="order-summary-row"><span>ACCOUNT</span><span>{user.email}</span></div>
                    <div className="order-summary-row"><span>SERVICE</span><span>{SERVICE_TYPES.find(t => t.id === serviceType)?.label}</span></div>
                    <div className="order-summary-row"><span>PACKAGE</span><span>{selectedPkg?.name} — {selectedPkg?.price}</span></div>
                    <div className="order-summary-row"><span>DESCRIPTION</span><span className="order-summary-desc">{description}</span></div>
                  </div>
                  <div className="order-actions">
                    <button className="btn btn-outline order-back" onClick={prevStep}>BACK</button>
                    <button className="form-submit order-next" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'SUBMITTING...' : 'PLACE ORDER'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="order-auth-prompt">
                  <p>You need an account to place an order.</p>
                  <button className="form-submit" onClick={() => setShowAuth(true)}>LOGIN / REGISTER</button>
                  <button className="btn btn-outline order-back" onClick={prevStep} style={{ marginTop: '12px' }}>BACK</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showAuth && (
        <ClientAuthModal
          onClose={() => { setShowAuth(false); if (!user && step === 3) setStep(2); }}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </>
  );
}
