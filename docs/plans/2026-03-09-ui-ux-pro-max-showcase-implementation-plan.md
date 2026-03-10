# UI UX Pro Max 展示系統 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立一個以 Prompt 使用者為核心、可從產品類型出發探索 UI 風格與複製 Prompt 的 Astro + Tailwind 展示系統。

**Architecture:** 以 Astro 靜態路由作為內容骨架，使用 Tailwind 建立共享設計 primitive，再透過 islands 實作結果頁互動、篩選、收藏與比較。資料來源來自 `ui-ux-pro-max` skill 的 CSV，先轉換成標準化 JSON，再由推薦引擎、內容清單頁與 detail page 共用。

**Tech Stack:** Astro、Tailwind CSS、TypeScript、Vitest、Playwright、Node.js Scripts、Git

---

## 0. 執行前提

- 目前工作目錄尚未初始化 Git，正式執行前先做 `git init -b main`
- 使用 Node.js LTS（建議 Node 20+）
- 所有 commit 訊息使用繁體中文
- 實作前請依序使用 `@using-git-worktrees`、`@test-driven-development`、`@verification-before-completion`（若在同一 session 直接執行）
- 資料來源固定來自：
  - `.codex/skills/ui-ux-pro-max/data/styles.csv`
  - `.codex/skills/ui-ux-pro-max/data/colors.csv`
  - `.codex/skills/ui-ux-pro-max/data/typography.csv`
  - `.codex/skills/ui-ux-pro-max/data/charts.csv`
  - `.codex/skills/ui-ux-pro-max/data/products.csv`
  - `.codex/skills/ui-ux-pro-max/data/landing.csv`
  - `.codex/skills/ui-ux-pro-max/data/ux-guidelines.csv`
  - `.codex/skills/ui-ux-pro-max/data/ui-reasoning.csv`
  - `.codex/skills/ui-ux-pro-max/data/web-interface.csv`

---

### Task 1: 初始化 Git 與 Astro 專案骨架

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.mjs`
- Create: `postcss.config.mjs`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`
- Create: `README.md`

**Expected Result:**
- Git repo 初始化完成
- Astro + Tailwind 專案可啟動
- 專案具備基本腳本：`dev`、`build`、`preview`、`test`、`test:e2e`、`build:data`

**Implementation Steps:**
1. 執行 `git init -b main`
2. 建立 `package.json`，加入 Astro、Tailwind、TypeScript、Vitest、Playwright、lint/format 所需腳本
3. 建立 `astro.config.mjs` 與 Tailwind / PostCSS 設定
4. 建立 `src/styles/global.css`，先放全站 reset、字體變數、focus 樣式與基礎 tokens
5. 在 `README.md` 寫入啟動方式、資料來源與開發流程

**Test / Validation Commands:**
- `git status`
- `npm install`
- `npm run dev`
- `npm run build`

**Commit:**
- `git add .`
- `git commit -m "初始化 Astro 與 Tailwind 專案骨架"`

---

