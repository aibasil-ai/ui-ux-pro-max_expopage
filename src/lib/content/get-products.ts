import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export interface ProductRecord extends GeneratedRecord {
  primaryStyle?: string;
  landingPattern?: string;
  dashboardStyle?: string;
}

export const getProducts = () => loadGeneratedDataset<ProductRecord>('products');
export const getProductBySlug = (slug: string) => getGeneratedBySlug<ProductRecord>('products', slug);
