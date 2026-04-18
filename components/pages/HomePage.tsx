'use client';

import Image from 'next/image';
import { ChevronRight, Play, BookOpen } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import type { TrainingInfo, Module } from '@/lib/types';

export const HomePage = ({
  navigateTo, postureCount, bookmarkedCount, progressPct,
  modulesCompleted, totalModules, trainingInfo, modules, completedIds,
}: {
  navigateTo: (p: string) => void;
  postureCount: number;
  bookmarkedCount: number;
  progressPct: number;
  modulesCompleted: number;
  totalModules: number;
  trainingInfo: TrainingInfo | null;
  modules: Module[];
  completedIds: Set<string>;
}) => {
  // Next incomplete module — sorted by order, first not in completedIds
  const nextModule = [...modules]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .find(m => !completedIds.has(m.id)) ?? null;

  const trainingName  = trainingInfo?.name        || 'Yoga Teacher Training';
  const studioName    = trainingInfo?.studioName  || '';
  const tagline       = trainingInfo?.tagline      || '';
  const description   = trainingInfo?.description  || '';
  const logoUrl       = trainingInfo?.logoUrl      || '';

  return (
    <div className="page-enter p-6 md:p-10 max-w-5xl mx-auto">

      {/* Hero banner */}
      <div
        className="relative rounded-2xl overflow-hidden mb-8 p-8 md:p-12"
        style={{ background: 'var(--charcoal)', minHeight: 240 }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '45%', background: 'var(--sage)', opacity: 0.1, clipPath: 'ellipse(75% 90% at 80% 50%)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'var(--terracotta)', opacity: 0.06, borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Logo + studio row */}
          {(logoUrl || studioName) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              {logoUrl && (
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.1)', flexShrink: 0, position: 'relative' }}>
                  <Image src={logoUrl} alt="Logo" fill style={{ objectFit: 'contain' }} />
                </div>
              )}
              {studioName && (
                <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
                  {studioName}
                </span>
              )}
            </div>
          )}

          {/* Tagline */}
          {tagline && (
            <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-light)', marginBottom: 8 }}>
              {tagline}
            </p>
          )}

          {/* Training name */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: description ? 12 : 24 }}>
            {trainingName.includes(' ') ? (
              <>
                {trainingName.split(' ').slice(0, -1).join(' ')}<br />
                <em>{trainingName.split(' ').slice(-1)[0]}</em>
              </>
            ) : <em>{trainingName}</em>}
          </h2>

          {/* Description */}
          {description && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 520, marginBottom: 24 }}>
              {description.length > 200 ? description.slice(0, 200) + '…' : description}
            </p>
          )}

          {/* CTA */}
          {nextModule ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => navigateTo('teaching')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: 'var(--terracotta)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', border: 'none', cursor: 'pointer' }}
              >
                <Play size={13} fill="currentColor" />
                Continue learning
              </button>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                {nextModule.section && `${nextModule.section} · `}{nextModule.title}
              </span>
            </div>
          ) : (
            <button
              onClick={() => navigateTo('postures')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: 'var(--terracotta)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', border: 'none', cursor: 'pointer' }}
            >
              <BookOpen size={13} />
              {totalModules === 0 ? 'Browse postures' : 'All modules complete!'}
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { num: `${progressPct}%`,                        label: 'Overall progress' },
          { num: postureCount,                              label: 'Postures available' },
          { num: bookmarkedCount,                           label: 'Bookmarks saved' },
          { num: `${modulesCompleted}/${totalModules}`,     label: 'Modules complete' },
        ].map((s, i) => (
          <div
            key={i}
            className="rounded-xl p-5 text-center"
            style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--charcoal)' }}>
              {s.num}
            </div>
            <div style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section nav cards */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontStyle: 'italic', color: 'var(--charcoal)', marginBottom: 20 }}>
        Explore the curriculum
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV_ITEMS.slice(1).map(item => {
          const Icon = item.icon;
          const colors: Record<string, { bg: string; accent: string }> = {
            team:       { bg: '#f0f5ef', accent: 'var(--sage)' },
            anatomy:    { bg: 'var(--sage-pale)', accent: 'var(--sage)' },
            philosophy: { bg: 'var(--terracotta-pale)', accent: 'var(--terracotta)' },
            teaching:   { bg: '#f0eefc', accent: '#7a77cc' },
            postures:   { bg: '#faf0e8', accent: 'var(--terracotta-light)' },
          };
          const c = colors[item.id] || { bg: 'var(--cream)', accent: 'var(--sage)' };
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="card-lift flex flex-col items-start p-6 rounded-2xl text-left"
              style={{ background: c.bg, border: `1px solid ${c.bg}`, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              <Icon size={28} style={{ color: c.accent, marginBottom: 14 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--charcoal)', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--mid-gray)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore <ChevronRight size={12} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
