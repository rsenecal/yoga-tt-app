'use client';

import React, { useState } from 'react';
import {
  CheckCircle2, Circle, BookOpen, ChevronDown,
  Play, Clock, Lightbulb, X, User, Flower2, Heart, Book
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { RichContent } from '@/components/ui/RichContent';
import type { Module, ModuleItem, Posture, AnatomyCard, PhilosophyCard, TeamMember } from '@/lib/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const groupBySection = (modules: Module[]) => {
  const map = new Map<string, Module[]>();
  for (const m of [...modules].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))) {
    const key = m.section || 'General';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return map;
};

const typeIcon = (type: ModuleItem['type']) => {
  if (type === 'posture')   return <Flower2 size={13} />;
  if (type === 'anatomy')   return <Heart size={13} />;
  if (type === 'philosophy') return <Book size={13} />;
};

const typeColor = (type: ModuleItem['type']) => {
  if (type === 'posture')    return { bg: 'var(--terracotta-pale)', color: 'var(--terracotta)' };
  if (type === 'anatomy')    return { bg: 'var(--sage-pale)',       color: 'var(--sage)' };
  if (type === 'philosophy') return { bg: '#f0eefc',                color: '#7a77cc' };
  return { bg: 'var(--sand)', color: 'var(--mid-gray)' };
};

interface ContentRef {
  id: string;
  label: string;
  sublabel?: string;
  imageUrl?: string;
  type: ModuleItem['type'];
}

// ─── Resolve a ModuleItem ref to displayable data ─────────────────────────────
const resolveItem = (
  item: ModuleItem,
  postures: Posture[],
  anatomyCards: AnatomyCard[],
  philosophyCards: PhilosophyCard[],
): ContentRef | null => {
  if (item.type === 'posture') {
    const p = postures.find(x => x.id === item.refId);
    if (!p) return null;
    return { id: p.id, label: p.english_name, sublabel: p.sanskrit_name, imageUrl: p.imageUrl, type: 'posture' };
  }
  if (item.type === 'anatomy') {
    const a = anatomyCards.find(x => x.id === item.refId);
    if (!a) return null;
    return { id: a.id, label: a.title, sublabel: a.category, imageUrl: a.imageUrl, type: 'anatomy' };
  }
  if (item.type === 'philosophy') {
    const ph = philosophyCards.find(x => x.id === item.refId);
    if (!ph) return null;
    return { id: ph.id, label: ph.title, sublabel: ph.category, imageUrl: ph.imageUrl, type: 'philosophy' };
  }
  return null;
};

// ─── Module detail modal ──────────────────────────────────────────────────────

