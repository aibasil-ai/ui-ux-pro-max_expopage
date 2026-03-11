# UI UX Pro Max 展示系統

這個專案會把 `ui-ux-pro-max` skill 內的風格、配色、字體、圖表、產品推薦與規則資料，整理成可瀏覽、可搜尋、可收藏、可比較、可複製 Prompt 的 Astro 展示網站。

## 專案目標

這個網站主要服務 `Prompt 使用者`，讓使用者能先從產品類型出發，再看到：

- 這類產品最適合的完整設計組合
- 67 種 UI 風格各自長什麼樣子
- 每一種風格的獨立展示頁（不是共用模板）
- 任意頁型模板（About / Pricing / FAQ / Terms / Privacy）一鍵套用 67 風格
- 96 組配色、57 組字體、25 種圖表如何展示
- 99 條 UX 指南、100 條推理規則與專門規則如何影響推薦結果

## 技術棧

- Astro
- Tailwind CSS
- React Islands
- TypeScript
- Vitest
- Playwright

## 目前資料筆數

以目前資料源為準：

- 67 種風格
- 96 組配色
- 57 組字體
- 25 種圖表
- 96 種產品類型
- 27 種 Landing Pattern
- 99 條 UX 指南
- 100 條推理規則
- 30 條專門規則

## 快速啟動

### 1. 安裝依賴

```bash
npm install
```

### 2. 產生展示資料

```bash
npm run build:data
```

這一步會：

- 讀取 `.codex/skills/ui-ux-pro-max/data/` 內的 CSV
- 轉成 `src/data/generated/*.json`
- 產生全站搜尋索引 `public/data/search-index.json`

### 3. 啟動開發站

```bash
npm run dev
```

啟動後可開啟：

- `http://localhost:4321`

## 常用指令

### 開發

```bash
npm run dev
```

### 重建資料

```bash
npm run build:data
```

### 單元測試

```bash
npm run test
```

### E2E 測試

```bash
npm run test:e2e
```

### 正式建置

```bash
npm run build
```

### 產生風格主題調色盤文件

```bash
npm run build:style-palette
```

### 預覽建置結果

```bash
npm run preview
```

## 主要頁面入口

### 核心流程

- 首頁：`/`
- 產品推薦頁：`/products/[category]/[product]`

### 內容庫

- 風格庫：`/styles`
- 風格 detail：`/styles/[slug]`
- 配色庫：`/colors`
- 字體庫：`/typography`
- 圖表庫：`/charts`
- 規則中心：`/rules`

### 風格實驗室（新）

- 模板入口：`/style-lab/templates`
- 模板總覽（單一模板 × 67 風格）：
  - `/style-lab/templates/about`
  - `/style-lab/templates/pricing`
  - `/style-lab/templates/faq`
  - `/style-lab/templates/terms`
  - `/style-lab/templates/privacy`
- 單頁展示（模板 + 風格）：
  - `/style-lab/templates/[template]/[slug]`
  - 範例：`/style-lab/templates/privacy/swiss-modernism-2-0`

### 規則中心子頁

- UX 指南：`/rules/ux`
- 推理規則：`/rules/reasoning`
- 專門規則：`/rules/special`

## 互動功能

目前網站已支援：

- 全站搜尋
- 收藏
- 比較抽屜
- 推薦模式切換（最佳推薦 / 精選 3 組 / 全部瀏覽）
- 風格篩選
- Prompt 複製
- 風格分群主題化（glass / brutal / neon-dark / organic / editorial / data / playful / default）

> 收藏與比較使用瀏覽器 `localStorage` 持久化。

## 專案結構

```text
src/
  components/     UI 元件、互動 islands、展示卡片
  layouts/        共用版型
  lib/            資料存取、推薦引擎、prompt builder、style manifest、style theme、dummy template data
  pages/          Astro 路由頁面
  data/generated/ CSV 轉換後的 JSON
scripts/
  build-data.mjs          建置資料與搜尋索引
  generate-style-showcases.mjs            生成 67 風格展示元件
  generate-style-theme-palette-doc.mjs    生成風格主題調色盤文件
  validate-content.mjs    驗證內容完整性
  check-slugs.mjs         檢查 slug 唯一性
  check-links.mjs         檢查交叉連結
public/data/
  search-index.json       全站搜尋索引
docs/
  style-showcase-theme-palette.md         風格主題調色盤文件（自動生成）
```

## 驗證流程

建議在提交前執行：

```bash
npm run test
npm run test:e2e
npm run build
```

## 資料來源

主要來源位於：

- `.codex/skills/ui-ux-pro-max/data/`

包含：

- `styles.csv`
- `colors.csv`
- `typography.csv`
- `charts.csv`
- `products.csv`
- `landing.csv`
- `ux-guidelines.csv`
- `ui-reasoning.csv`
- `web-interface.csv`

## 文件

- 設計規格：`docs/plans/2026-03-09-ui-ux-pro-max-showcase-design.md`
- 實作計畫：`docs/plans/2026-03-09-ui-ux-pro-max-showcase-implementation-plan.md`
- 風格頁設計：`docs/plans/2026-03-10-style-showcase-design.md`
- 風格頁實作計畫：`docs/plans/2026-03-10-style-showcase-implementation-plan.md`
- 風格主題調色盤：`docs/style-showcase-theme-palette.md`

## 版本控制

本專案已使用 Git 版控。

查看目前 commit：

```bash
git log --oneline -n 5
```
