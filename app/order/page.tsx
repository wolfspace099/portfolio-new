import type { Metadata } from 'next';
import OrderFlow from './OrderFlow';

export const metadata: Metadata = {
  title: 'ORDER | CQT.EXE',
  description: 'Place a development order — Minecraft plugins, web apps, DevOps.',
};

export default function Page() {
  return (
    <section id="order">
      <div className="win">
        <div className="win-titlebar">
          <span className="win-title">ORDER<span className="dim">.EXE</span></span>
          <div className="win-controls">
            <div className="win-btn">-</div>
            <div className="win-btn">+</div>
            <div className="win-btn">x</div>
          </div>
        </div>
        <div className="win-body">
          <div className="win-label">PLACE AN ORDER</div>
          <OrderFlow />
        </div>
      </div>
    </section>
  );
}