### Task 2: 建立測試基礎設施

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/setup.ts`
- Create: `tests/unit/smoke.test.ts`
- Create: `tests/e2e/home.spec.ts`

**Expected Result:**
- 有可執行的單元測試與 smoke e2e 測試骨架
- 後續資料管線與推薦引擎可被持續驗證

**Implementation Steps:**
1. 設定 Vitest 執行環境與 alias
2. 建立最小 smoke test，先驗證 `true === true` 或基本工具函式可執行
3. 設定 Playwright 基本首頁載入測試
4. 在 `package.json` 補齊 `test`、`test:watch`、`test:e2e` 腳本

**Test / Validation Commands:**
- `npm run test`
- `npx playwright install`
- `npm run test:e2e`

**Commit:**
- `git add vitest.config.ts playwright.config.ts tests package.json`
- `git commit -m "建立測試與端對端驗證基礎"`

---

### Task 3: 建立資料轉換腳本與標準化 schema

**Files:**
- Create: `scripts/build-data.mjs`
- Create: `scripts/lib/read-csv.mjs`
- Create: `scripts/lib/slugify.mjs`
- Create: `scripts/lib/normalize-records.mjs`
- Create: `src/types/content.ts`
- Create: `src/data/generated/.gitkeep`
- Create: `tests/unit/build-data.test.ts`

**Expected Result:**
- 可把所有 CSV 轉成標準化 JSON
- 每筆資料至少具備 `id`、`slug`、`category`、`tags`、`sourceFile`、`sourceRow`
- build script 會輸出資料筆數摘要

**Implementation Steps:**
1. 寫 `tests/unit/build-data.test.ts`，驗證主要資料集數量為 `67/96/57/25/96/27/99/100/30`
2. 建立 CSV 讀取與 slug 工具
3. 建立標準化轉換邏輯，分別處理 styles、colors、typography、charts、products、landing、ux、reasoning、web-interface
4. 讓 `scripts/build-data.mjs` 寫出 `src/data/generated/*.json`
5. 在腳本結尾輸出資料摘要表

**Test / Validation Commands:**
- `npm run test -- build-data`
- `node scripts/build-data.mjs`
- `ls src/data/generated`

**Commit:**
- `git add scripts src/types src/data/generated tests/unit/build-data.test.ts`
- `git commit -m "建立 CSV 轉 JSON 的資料建置流程"`

---

### Task 4: 建立資料驗證腳本

**Files:**
- Create: `scripts/validate-content.mjs`
- Create: `scripts/check-slugs.mjs`
- Create: `scripts/check-links.mjs`
- Create: `tests/unit/validate-content.test.ts`

**Expected Result:**
- 可驗證 slug 唯一、必要欄位存在、關聯資料有效
- 未來 CSV 變更後可快速檢查內容完整性

**Implementation Steps:**
1. 先寫測試驗證空欄位、重複 slug、缺關聯時應失敗
2. 實作內容驗證腳本，檢查每個 generated JSON
3. 實作 slug 唯一性檢查與 route key 檢查
4. 實作交叉連結檢查，確保推薦關聯與 detail route 不會斷鏈

**Test / Validation Commands:**
- `npm run test -- validate-content`
- `node scripts/validate-content.mjs`
- `node scripts/check-slugs.mjs`
- `node scripts/check-links.mjs`

**Commit:**
- `git add scripts tests/unit/validate-content.test.ts`
- `git commit -m "加入內容驗證與 slug 檢查腳本"`

---

### Task 5: 建立內容索引層與共用資料存取 API

**Files:**
- Create: `src/lib/content/load-generated.ts`
- Create: `src/lib/content/get-styles.ts`
- Create: `src/lib/content/get-products.ts`
- Create: `src/lib/content/get-colors.ts`
- Create: `src/lib/content/get-typography.ts`
- Create: `src/lib/content/get-charts.ts`
- Create: `src/lib/content/get-rules.ts`
- Create: `tests/unit/content-loaders.test.ts`

**Expected Result:**
- 頁面層不直接碰原始 CSV 或手動 JSON path
- 所有內容都透過型別化 loader 取得

**Implementation Steps:**
1. 先寫 loader 單元測試，驗證每個函式回傳筆數與核心欄位
2. 建立 generated JSON 讀取工具與 cache 層
3. 拆出各資料型別的 `get*` 函式
4. 提供 `getBySlug`、`getAll`、`getRelated` 等常用 API

**Test / Validation Commands:**
- `npm run test -- content-loaders`
- `npm run build`

**Commit:**
- `git add src/lib/content tests/unit/content-loaders.test.ts`
- `git commit -m "建立內容載入與型別化存取層"`

---

### Task 6: 建立產品大類 taxonomy 與首頁入口流程

**Files:**
- Create: `src/lib/product-taxonomy.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/components/home/ProductCategoryGrid.astro`
- Create: `src/components/home/ProductSubcategoryPicker.tsx`
- Create: `src/pages/index.astro`
- Create: `tests/unit/product-taxonomy.test.ts`
- Create: `tests/e2e/product-entry.spec.ts`

**Expected Result:**
- 首頁先顯示產品大類，再進細類
- 使用者可由首頁正確導到產品推薦頁
- 全站 shell 具備一致 header / footer / SEO 基礎

**Implementation Steps:**
1. 先寫 taxonomy 測試，驗證 `96` 個產品都被分配到大類且無遺漏
2. 建立 `product-taxonomy.ts`，定義大類、排序、說明文與細類映射
3. 建立 `BaseLayout.astro` 與全站 shell
4. 建立首頁卡片網格與細類選擇器
5. 寫 e2e 測試，驗證從首頁點選產品類型可進入目標頁

**Test / Validation Commands:**
- `npm run test -- product-taxonomy`
- `npm run test:e2e -- product-entry`
- `npm run build`

**Commit:**
- `git add src/layouts src/components/layout src/components/home src/lib/product-taxonomy.ts src/pages/index.astro tests`
- `git commit -m "完成首頁產品分類入口流程"`

---

### Task 7: 建立 Prompt 組裝器與推薦分數模型

**Files:**
- Create: `src/lib/prompt-builder.ts`
- Create: `src/lib/recommendation/score-product-fit.ts`
- Create: `src/lib/recommendation/build-bundles.ts`
- Create: `src/lib/recommendation/get-recommendations.ts`
- Create: `tests/unit/prompt-builder.test.ts`
- Create: `tests/unit/recommendation-engine.test.ts`

**Expected Result:**
- 可依產品類型組出「風格 + 配色 + 字體 + Landing / Dashboard 建議 + Prompt」完整組合
- 推薦結果支援 `best`、`curated`、`all` 三種模式
- `all` 模式預設依產品適配分數排序

**Implementation Steps:**
1. 先寫 `prompt-builder` 測試，驗證產生的 Prompt 含風格、色彩、字體與產品脈絡
2. 先寫推薦引擎測試，驗證特定產品可回傳至少一組 bundle，且排序合理
3. 實作產品適配分數模型，優先使用 `products.json` 與 `ui-reasoning.json`
4. 實作組合建構器，把 styles / colors / typography / landing / dashboard 合成 bundle
5. 加入推薦模式切換邏輯與預設排序

**Test / Validation Commands:**
- `npm run test -- prompt-builder`
- `npm run test -- recommendation-engine`
- `npm run build`

**Commit:**
- `git add src/lib/recommendation src/lib/prompt-builder.ts tests/unit`
- `git commit -m "建立推薦引擎與 Prompt 組裝邏輯"`

---

### Task 8: 建立產品推薦結果頁與互動篩選

**Files:**
- Create: `src/pages/products/[category]/[product].astro`
- Create: `src/components/recommendation/ModeSwitcher.tsx`
- Create: `src/components/recommendation/StyleFilter.tsx`
- Create: `src/components/recommendation/RecommendationCard.astro`
- Create: `src/components/recommendation/RecommendationGrid.tsx`
- Create: `src/components/recommendation/CopyPromptButton.tsx`
- Create: `tests/e2e/recommendation-page.spec.ts`

**Expected Result:**
- 推薦結果頁可切換 `最佳推薦 / 精選 3 組 / 全部瀏覽`
- `全部瀏覽` 預設排序為最適合此產品
- 使用者可用風格作為主要篩選器
- 每張卡可複製 Prompt

**Implementation Steps:**
1. 先寫 e2e 測試，驗證頁面能顯示推薦模式切換器與至少一張推薦卡
2. 建立動態 route 與 `getStaticPaths`
3. 建立結果頁卡片、模式切換器、風格篩選器與複製按鈕
4. 用 island 狀態管理切換模式與篩選，不整頁重整
5. 寫 prompt 複製成功狀態與空結果 fallback

**Test / Validation Commands:**
- `npm run test:e2e -- recommendation-page`
- `npm run build`
- `npm run preview`

**Commit:**
- `git add src/pages/products src/components/recommendation tests/e2e/recommendation-page.spec.ts`
- `git commit -m "完成產品推薦結果頁與互動篩選"`

---

### Task 9: 建立全站風格頁共用 primitive 與 manifest registry

**Files:**
- Create: `src/content/style-manifests/index.ts`
- Create: `src/content/style-manifests/types.ts`
- Create: `src/components/style/StyleHeroRegistry.ts`
- Create: `src/components/style/StyleSectionRegistry.ts`
- Create: `src/components/style/PromptPanel.astro`
- Create: `src/components/style/CompatibilityPanel.astro`
- Create: `src/components/style/PreviewFrame.astro`
- Create: `tests/unit/style-manifests.test.ts`

**Expected Result:**
- 每個 style slug 都能對應到專屬頁面設定
- detail page 可共享 primitives，但保留獨特編排能力

**Implementation Steps:**
1. 先寫 manifest 測試，驗證 `67` 個 style 都有對應 manifest 設定
2. 定義 manifest 型別：hero variant、section order、accent mode、preview preset、related content policy
3. 建立 registry，將 slug 對應到特定 hero / section 組合
4. 建立共享 primitive 元件：prompt panel、compatibility panel、preview frame

**Test / Validation Commands:**
- `npm run test -- style-manifests`
- `npm run build`

**Commit:**
- `git add src/content/style-manifests src/components/style tests/unit/style-manifests.test.ts`
- `git commit -m "建立風格頁 registry 與共用展示元件"`

---

### Task 10: 生成 67 種風格 detail page

**Files:**
- Create: `src/pages/styles/[slug].astro`
- Create: `src/components/style/previews/GeneralPreview.astro`
- Create: `src/components/style/previews/LandingPreview.astro`
- Create: `src/components/style/previews/DashboardPreview.astro`
- Create: `src/components/style/previews/style-specific/`
- Create: `tests/e2e/style-pages.spec.ts`

**Expected Result:**
- `67` 個 style 都有獨立網址
- 每頁至少有獨特 hero、完整展示區、Prompt 區塊、適用/不適用、相容配色/字體/圖表
- 至少抽樣確認代表性風格頁有明顯差異

**Implementation Steps:**
1. 先寫 e2e 測試，驗證 `styles` 動態路由生成數量與代表性頁面可載入
2. 建立 `getStaticPaths`，從 styles JSON 生成 route
3. 依 manifest 注入 hero / sections / preview preset
4. 先完成 3 個基底 preview 類型，再用 slug-specific fragment 擴充重點風格
5. 補齊相容配色、字體、圖表與 prompt block

**Test / Validation Commands:**
- `npm run test:e2e -- style-pages`
- `npm run build`
- `npm run preview`

**Commit:**
- `git add src/pages/styles src/components/style/previews tests/e2e/style-pages.spec.ts`
- `git commit -m "完成 67 種風格展示頁生成"`

---

### Task 11: 建立風格索引頁與跨頁導覽

**Files:**
- Create: `src/pages/styles/index.astro`
- Create: `src/components/style/StyleIndexFilters.tsx`
- Create: `src/components/style/StyleCard.astro`
- Create: `src/components/navigation/Breadcrumbs.astro`
- Create: `tests/e2e/style-index.spec.ts`

**Expected Result:**
- 使用者可從風格庫瀏覽所有風格
- 可依 `General / Landing Page / BI-Analytics` 與關鍵字篩選
- 可快速跳入 detail page

**Implementation Steps:**
1. 先寫 e2e 測試，驗證 style index 可篩選並進入 detail page
2. 建立 style card 與索引過濾器
3. 補上 breadcrumbs 與 related navigation
4. 確保索引頁可從首頁與推薦頁導入

**Test / Validation Commands:**
- `npm run test:e2e -- style-index`
- `npm run build`

**Commit:**
- `git add src/pages/styles/index.astro src/components/style src/components/navigation tests/e2e/style-index.spec.ts`
- `git commit -m "加入風格索引頁與導覽層"`

---

### Task 12: 建立配色、字體與圖表 detail page

**Files:**
- Create: `src/pages/colors/index.astro`
- Create: `src/pages/colors/[slug].astro`
- Create: `src/pages/typography/index.astro`
- Create: `src/pages/typography/[slug].astro`
- Create: `src/pages/charts/index.astro`
- Create: `src/pages/charts/[slug].astro`
- Create: `src/components/colors/PalettePreview.astro`
- Create: `src/components/typography/TypographyPreview.astro`
- Create: `src/components/charts/ChartPreviewRegistry.ts`
- Create: `src/components/charts/ChartPreviewFrame.astro`
- Create: `tests/e2e/library-pages.spec.ts`

**Expected Result:**
- `96` 配色、`57` 字體、`25` 圖表都有清楚可視化 detail page
- 這些 detail page 可被風格頁引用與交叉導覽

**Implementation Steps:**
1. 先寫 e2e 測試，驗證 colors / typography / charts index 與 detail 頁可載入
2. 建立各自的 index 與 detail route
3. 配色頁顯示 UI token 套用、CTA 對比、背景層次與圖表色
4. 字體頁顯示 hero、內文、資料表與按鈕文字
5. 圖表頁使用固定假資料渲染不同 chart type 展示

**Test / Validation Commands:**
- `npm run test:e2e -- library-pages`
- `npm run build`
- `npm run preview`

**Commit:**
- `git add src/pages/colors src/pages/typography src/pages/charts src/components/colors src/components/typography src/components/charts tests/e2e/library-pages.spec.ts`
- `git commit -m "完成配色字體與圖表展示頁"`

---

### Task 13: 建立規則中心與 before/after 展示

**Files:**
- Create: `src/pages/rules/index.astro`
- Create: `src/pages/rules/ux/index.astro`
- Create: `src/pages/rules/ux/[slug].astro`
- Create: `src/pages/rules/reasoning/index.astro`
- Create: `src/pages/rules/reasoning/[slug].astro`
- Create: `src/pages/rules/special/index.astro`
- Create: `src/pages/rules/special/[slug].astro`
- Create: `src/components/rules/BeforeAfterDemo.astro`
- Create: `src/components/rules/RuleDetail.astro`
- Create: `tests/e2e/rules-center.spec.ts`

**Expected Result:**
- `99` UX、`100` 推理規則與專門規則皆可瀏覽
- 規則 detail page 具備 before / after 或錯誤 / 正確示例
- 使用者能理解推薦不是黑箱

**Implementation Steps:**
1. 先寫 e2e 測試，驗證 rules index 與三個子區塊可進入 detail 頁
2. 建立 rules hub 與分類索引頁
3. 建立 detail template，支援 `Do / Don't`、嚴重性、平台、相關規則
4. 補上 before / after 展示元件
5. 讓推薦結果頁與 style 頁可連回相關規則

**Test / Validation Commands:**
- `npm run test:e2e -- rules-center`
- `npm run build`

**Commit:**
- `git add src/pages/rules src/components/rules tests/e2e/rules-center.spec.ts`
- `git commit -m "建立 UX 與推理規則展示中心"`

---

### Task 14: 建立搜尋、收藏與比較功能

**Files:**
- Create: `src/components/search/GlobalSearch.tsx`
- Create: `src/components/search/search-index.ts`
- Create: `src/components/favorites/FavoritesStore.ts`
- Create: `src/components/favorites/FavoriteButton.tsx`
- Create: `src/components/compare/CompareDrawer.tsx`
- Create: `src/components/compare/CompareStore.ts`
- Create: `tests/unit/search-index.test.ts`
- Create: `tests/e2e/search-compare.spec.ts`

**Expected Result:**
- 使用者可搜尋 styles / products / colors / typography / rules
- 可收藏與比較條目
- 收藏與比較狀態可在前端持久化

**Implementation Steps:**
1. 先寫 search index 單元測試，驗證索引包含主要內容類型
2. 先寫 e2e 測試，驗證搜尋、加入比較與收藏可運作
3. 建立前端搜尋索引與輸入介面
4. 建立 favorites / compare store，優先使用 `localStorage`
5. 將這些功能掛到推薦卡、風格卡與 detail page

**Test / Validation Commands:**
- `npm run test -- search-index`
- `npm run test:e2e -- search-compare`
- `npm run build`

**Commit:**
- `git add src/components/search src/components/favorites src/components/compare tests`
- `git commit -m "加入搜尋收藏與比較功能"`

---

### Task 15: 補齊 SEO、分享與內容導覽強化

**Files:**
- Create: `src/components/seo/SeoHead.astro`
- Create: `src/components/seo/OpenGraphImage.astro`
- Create: `src/lib/seo/build-meta.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/**/*.astro`
- Create: `tests/e2e/seo-smoke.spec.ts`

**Expected Result:**
- 各主要 detail page 具備正確 title、description、canonical、Open Graph 基礎資料
- 分享 detail page 時能看出主題與類型

**Implementation Steps:**
1. 先寫 e2e smoke test，驗證首頁與一個風格頁有正確 title / meta description
2. 建立共用 SEO 元件與 meta builder
3. 把 SEO 套用到首頁、產品頁、風格頁、配色頁、字體頁、圖表頁、規則頁
4. 補齊 canonical 與分享標題策略

**Test / Validation Commands:**
- `npm run test:e2e -- seo-smoke`
- `npm run build`

**Commit:**
- `git add src/components/seo src/lib/seo src/layouts/BaseLayout.astro src/pages tests/e2e/seo-smoke.spec.ts`
- `git commit -m "補齊 SEO 與分享資訊"`

---

### Task 16: 最終驗證、文件更新與發佈前檢查

**Files:**
- Modify: `README.md`
- Modify: `docs/plans/2026-03-09-ui-ux-pro-max-showcase-design.md`
- Modify: `docs/plans/2026-03-09-ui-ux-pro-max-showcase-implementation-plan.md`
- Create: `docs/testing.md`
- Create: `docs/content-model.md`

**Expected Result:**
- 文件與實際專案一致
- 所有測試、資料建置、內容驗證與 build 都通過
- 團隊可直接接手繼續開發或部署

**Implementation Steps:**
1. 更新 README，寫清楚安裝、啟動、測試、資料更新流程
2. 補 `docs/testing.md` 與 `docs/content-model.md`
3. 依 `@verification-before-completion` 執行完整驗證
4. 確認工作樹乾淨後再做最終 commit

**Test / Validation Commands:**
- `node scripts/build-data.mjs`
- `node scripts/validate-content.mjs`
- `node scripts/check-slugs.mjs`
- `node scripts/check-links.mjs`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

**Commit:**
- `git add README.md docs`
- `git commit -m "完成展示系統第一版實作與文件整理"`

---

## 建議執行順序

1. `Task 1` → `Task 4`：先把 repo、測試、資料與驗證能力打穩
2. `Task 5` → `Task 8`：完成首頁、推薦引擎與核心結果頁
3. `Task 9` → `Task 13`：完成各內容庫與 detail page 系統
4. `Task 14` → `Task 16`：補互動能力、SEO 與最終驗證

---

## 每階段最低驗收門檻

- **M1：資料基礎完成**
  - `build-data` 與內容驗證腳本可執行
  - JSON 輸出筆數正確
- **M2：核心流程完成**
  - 可從首頁選產品類型並進入推薦結果頁
  - 推薦模式切換與風格篩選可用
- **M3：內容展示完成**
  - `67` 風格、`96` 配色、`57` 字體、`25` 圖表、`99` UX、`100` 推理規則可瀏覽
- **M4：發佈就緒**
  - 測試、build、內容驗證、SEO 基礎都通過

---

## 備註

- 由於你要求 `67` 種風格各自生成獨特頁面，本計畫刻意把 `manifest registry` 與 `shared primitives` 拆成獨立任務，避免後續維護失控。
- 結果頁雖支援 `最佳推薦 / 精選 3 組 / 全部瀏覽`，但互動設計應預設停在對 Prompt 使用者最友善的狀態；實作時建議預設為 `精選 3 組`，並允許即時切換到 `全部瀏覽`。
- 若後續要加入 CMS、後台編輯器或部署流程，建議另外開第二份 implementation plan，不與本計畫混在一起。
