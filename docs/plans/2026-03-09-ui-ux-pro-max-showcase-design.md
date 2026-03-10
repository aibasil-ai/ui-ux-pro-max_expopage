# UI UX Pro Max 展示系統設計規格

> **定位：** 這是一套以 Prompt 使用者為第一優先的展示型設計系統，目標是讓使用者先透過產品類型與可視化頁面範例，理解不同 UI/UX 風格實際長相，再更精準地描述需求給 AI。

**日期：** 2026-03-09  
**狀態：** 已確認方向，可進入實作規劃  
**技術選型：** Astro + Tailwind CSS  
**產品策略：** 混合式展示架構（索引頁 + detail page + client-side 互動）  
**展示策略：** 每種風格各自生成獨特頁面  
**主要使用者：** Prompt 使用者  
**首頁主入口：** 先選產品類型（先分大類，再進細類）

---

## 1. 專案目標

本專案的核心問題不是「資料不夠多」，而是 `ui-ux-pro-max` skill 雖然已經累積大量 UI 風格、配色、字體、圖表、UX 指南與推理規則，但這些內容目前主要停留在文字層級。對 Prompt 使用者而言，最大的困難不是找不到術語，而是不確定某種描述實際會長成什麼樣子，因此難以在與 AI 協作時精準表達偏好。

本展示系統的目標，是把這些靜態資料轉換成可瀏覽、可比較、可複製 Prompt 的參考體驗。使用者應該可以先從「產品類型」出發，而不是被迫直接輸入抽象風格詞，再逐步看到最適合該產品的風格組合，包含對應配色、字體、Landing / Dashboard 建議，以及可直接複製的 Prompt。每種風格都必須有獨立頁面，且不是只有說明文字，而是有足以讓人一眼辨識特徵的真實展示畫面。

此專案的價值主張可濃縮成一句話：**讓使用者先看懂風格，再學會如何對 AI 描述風格。**

---

## 2. 已確認需求與範圍

本次規劃以目前 skill 內既有資料源為準，不補資料後再設計。資料實際筆數如下：`67` 種 UI 風格、`96` 組配色方案、`57` 組字體搭配、`25` 種圖表類型、`99` 條 UX 指南、`100` 條推理規則，以及推理引擎中會用到的專門規則資料。其來源分別為 `.codex/skills/ui-ux-pro-max/data/styles.csv:1`、`.codex/skills/ui-ux-pro-max/data/colors.csv:1`、`.codex/skills/ui-ux-pro-max/data/typography.csv:1`、`.codex/skills/ui-ux-pro-max/data/charts.csv:1`、`.codex/skills/ui-ux-pro-max/data/ux-guidelines.csv:1`、`.codex/skills/ui-ux-pro-max/data/ui-reasoning.csv:1`、`.codex/skills/ui-ux-pro-max/data/web-interface.csv:1`。

風格資料內已包含三大子類：`49` 個通用風格、`8` 個 Landing Page 風格、`10` 個 BI / Analytics 風格，因此可以自然對應到三種主要展示模板來源。但因為你已明確指定「每種風格各做獨特頁面」，所以實作上不能只做一個共用模板換皮，而必須在共用骨架之上，讓每個 style detail page 都有自己明確的構圖、節奏與視覺特徵。

此外，首頁不採風格牆起手，而是先分產品大類，再進產品細類。使用者在選完產品細類後，系統要先推薦完整組合，而不是單一風格或單一 Prompt。

---

## 3. 目標使用者與核心使用情境

第一優先使用者是「Prompt 使用者」，也就是會與 AI 協作生成設計、頁面或前端介面的人。他們未必是專業設計師，但通常已經知道自己要做的產品類型，例如 SaaS、電商、醫療、金融、教育、內容平台、服務型網站或 BI Dashboard。這類使用者的困難不在於沒有需求，而在於需求常常停留在模糊描述，例如「我想要比較高級、有科技感、但要有信任感」，卻不知道這種要求對應到哪些風格、配色與字體組合。

