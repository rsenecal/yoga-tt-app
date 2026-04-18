'use client';

import React from 'react';
import Image from 'next/image';
import { Bookmark, BookmarkCheck, Search, Filter, Star } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { RichContent } from '@/components/ui/RichContent';
import { FALLBACKS } from '@/lib/constants';
import { groupAndSort } from '@/lib/groupAndSort';

const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
import type { Posture, CategoryItem } from '@/lib/types';

// ─── PostureDetail ────────────────────────────────────────────────────────────

export const PostureDetail = ({
  posture, onBack, bookmarked, toggleBookmark
}: { posture: Posture; onBack: () => void; bookmarked: boolean; toggleBookmark: (id: string) => void }) => {
  const [activeTab, setActiveTab] = React.useState<'dialogue' | 'alignment' | 'details'>('dialogue');

  return (
    <div className="page-enter max-w-4xl mx-auto">

      {/* Hero image with overlay */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', width: '60%', margin: '0 auto' }}>
        <Image
          src={posture.imageUrl || FALLBACKS.yoga}
          alt={posture.english_name}
          fill
          className="object-cover"
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,44,42,0.85) 0%, rgba(44,44,42,0.2) 60%, transparent 100%)' }} />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-5">
          <BackButton onClick={onBack} label="Postures" />
          <button
            onClick={() => toggleBookmark(posture.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', cursor: 'pointer' }}
          >
            {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{posture.category}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
            {posture.english_name}
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)' }}>
            {posture.sanskrit_name}
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--sand)', background: 'var(--warm-white)', position: 'sticky', top: 64, zIndex: 20 }}>
        {([
          { id: 'dialogue', label: 'Teaching Dialogue' },
          { id: 'alignment', label: 'Alignment' },
          { id: 'details', label: 'Benefits & Muscles' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '14px 8px', border: 'none', background: 'transparent',
              fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--terracotta)' : 'var(--mid-gray)',
              borderBottom: activeTab === tab.id ? '2px solid var(--terracotta)' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? 500 : 400,
              transition: 'all 0.15s',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 md:p-10">

        {activeTab === 'dialogue' && (
          <div className="page-enter">
            <VideoPlayer url={posture.videoUrl} />
            {posture.dialogue ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div style={{ width: 3, height: 24, background: 'var(--terracotta)', borderRadius: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mid-gray)' }}>
                    Teaching Script
                  </p>
                </div>
                <div style={{ maxWidth: 680 }}>
                  {isHtml(posture.dialogue) ? (
                    <RichContent html={posture.dialogue} className="dialogue" />
                  ) : (
                    /* Legacy plain-text rendering with drop cap */
                    <>
                      {posture.dialogue.split('\n\n').filter(Boolean).map((para, i) => (
                        <p key={i} style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 22,
                          fontWeight: 300,
                          lineHeight: 1.8,
                          color: 'var(--charcoal)',
                          marginBottom: '1.5rem',
                          fontStyle: i === 0 ? 'italic' : 'normal',
                        }}>
                          {i === 0 && <span style={{ color: 'var(--terracotta)', fontSize: 48, lineHeight: 0.5, verticalAlign: -16, marginRight: 4, fontFamily: 'Georgia, serif' }}>"</span>}
                          {para.trim()}
                        </p>
                      ))}
                    </>
                  )}
                  <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--sand)', fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic', color: 'var(--mid-gray)' }}>
                    — {posture.english_name} · {posture.sanskrit_name}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--mid-gray)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic' }}>No teaching dialogue added yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alignment' && (
          <div className="page-enter" style={{ maxWidth: 680 }}>
            <div className="flex items-center gap-2 mb-6">
              <div style={{ width: 3, height: 24, background: 'var(--sage)', borderRadius: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mid-gray)' }}>Alignment Cues</p>
            </div>
            {posture.alignment?.length > 0 ? (
              <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {posture.alignment.map((cue, i) => (
                  <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px', background: 'var(--warm-white)', border: '1px solid var(--sand)', borderRadius: 14 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--sage-mid)', lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p style={{ fontSize: 15, color: 'var(--charcoal)', lineHeight: 1.6, margin: 0 }}>{cue}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p style={{ color: 'var(--mid-gray)', fontStyle: 'italic' }}>No alignment cues added yet.</p>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="page-enter" style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {posture.benefits && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 3, height: 24, background: 'var(--terracotta)', borderRadius: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mid-gray)' }}>Benefits</p>
                </div>
                <p style={{ fontSize: 15, color: 'var(--charcoal)', lineHeight: 1.8 }}>{posture.benefits}</p>
              </div>
            )}
            {posture.key_muscles && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{ width: 3, height: 24, background: 'var(--sage)', borderRadius: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--mid-gray)' }}>Key Muscles</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {posture.key_muscles.split(',').map(m => m.trim()).filter(Boolean).map(m => (
                    <span key={m} style={{ background: 'var(--sage-pale)', color: 'var(--sage)', fontSize: 13, padding: '6px 14px', borderRadius: 20 }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// ─── PostureCard ──────────────────────────────────────────────────────────────

export const PostureCard = ({
  posture, onSelect, bookmarked, onBookmark
}: { posture: Posture; onSelect: () => void; bookmarked: boolean; onBookmark: (e: React.MouseEvent) => void }) => (
  <div
    className="card-lift rounded-2xl overflow-hidden cursor-pointer"
    style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
    onClick={onSelect}
  >
    <div className="relative" style={{ aspectRatio: '1/1', width: '75%', margin: '12px auto 0' }}>
      <Image
        src={posture.imageUrl || FALLBACKS.yoga}
        alt={posture.english_name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 33vw"
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,44,42,0.5) 0%, transparent 60%)' }} />
      <div
        className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs"
        style={{ background: 'rgba(44,44,42,0.6)', color: '#fff', backdropFilter: 'blur(4px)' }}
      >
        {posture.category}
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h3
            className="truncate"
            style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--charcoal)', marginBottom: 1 }}
          >
            {posture.english_name}
          </h3>
          <p
            className="truncate"
            style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontStyle: 'italic', color: 'var(--terracotta-light)' }}
          >
            {posture.sanskrit_name}
          </p>
        </div>
        <button
          onClick={onBookmark}
          className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
          style={{
            color: bookmarked ? 'var(--terracotta)' : 'var(--sand-dark)',
            background: bookmarked ? 'var(--terracotta-pale)' : 'transparent',
          }}
        >
          {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        </button>
      </div>
      {(() => {
        const preview = posture.shortDescription
          || (posture.dialogue ? stripHtml(posture.dialogue).slice(0, 120) : '');
        if (!preview) return null;
        const truncated = preview.length > 120 ? preview.slice(0, 120) + '…' : preview;
        return (
          <p style={{
            fontSize: 13,
            color: 'var(--mid-gray)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
            borderTop: '1px solid var(--light-gray)',
            paddingTop: 8,
            marginTop: 4,
          }}>
            {truncated}
          </p>
        );
      })()}
    </div>
  </div>
);

// ─── PosturesPage ─────────────────────────────────────────────────────────────

interface PosturesPageProps {
  postures: Posture[];
  categories: CategoryItem[];
  selected: Posture | null;
  setSelected: (p: Posture | null) => void;
  navigateTo: (p: string) => void;
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (c: string) => void;
  bookmarked: Set<string>;
  toggleBookmark: (id: string) => void;
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  paginated: Posture[];
}

export const PosturesPage = ({
  postures, categories, selected, setSelected, navigateTo,
  search, setSearch, category, setCategory,
  bookmarked, toggleBookmark,
  page, setPage, totalPages, paginated,
}: PosturesPageProps) => {
  if (selected) return (
    <PostureDetail
      posture={selected}
      onBack={() => setSelected(null)}
      bookmarked={bookmarked.has(selected.id)}
      toggleBookmark={toggleBookmark}
    />
  );

  const bookmarkedList = postures.filter(p => bookmarked.has(p.id));
  const showGrouped = category === 'All' && !search;
  const groups = showGrouped
    ? groupAndSort(postures, categories, p => p.english_name)
    : [];

  // Build dynamic chip labels: All + sorted category names
  const chipLabels = ['All', ...categories
    .slice()
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name))
    .map(c => c.name),
  ];
  // Fallback: if no categories in Firestore yet, show chips from posture data
  const allCatNames = chipLabels.length > 1
    ? chipLabels
    : ['All', ...Array.from(new Set(postures.map(p => p.category).filter(Boolean))).sort()];

  return (
    <div className="page-enter p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontStyle: 'italic', fontWeight: 300, color: 'var(--charcoal)', marginBottom: 4 }}>
            Postures
          </h1>
          <p style={{ fontSize: 13, color: 'var(--mid-gray)' }}>
            {postures.length} postures · {bookmarked.size} saved
          </p>
        </div>
        {/* Mobile search */}
        <div className="relative sm:hidden">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--sand-dark)' }} />
          <input
            type="text"
            placeholder="Search postures…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 rounded-full text-sm outline-none w-full"
            style={{ background: 'var(--cream)', border: '1px solid var(--sand)', fontFamily: 'var(--font-body)' }}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCatNames.map(cat => (
          <CategoryChip
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => { setCategory(cat); setPage(1); }}
          />
        ))}
      </div>

      {/* Bookmarked shelf — only in flat view */}
      {bookmarkedList.length > 0 && category === 'All' && !search && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star size={15} style={{ color: 'var(--terracotta)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--charcoal)', fontStyle: 'italic' }}>
              Your bookmarks
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedList.slice(0, 3).map(p => (
              <PostureCard
                key={p.id}
                posture={p}
                onSelect={() => setSelected(p)}
                bookmarked={true}
                onBookmark={e => { e.stopPropagation(); toggleBookmark(p.id); }}
              />
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--sand)', margin: '24px 0' }} />
        </div>
      )}

      {/* Grouped view — All + no search */}
      {showGrouped ? (
        groups.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--warm-white)', border: '1px dashed var(--sand-dark)' }}>
            <Filter size={40} style={{ color: 'var(--sand-dark)', margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--mid-gray)', fontSize: 15 }}>No postures added yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {groups.map(group => (
              <div key={group.category}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', fontWeight: 300, color: 'var(--charcoal)', margin: 0 }}>
                    {group.category}
                  </h2>
                  <span style={{ fontSize: 12, color: 'var(--mid-gray)', background: 'var(--sand)', borderRadius: 20, padding: '2px 10px' }}>
                    {group.items.length}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.items.map(p => (
                    <PostureCard
                      key={p.id}
                      posture={p}
                      onSelect={() => setSelected(p)}
                      bookmarked={bookmarked.has(p.id)}
                      onBookmark={e => { e.stopPropagation(); toggleBookmark(p.id); }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Flat filtered/search view with pagination */
        <>
          {paginated.length === 0 ? (
            <div className="text-center py-20 rounded-2xl" style={{ background: 'var(--warm-white)', border: '1px dashed var(--sand-dark)' }}>
              <Filter size={40} style={{ color: 'var(--sand-dark)', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--mid-gray)', fontSize: 15 }}>No postures match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map(p => (
                <PostureCard
                  key={p.id}
                  posture={p}
                  onSelect={() => setSelected(p)}
                  bookmarked={bookmarked.has(p.id)}
                  onBookmark={e => { e.stopPropagation(); toggleBookmark(p.id); }}
                />
              ))}
            </div>
          )}
          <Pagination page={page} total={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
};
