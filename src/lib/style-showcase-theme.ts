import type { AccentMode } from './style-manifests/types';

type StyleLike = {
  slug: string;
  title?: string;
  raw?: Record<string, string | undefined>;
};

type ManifestLike = {
  accentMode?: AccentMode;
};

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const accentFallbackMap: Record<AccentMode, string> = {
  indigo: '#4F46E5',
  cyan: '#0891B2',
  emerald: '#059669',
  fuchsia: '#C026D3',
  amber: '#D97706',
  mono: '#475569',
  crimson: '#BE123C'
};

const darkKeywords = ['dark', 'oled', 'cyber', 'noir', 'midnight', 'neon', 'futur'];
const serifKeywords = ['editorial', 'vintage', 'classic', 'luxury', 'retro', 'magazine'];
const monoKeywords = ['terminal', 'hud', 'code', 'developer', 'cyber', 'matrix', 'pixel', 'dashboard'];
const energeticKeywords = ['motion', 'kinetic', 'parallax', 'glitch', 'neon', 'dynamic', 'micro'];

const brutalKeywords = ['brutal', 'neubrutal', 'raw', 'anti-polish'];
const glassKeywords = ['glass', 'liquid', 'neumorphism', 'clay', 'frost', 'blur'];
const neonDarkKeywords = ['cyber', 'neon', 'vapor', 'y2k', 'hud', 'fui', 'rgb', 'chromatic', 'oled'];
const organicKeywords = ['organic', 'biophilic', 'biomimetic', 'nature', 'tactile', 'paper', 'e-ink'];
const editorialKeywords = ['editorial', 'swiss', 'magazine', 'storytelling', 'vintage', 'retro', 'typography'];
const dataKeywords = [
  'dashboard',
  'analytics',
  'analysis',
  'monitoring',
  'monitor',
  'heat-map',
  'heat map',
  'financial',
  'sales',
  'executive',
  'predictive',
  'drill-down',
  'real-time',
  'real time'
];
const playfulKeywords = ['memphis', 'chaos', 'vibrant', 'pixel', '3d', 'hyperreal', 'cursor', 'bento', 'aurora'];

interface GroupTokens {
  panelRadius: string;
  cardRadius: string;
  pillRadius: string;
  borderWidth: string;
  shadowSoft: string;
  shadowStrong: string;
  surfaceBlend: string;
}

export type StyleThemeGroup = 'glass' | 'brutal' | 'neon-dark' | 'organic' | 'editorial' | 'data' | 'playful' | 'default';

