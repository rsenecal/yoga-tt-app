'use client';

import { Flower2 } from 'lucide-react';

export const LoadingSplash = () => (
  <div
    className="fixed inset-0 flex flex-col items-center justify-center"
    style={{ background: 'var(--cream)' }}
  >
    <Flower2 size={48} style={{ color: 'var(--terracotta)', marginBottom: 16, animation: 'spin 2s linear infinite' }} />
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--charcoal)', fontStyle: 'italic' }}>
      Loading your practice…
    </p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
