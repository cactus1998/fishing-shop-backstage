<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
    <div class="bg-white p-10 rounded-2xl shadow-xl w-96 flex flex-col items-center">
      <h1 class="text-3xl font-extrabold text-blue-700 mb-8">後台登入</h1>

      <button
        @click="loginWithGoogle"
        class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
      >
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

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("登入成功:", result.user.email);
    router.push('/dashboard');
  } catch (err) {
    console.error("登入錯誤:", err);
    alert("登入失敗: " + err.message);
  }
};
</script>
