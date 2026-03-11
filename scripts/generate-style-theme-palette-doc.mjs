import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { getStyleTraditionalChineseName } from '../src/lib/style-localization.ts';
import { buildStyleShowcaseTheme } from '../src/lib/style-showcase-theme.ts';

const outputPath = resolve(process.cwd(), 'docs/style-showcase-theme-palette.md');
const stylesPath = resolve(process.cwd(), 'src/data/generated/styles.json');
const accentModes = ['indigo', 'cyan', 'emerald', 'fuchsia', 'amber', 'mono', 'crimson'];
const accentOverrides = {
  glassmorphism: 'cyan',
  brutalism: 'crimson',
  neumorphism: 'mono',
  'minimalism-and-swiss-style': 'mono',
  'executive-dashboard': 'indigo',
  'real-time-monitoring': 'emerald',
  'hero-centric-design': 'amber',
  'storytelling-driven': 'fuchsia'
};

function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderTableRow(columns) {
  return `| ${columns.map((value) => escapeCell(value)).join(' | ')} |`;
}

function hashString(value) {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function resolveAccentMode(style) {
  if (accentOverrides[style.slug]) return accentOverrides[style.slug];
  const seed = hashString(style.slug);
  return accentModes[seed % accentModes.length];
}

const styles = JSON.parse(await readFile(stylesPath, 'utf8'));

const rows = styles.map((style) => {
  const theme = buildStyleShowcaseTheme(style, { accentMode: resolveAccentMode(style) });
  const zhName = getStyleTraditionalChineseName(style.slug) ?? '未定義';

  return {
    slug: style.slug,
    english: style.title,
    chinese: zhName,
    group: theme.group,
    isDark: theme.isDark ? 'Yes' : 'No',
    accent: theme.palette.accent,
    accent2: theme.palette.accent2,
    bgFrom: theme.palette.bgFrom,
    bgTo: theme.palette.bgTo,
    text: theme.palette.text
  };
});

const groupCount = rows.reduce((acc, row) => {
  acc[row.group] = (acc[row.group] ?? 0) + 1;
  return acc;
}, {});

const sortedGroups = Object.entries(groupCount).sort((a, b) => a[0].localeCompare(b[0]));

const content = [
  '# 風格主題調色盤文件',
  '',
  `- 生成時間：${new Date().toISOString()}`,
  `- 風格總數：${rows.length}`,
  '',
  '## 分群數量',
  ''
];

for (const [group, count] of sortedGroups) {
  content.push(`- \`${group}\`：${count}`);
}

content.push('', '## 調色盤總覽', '');
content.push(
  renderTableRow([
    'Slug',
    'English Name',
    '繁中名稱',
    'Group',
    'isDark',
    'Accent',
    'Accent-2',
    'BG From',
    'BG To',
    'Text'
  ])
);
content.push(renderTableRow(['---', '---', '---', '---', '---', '---', '---', '---', '---', '---']));

for (const row of rows) {
  content.push(
    renderTableRow([
      `\`${row.slug}\``,
      row.english,
      row.chinese,
      `\`${row.group}\``,
      row.isDark,
      `\`${row.accent}\``,
      `\`${row.accent2}\``,
      `\`${row.bgFrom}\``,
      `\`${row.bgTo}\``,
      `\`${row.text}\``
    ])
  );
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${content.join('\n')}\n`, 'utf8');

console.log(`Generated: ${outputPath}`);
