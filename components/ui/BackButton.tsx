'use client';

import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 mb-8 transition-colors"
    style={{ color: 'var(--sage-light)', fontSize: 14, fontWeight: 400 }}
    onMouseOver={e => (e.currentTarget.style.color = 'var(--sage)')}
    onMouseOut={e  => (e.currentTarget.style.color = 'var(--sage-light)')}
  >
    <ArrowLeft size={16} />
    {label}
  </button>
);