因此系統需要協助他們完成三件事。第一，從產品脈絡出發，快速看到適合的視覺方向。第二，把抽象偏好轉換成更可操作的描述詞與 Prompt。第三，在多種可能性中比較差異，而不是只得到單一黑箱答案。這也代表我們不能只提供推薦結果，而要讓每個推薦組合都具備可理解的結構，例如為什麼這個產品適合某種風格、這種風格常搭哪些配色、它更適合 Landing 還是 Dashboard、以及應避免哪些描述方式。

本系統不是設計工具本身，而是 AI 協作前的「風格理解與語言對齊層」。

---

## 4. 產品策略與體驗原則

本系統採用「混合式展示架構」，也就是同時具備靜態可索引的內容頁面與前端互動層。這樣做有三個原因。首先，數量龐大的 detail page 需要穩定路由與良好可分享性，因此應使用 Astro 生成靜態頁面。其次，結果頁與比較頁需要切換推薦模式、篩選風格與複製 Prompt，這些行為適合放在 client-side islands 中實作。最後，因為使用者主要是為了理解與選擇，而不是進行內容編輯，所以互動可以聚焦在查找、比較、篩選與複製，而不需要過度引入複雜後台。

體驗原則共有五條。第一，**先產品，後風格**。第二，**先看畫面，再看文字**。第三，**每個畫面都必須能回推成 Prompt**。第四，**推薦不是黑箱，應可理解與比較**。第五，**展示站本身保持清楚與克制，風格張力放在展示內容，而不是全站 UI**。因此，站點整體外觀會偏文件型、高可讀、強搜尋導向，但 individual detail page 允許呈現強烈個性。

這個策略能平衡內容規模、維護成本與展示品質。

---

## 5. 首頁與整體資訊架構

首頁的首要任務不是展示全部內容，而是幫使用者用最小認知成本切入正確探索路徑。首頁第一屏應提供「產品大類」卡片，例如 SaaS / Software、E-commerce / Retail、Healthcare、Finance、Education、Content / Media、Service Business、Community / Membership、Developer Tools、Analytics / Dashboard 等。使用者點入大類後，再進入對應的產品細類清單，例如 SaaS (General)、Micro SaaS、Developer Tool / IDE、Cybersecurity Platform 等。這個兩層入口設計比直接攤開 `96` 個產品類型更容易理解。

站點主結構可分為七個主要區塊：`首頁`、`產品推薦結果頁`、`風格庫`、`配色庫`、`字體庫`、`圖表庫`、`規則中心`。其中「產品推薦結果頁」是核心轉換頁，它接在產品細類之後，負責把原始資料整合成對 Prompt 使用者有意義的推薦組合。風格庫、配色庫、字體庫與圖表庫則是支撐層，讓使用者能從推薦結果往下深挖或跨頁比較。規則中心則負責說明 UX 原則、推理邏輯與專門規則，避免整個系統像一個沒有解釋的靈感黑盒子。

所有 detail page 都應具備獨立網址，方便收藏、分享與後續擴充。

---

## 6. 關鍵使用者流程

主要流程如下。使用者先進入首頁，選擇產品大類，再選擇產品細類。系統接著進入推薦結果頁，預設以「最適合此產品」排序顯示完整組合。每個組合至少包含：推薦風格、推薦配色、推薦字體、推薦 Landing Pattern、推薦 Dashboard Direction（若該產品適用）、適用原因、避免事項，以及一段可直接複製的 Prompt。使用者可以在結果頁上切換推薦模式，例如 `最佳推薦`、`精選 3 組`、`全部瀏覽`，其中你已明確要求使用者可自行切換，而 `全部瀏覽` 預設排序則為「最適合此產品」。

當使用者進入「全部瀏覽」模式後，主要縮小範圍的方式是「用風格篩選」。這代表結果頁的第一層篩選器應圍繞 style taxonomy，而不是色彩或頁面類型。使用者看到想深入的組合後，可進入對應風格 detail page，看更完整的獨特視覺展示、描述詞拆解、相容配色 / 字體 / 圖表、與適合複製給 AI 的 Prompt。

