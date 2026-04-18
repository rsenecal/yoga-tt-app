import type { CategoryItem } from './types';

export interface Group<T> {
  category: string;
  items: T[];
}

/**
 * Groups an array of items by their `category` field, sorts the groups by the
 * matching CategoryItem's `order` (then alphabetically), and sorts items within
 * each group by their own `order` (then alphabetically via `getLabel`).
 *
 * Items with no category are collected into a trailing "Uncategorized" group.
 */
export function groupAndSort<T extends { category?: string; order?: number }>(
  items: T[],
  categories: CategoryItem[],
  getLabel: (item: T) => string,
): Group<T>[] {
  // ── bucket items by category name ──────────────────────────────────────────
  const map = new Map<string, T[]>();
  const uncategorized: T[] = [];

  for (const item of items) {
    const cat = item.category?.trim() ?? '';
    if (!cat) { uncategorized.push(item); continue; }
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(item);
  }

  // ── sort items within a group ───────────────────────────────────────────────
  const toNum = (v: unknown): number => (v != null && v !== '' ? Number(v) : Infinity);

  const sortItems = (arr: T[]): T[] =>
    [...arr].sort((a, b) => {
      const ao = toNum(a.order);
      const bo = toNum(b.order);
      if (ao !== bo) return ao - bo;
      return getLabel(a).localeCompare(getLabel(b));
    });

  // ── sort group keys by category order, then alpha ──────────────────────────
  const catOrder = new Map(categories.map(c => [c.name, toNum(c.order)]));
  const sortedKeys = [...map.keys()].sort((a, b) => {
    const oa = catOrder.get(a) ?? Infinity;
    const ob = catOrder.get(b) ?? Infinity;
    if (oa !== ob) return oa - ob;
    return a.localeCompare(b);
  });

  const groups: Group<T>[] = sortedKeys.map(cat => ({
    category: cat,
    items: sortItems(map.get(cat)!),
  }));

  if (uncategorized.length > 0) {
    groups.push({ category: 'Uncategorized', items: sortItems(uncategorized) });
  }

  return groups;
}
