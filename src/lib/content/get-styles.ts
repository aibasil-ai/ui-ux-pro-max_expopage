import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export interface StyleRecord extends GeneratedRecord {
  prompt?: string;
}

export const getStyles = () => loadGeneratedDataset<StyleRecord>('styles');
export const getStyleBySlug = (slug: string) => getGeneratedBySlug<StyleRecord>('styles', slug);