次要流程包含：從風格 detail page 反查其他產品適用情境、在配色或字體 detail page 套用到範例頁面、以及從規則中心理解推薦邏輯。

---

## 7. 推薦結果頁設計

推薦結果頁是本系統最重要的功能頁。它不只是搜尋結果清單，而是把資料庫中的產品建議、風格建議與推理規則轉換為「可採用的設計方向」。因此每張結果卡不應只有名稱與標籤，而要像一個可操作的設計套餐。每張卡片至少應包含五種資訊：一個有辨識度的風格預覽縮圖、風格名稱與一句話定位、配色與字體組合、結構建議（Landing / Dashboard），以及 Prompt 摘要與複製按鈕。

頁面上方要有三種推薦模式切換器：`最佳推薦`、`精選 3 組`、`全部瀏覽`。預設模式建議仍以 `精選 3 組` 為初始，但使用者可立即切換。你已確認系統必須允許當下自由選擇，因此推薦模式切換器應該是結果頁最明顯的控制元件之一。`全部瀏覽` 模式則需提供足夠清楚的排序與篩選邏輯，預設排序為 `最適合此產品`，主要篩選器為 `風格`。

另外，結果頁應額外支援收藏、比較、以及「改寫 Prompt」入口，讓使用者可以在選中某個組合後，直接把風格語言延伸成更具體的需求描述。

---

## 8. 風格頁、配色頁、字體頁與圖表頁

風格頁是整個展示系統的視覺核心。`67` 種風格都要有各自獨立 detail page，且每頁都要讓人一眼看出該風格的性格，不可退化成統一模板加換色。因此實作上應採「共享 primitive + 每頁獨特編排」：例如共用卡片、按鈕、排版、preview frame、prompt block 等元件，但不同風格可採用不同 Hero 結構、不同區塊節奏、不同裝飾層與不同互動。風格頁應展示：風格概述、視覺特徵、適用產品、避免用途、相容配色、相容字體、相容圖表、代表 Prompt，以及一個完整頁面示範。

配色頁與字體頁雖然不需要像風格頁那樣每頁都有完全不同的版型，但仍需要有可視化套用。配色頁應讓使用者看到按鈕、文字、背景、卡片、圖表色如何一起工作；字體頁則應同時展示 Hero 標題、正文、數據、表格與按鈕文本，以利比較。圖表頁則要用同一批範例資料渲染不同圖表類型，避免因資料差異干擾理解。

這些 detail page 的目的不是陳列資訊，而是讓使用者形成可描述的偏好。

---

## 9. UX 指南、推理規則與專門規則展示

規則中心應拆成三個層次：`UX 指南`、`推理規則`、`專門規則`。UX 指南主要來自 `.codex/skills/ui-ux-pro-max/data/ux-guidelines.csv:1`，適合做成知識型列表與 detail page，並在 detail page 中搭配 before / after 示意或錯誤示例 / 修正示例。推理規則則來自 `.codex/skills/ui-ux-pro-max/data/ui-reasoning.csv:1`，其重點不是技術細節，而是讓使用者知道「系統為什麼覺得某種產品應優先看某種風格、顏色或排版氣質」。

至於專門規則，現階段最合理的來源是推理引擎與 Web / Platform 規則資料，例如 `.codex/skills/ui-ux-pro-max/data/web-interface.csv:1` 與腳本中的規則套用邏輯。這一層展示不需要做成學術解釋，而是應聚焦在「推薦時會考慮哪些專業限制」，例如可及性、動效節制、對比、導航與資料密度。

規則中心的核心角色不是給使用者全部讀完，而是當使用者問「為什麼推薦這樣」時，提供一個可理解的說明層。這能提高整個展示系統的可信度，也能幫助使用者學習更好的 Prompt 結構。

