import { createRouter, createWebHashHistory } from "vue-router";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: "/login", component: () => import("../views/Login.vue") },
  { path: "/dashboard", component: () => import("../views/Dashboard.vue"), meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const base = import.meta.env.MODE === "development" ? "/" : "/fishing-shop-backstage/";

const router = createRouter({
  history: createWebHashHistory(base),
  routes,
});

// Firebase 登入狀態監聽（僅更新 Token,不做跳轉）
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 儲存 token
    const token = await user.getIdToken();
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
});

// 檢查 token 是否存在
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");

  // 如果進入需要登入的頁面但沒有 token → 導向登入頁
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } 
  // 如果已登入但進入登入頁 → 導向 dashboard
  else if (to.path === "/login" && token) {
    next("/dashboard");
  } 
  else {
    next();
  }
});

export default router;