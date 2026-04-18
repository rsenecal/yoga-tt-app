'use client';

import { Flower2 } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';

export const Sidebar = ({
  currentPage, navigateTo, mobileOpen, setMobileOpen, progressPct = 0
}: {
  currentPage: string;
  navigateTo: (p: string) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  progressPct?: number;
}) => {
  const sidebarContent = (
    <aside
      className="flex flex-col h-full"
      style={{ background: 'var(--charcoal)', width: 256 }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-6 py-6 cursor-pointer"
        onClick={() => navigateTo('home')}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0"
          style={{ width: 36, height: 36, background: 'var(--terracotta)' }}
        >
          <Flower2 size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', fontWeight: 400 }}>
            YTB Manual
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>
            300-Hr Training
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', padding: '0 12px', marginBottom: 8 }}>
          Curriculum
        </p>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { navigateTo(item.id); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: active ? 'var(--sage)' : 'transparent',
                color:      active ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 13,
                fontWeight: active ? 500 : 300,
                fontFamily: 'var(--font-body)',
              }}
              onMouseOver={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              onMouseOut={e  => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              <Icon size={16} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Progress footer */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex justify-between mb-2" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          <span>Course progress</span>
          <span>{progressPct}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--terracotta)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
