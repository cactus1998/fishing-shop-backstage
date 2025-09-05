<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-4xl p-8">
      <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
        後台訂單列表
      </h1>

      <div v-if="loading" class="text-gray-500 text-center">讀取中...</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
        >
          <p class="text-gray-800 font-medium mb-1">用戶: {{ order.customer.name }}</p>
          <p class="text-gray-800 font-medium mb-1">用戶信箱: {{ order.customer.email }}</p>
          <p class="text-gray-800 font-medium mb-1">用戶電話: {{ order.customer.phone }}</p>
          <p class="text-gray-800 font-medium mb-1">金額: ${{ order.total }}</p>
          <p class="text-gray-500 text-sm">
            日期: {{ order.createdAt?.toDate().toLocaleString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { db } from "@/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const orders = ref([]);
const loading = ref(true);

onMounted(() => {
  // 即時監聽 orders 集合
  const unsub = onSnapshot(collection(db, "orders"), snapshot => {
    orders.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loading.value = false;
  });

  // 組件卸載時取消監聽
  onUnmounted(() => unsub());
});
</script>
