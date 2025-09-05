import { createApp } from "vue";
import './index.css'
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// 🚨 新增這兩行
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// 宣告一個變數來保存 app 實例
let app;

// 監聽 Firebase 身份驗證狀態變化
onAuthStateChanged(auth, () => {
  // 如果 app 尚未被建立，則進行初始化
  if (!app) {
    app = createApp(App);

    app.use(router);
    app.use(createPinia());
    app.use(ElementPlus);

    app.mount("#app");
  }
});