'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  page, total, setPage
}: { page: number; total: number; setPage: (p: number) => void }) => {
  if (total <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
        style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => setPage(n)}
          className="w-9 h-9 rounded-lg text-sm transition-all"
          style={{
            background: page === n ? 'var(--sage)' : 'var(--warm-white)',
            color:      page === n ? '#fff' : 'var(--charcoal)',
            border:     page === n ? 'none' : '1px solid var(--sand)',
            fontWeight: page === n ? 500 : 400,
          }}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setPage(Math.min(total, page + 1))}
        disabled={page === total}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
        style={{ background: 'var(--warm-white)', border: '1px solid var(--sand)' }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
