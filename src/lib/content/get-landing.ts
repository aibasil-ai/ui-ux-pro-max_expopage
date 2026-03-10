import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export type LandingRecord = GeneratedRecord;

export const getLandingPatterns = () => loadGeneratedDataset<LandingRecord>('landing');
export const getLandingPatternBySlug = (slug: string) => getGeneratedBySlug<LandingRecord>('landing', slug);
