<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-200 p-6">

    <div class="flex items-center w-full justify-between mb-10">
      <div class="w-[90px]"></div> <!-- 寬度跟右側按鈕差不多 -->

      <!-- 標題 -->
      <h1 class="text-3xl font-semibold text-gray-800 text-center flex-1">
        後台訂單管理
      </h1>

      <!-- 返回按鈕 -->
      <el-button
        type="info"
        plain
        @click="goBack"
        class="w-[90px]"
      >
        返回
      </el-button>
    </div>




    <!-- 最外層卡片 -->
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-6">

      <!-- 搜尋欄 -->
      <div class="flex justify-end mb-4">
        <el-input
          v-model="searchQuery"
          placeholder="輸入用戶名稱搜尋"
          clearable
          class="w-64"
        />
      </div>

      <!-- Tabs -->
      <el-tabs v-model="activeTab" type="card" class="w-full mb-6">
        
        <!-- 未送單 -->
        <el-tab-pane label="未送單" name="pending">
          <div v-if="loading" class="text-gray-500 text-center">讀取中...</div>
          <div v-else-if="filteredPending.length === 0" class="text-gray-500 text-center">
            沒有符合的未送單訂單
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in filteredPending"
              :key="order.id"
              class="bg-gray-100 rounded-2xl p-5 transition duration-200"
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
          <div v-if="filteredShipped.length === 0" class="text-gray-500 text-center">
            沒有符合的已送單訂單
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in filteredShipped"
              :key="order.id"
              class="bg-gray-100 rounded-2xl p-5 transition duration-200"
            >
              <p class="text-gray-800 font-medium mb-1">用戶: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <p class="text-gray-800 font-medium mb-1">金額: ${{ order.total }}</p>
              <p class="text-gray-500 text-sm mb-4">
                日期: {{ order.createdAt?.toDate().toLocaleString() }}
              </p>
              <el-button type="success" class="w-full" @click="markAsCompleted(order.id)">
                完成付款
              </el-button>
            </div>
          </div>
        </el-tab-pane>

        <!-- 完成 -->
        <el-tab-pane label="完成" name="completed">
          <div v-if="filteredCompleted.length === 0" class="text-gray-500 text-center">
            沒有符合的完成訂單
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="order in filteredCompleted"
              :key="order.id"
              class="bg-gray-100 rounded-2xl p-5 duration-200"
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
import { useRouter } from "vue-router";

// Tab 狀態
const activeTab = ref("pending");

// 搜尋字串
const searchQuery = ref("");

const router = useRouter();

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

// 狀態更新
const markAsShipped = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: "已送單",
    shippedAt: serverTimestamp()
  });
};

const markAsCompleted = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: "完成",
    completedAt: serverTimestamp()
  });
};

// 原始分類
const pendingOrders = computed(() => orders.value.filter(o => o.status === "未送單"));
const shippedOrders = computed(() => orders.value.filter(o => o.status === "已送單"));
const completedOrders = computed(() => orders.value.filter(o => o.status === "完成"));

// 套用搜尋過濾
const filterByName = (list) => {
  if (!searchQuery.value) return list;
  return list.filter(o => o.customer?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()));
};

const filteredPending = computed(() => filterByName(pendingOrders.value));
const filteredShipped = computed(() => filterByName(shippedOrders.value));
const filteredCompleted = computed(() => filterByName(completedOrders.value));

const goBack = () => {
  router.go(-1);
};
</script>
