import OverviewSection from './sections/OverviewSection.astro';
import VisualDNASection from './sections/VisualDNASection.astro';
import CompatibilityPanel from './CompatibilityPanel.astro';
import PromptPanel from './PromptPanel.astro';
import TokensSection from './sections/TokensSection.astro';

export const styleSectionRegistry = {
  overview: OverviewSection,
  'visual-dna': VisualDNASection,
  compatibility: CompatibilityPanel,
  prompt: PromptPanel,
  tokens: TokensSection
};