const ModuleModal = ({
  mod, done, onToggle, onClose, loadingProgress,
  postures, anatomyCards, philosophyCards, teamMembers,
}: {
  mod: Module;
  done: boolean;
  onToggle: () => void;
  onClose: () => void;
  loadingProgress: boolean;
  postures: Posture[];
  anatomyCards: AnatomyCard[];
  philosophyCards: PhilosophyCard[];
  teamMembers: TeamMember[];
}) => {
  const tips  = mod.tips ?? [];
  const items = mod.items ?? [];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(44,44,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--warm-white)', borderRadius: 20, width: '100%', maxWidth: 740, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--sand)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            {mod.section && (
              <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', background: 'var(--sage-pale)', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 8 }}>
                {mod.section}
              </span>
            )}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--charcoal)', margin: 0, lineHeight: 1.2 }}>
              {mod.title}
            </h2>
            {items.length > 0 && (
              <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 6 }}>
                {items.length} item{items.length !== 1 ? 's' : ''} in this module
              </p>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'var(--cream)', border: '1px solid var(--sand)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--mid-gray)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Description */}
          {mod.description && (
            <RichContent
              html={mod.description}
              style={{ color: 'var(--charcoal)', fontSize: 15, lineHeight: 1.8 }}
            />
          )}

          {/* Video */}
          <VideoPlayer url={mod.videoUrl} />

          {/* Tips */}
          {tips.length > 0 && (
            <div style={{ background: 'var(--sage-pale)', border: '1px solid var(--sage-mid)', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Lightbulb size={15} style={{ color: 'var(--sage)' }} />
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sage)', fontWeight: 500 }}>Quick tips</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tips.map((tip, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--charcoal)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--sage)', flexShrink: 0 }}>●</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Curated content items */}
          {items.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 3, height: 20, background: 'var(--terracotta)', borderRadius: 2 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, color: 'var(--charcoal)', margin: 0, fontStyle: 'italic' }}>
                  Module content
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item, i) => {
                  const ref = resolveItem(item, postures, anatomyCards, philosophyCards);
                  if (!ref) return null;
                  const teacher = teamMembers.find(t => t.id === item.teacherId);
                  const colors  = typeColor(item.type);
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--cream)', border: '1px solid var(--sand)', borderRadius: 12 }}>
                      {/* Thumbnail */}
                      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--sand)' }}>
                        {ref.imageUrl && (
                          <img src={ref.imageUrl} alt={ref.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20, background: colors.bg, color: colors.color }}>
                            {typeIcon(item.type)} {item.type}
                          </span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--charcoal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ref.label}
                        </div>
                        {ref.sublabel && (
                          <div style={{ fontSize: 12, color: 'var(--mid-gray)', fontStyle: 'italic' }}>{ref.sublabel}</div>
                        )}
                      </div>
                      {/* Assigned teacher */}
                      {teacher && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: 'var(--sand)', flexShrink: 0 }}>
                            {teacher.imageUrl
                              ? <img src={teacher.imageUrl} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={14} style={{ color: 'var(--mid-gray)' }} /></div>
                            }
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--mid-gray)', whiteSpace: 'nowrap' }}>{teacher.name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!mod.description && !mod.videoUrl && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--mid-gray)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic' }}>Content coming soon.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--sand)', background: 'transparent', color: 'var(--mid-gray)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Close
          </button>
          <button
            onClick={() => { onToggle(); onClose(); }}
            disabled={loadingProgress}
            style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: done ? 'var(--sand)' : 'var(--sage)', color: done ? 'var(--mid-gray)' : '#fff', fontSize: 13, cursor: loadingProgress ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {done ? <><Circle size={15} /> Mark incomplete</> : <><CheckCircle2 size={15} /> Mark complete</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section header with progress ─────────────────────────────────────────────

const SectionHeader = ({ section, modules, completedIds }: { section: string; modules: Module[]; completedIds: Set<string> }) => {
  const done  = modules.filter(m => completedIds.has(m.id)).length;
  const total = modules.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', fontWeight: 300, color: 'var(--charcoal)', margin: 0 }}>
          {section}
        </h2>
        <span style={{ fontSize: 12, color: 'var(--mid-gray)' }}>{done}/{total}</span>
      </div>
      <div style={{ height: 3, background: 'var(--sand)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--sage)', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
};

// ─── Module row ───────────────────────────────────────────────────────────────

const ModuleRow = ({ mod, done, onToggle, loadingProgress, onOpen }: {
  mod: Module; done: boolean; onToggle: () => void; loadingProgress: boolean; onOpen: () => void;
}) => {
  const itemCount = mod.items?.length ?? 0;
  const hasBody   = !!(mod.description || mod.videoUrl || itemCount > 0);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px', borderRadius: 14, background: done ? 'var(--sage-pale)' : 'var(--warm-white)', border: `1px solid ${done ? 'var(--sage-mid)' : 'var(--sand)'}`, transition: 'all 0.2s', opacity: loadingProgress ? 0.6 : 1 }}>
      <button onClick={() => !loadingProgress && onToggle()} style={{ flexShrink: 0, marginTop: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        {done ? <CheckCircle2 size={22} style={{ color: 'var(--sage)' }} /> : <Circle size={22} style={{ color: 'var(--sand-dark)' }} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: done ? 'var(--sage)' : 'var(--charcoal)', textDecoration: done ? 'line-through' : 'none', cursor: hasBody ? 'pointer' : 'default' }} onClick={hasBody ? onOpen : undefined}>
            {mod.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {itemCount > 0 && (
              <span style={{ fontSize: 11, color: 'var(--mid-gray)', background: 'var(--sand)', borderRadius: 20, padding: '2px 8px' }}>
                {itemCount} item{itemCount !== 1 ? 's' : ''}
              </span>
            )}
            {mod.videoUrl && <Play size={12} style={{ color: 'var(--terracotta)' }} fill="currentColor" />}
            {done && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'var(--sage)', color: '#fff' }}>Done</span>}
          </div>
        </div>
        {mod.description && (
          <div style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.5, marginTop: 4 }}
            dangerouslySetInnerHTML={{ __html: mod.description.replace(/<[^>]+>/g, '').slice(0, 120) + (mod.description.length > 120 ? '…' : '') }}
          />
        )}
        {hasBody && (
          <button onClick={onOpen} style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--sage-light)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
            View module <ChevronDown size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

interface ModulesPageProps {
  navigateTo: (p: string) => void;
  modules: Module[];
  completedIds: Set<string>;
  onToggle: (id: string, completed: boolean) => void;
  loadingProgress: boolean;
  postures: Posture[];
  anatomyCards: AnatomyCard[];
  philosophyCards: PhilosophyCard[];
  teamMembers: TeamMember[];
}

export const ModulesPage = ({
  navigateTo, modules, completedIds, onToggle, loadingProgress,
  postures, anatomyCards, philosophyCards, teamMembers,
}: ModulesPageProps) => {
  const [openModule, setOpenModule] = useState<Module | null>(null);
  const grouped    = groupBySection(modules);
  const totalCount = modules.length;
  const doneCount  = modules.filter(m => completedIds.has(m.id)).length;
  const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="page-enter p-6 md:p-10 max-w-4xl mx-auto">
      <BackButton onClick={() => navigateTo('home')} label="Dashboard" />

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontStyle: 'italic', fontWeight: 300, color: 'var(--charcoal)', marginBottom: 6 }}>
            Teaching Guidelines
          </h1>
          <p style={{ color: 'var(--mid-gray)', fontSize: 14 }}>{doneCount} of {totalCount} modules completed</p>
        </div>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
          <circle cx="36" cy="36" r="28" fill="none" stroke="var(--sand)" strokeWidth="6" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="var(--sage)" strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            strokeLinecap="round" transform="rotate(-90 36 36)" />
          <text x="36" y="41" textAnchor="middle" fontSize="14" fontFamily="var(--font-display)" fill="var(--charcoal)">{pct}%</text>
        </svg>
      </div>

      <div style={{ height: 4, background: 'var(--sand)', borderRadius: 2, marginBottom: 40, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--sage)', borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>

      {modules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--warm-white)', borderRadius: 16, border: '1px dashed var(--sand-dark)' }}>
          <BookOpen size={40} style={{ color: 'var(--sand-dark)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--mid-gray)', fontSize: 14 }}>No modules yet — your admin will add them soon.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {Array.from(grouped.entries()).map(([section, sectionModules]) => (
            <div key={section}>
              <SectionHeader section={section} modules={sectionModules} completedIds={completedIds} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sectionModules.map(mod => (
                  <ModuleRow
                    key={mod.id}
                    mod={mod}
                    done={completedIds.has(mod.id)}
                    onToggle={() => onToggle(mod.id, !completedIds.has(mod.id))}
                    loadingProgress={loadingProgress}
                    onOpen={() => setOpenModule(mod)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {openModule && (
        <ModuleModal
          mod={openModule}
          done={completedIds.has(openModule.id)}
          onToggle={() => onToggle(openModule.id, !completedIds.has(openModule.id))}
          onClose={() => setOpenModule(null)}
          loadingProgress={loadingProgress}
          postures={postures}
          anatomyCards={anatomyCards}
          philosophyCards={philosophyCards}
          teamMembers={teamMembers}
        />
      )}
    </div>
  );
};
