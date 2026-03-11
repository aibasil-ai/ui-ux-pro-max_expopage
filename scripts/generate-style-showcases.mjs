import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const stylesPath = resolve(root, 'src/data/generated/styles.json');
const outputDir = resolve(root, 'src/components/style/showcases');
const registryPath = resolve(root, 'src/components/style/StyleShowcaseRegistry.ts');

const moduleTypes = ['metrics', 'features', 'timeline', 'motif', 'palette', 'typography', 'device', 'quotes'];
const ctaPositions = [0, 1, 2, 3];

const heroVariants = ['SplitHero', 'StackedHero', 'EditorialHero', 'ImmersiveHero', 'MetricsHero', 'GalleryHero'];

const heroVariantMap = {
  SplitHero: "split",
  StackedHero: "stacked",
  EditorialHero: "editorial",
  ImmersiveHero: "immersive",
  MetricsHero: "metrics",
  GalleryHero: "gallery"
};

function hashString(value) {
  return Array.from(value).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildRecipePool() {
  const triples = [];
  for (let i = 0; i < moduleTypes.length; i += 1) {
    for (let j = 0; j < moduleTypes.length; j += 1) {
      if (j === i) continue;
      for (let k = 0; k < moduleTypes.length; k += 1) {
        if (k === i || k === j) continue;
        triples.push([moduleTypes[i], moduleTypes[j], moduleTypes[k]]);
      }
    }
  }

  return triples.flatMap((triple) =>
    ctaPositions.map((position) => {
      const recipe = [...triple];
      recipe.splice(position, 0, 'cta');
      return recipe;
    })
  );
}

function buildShowcaseContent(slug, heroVariant, recipe) {
  return `---\nimport ShowcaseLayout from './ShowcaseLayout.astro';\nimport ShowcaseRenderer from './ShowcaseRenderer.astro';\nimport SplitHero from '../hero/SplitHero.astro';\nimport StackedHero from '../hero/StackedHero.astro';\nimport EditorialHero from '../hero/EditorialHero.astro';\nimport ImmersiveHero from '../hero/ImmersiveHero.astro';\nimport MetricsHero from '../hero/MetricsHero.astro';\nimport GalleryHero from '../hero/GalleryHero.astro';\n\nconst { style, manifest, relatedColor, relatedTypography, previewPrompt } = Astro.props;\nconst heroVariant = '${heroVariantMap[heroVariant]}';\nconst heroRegistry = {\n  split: SplitHero,\n  stacked: StackedHero,\n  editorial: EditorialHero,\n  immersive: ImmersiveHero,\n  metrics: MetricsHero,\n  gallery: GalleryHero\n};\nconst Hero = heroRegistry[heroVariant] ?? SplitHero;\nconst recipe = ${JSON.stringify(recipe)};\n---\n\n<ShowcaseLayout title={style.title} description={style.summary} style={style} manifest={manifest}>\n  <div data-showcase='${slug}' class='space-y-6'>\n    <Hero style={style} manifest={manifest} />\n    <ShowcaseRenderer\n      recipe={recipe.map((item) => ({ type: item }))}\n      style={style}\n      manifest={manifest}\n      relatedColor={relatedColor}\n      relatedTypography={relatedTypography}\n      previewPrompt={previewPrompt}\n    />\n  </div>\n</ShowcaseLayout>\n`;
}

function buildRegistry(entries) {
  const lines = entries
    .map(({ slug }) => `  '${slug}': '../../components/style/showcases/${slug}.astro'`)
    .join(',\n');
  return `export const styleShowcaseRegistry: Record<string, string> = {\n${lines}\n};\n`;
}

const styles = JSON.parse(await readFile(stylesPath, 'utf8'));
await mkdir(outputDir, { recursive: true });
const recipePool = buildRecipePool();

if (recipePool.length < styles.length) {
  throw new Error(`Recipe pool is too small: ${recipePool.length} < ${styles.length}`);
}

const entries = [];
const usedRecipeIndexes = new Set();

for (const style of styles) {
  const slug = style.slug;
  const seed = hashString(slug);
  const heroVariant = heroVariants[seed % heroVariants.length];
  let recipeIndex = seed % recipePool.length;

  while (usedRecipeIndexes.has(recipeIndex)) {
    recipeIndex = (recipeIndex + 1) % recipePool.length;
  }
  usedRecipeIndexes.add(recipeIndex);

  const recipe = recipePool[recipeIndex];
  const content = buildShowcaseContent(slug, heroVariant, recipe);
  await writeFile(resolve(outputDir, `${slug}.astro`), content, 'utf8');
  entries.push({ slug });
}

await writeFile(registryPath, buildRegistry(entries), 'utf8');
