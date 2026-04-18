'use client';

import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';
import { ContentCardGrid } from '@/components/ui/ContentCardGrid';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { RichContent } from '@/components/ui/RichContent';
import { FALLBACKS } from '@/lib/constants';
import { groupAndSort } from '@/lib/groupAndSort';
import type { AnatomyCard, CategoryItem, SubCard } from '@/lib/types';

interface AnatomyPageProps {
  cards: AnatomyCard[];
  categories: CategoryItem[];
  selected: AnatomyCard | null;
  setSelected: (card: AnatomyCard | null) => void;
  navigateTo: (p: string) => void;
  searchTerm?: string;
}

export const AnatomyPage = ({
  cards, categories, selected, setSelected, navigateTo, searchTerm = '',
}: AnatomyPageProps) => {
  if (selected) return (
    <div className="page-enter p-6 md:p-10 max-w-4xl mx-auto">
      <BackButton onClick={() => setSelected(null)} label="Anatomy" />
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '1/1', width: '60%', margin: '0 auto 2rem' }}>
        <Image src={selected.imageUrl || FALLBACKS.anatomy} alt={selected.title} fill className="object-cover" priority />
      </div>
      {selected.category && (
        <span style={{ display: 'inline-block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)', background: 'var(--sage-pale)', padding: '4px 12px', borderRadius: 20, marginBottom: 12 }}>
          {selected.category}
        </span>
      )}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'var(--charcoal)', marginBottom: 16 }}>
        {selected.title}
      </h1>
      <VideoPlayer url={selected.videoUrl} />
      <RichContent
        html={selected.detailedContent}
        className="prose-yoga"
        style={{ color: 'var(--mid-gray)', fontSize: 15, lineHeight: 1.8 }}
      />

      {selected.subCards && selected.subCards.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 3, height: 24, background: 'var(--sage)', borderRadius: 2, flexShrink: 0 }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 300, fontStyle: 'italic', color: 'var(--charcoal)', margin: 0 }}>
              {selected.title} — Overview
            </h2>
            <span style={{ fontSize: 12, color: 'var(--mid-gray)', background: 'var(--sand)', borderRadius: 20, padding: '2px 10px' }}>
              {selected.subCards.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {selected.subCards.map((sub: SubCard, i: number) => (
              <div key={i} style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)', borderRadius: 16, overflow: 'hidden' }}>
                {sub.imageUrl && (
                  <div style={{ position: 'relative', width: '100%', height: 180 }}>
                    <img
                      src={sub.imageUrl}
                      alt={sub.title}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--charcoal)', marginBottom: 6 }}>
                    {sub.title}
                  </h3>
                  {sub.description && (
                    <p style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.6, margin: 0 }}>
                      {sub.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const groups = groupAndSort(cards, categories, c => c.title);

  return (
    <div className="page-enter p-6 md:p-10 max-w-6xl mx-auto">
      <BackButton onClick={() => navigateTo('home')} label="Dashboard" />
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontStyle: 'italic', fontWeight: 300, color: 'var(--charcoal)', marginBottom: 6 }}>
          Anatomy
        </h1>
        <p style={{ color: 'var(--mid-gray)', fontSize: 14 }}>
          {searchTerm ? `${cards.length} result${cards.length !== 1 ? 's' : ''} for "${searchTerm}"` : `${cards.length} topics`}
        </p>
      </div>

      {cards.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: 'var(--warm-white)', borderRadius: 16, border: '1px dashed var(--sand-dark)' }}>
          <p style={{ color: 'var(--mid-gray)', fontSize: 15 }}>No topics match "{searchTerm}"</p>
        </div>
      ) : groups.length === 0 ? (
        <ContentCardGrid items={cards} onSelect={setSelected} fallback={FALLBACKS.anatomy} />
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
              <ContentCardGrid items={group.items} onSelect={setSelected} fallback={FALLBACKS.anatomy} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
