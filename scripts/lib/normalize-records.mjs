import { slugify } from './slugify.mjs';

function splitTags(...values) {
  return values
    .flatMap((value) => String(value || '').split(/[,/]|\+|\|/g))
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeBase(record, dataset, titleField, categoryField, extra = {}) {
  const title = record[titleField];
  const category = categoryField ? record[categoryField] : dataset;
  const tags = splitTags(record.Keywords, record['Mood/Style Keywords'], title, category);

  return {
    id: `${dataset}-${record.No}`,
    slug: slugify(title || `${dataset}-${record.No}`),
    dataset,
    title,
    category,
    tags,
    sourceFile: `${dataset}.csv`,
    sourceRow: record.__row,
    raw: record,
    ...extra
  };
}

export function normalizeStyles(records) {
  return records.map((record) =>
    normalizeBase(record, 'styles', 'Style Category', 'Type', {
      summary: record['Best For'],
      prompt: record['AI Prompt Keywords']
    })
  );
}

export function normalizeColors(records) {
  return records.map((record) =>
    normalizeBase(record, 'colors', 'Product Type', 'Product Type', {
      summary: record.Notes,
      palette: {
        primary: record['Primary (Hex)'],
        secondary: record['Secondary (Hex)'],
        cta: record['CTA (Hex)'],
        background: record['Background (Hex)'],
        text: record['Text (Hex)'],
        border: record['Border (Hex)']
      }
    })
  );
}

export function normalizeTypography(records) {
  return records.map((record) =>
    normalizeBase(record, 'typography', 'Font Pairing Name', 'Category', {
      summary: record['Best For'],
      headingFont: record['Heading Font'],
      bodyFont: record['Body Font']
    })
  );
}

export function normalizeCharts(records) {
  return records.map((record) =>
    normalizeBase(record, 'charts', 'Best Chart Type', 'Data Type', {
      summary: record['Accessibility Notes'],
      interactiveLevel: record['Interactive Level']
    })
  );
}

export function normalizeProducts(records) {
  return records.map((record) =>
    normalizeBase(record, 'products', 'Product Type', 'Product Type', {
      summary: record['Key Considerations'],
      primaryStyle: record['Primary Style Recommendation'],
      landingPattern: record['Landing Page Pattern'],
      dashboardStyle: record['Dashboard Style (if applicable)']
    })
  );
}

export function normalizeLanding(records) {
  return records.map((record) =>
    normalizeBase(record, 'landing', 'Pattern Name', 'Pattern Name', {
      summary: record['Conversion Optimization']
    })
  );
}

export function normalizeUx(records) {
  return records.map((record) =>
    normalizeBase(record, 'ux-guidelines', 'Issue', 'Category', {
      summary: record.Description,
      severity: record.Severity,
      platform: record.Platform
    })
  );
}

export function normalizeReasoning(records) {
  return records.map((record) =>
    normalizeBase(record, 'ui-reasoning', 'UI_Category', 'UI_Category', {
      summary: record['Recommended_Pattern'],
      severity: record.Severity,
      stylePriority: record['Style_Priority']
    })
  );
}

export function normalizeWebRules(records) {
  return records.map((record) =>
    normalizeBase(record, 'web-interface', 'Issue', 'Category', {
      summary: record.Description,
      severity: record.Severity,
      platform: record.Platform
    })
  );
}
