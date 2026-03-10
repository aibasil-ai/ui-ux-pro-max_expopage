import type { ProductRecord } from './content/get-products';

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  highlight: string;
}

export interface ProductCategoryGroup extends ProductCategory {
  products: ProductRecord[];
}

const CATEGORY_DEFS: ProductCategory[] = [
  {
    id: 'software-saas',
    name: 'Software / SaaS',
    description: 'SaaS、工具、平台與工作流程產品。',
    highlight: '適合先探索產品體驗、資訊架構與轉換節奏。'
  },
  {
    id: 'commerce-retail',
    name: 'Commerce / Retail',
    description: '電商、零售、訂閱、餐飲與銷售導向品牌。',
    highlight: '適合先比較轉換強度、商品展示與 CTA 節奏。'
  },
  {
    id: 'finance-analytics',
    name: 'Finance / Analytics',
    description: '金融、保險、銀行與資料分析儀表板。',
    highlight: '適合先看信任感、資料密度與專業調性。'
  },
  {
    id: 'health-wellness',
    name: 'Health / Wellness',
    description: '醫療、健康、照護、美容與身心相關產品。',
    highlight: '適合先看可讀性、安心感與可及性。'
  },
  {
    id: 'education-knowledge',
    name: 'Education / Knowledge',
    description: '教育、學習、知識工具與內容型產品。',
    highlight: '適合先看資訊清晰度與學習導向排版。'
  },
  {
    id: 'media-creator',
    name: 'Media / Creator',
    description: '內容媒體、作品展示、創作者與娛樂體驗。',
    highlight: '適合先看敘事感、品牌個性與內容消費節奏。'
  },
  {
    id: 'services-local',
    name: 'Services / Local Business',
    description: '在地服務、專業服務與實體商業品牌。',
    highlight: '適合先看信任建立、預約轉換與服務說服力。'
  },
  {
    id: 'travel-hospitality',
    name: 'Travel / Hospitality',
    description: '旅行、飯店、交通、場域與活動接待。',
    highlight: '適合先看沉浸感、圖片敘事與行程轉換。'
  },
  {
    id: 'community-events',
    name: 'Community / Events',
    description: '社群、會員、活動、招募與公共參與平台。',
    highlight: '適合先看互動性、參與感與社會信任。'
  },
  {
    id: 'emerging-tech',
    name: 'Emerging Tech',
    description: '前沿科技、硬體生態、未來感產品與實驗性體驗。',
    highlight: '適合先看科技感、差異化與概念表達。'
  }
];