const groupTokenMap: Record<StyleThemeGroup, GroupTokens> = {
  glass: {
    panelRadius: '2.75rem',
    cardRadius: '1.8rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 20px 42px -30px var(--ss-accent)',
    shadowStrong: '0 28px 58px -34px var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(150deg,var(--ss-bg-from),var(--ss-panel-soft))'
  },
  brutal: {
    panelRadius: '0.65rem',
    cardRadius: '0.45rem',
    pillRadius: '0.55rem',
    borderWidth: '2px',
    shadowSoft: '8px 8px 0 0 var(--ss-accent)',
    shadowStrong: '12px 12px 0 0 var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(135deg,var(--ss-panel),var(--ss-bg-to))'
  },
  'neon-dark': {
    panelRadius: '1.4rem',
    cardRadius: '1rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 0 0.8rem -0.2rem var(--ss-accent)',
    shadowStrong: '0 0 1.4rem -0.3rem var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(145deg,var(--ss-bg-from),var(--ss-panel))'
  },
  organic: {
    panelRadius: '2.4rem',
    cardRadius: '1.35rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 18px 34px -28px var(--ss-accent)',
    shadowStrong: '0 24px 48px -30px var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(145deg,var(--ss-panel-soft),var(--ss-bg-to))'
  },
  editorial: {
    panelRadius: '1rem',
    cardRadius: '0.8rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 14px 30px -26px rgba(15,23,42,0.45)',
    shadowStrong: '0 22px 42px -28px rgba(15,23,42,0.5)',
    surfaceBlend: 'linear-gradient(140deg,var(--ss-panel),var(--ss-bg-from))'
  },
  data: {
    panelRadius: '1.1rem',
    cardRadius: '0.9rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 16px 28px -24px rgba(15,23,42,0.36)',
    shadowStrong: '0 22px 34px -24px rgba(15,23,42,0.42)',
    surfaceBlend: 'linear-gradient(140deg,var(--ss-panel),var(--ss-panel-soft))'
  },
  playful: {
    panelRadius: '2.2rem',
    cardRadius: '1.2rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 16px 34px -28px var(--ss-accent)',
    shadowStrong: '0 24px 44px -30px var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(150deg,var(--ss-bg-from),var(--ss-bg-to))'
  },
  default: {
    panelRadius: '2rem',
    cardRadius: '1.25rem',
    pillRadius: '9999px',
    borderWidth: '1px',
    shadowSoft: '0 14px 30px -24px var(--ss-accent)',
    shadowStrong: '0 20px 42px -26px var(--ss-accent-2)',
    surfaceBlend: 'linear-gradient(145deg,var(--ss-bg-from),var(--ss-bg-to))'
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(value: string) {
  const cleaned = value.trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(cleaned)) return null;
  if (cleaned.length === 4) {
    const [r, g, b] = cleaned.slice(1).split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return cleaned.toUpperCase();
}

function hexToRgb(value: string): Rgb | null {
  const hex = normalizeHex(value);
  if (!hex) return null;
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16)
  };
}

