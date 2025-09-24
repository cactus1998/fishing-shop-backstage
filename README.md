# 樂咖大物輪 後台網站

![Static Badge](https://img.shields.io/badge/Vue3%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) ![Static Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![Static Badge](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![Static Badge](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Static Badge](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white) ![Static Badge](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![Static Badge](https://img.shields.io/badge/Node%20js%2014.16.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![Static Badge](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Static Badge](https://img.shields.io/badge/Element--Plus-409EFF?style=for-the-badge&logo=element&logoColor=white) ![Static Badge](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=white) ![Static Badge](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![Static Badge](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black) ![Static Badge](https://img.shields.io/badge/SweetAlert2-3085d6?style=for-the-badge&logoColor=white)

## 說明

一個以 **Vue 3 + Vite** 建置的一頁式前端專案範本，整合 Element Plus、TailwindCSS、Pinia 及 Firebase（Realtime DB）等常用套件，提供購物 / 商品瀏覽類型的畫面與互動基礎。

## 專案技術

- Vue v3.5.18  
- Vite v7.1.2  
- Element Plus ^2.11.1  
- Pinia ^3.0.3  
- TailwindCSS 3.4.17  
- Firebase ^12.2.1 (Realtime Database)  
- SweetAlert2 ^11.22.5  
- Vue Router ^4.5.1  
- 開發工具：@vitejs/plugin-vue, eslint, prettier, postcss, autoprefixer 等

> 建議 Node.js 版本：**14.16.0**（或相容的 LTS 版本）以符合專案 badge（視實際套件需求可升級）。

## 資料夾說明

- `components` - 畫面與元件放置處  
- `modules` - 自訂模組或功能放置處  
- `assets` - 靜態資源 (圖片、字體、icons)  
- `store` - Pinia 狀態管理（stores）  
- `router` - Vue Router 設定  
- `views` - 頁面（頁面組合檔）

## 安裝與啟動

```bash
npm install

npm run dev

npm run build

npm run preview
```

`scripts`:
- `dev`：`vite`  
- `build`：`vite build`  
- `preview`：`vite preview`

## 注意事項

- 若要使用 Firebase 的 Realtime Database，請記得建立 `sdk.js` 或相應的環境設定，並在 `.env` / 設定檔中放入 API keys（不要直接推到公開 repo）。  
- 若要在 CI 或部署平台上運行，請確認平台的 Node 版本是否與本專案相容（建議至少與 badge 指定版本一致）。

## 貢獻與聯絡

歡迎 fork、PR 或開 issue 討論功能與錯誤。