export const EXACT_CATEGORY_MAP: Record<string, string> = {
  'SaaS (General)': 'software-saas',
  'Micro SaaS': 'software-saas',
  'Service Landing Page': 'services-local',
  'B2B Service': 'services-local',
  'Financial Dashboard': 'finance-analytics',
  'Analytics Dashboard': 'finance-analytics',
  'Healthcare App': 'health-wellness',
  'Educational App': 'education-knowledge',
  'Creative Agency': 'media-creator',
  'Portfolio/Personal': 'media-creator',
  Gaming: 'media-creator',
  'Government/Public Service': 'community-events',
  'Fintech/Crypto': 'finance-analytics',
  'Social Media App': 'community-events',
  'Productivity Tool': 'software-saas',
  'Design System/Component Library': 'software-saas',
  'AI/Chatbot Platform': 'software-saas',
  'NFT/Web3 Platform': 'emerging-tech',
  'Creator Economy Platform': 'media-creator',
  'Sustainability/ESG Platform': 'finance-analytics',
  'Remote Work/Collaboration Tool': 'software-saas',
  'Mental Health App': 'health-wellness',
  'Pet Tech App': 'emerging-tech',
  'Smart Home/IoT Dashboard': 'emerging-tech',
  'EV/Charging Ecosystem': 'emerging-tech',
  'Subscription Box Service': 'commerce-retail',
  'Podcast Platform': 'media-creator',
  'Dating App': 'community-events',
  'Micro-Credentials/Badges Platform': 'education-knowledge',
  'Knowledge Base/Documentation': 'education-knowledge',
  'Hyperlocal Services': 'services-local',
  'Beauty/Spa/Wellness Service': 'health-wellness',
  'Luxury/Premium Brand': 'commerce-retail',
  'Restaurant/Food Service': 'commerce-retail',
  'Fitness/Gym App': 'health-wellness',
  'Real Estate/Property': 'services-local',
  'Travel/Tourism Agency': 'travel-hospitality',
  'Hotel/Hospitality': 'travel-hospitality',
  'Wedding/Event Planning': 'services-local',
  'Legal Services': 'services-local',
  'Insurance Platform': 'finance-analytics',
  'Banking/Traditional Finance': 'finance-analytics',
  'Online Course/E-learning': 'education-knowledge',
  'Non-profit/Charity': 'community-events',
  'Music Streaming': 'media-creator',
  'Video Streaming/OTT': 'media-creator',
  'Job Board/Recruitment': 'community-events',
  'Marketplace (P2P)': 'commerce-retail',
  'Logistics/Delivery': 'services-local',
  'Agriculture/Farm Tech': 'emerging-tech',
  'Construction/Architecture': 'services-local',
  'Automotive/Car Dealership': 'commerce-retail',
  'Photography Studio': 'media-creator',
  'Coworking Space': 'services-local',
  'Cleaning Service': 'services-local',
  'Home Services (Plumber/Electrician)': 'services-local',
  'Childcare/Daycare': 'services-local',
  'Senior Care/Elderly': 'health-wellness',
  'Medical Clinic': 'health-wellness',
  'Pharmacy/Drug Store': 'health-wellness',
  'Dental Practice': 'health-wellness',
  'Veterinary Clinic': 'health-wellness',
  'Florist/Plant Shop': 'commerce-retail',
  'Bakery/Cafe': 'commerce-retail',
  'Coffee Shop': 'commerce-retail',
  'Brewery/Winery': 'commerce-retail',
  Airline: 'travel-hospitality',
  'News/Media Platform': 'media-creator',
  'Magazine/Blog': 'media-creator',
  'Freelancer Platform': 'community-events',
  'Consulting Firm': 'services-local',
  'Marketing Agency': 'services-local',
  'Event Management': 'community-events',
  'Conference/Webinar Platform': 'community-events',
  'Membership/Community': 'community-events',
  'Newsletter Platform': 'media-creator',
  'Digital Products/Downloads': 'commerce-retail',
  'Church/Religious Organization': 'community-events',
  'Sports Team/Club': 'media-creator',
  'Museum/Gallery': 'media-creator',
  'Theater/Cinema': 'media-creator',
  'Language Learning App': 'education-knowledge',
  'Coding Bootcamp': 'education-knowledge',
  'Cybersecurity Platform': 'software-saas',
  'Developer Tool / IDE': 'software-saas',
  'Biotech / Life Sciences': 'health-wellness',
  'Space Tech / Aerospace': 'emerging-tech',
  'Architecture / Interior': 'services-local',
  'Quantum Computing Interface': 'emerging-tech',
  'Biohacking / Longevity App': 'health-wellness',
  'Autonomous Drone Fleet Manager': 'emerging-tech',
  'Generative Art Platform': 'media-creator',
  'Spatial Computing OS / App': 'emerging-tech',
  'Sustainable Energy / Climate Tech': 'emerging-tech',
  'E-commerce': 'commerce-retail',
  'E-commerce Luxury': 'commerce-retail'
};

export function getCategoryIdForProductTitle(title: string) {
  return EXACT_CATEGORY_MAP[title] ?? null;
}

export function buildProductTaxonomy(products: ProductRecord[]): ProductCategoryGroup[] {
  const groups = CATEGORY_DEFS.map((category) => ({ ...category, products: [] as ProductRecord[] }));
  const byId = new Map(groups.map((group) => [group.id, group]));

  for (const product of products) {
    const categoryId = EXACT_CATEGORY_MAP[product.title];
    if (!categoryId) {
      throw new Error(`尚未定義產品分類：${product.title}`);
    }

    byId.get(categoryId)?.products.push(product);
  }

  const unassigned = groups.filter((group) => group.products.length === 0);
  if (unassigned.length > 0) {
    throw new Error(`以下大類沒有產品：${unassigned.map((item) => item.id).join(', ')}`);
  }

  return groups.map((group) => ({
    ...group,
    products: group.products.sort((left, right) => left.title.localeCompare(right.title, 'en'))
  }));
}

export function findCategoryById(categoryId: string) {
  return CATEGORY_DEFS.find((category) => category.id === categoryId) ?? null;
}
