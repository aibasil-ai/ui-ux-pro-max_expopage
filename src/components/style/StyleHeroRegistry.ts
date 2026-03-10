import SplitHero from './hero/SplitHero.astro';
import StackedHero from './hero/StackedHero.astro';
import EditorialHero from './hero/EditorialHero.astro';
import ImmersiveHero from './hero/ImmersiveHero.astro';
import MetricsHero from './hero/MetricsHero.astro';
import GalleryHero from './hero/GalleryHero.astro';

export const styleHeroRegistry = {
  split: SplitHero,
  stacked: StackedHero,
  editorial: EditorialHero,
  immersive: ImmersiveHero,
  metrics: MetricsHero,
  gallery: GalleryHero
};