function rgbToHex(rgb: Rgb) {
  const toHex = (input: number) => clamp(Math.round(input), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

function mix(base: string, target: string, weight: number) {
  const fromRgb = hexToRgb(base);
  const toRgb = hexToRgb(target);
  if (!fromRgb || !toRgb) return base;
  const t = clamp(weight, 0, 1);
  return rgbToHex({
    r: fromRgb.r + (toRgb.r - fromRgb.r) * t,
    g: fromRgb.g + (toRgb.g - fromRgb.g) * t,
    b: fromRgb.b + (toRgb.b - fromRgb.b) * t
  });
}

function relativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  const srgb = [rgb.r, rgb.g, rgb.b].map((value) => value / 255).map((channel) => {
    if (channel <= 0.03928) return channel / 12.92;
    return ((channel + 0.055) / 1.055) ** 2.4;
  });
  return srgb[0] * 0.2126 + srgb[1] * 0.7152 + srgb[2] * 0.0722;
}

function firstHex(input: string | undefined) {
  if (!input) return null;
  const match = input.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  return match ? normalizeHex(match[0]) : null;
}

function hasKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function classifyThemeGroup(keywordText: string): StyleThemeGroup {
  if (hasKeyword(keywordText, brutalKeywords)) return 'brutal';
  if (hasKeyword(keywordText, glassKeywords)) return 'glass';
  if (hasKeyword(keywordText, neonDarkKeywords)) return 'neon-dark';
  if (hasKeyword(keywordText, organicKeywords)) return 'organic';
  if (hasKeyword(keywordText, dataKeywords)) return 'data';
  if (hasKeyword(keywordText, editorialKeywords)) return 'editorial';
  if (hasKeyword(keywordText, playfulKeywords)) return 'playful';
  return 'default';
}

function resolveFontClass(keywordText: string, group: StyleThemeGroup) {
  if (group === 'data' || group === 'neon-dark' || hasKeyword(keywordText, monoKeywords)) return 'font-mono';
  if (group === 'editorial' || hasKeyword(keywordText, serifKeywords)) return 'font-serif';
  return 'font-sans';
}

function resolveMotionClass(keywordText: string, group: StyleThemeGroup) {
  if (group === 'brutal') {
    return 'transition-none motion-reduce:transition-none';
  }

  if (group === 'neon-dark') {
    return 'transition-all duration-500 ease-out motion-reduce:transition-none';
  }

  if (group === 'playful' || hasKeyword(keywordText, energeticKeywords)) {
    return 'transition-transform duration-300 ease-out motion-reduce:transition-none';
  }

  if (group === 'data') {
    return 'transition-colors duration-150 ease-linear motion-reduce:transition-none';
  }

  return 'transition-colors duration-250 ease-out motion-reduce:transition-none';
}

export interface StyleShowcasePalette {
  bgFrom: string;
  bgTo: string;
  panel: string;
  panelSoft: string;
  border: string;
  accent: string;
  accent2: string;
  text: string;
  muted: string;
}

export interface StyleShowcaseTheme {
  group: StyleThemeGroup;
  isDark: boolean;
  fontClass: 'font-sans' | 'font-serif' | 'font-mono';
  motionClass: string;
  rootStyle: string;
  palette: StyleShowcasePalette;
}

export function buildStyleShowcaseTheme(style: StyleLike, manifest: ManifestLike = {}): StyleShowcaseTheme {
  const raw = style.raw ?? {};
  const keywordText = [
    style.slug,
    style.title ?? '',
    raw['Keywords'] ?? '',
    raw['Effects & Animation'] ?? '',
    raw['Best For'] ?? ''
  ]
    .join(' ')
    .toLowerCase();

  const accentMode = manifest.accentMode ?? 'indigo';
  const accentFallback = accentFallbackMap[accentMode];
  const primary = firstHex(raw['Primary Colors']) ?? accentFallback;
  const secondary = firstHex(raw['Secondary Colors']) ?? mix(primary, '#FFFFFF', 0.55);
  const prefersDark = hasKeyword(keywordText, darkKeywords);
  const darkByColor = relativeLuminance(primary) < 0.2;
  const group = classifyThemeGroup(keywordText);
  const isDark = prefersDark || darkByColor || group === 'neon-dark';

  const bgFrom = isDark ? mix(primary, '#020617', 0.84) : mix(primary, '#FFFFFF', 0.88);
  const bgTo = isDark ? mix(secondary, '#0F172A', 0.82) : mix(secondary, '#FFFFFF', 0.9);
  const panel = isDark ? mix(primary, '#0F172A', 0.74) : '#FFFFFF';
  const panelSoft = isDark ? mix(primary, '#111827', 0.78) : mix(primary, '#FFFFFF', 0.94);
  const border = isDark ? mix(primary, '#CBD5E1', 0.45) : mix(primary, '#CBD5E1', 0.78);
  const text = isDark ? '#E2E8F0' : '#0F172A';
  const muted = isDark ? '#94A3B8' : '#475569';

  const fontClass = resolveFontClass(keywordText, group);
  const motionClass = resolveMotionClass(keywordText, group);
  const groupTokens = groupTokenMap[group];

  const palette: StyleShowcasePalette = {
    bgFrom,
    bgTo,
    panel,
    panelSoft,
    border,
    accent: primary,
    accent2: secondary,
    text,
    muted
  };

  return {
    group,
    isDark,
    fontClass,
    motionClass,
    palette,
    rootStyle: [
      `--ss-bg-from:${palette.bgFrom}`,
      `--ss-bg-to:${palette.bgTo}`,
      `--ss-panel:${palette.panel}`,
      `--ss-panel-soft:${palette.panelSoft}`,
      `--ss-border:${palette.border}`,
      `--ss-accent:${palette.accent}`,
      `--ss-accent-2:${palette.accent2}`,
      `--ss-text:${palette.text}`,
      `--ss-muted:${palette.muted}`,
      `--ss-radius-panel:${groupTokens.panelRadius}`,
      `--ss-radius-card:${groupTokens.cardRadius}`,
      `--ss-radius-pill:${groupTokens.pillRadius}`,
      `--ss-border-width:${groupTokens.borderWidth}`,
      `--ss-shadow-soft:${groupTokens.shadowSoft}`,
      `--ss-shadow-strong:${groupTokens.shadowStrong}`,
      `--ss-surface:${groupTokens.surfaceBlend}`
    ].join(';')
  };
}
