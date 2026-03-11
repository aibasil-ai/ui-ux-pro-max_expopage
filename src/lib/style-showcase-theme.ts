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
const monoKeywords = ['terminal', 'hud', 'code', 'developer', 'cyber', 'matrix', 'pixel'];
const energeticKeywords = ['motion', 'kinetic', 'parallax', 'glitch', 'neon', 'dynamic', 'micro'];

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

export interface StyleShowcaseTheme {
  isDark: boolean;
  fontClass: 'font-sans' | 'font-serif' | 'font-mono';
  motionClass: string;
  rootStyle: string;
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
  const isDark = prefersDark || darkByColor;

  const bgFrom = isDark ? mix(primary, '#020617', 0.84) : mix(primary, '#FFFFFF', 0.88);
  const bgTo = isDark ? mix(secondary, '#0F172A', 0.82) : mix(secondary, '#FFFFFF', 0.9);
  const panel = isDark ? mix(primary, '#0F172A', 0.74) : '#FFFFFF';
  const panelSoft = isDark ? mix(primary, '#111827', 0.78) : mix(primary, '#FFFFFF', 0.94);
  const border = isDark ? mix(primary, '#CBD5E1', 0.45) : mix(primary, '#CBD5E1', 0.78);
  const text = isDark ? '#E2E8F0' : '#0F172A';
  const muted = isDark ? '#94A3B8' : '#475569';

  const fontClass = hasKeyword(keywordText, monoKeywords)
    ? 'font-mono'
    : hasKeyword(keywordText, serifKeywords)
      ? 'font-serif'
      : 'font-sans';
  const motionClass = hasKeyword(keywordText, energeticKeywords)
    ? 'transition-transform duration-300 ease-out motion-reduce:transition-none'
    : 'transition-colors duration-200 ease-out motion-reduce:transition-none';

  return {
    isDark,
    fontClass,
    motionClass,
    rootStyle: [
      `--ss-bg-from:${bgFrom}`,
      `--ss-bg-to:${bgTo}`,
      `--ss-panel:${panel}`,
      `--ss-panel-soft:${panelSoft}`,
      `--ss-border:${border}`,
      `--ss-accent:${primary}`,
      `--ss-accent-2:${secondary}`,
      `--ss-text:${text}`,
      `--ss-muted:${muted}`
    ].join(';')
  };
}
