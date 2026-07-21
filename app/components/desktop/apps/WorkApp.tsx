'use client';

import { useState } from 'react';
import { PROJECTS, Project } from '@/lib/data';
import VideoPlayer from '../../modals/VideoPlayer';

type Filter = 'all' | 'minecraft' | 'web';
const FILTERS: Filter[] = ['all', 'minecraft', 'web'];

interface Props {
  onOpenQuote?: () => void;
}

export default function WorkApp({ onOpenQuote }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [video, setVideo] = useState<Project | null>(null);

  const visible = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  function openProject(p: Project) {
    if (p.viewType === 'video') { setVideo(p); return; }
    const target = p.link || p.cardLink;
    if (!target) return;
    if (target.startsWith('#')) { onOpenQuote?.(); return; }
    window.open(target, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="kapp work-app">
      <div className="work-filter">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`work-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'minecraft' ? 'Minecraft' : 'Web'}
          </button>
        ))}
      </div>

      <div className="work-grid">
        {visible.map(p => (
          <article key={p.name} className="work-card">
            <h2 className="work-card-name">{p.name}</h2>
            <p className="work-card-desc">{p.desc}</p>
            <div className="work-tags">
              {p.tags.map(t => <span key={t} className="work-tag">{t}</span>)}
            </div>
            <button className="work-open" onClick={() => openProject(p)}>
              {p.viewType === 'video' ? 'Watch demo' : 'Open'}
            </button>
          </article>
        ))}
      </div>

      {video && <VideoPlayer project={video} onClose={() => setVideo(null)} />}
    </div>
  );
}
