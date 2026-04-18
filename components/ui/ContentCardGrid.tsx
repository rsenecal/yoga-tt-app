'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export const ContentCardGrid = ({
  items, onSelect, fallback
}: { items: any[]; onSelect: (item: any) => void; fallback: string }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {items.map(card => (
      <div
        key={card.id}
        className="card-lift rounded-2xl overflow-hidden cursor-pointer"
        style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
        onClick={() => onSelect(card)}
      >
        <div className="relative" style={{ aspectRatio: '1/1', width: '75%', margin: '12px auto 0' }}>
          <Image
            src={card.imageUrl || fallback}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--charcoal)', marginBottom: 6 }}>
            {card.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--mid-gray)', lineHeight: 1.6 }}>
            {card.description}
          </p>
          <div className="flex items-center gap-1 mt-4" style={{ fontSize: 12, color: 'var(--sage-light)' }}>
            Read more <ChevronRight size={12} />
          </div>
        </div>
      </div>
    ))}
  </div>
);
