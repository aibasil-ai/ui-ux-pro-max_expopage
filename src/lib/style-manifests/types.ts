export type StyleHeroVariant = 'split' | 'stacked' | 'editorial' | 'immersive' | 'metrics' | 'gallery';
export type StylePreviewVariant = 'general' | 'landing' | 'dashboard';
export type AccentMode = 'indigo' | 'cyan' | 'emerald' | 'fuchsia' | 'amber' | 'mono' | 'crimson';
export type StyleSectionId = 'overview' | 'visual-dna' | 'compatibility' | 'prompt' | 'tokens';

export interface StyleManifest {
  slug: string;
  heroVariant: StyleHeroVariant;
  previewVariant: StylePreviewVariant;
  accentMode: AccentMode;
  sectionOrder: StyleSectionId[];
  moodLine: string;
  perspective: string;
  heroKicker: string;
}
