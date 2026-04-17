# 凍肉海產資訊

為香港凍肉門店及貿易商提供官方市場數據與行業資訊。

## 🌐 線上訪問

**網站地址**: https://2ykotz6z2utai.ok.kimi.link

## 📊 數據來源

- **香港政府官方**: 食物環境衛生署 (FEHD) - 活豬供應及拍賣價
- **CME 期貨**: CME Group - 肉類期貨價格指數
- **海鮮價格**: SalmonBusiness、Urner Barry、FRED
- **市場情報**: Beef Central、SeafoodSource、Global Meat News、Seafood News

## 🔄 自動更新系統

本網站使用 GitHub Actions 實現每日自動更新：

- **更新時間**: 每天凌晨 3:00 (香港時間)
- **更新內容**: 
  - 香港活豬價格及供應量
  - CME 肉類期貨價格
  - 全球海鮮價格指數
  - 市場新聞資訊

## 🚀 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 手動更新數據
node scripts/fetch-data.js
```

## 📁 項目結構

```
.
├── .github/workflows/    # GitHub Actions 配置
├── data/                 # 數據存儲
├── scripts/              # 數據抓取腳本
├── src/
│   ├── components/       # React 組件
│   ├── sections/         # 頁面區塊
│   └── ...
└── dist/                 # 構建輸出
```

## 🛠️ 技術棧

- **前端**: React + TypeScript + Vite
- **樣式**: Tailwind CSS
- **動畫**: GSAP
- **圖標**: Lucide React
- **部署**: GitHub Pages

## 📞 聯繫我們

- **郵箱**: zhangkailiang12@nfh.hk
- **電話**: +86 18825146113
- **地址**: 大角咀欽州街89號潤發大廈

---

*最後更新: 2026-04-17*
