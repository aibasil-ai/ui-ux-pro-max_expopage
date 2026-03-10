import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export type TypographyRecord = GeneratedRecord;

export const getTypography = () => loadGeneratedDataset<TypographyRecord>('typography');
export const getTypographyBySlug = (slug: string) => getGeneratedBySlug<TypographyRecord>('typography', slug);
