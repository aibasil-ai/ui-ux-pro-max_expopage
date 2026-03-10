import { getGeneratedBySlug, loadGeneratedDataset, type GeneratedRecord } from './load-generated';

export type ChartRecord = GeneratedRecord;

export const getCharts = () => loadGeneratedDataset<ChartRecord>('charts');
export const getChartBySlug = (slug: string) => getGeneratedBySlug<ChartRecord>('charts', slug);
