'use client';

import { Search, Menu, X } from 'lucide-react';

export const TopBar = ({
  title, search, setSearch, showSearch = false,
  mobileOpen, setMobileOpen, rightSlot
}: {
  title: string;
  search?: string;
  setSearch?: (v: string) => void;
  showSearch?: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  rightSlot?: React.ReactNode;
}) => (
  <header
    className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
    style={{
      background: 'var(--warm-white)',
      borderBottom: '1px solid var(--light-gray)',
    }}
  >
    <div className="flex items-center gap-4">
      <button
        className="md:hidden p-2 rounded-lg"
        style={{ color: 'var(--mid-gray)' }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--charcoal)' }}>
        {title}
      </h1>
    </div>
    <div className="flex items-center gap-3">
      {showSearch && setSearch !== undefined && (
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--sand-dark)' }}
          />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 rounded-full text-sm outline-none"
            style={{
              background: 'var(--cream)',
              border: '1px solid var(--sand)',
              color: 'var(--charcoal)',
              width: 200,
              fontFamily: 'var(--font-body)',
            }}
          />
        </div>
      )}
      {rightSlot}
    </div>
  </header>
);
