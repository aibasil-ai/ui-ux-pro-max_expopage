import type { StyleRecord } from '../../lib/content/get-styles';
import type { AccentMode, StyleHeroVariant, StyleManifest, StylePreviewVariant, StyleSectionId } from './types';

const heroVariants: StyleHeroVariant[] = ['split', 'stacked', 'editorial', 'immersive', 'metrics', 'gallery'];
const accentModes: AccentMode[] = ['indigo', 'cyan', 'emerald', 'fuchsia', 'amber', 'mono', 'crimson'];
const sectionOrders: StyleSectionId[][] = [
  ['overview', 'visual-dna', 'compatibility', 'prompt', 'tokens'],
  ['overview', 'prompt', 'visual-dna', 'compatibility', 'tokens'],
  ['visual-dna', 'overview', 'compatibility', 'tokens', 'prompt'],
  ['overview', 'compatibility', 'visual-dna', 'prompt', 'tokens']
];

const heroOverrides: Record<string, Partial<StyleManifest>> = {
  glassmorphism: { heroVariant: 'immersive', accentMode: 'cyan' },
  brutalism: { heroVariant: 'editorial', accentMode: 'crimson' },
  neumorphism: { heroVariant: 'stacked', accentMode: 'mono' },
  'minimalism-and-swiss-style': { heroVariant: 'split', accentMode: 'mono' },
  'executive-dashboard': { heroVariant: 'metrics', previewVariant: 'dashboard', accentMode: 'indigo' },
  'real-time-monitoring': { heroVariant: 'metrics', previewVariant: 'dashboard', accentMode: 'emerald' },
  'hero-centric-design': { heroVariant: 'split', previewVariant: 'landing', accentMode: 'amber' },
  'storytelling-driven': { heroVariant: 'gallery', previewVariant: 'landing', accentMode: 'fuchsia' }
};

function hashString(value: string) {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function resolvePreviewVariant(style: StyleRecord): StylePreviewVariant {
  if (style.category === 'Landing Page') {
    return 'landing';
  }
  if (style.category === 'BI/Analytics') {
    return 'dashboard';
  }
  return 'general';
}

function buildMoodLine(style: StyleRecord) {
  const effects = style.raw['Effects & Animation'] || style.raw['Keywords'] || style.summary || '';
  return effects.split(',').slice(0, 3).join(' · ');
}

function buildPerspective(style: StyleRecord) {
  if (style.category === 'Landing Page') {
    return '以敘事節奏、區塊轉場與 CTA 收斂視線';
  }
  if (style.category === 'BI/Analytics') {
    return '以資料密度、可讀性與決策效率建立專業感';
  }
  return '以視覺語言、層級與互動節奏塑造風格辨識';
}

function buildHeroKicker(style: StyleRecord) {
  if (style.category === 'Landing Page') {
    return 'Landing Showcase';
  }
  if (style.category === 'BI/Analytics') {
    return 'Dashboard Showcase';
  }
  return 'Style Showcase';
}

export function getStyleManifest(style: StyleRecord): StyleManifest {
  const seed = hashString(style.slug);
  const base: StyleManifest = {
    slug: style.slug,
    heroVariant: heroVariants[seed % heroVariants.length],
    previewVariant: resolvePreviewVariant(style),
    accentMode: accentModes[seed % accentModes.length],
    sectionOrder: sectionOrders[seed % sectionOrders.length],
    moodLine: buildMoodLine(style),
    perspective: buildPerspective(style),
    heroKicker: buildHeroKicker(style)
  };

  return {
    ...base,
    ...heroOverrides[style.slug]
  };
}

export function getStyleManifests(styles: StyleRecord[]) {
  return styles.map((style) => getStyleManifest(style));
}
