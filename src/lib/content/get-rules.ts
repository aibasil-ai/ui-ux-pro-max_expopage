import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export const getUxGuidelines = () => loadGeneratedDataset<GeneratedRecord>('uxGuidelines');
export const getUiReasoning = () => loadGeneratedDataset<GeneratedRecord>('uiReasoning');
export const getWebInterfaceRules = () => loadGeneratedDataset<GeneratedRecord>('webInterface');

export const getUxGuidelineBySlug = (slug: string) => getGeneratedBySlug<GeneratedRecord>('uxGuidelines', slug);
export const getUiReasoningBySlug = (slug: string) => getGeneratedBySlug<GeneratedRecord>('uiReasoning', slug);
export const getWebInterfaceRuleBySlug = (slug: string) => getGeneratedBySlug<GeneratedRecord>('webInterface', slug);