---

## 10. 資料模型與內容生成策略

資料層應先把 CSV 轉換成一致的內容模型，避免 Astro 頁面直接依賴原始欄位命名。建議建立一條 build pipeline，把 style、product、color、typography、chart、ux、reasoning、web rules 都轉換為標準化 JSON。每一筆資料至少需要補齊 `slug`、`category`、`tags`、`relatedIds`、`sourceFile`、`sourceRow` 等欄位，以便生成 detail route、建立 cross-link、做篩選與追溯。

推薦引擎的基礎應以 `products.csv` 的產品類型建議與 `ui-reasoning.csv` 的決策邏輯為核心，再補上 `styles.csv`、`colors.csv`、`typography.csv` 與 `landing.csv` 的候選項目。輸出不是單一結果，而是一組有排序依據的「推薦組合」。這些組合可在 build 階段預先生成，也可在前端依選定產品即時組合。考量資料規模不大、且結果頁需要切換模式與篩選，我建議採用「基礎關聯預先生成 + 前端再排序與篩選」的混合策略。

所有 detail page 應由資料驅動自動生成，避免手工管理上百條 route。同時也要保留少量人工設定檔，處理某些風格頁的特殊 Hero、特定 section 結構與視覺裝置。

---

## 11. 技術架構

技術上採用 Astro + Tailwind CSS。Astro 負責靜態頁生成、內容路由、資料讀取與高效輸出；Tailwind 負責快速建立可組合的設計 primitive。互動功能，例如推薦模式切換、比較、收藏、Prompt 複製、結果排序與篩選，則透過 Astro islands 掛載輕量前端元件即可，不需要一開始就導入重量級 SPA 架構。

檔案結構建議分成五層：`src/content` 或 `src/data/generated` 存放轉換後資料、`src/lib` 放資料處理與推薦邏輯、`src/components` 放共享元件、`src/layouts` 放頁面骨架、`src/pages` 放路由。針對 `67` 個風格 detail page，建議建立一組 style manifest，讓每個 slug 能對應到專屬的 section 組合與視覺參數。這樣仍可保留每頁獨特性，同時避免完全無結構的手工頁。

整體站點本身的 UI 應保持極簡、文件型、可搜尋與高可讀，這也與 `ui-ux-pro-max` 為展示站本身查出的 `Minimalism & Swiss Style` 方向一致。

---

## 12. 視覺與內容設計原則

展示站本身的風格不應搶走內容風采，因此全站 shell 建議採高留白、強層級、低裝飾的文件型介面：中性色背景、清楚網格、穩定導航、顯著搜尋、容易閱讀的字級階層。這種克制的外層框架可以讓使用者在不同風格 detail page 間切換時，不會被主站 UI 干擾，也有助於維持資訊密度與可用性。

然而進入各個 style detail page 時，內容區應允許高度差異化。例如 Brutalism 頁可採用重邊框、高對比塊狀結構與挑釁式排版； Glassmorphism 可用分層玻璃片、霓虹高光與景深背景； Executive Dashboard 應以清楚 KPI 模組、專業圖表與穩定節奏為主； Storytelling-Driven 則可強調分段敘事、滾動節奏與沉浸式畫面。這些差異應由資料與 manifest 共同驅動，而不是完全依賴單一模板微調。

內容文案則要始終服務 Prompt 使用者，因此所有說明都應偏「如何描述」而不是只講設計史。

---

## 13. 非功能需求

這個系統雖然以展示為主，但仍有明確的非功能要求。首先是可及性。全站 shell 與規則頁應達成穩定的鍵盤操作、可見焦點、合理語意結構與足夠對比；展示型 detail page 則至少不能破壞基本可用性。其次是效能。由於頁面數量很大，建議所有清單頁採靜態生成與懶載入縮圖，detail page 圖像與裝飾層也應控制體積，避免因追求風格導致首屏過重。

