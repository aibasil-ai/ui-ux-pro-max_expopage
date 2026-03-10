import type { ColorRecord } from './content/get-colors';
import type { ProductRecord } from './content/get-products';
import type { StyleRecord } from './content/get-styles';
import type { TypographyRecord } from './content/get-typography';
import type { GeneratedRecord } from './content/load-generated';
import type { LandingRecord } from './content/get-landing';

export interface PromptBundleInput {
  product: ProductRecord;
  style: StyleRecord;
  color: ColorRecord;
  typography: TypographyRecord;
  landing: LandingRecord | null;
  dashboardLabel: string | null;
  reasoning: GeneratedRecord | null;
}

export function buildPrompt(input: PromptBundleInput) {
  const { product, style, color, typography, landing, dashboardLabel, reasoning } = input;
  const styleKeywords = style.raw['Keywords'] || style.raw['AI Prompt Keywords'] || style.summary || '';
  const keyEffects = reasoning?.raw?.['Key_Effects'] || style.raw['Effects & Animation'] || 'Subtle hover and smooth transitions';
  const avoid = reasoning?.raw?.['Anti_Patterns'] || style.raw['Do Not Use For'] || 'Avoid clutter and weak hierarchy';
  const headingFont = typography.raw['Heading Font'] || typography.title;
  const bodyFont = typography.raw['Body Font'] || typography.title;
  const palette = color.palette || {
    primary: color.raw['Primary (Hex)'],
    secondary: color.raw['Secondary (Hex)'],
    cta: color.raw['CTA (Hex)'],
    background: color.raw['Background (Hex)'],
    text: color.raw['Text (Hex)']
  };

  return [
    `請為「${product.title}」設計一個高完成度的產品展示頁或產品介面。`,
    `整體視覺風格以 ${style.title} 為主，關鍵特徵包含：${styleKeywords}。`,
    `配色請參考 ${color.title} 調性，主色 ${palette.primary}、次色 ${palette.secondary}、CTA ${palette.cta}、背景 ${palette.background}、文字 ${palette.text}。`,
    `字體搭配採用 ${typography.title}，標題字體 ${headingFont}，內文字體 ${bodyFont}。`,
    landing ? `頁面結構可參考 ${landing.title}，並依照該結構安排資訊層次與 CTA。` : '請以清楚的內容分段與明確 CTA 建立頁面節奏。',
    dashboardLabel && !/^N\/A/i.test(dashboardLabel) ? `若有儀表板或後台區塊，可融入 ${dashboardLabel} 的資訊密度與模組安排。` : '若內容偏產品導向，請優先強調價值主張、功能展示與信任訊號。',
    `互動效果可包含：${keyEffects}。`,
    `請避免：${avoid}。`
  ].join('\n');
}
