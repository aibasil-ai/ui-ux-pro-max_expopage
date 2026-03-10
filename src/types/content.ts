export interface BaseGeneratedRecord<TRecord = Record<string, string>> {
  id: string;
  slug: string;
  dataset: string;
  title: string;
  category: string;
  tags: string[];
  sourceFile: string;
  sourceRow: number;
  raw: TRecord;
  summary?: string;
}

export interface GeneratedPaletteRecord extends BaseGeneratedRecord {
  palette: {
    primary: string;
    secondary: string;
    cta: string;
    background: string;
    text: string;
    border: string;
  };
}
