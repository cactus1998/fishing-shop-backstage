import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";

// 路由設定
const routes = [
  { path: "/login", component: () => import("../views/Login.vue") },
  { path: "/dashboard", component: () => import("../views/Dashboard.vue"), meta: { requiresAuth: true } },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const base = import.meta.env.MODE === "development" ? "/" : "/fishing-shop-backstage/";

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

// 🔥 新增：在 Firebase 身份驗證狀態變動時，主動檢查並導航
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // 如果使用者已登入，檢查白名單
    const email = (user.email || "").toLowerCase().trim();
    const snap = await getDoc(doc(db, "allowlist", email));

    // 如果使用者在白名單內，且當前不在 dashboard 頁面，就導向 dashboard
    if (snap.exists() && router.currentRoute.value.path !== '/dashboard') {
      router.push('/dashboard');
    }
  } else {
    // 如果使用者未登入，且當前不在 login 頁面，就導向 login
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login');
    }
  }
});


export default router;