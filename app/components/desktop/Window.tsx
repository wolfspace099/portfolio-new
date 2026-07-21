'use client';

import { useRef, ReactNode } from 'react';
import { AppIcon, AppId } from '@/lib/apps';

export type WinState = {
  key: number;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

interface Props {
  win: WinState;
  focused: boolean;
  mobile: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMax: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
}

export default function Window({
  win, focused, mobile, onFocus, onClose, onMinimize, onToggleMax, onMove, children,
}: Props) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    if (mobile || win.maximized) return;
    if ((e.target as HTMLElement).closest('.pwin-btn')) return;
    onFocus();
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const x = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - drag.current.dx));
    const y = Math.max(0, Math.min(window.innerHeight - 90, e.clientY - drag.current.dy));
    onMove(x, y);
  }

  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  const style: React.CSSProperties =
    mobile || win.maximized
      ? { zIndex: win.z }
      : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  const cls = [
    'pwin',
    focused ? 'focused' : '',
    win.minimized ? 'minimized' : '',
    (mobile || win.maximized) ? 'maximized' : '',
  ].join(' ').trim();

  return (
    <section className={cls} style={style} onPointerDown={onFocus} aria-label={win.title}>
      <header
        className="pwin-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={() => !mobile && onToggleMax()}
      >
        <span className="pwin-icon"><AppIcon id={win.appId} size={16} /></span>
        <span className="pwin-title">{win.title}</span>
        <div className="pwin-controls">
          <button className="pwin-btn pwin-min" onClick={onMinimize} aria-label="Minimize" title="Minimize" />
          <button className="pwin-btn pwin-max" onClick={onToggleMax} aria-label="Maximize" title="Maximize" />
          <button className="pwin-btn pwin-close" onClick={onClose} aria-label="Close" title="Close" />
        </div>
      </header>
      <div className="pwin-body">{children}</div>
    </section>
  );
}