再來是可維護性。`67` 個風格頁如果完全手刻，後續變更成本會很高，因此即便視覺需要獨特，也必須有一層統一的資料與元件系統支撐。最後是可驗證性。資料筆數、slug 唯一性、交叉連結完整度、頁面生成成功率、搜尋與篩選結果，都應有對應檢查腳本。若缺乏這些基礎驗證，未來只要 CSV 有更新，展示站就很容易出現遺漏或斷鏈。

因此，本專案不是只做漂亮頁面，而是要做一個可長期演化的展示平台。

---

## 14. Git 版控策略

本專案需使用 Git 做版控。建議在正式實作前即初始化 repo，並以 `main` 作為主幹分支。功能開發採 `feature/*` 命名，例如 `feature/project-scaffold`、`feature/data-pipeline`、`feature/style-pages`、`feature/recommendation-ui`。由於此專案範圍廣、頁面量大、資料集多，應避免一次性大提交，而要依模組拆分 commit。

建議的 commit 粒度如下：初始化 Astro 專案一次、建立資料轉換腳本一次、完成首頁流程一次、完成推薦結果頁一次、完成風格 detail page 生成基礎一次、補齊配色 / 字體 / 圖表展示一次、加入規則中心一次、加入搜尋 / 比較 / 收藏與 Prompt Builder 一次。每次 commit 訊息請使用繁體中文，便於與本專案規範一致。

若後續需要較強隔離，也可在正式實作前使用 worktree，但這一點可於 implementation phase 再決定。此份 spec 先以單一工作目錄的乾淨演進作為前提。

---

## 15. 分階段實作計畫

### Phase 1：建立專案骨架與資料轉換基礎

**預計修改檔案**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/styles/global.css`
- Create: `scripts/build-data.mjs`
- Create: `src/data/generated/`
- Create: `.gitignore`
- Create: `README.md`

**預期結果**
- Astro + Tailwind 專案可啟動
- 可將 CSV 轉換為標準化 JSON
- 產出筆數檢查報告，確認 `67/96/57/25/99/100` 與其他資料源一致

**驗證指令**
- `npm install`
- `npm run dev`
- `node scripts/build-data.mjs`
- `npm run build`

### Phase 2：建立全站 shell 與首頁產品入口

**預計修改檔案**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/components/home/ProductCategoryGrid.astro`
- Create: `src/components/home/ProductSubcategoryPicker.astro`
- Create: `src/lib/product-taxonomy.ts`
- Modify: `src/data/generated/products.json`

**預期結果**
- 首頁可先顯示產品大類，再進細類
- 使用者可從產品類型進入推薦結果頁
- 站點 shell 具備導航、搜尋入口與一致版面

**驗證指令**
- `npm run dev`
- `npm run build`

### Phase 3：建立推薦引擎與結果頁互動

**預計修改檔案**
- Create: `src/lib/recommendation-engine.ts`
- Create: `src/pages/products/[category]/[product].astro`
- Create: `src/components/recommendation/ModeSwitcher.tsx`
- Create: `src/components/recommendation/ResultGrid.tsx`
- Create: `src/components/recommendation/RecommendationCard.astro`
- Create: `src/components/recommendation/StyleFilter.tsx`
- Create: `src/lib/prompt-builder.ts`

**預期結果**
- 支援 `最佳推薦 / 精選 3 組 / 全部瀏覽` 三種模式
- `全部瀏覽` 預設以最適合此產品排序
- 可用風格進行主要篩選
- 每組推薦都能複製 Prompt

**驗證指令**
- `npm run dev`
- `npm run build`
- `npm run preview`

### Phase 4：建立 67 種風格獨特頁面生成系統

**預計修改檔案**
- Create: `src/pages/styles/[slug].astro`
- Create: `src/components/style/StyleHeroRegistry.ts`
- Create: `src/components/style/StyleSectionRegistry.ts`
- Create: `src/content/style-manifests/`
- Create: `src/components/style/previews/`
- Create: `src/components/style/PromptPanel.astro`
- Create: `src/components/style/CompatibilityPanel.astro`

