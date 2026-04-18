import { Home, Users, Heart, Book, Compass, Flower2 } from 'lucide-react';

export const CATEGORIES = ['All', 'Standing', 'Inversion', 'Resting', 'Seated', 'Backbend', 'Forward Fold'];

export const NAV_ITEMS = [
  { id: 'home',       label: 'Dashboard',          icon: Home },
  { id: 'team',       label: 'Our Teachers',        icon: Users },
  { id: 'anatomy',    label: 'Anatomy',             icon: Heart },
  { id: 'philosophy', label: 'Yoga Philosophy',     icon: Book },
  { id: 'teaching',   label: 'Teaching Guidelines', icon: Compass },
  { id: 'postures',   label: 'Postures',            icon: Flower2 },
];

export const FALLBACKS = {
  yoga:    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  anatomy: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  team:    'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80',
};

export const ITEMS_PER_PAGE   = 6;
export const POSTURES_PER_PAGE = 9;
