'use client';

export const CategoryChip = ({
  label, active, onClick
}: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-1.5 rounded-full text-sm transition-all"
    style={{
      background:   active ? 'var(--sage)' : 'transparent',
      color:        active ? '#fff' : 'var(--mid-gray)',
      border:       `1px solid ${active ? 'var(--sage)' : 'var(--sand)'}`,
      fontFamily:   'var(--font-body)',
    }}
  >
    {label}
  </button>
);
