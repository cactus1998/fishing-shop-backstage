<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6 text-center">
      後台訂單管理
    </h1>

    <!-- 最外層卡片 -->
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-6">

      <!-- Tabs -->
      <el-tabs v-model="activeTab" type="card" class="w-full mb-6">
        <!-- 未送單 -->
        <el-tab-pane label="未送單" name="pending">
          <div v-if="loading" class="text-gray-500 text-center">讀取中...</div>
          <div v-else-if="pendingOrders.length === 0" class="text-gray-500 text-center">
            沒有未送單訂單
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in pendingOrders"
              :key="order.id"
              class="bg-gray-50 rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-200"
            >
              <p class="text-gray-800 font-medium mb-1">用戶: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <p class="text-gray-800 font-medium mb-1">金額: ${{ order.total }}</p>
              <p class="text-gray-500 text-sm mb-4">
                日期: {{ order.createdAt?.toDate().toLocaleString() }}
              </p>
              <el-button type="primary" class="w-full" @click="markAsShipped(order.id)">
                送單
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 已送單 -->
        <el-tab-pane label="已送單" name="shipped">
          <div v-if="shippedOrders.length === 0" class="text-gray-500 text-center">
            沒有已送單訂單
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in shippedOrders"
              :key="order.id"
              class="bg-gray-50 rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-200"
            >
              <p class="text-gray-800 font-medium mb-1">用戶: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <p class="text-gray-800 font-medium mb-1">金額: ${{ order.total }}</p>
              <p class="text-gray-500 text-sm mb-4">
                日期: {{ order.createdAt?.toDate().toLocaleString() }}
              </p>
              <el-button type="success" class="w-full" @click="markAsCompleted(order.id)">
                完成
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 完成 -->
        <el-tab-pane label="完成" name="completed">
          <div v-if="completedOrders.length === 0" class="text-gray-500 text-center">
            沒有完成訂單
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in completedOrders"
              :key="order.id"
              class="bg-gray-100 rounded-2xl p-5 shadow-md transition-shadow duration-200"
            >
              <p class="text-gray-800 font-medium mb-1">用戶: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <p class="text-gray-800 font-medium mb-1">金額: ${{ order.total }}</p>
              <p class="text-gray-500 text-sm">
                完成日期: {{ order.completedAt?.toDate().toLocaleString() }}
              </p>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { db } from "@/firebase";
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";

// Tab 狀態
const activeTab = ref("pending");

// 訂單資料
const orders = ref([]);
const loading = ref(true);

// Firestore 即時監聽 orders 集合
let unsub;
onMounted(() => {
  unsub = onSnapshot(collection(db, "orders"), snapshot => {
    orders.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    loading.value = false;
  });
});

onUnmounted(() => unsub && unsub());

// 完成送單 → 改為已送單
const markAsShipped = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "已送單",
      shippedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("更新訂單狀態失敗:", error);
  }
};

// 已送單 → 完成
const markAsCompleted = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: "完成",
      completedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("更新訂單狀態失敗:", error);
  }
};

// 分類訂單
const pendingOrders = computed(() => orders.value.filter(o => o.status === "未送單"));
const shippedOrders = computed(() => orders.value.filter(o => o.status === "已送單"));
const completedOrders = computed(() => orders.value.filter(o => o.status === "完成"));
</script>
