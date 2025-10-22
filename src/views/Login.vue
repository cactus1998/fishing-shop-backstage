<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4">
    <!-- 登入卡片 -->
    <div class="bg-white rounded-3xl shadow-lg w-11/12 sm:w-96 p-8 sm:p-10 flex flex-col items-center">
      <!-- 標題 -->
      <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 text-center">
        後台登入
      </h1>

      <!-- Google 登入按鈕 -->
      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-5 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
      >
        <!-- Google Logo SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.3 0 6 1.1 7.8 2.1l5.7-5.7C33.1 3.1 28.9 1 24 1 14.7 1 7.1 6.9 4.3 15.2l6.6 5.1C12.7 14 17.9 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.5-.1-2.6-.3-3.7H24v7h12.7c-.5 3-2 5.5-4.3 7.2l6.6 5.1c3.9-3.6 6.5-8.9 6.5-15.6z"/>
          <path fill="#FBBC05" d="M10.9 28.3l-6.6 5.1C5.1 36.3 14.7 43 24 43c6.4 0 11.8-2.1 15.7-5.7l-6.6-5.1c-2.1 1.4-4.7 2.2-7.8 2.2-6.1 0-11.3-4.5-12.4-10.2z"/>
          <path fill="#34A853" d="M4.3 15.2L10.9 20.3c1.1-5.7 6.3-10.2 12.4-10.2 3 0 5.7.8 7.8 2.2l6.6-5.1C35.8 3.1 30.4 1 24 1 14.7 1 7.1 6.9 4.3 15.2z"/>
        </svg>
        使用 Google 登入
      </button>

      <!-- 訪客登入按鈕 -->
      <button
        @click="loginAsGuest"
        class="w-full flex items-center justify-center gap-3 px-5 py-3 mt-4 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-colors duration-200 text-sm sm:text-base"
      >
        以訪客身份登入
      </button>
    </div>
  </div>
</template>

<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const auth = getAuth();
const router = useRouter();

// 🔹 Google 登入
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    // 呼叫 Google 登入彈窗
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // 🔍 檢查是否為新用戶（透過比對創建時間和最後登入時間）
    const metadata = user.metadata;
    const isNewUser = metadata.creationTime === metadata.lastSignInTime;
    
    if (isNewUser) {
      // ❌ 是新用戶 → 刪除並拒絕登入
      await user.delete();
      
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "此帳號尚未註冊,請聯絡管理員",
        confirmButtonColor: "#d33",
      });
      return;
    }
    
    // ✅ 已存在的用戶 → 允許登入
    const token = await user.getIdToken();
    localStorage.setItem("authToken", token);
    
    // 手動跳轉到 dashboard
    router.push("/dashboard");
    
  } catch (err) {
    // 忽略 user.delete() 造成的錯誤
    if (err.code === 'auth/user-token-expired' || err.code === 'auth/user-not-found') {
      return;
    }
    
    // 忽略用戶取消登入的情況
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return;
    }
    
    // 其他錯誤才顯示
    Swal.fire({
      icon: "error",
      title: "登入失敗",
      text: err.message,
      confirmButtonColor: "#3085d6",
    });
  }
};

// 🔹 訪客登入
const loginAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    const token = await result.user.getIdToken();
    localStorage.setItem("authToken", token);
    router.push("/dashboard");
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "訪客登入失敗",
      text: err.message,
      confirmButtonColor: "#3085d6",
    });
  }
};
</script>