**預期結果**
- `67` 種風格皆有獨立網址與明顯不同的展示頁
- 各頁含視覺展示、Prompt、適用情境、避免事項、相容配色與字體
- 保有共用 primitive，避免維護失控

**驗證指令**
- `npm run build`
- `npm run preview`
- `node scripts/build-data.mjs`

### Phase 5：建立配色、字體、圖表與規則中心

**預計修改檔案**
- Create: `src/pages/colors/[slug].astro`
- Create: `src/pages/typography/[slug].astro`
- Create: `src/pages/charts/[slug].astro`
- Create: `src/pages/rules/ux/[slug].astro`
- Create: `src/pages/rules/reasoning/[slug].astro`
- Create: `src/pages/rules/special/[slug].astro`
- Create: `src/components/rules/BeforeAfterDemo.astro`
- Create: `src/components/charts/ChartPreviewRegistry.ts`

**預期結果**
- `96` 配色、`57` 字體、`25` 圖表、`99` UX、`100` 推理規則皆可被瀏覽
- 規則頁具備 before/after 或錯誤/正確示例
- 各 detail page 能與風格頁交叉連結

**驗證指令**
- `npm run build`
- `npm run preview`

### Phase 6：補齊搜尋、比較、收藏與品質驗證

**預計修改檔案**
- Create: `src/components/search/GlobalSearch.tsx`
- Create: `src/components/compare/CompareDrawer.tsx`
- Create: `src/components/favorites/FavoritesStore.ts`
- Create: `scripts/validate-content.mjs`
- Create: `scripts/check-slugs.mjs`
- Create: `scripts/check-links.mjs`

**預期結果**
- 全站可搜尋與跨類別比較
- 使用者可收藏條目
- 具備資料、slug、路由與連結檢查腳本

**驗證指令**
- `npm run build`
- `node scripts/validate-content.mjs`
- `node scripts/check-slugs.mjs`
- `node scripts/check-links.mjs`

---

## 16. 驗收標準

專案完成後，至少需滿足以下條件。第一，使用者可從首頁以產品大類 → 產品細類的方式進入推薦結果頁。第二，推薦結果頁可切換三種推薦模式，並在 `全部瀏覽` 模式下以最適合此產品排序，且可用風格篩選。第三，所有主要資料類型皆有 detail page，且各自能被搜尋或從推薦結果導入。第四，`67` 種風格都有具有辨識度的獨特頁面，而不是單純套模板換色。第五，每個重要 detail page 都提供可直接複製的 Prompt。第六，規則中心能清楚說明推薦邏輯，而不只是把資料平鋪。

除此之外，建置流程必須能穩定生成所有 route，且資料筆數與 source of truth 一致，不得出現大規模遺漏。若未來 CSV 更新，只需重新執行資料建置與驗證腳本，即可確認內容是否完整。這些條件滿足後，才能稱得上是一個可用、可理解、可擴充的 UI/UX 展示系統。

---

## 17. 風險與決策紀錄

目前最大的風險有三個。第一，`67` 種風格各做獨特頁面，若沒有 manifest 與共用 primitive，維護成本會很快失控。第二，推薦邏輯若只做靜態映射，結果可能過於僵化，失去探索價值；但若完全動態組合，又可能造成品質不穩。第三，內容量極大，若沒有明確的資料驗證與路由檢查，後續 CSV 變更會很容易導致頁面遺漏。

目前已確認的產品決策如下：技術選型為 Astro + Tailwind；展示架構採混合式；首頁先選產品類型，且先分大類再進細類；推薦結果先推薦完整組合；推薦模式要允許使用者即時切換；`全部瀏覽` 預設排序為最適合此產品；結果頁主要縮小範圍方式為用風格篩選；第一優先目標使用者為 Prompt 使用者；資料範圍以現有來源為準，不補到 `57` 字體或 `99` UX 再開始。

這些決策已足夠支撐下一階段的實作計畫。
