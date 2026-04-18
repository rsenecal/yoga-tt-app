export interface CategoryItem {
  id: string;
  name: string;
  order?: number;
}

export interface SubCard {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface AnatomyCard {
  id: string;
  title: string;
  description: string;
  category?: string;
  order?: number;
  imageUrl: string;
  detailedContent: string;
  videoUrl?: string;
  subCards?: SubCard[];
}

export interface PhilosophyCard {
  id: string;
  title: string;
  description: string;
  category?: string;
  order?: number;
  imageUrl: string;
  detailedContent: string;
  videoUrl?: string;
  subCards?: SubCard[];
}

export interface Posture {
  id: string;
  english_name: string;
  sanskrit_name: string;
  category: string;
  description: string;
  shortDescription?: string;
  order?: number;
  imageUrl: string;
  alignment: string[];
  dialogue: string;
  benefits: string;
  key_muscles: string;
  videoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  section: string;
  order: number;
}

export interface TrainingInfo {
  id?: string;
  name: string;
  studioName?: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
}
