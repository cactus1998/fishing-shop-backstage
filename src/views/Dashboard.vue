<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-2xl shadow-2xl p-10 w-96 flex flex-col items-center text-center">
      <h1 class="text-3xl font-extrabold text-green-600 mb-4">歡迎進入後台</h1>
      <p class="text-gray-700 mb-6">你已經通過 Firebase 白名單驗證 ✅</p>

      <button
        @click="logout"
        class="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 hover:shadow-lg transition-all duration-300"
      >
        登出
      </button>
    </div>
  </div>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = async () => {
  await signOut(auth);
  router.push("/login");
};
</script>
