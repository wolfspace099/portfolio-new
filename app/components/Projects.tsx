'use client';

import { useEffect, useState } from 'react';
import { PROJECTS, Project } from '@/lib/data';
import VideoPlayer from './modals/VideoPlayer';

type Filter = 'all' | 'minecraft' | 'web';

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const [videoProject, setVideoProject] = useState<Project | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setVideoProject(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const visible = filter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === filter);

  function handleCardClick(p: Project) {
    if (p.cardLink) {
      if (p.cardLink.startsWith('#')) {
        window.location.href = '/quote';
      } else {
        window.open(p.cardLink, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    handleViewClick(p);
  }

  function handleViewClick(p: Project) {
    if (p.viewType === 'video') {
      setVideoProject(p);
      return;
    }
    if (!p.link) return;
    if (p.link.startsWith('#')) {
      window.location.href = '/quote';
    } else {
      window.open(p.link, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <>
      <section id="projects">
        <div className="win">
          <div className="win-titlebar">
            <span className="win-title">WORK<span className="dim">.EXE</span></span>
            <div className="win-controls">
              <div className="win-btn">-</div>
              <div className="win-btn">+</div>
              <div className="win-btn">x</div>
            </div>
          </div>
          <div className="win-body">
            <div className="win-label">PROJECTS</div>
            <div className="proj-filter">
              {(['all', 'minecraft', 'web'] as Filter[]).map(f => (
                <button
                  key={f}
                  className={`proj-filter-btn${filter === f ? ' active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="projects-list">
              {visible.map(p => (
                <article
                  key={p.name}
                  className="proj proj-clickable"
                  role="link"
                  tabIndex={0}
                  aria-label={`Open project ${p.name}`}
                  onClick={e => {
                    if ((e.target as HTMLElement).closest('.proj-link')) return;
                    handleCardClick(p);
                  }}
                  onKeyDown={e => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    handleCardClick(p);
                  }}
                >
                  <div className="proj-header">
                    <span className="proj-header-name">{p.name}</span>
                  </div>
                  <div className="proj-body">
                    <div className="proj-desc-label">&gt; DESCRIPTION:</div>
                    <div className="proj-desc">{p.desc}</div>
                    <div className="proj-tags">
                      {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <div className="proj-links">
                      {p.viewType === 'video' ? (
                        <button
                          type="button"
                          className="proj-link proj-link-btn"
                          onClick={e => { e.stopPropagation(); setVideoProject(p); }}
                        >
                          [VIEW]
                        </button>
                      ) : (
                        <a
                          href={p.link?.startsWith('#') ? '/quote' : (p.link || '#')}
                          className="proj-link"
                          target={p.link?.startsWith('http') ? '_blank' : undefined}
                          rel={p.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          onClick={e => e.stopPropagation()}
                        >
                          [VIEW]
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {videoProject && (
        <VideoPlayer project={videoProject} onClose={() => setVideoProject(null)} />
      )}
    </>
  );
}
