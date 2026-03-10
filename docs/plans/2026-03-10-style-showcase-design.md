# 風格頁 67 套獨立展示設計

**目標**：讓 `/styles/<slug>` 的每一頁都擁有獨立展示元件與版型，而非共用模板，達到每一種風格可一眼辨識的差異。

## 範圍
- 針對 67 種風格建立專屬展示元件。
- 移除 detail page 對共用 `General/Landing/Dashboard` 預覽模板的依賴，改由 registry 指派專屬元件。
- 保留既有共用 primitives（按鈕、卡片、Prompt 區塊等）以維持品質與一致性。

## 架構與檔案布局
- 每個風格建立一個專屬展示元件：`src/components/style/showcases/<slug>.astro`
- 新增 registry：`src/components/style/StyleShowcaseRegistry.ts`
  - `slug -> ShowcaseComponent`
- `/styles/[slug].astro` 僅負責資料取得並交給 showcase 元件渲染

## 元件策略
- 每個 showcase 至少包含：
  - 專屬 Hero（可延用 `styleHeroRegistry` 但需在元件內組合不同結構）
  - 2-3 個展示模組（卡片拼貼、數據區、UI 元件列、時間軸、動效示意等）
  - 1 個小型 landing 範例區（CTA/價值主張/轉換段落）
- 所有 showcase 可使用共用 primitives：`PreviewFrame`、`PromptPanel`、按鈕/徽章樣式
- 內容取材自 `style.raw` 欄位（Primary/Secondary Colors、Effects、Best For、Keywords 等）

## 資料流
- `/styles/[slug].astro` 取得：
  - `style`、`manifest`、`relatedColor`、`relatedTypography`、`previewPrompt`
- 將上述資料傳入對應 showcase 元件

## 錯誤處理
- 新增 `MissingShowcase.astro` fallback：若 registry 缺少對應 slug，顯示清楚訊息但頁面仍可載入
- showcase 內對 `style.raw` 欄位設置合理預設值，避免空值造成版面破壞

## 測試策略
- 單元測試：registry 完整性
  - 取得全部 style slug，逐一檢查 registry 是否存在對應元件
  - 缺漏即 fail 並列出 slug
- E2E 抽樣測試（可選）：
  - 隨機或固定 3-5 個 slug，確認展示區塊存在（例如 `data-showcase=<slug>`）

## 成功標準
- 67 個 `/styles/<slug>` 頁面皆有專屬展示元件
- 視覺差異在 Hero、區塊節奏、展示模組上明顯可辨
- registry 測試通過，不允許漏寫
