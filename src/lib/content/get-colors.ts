import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export interface ColorRecord extends GeneratedRecord {
  palette?: Record<string, string>;
}

export const getColors = () => loadGeneratedDataset<ColorRecord>('colors');
export const getColorBySlug = (slug: string) => getGeneratedBySlug<ColorRecord>('colors', slug);
