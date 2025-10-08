<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <!-- 登入卡片 -->
    <div class="bg-white rounded-3xl shadow-lg w-96 p-10 flex flex-col items-center">
      <!-- 標題 -->
      <h1 class="text-3xl font-semibold text-gray-800 mb-8">後台登入</h1>

      <!-- Google 登入按鈕 -->
      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors duration-200"
      >
        <!-- Google Logo SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.3 0 6 1.1 7.8 2.1l5.7-5.7C33.1 3.1 28.9 1 24 1 14.7 1 7.1 6.9 4.3 15.2l6.6 5.1C12.7 14 17.9 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.5-.1-2.6-.3-3.7H24v7h12.7c-.5 3-2 5.5-4.3 7.2l6.6 5.1c3.9-3.6 6.5-8.9 6.5-15.6z"/>
          <path fill="#FBBC05" d="M10.9 28.3l-6.6 5.1C5.1 36.3 14.7 43 24 43c6.4 0 11.8-2.1 15.7-5.7l-6.6-5.1c-2.1 1.4-4.7 2.2-7.8 2.2-6.1 0-11.3-4.5-12.4-10.2z"/>
          <path fill="#34A853" d="M4.3 15.2L10.9 20.3c1.1-5.7 6.3-10.2 12.4-10.2 3 0 5.7.8 7.8 2.2l6.6-5.1C35.8 3.1 30.4 1 24 1 14.7 1 7.1 6.9 4.3 15.2z"/>
        </svg>
        使用 Google 登入
      </button>
    </div>
  </div>
</template>

<script setup>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

const auth = getAuth();
const router = useRouter();

// Google 登入方法
const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    // 登入 Google
    const result = await signInWithPopup(auth, provider);

    // 儲存 accessToken 到 localStorage
    const token = result.user.accessToken || (await result.user.getIdToken());
    localStorage.setItem("authToken", token);

    // 導向後台
    router.push("/dashboard");
  } catch (err) {
    alert("登入失敗: " + err.message);
  }
};
</script>
