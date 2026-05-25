'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/lib/data';

interface Props {
  project: Project;
  onClose: () => void;
}

export default function VideoPlayer({ project, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (project.videoSrc) {
      v.src = project.videoSrc;
      v.load();
      v.play().catch(() => {});
    }
    return () => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
  }, [project.videoSrc]);

  const sourceLabel = project.videoSrc
    ? project.videoSrc.startsWith('http') ? 'REMOTE' : 'LOCAL'
    : 'NOT SET';

  return (
    <div className="video-overlay show">
      <div className="video-popup-win">
        <div className="win-titlebar">
          <span className="win-title">VIDEOPLAYER<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn" onClick={onClose}>x</div>
          </div>
        </div>
        <div className="video-popup-body">
          <div className="win-label">{project.name.toUpperCase()}</div>
          <div className="video-meta">
            <div className="video-pill">SOURCE: {sourceLabel}</div>
            <div className="video-pill">STATUS: {project.videoSrc ? 'READY' : 'NO VIDEO'}</div>
          </div>
          <div className="video-stage">
            <video ref={videoRef} controls playsInline preload="metadata" />
          </div>
          <div className="video-note">{project.desc}</div>
        </div>
      </div>
    </div>
  );
}
