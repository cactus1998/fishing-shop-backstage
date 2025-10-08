<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-200 p-6">

    <div class="flex items-center w-full justify-between mb-10">
      <div class="w-[90px]"></div> <!-- 寬度跟右側按鈕差不多 -->
      <h1 class="text-3xl font-semibold text-gray-800 text-center flex-1">
        後台訂單管理
      </h1>
      <el-button
        type="info"
        plain
        @click="logout"
        class="w-[90px]"
      >
        登出
      </el-button>
    </div>

    <!-- 最外層卡片 -->
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-5xl p-6">
      <!-- 搜尋欄 -->
      <div class="flex justify-end mb-4">
        <el-input
          v-model="searchQuery"
          placeholder="輸入買家名稱搜尋"
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
              <p class="text-gray-800 font-medium mb-1">買家: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <div class="mb-2">
                <p class="text-gray-800 font-medium mb-1">商品細項:</p>
                <ul class="list-disc list-inside text-gray-700 ml-2">
                  <li v-for="(item, index) in order.items" :key="index">
                    {{ item.name }} × {{ item.quantity }}
                  </li>
                </ul>
              </div>
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
              <p class="text-gray-800 font-medium mb-1">買家: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <div class="mb-2">
                <p class="text-gray-800 font-medium mb-1">商品細項:</p>
                <ul class="list-disc list-inside text-gray-700 ml-2">
                  <li v-for="(item, index) in order.items" :key="index">
                    {{ item.name }} × {{ item.quantity }}
                  </li>
                </ul>
              </div>
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
              <p class="text-gray-800 font-medium mb-1">買家: {{ order.customer.name }}</p>
              <p class="text-gray-800 font-medium mb-1">信箱: {{ order.customer.email }}</p>
              <p class="text-gray-800 font-medium mb-1">電話: {{ order.customer.phone }}</p>
              <div class="mb-2">
                <p class="text-gray-800 font-medium mb-1">商品細項:</p>
                <ul class="list-disc list-inside text-gray-700 ml-2">
                  <li v-for="(item, index) in order.items" :key="index">
                    {{ item.name }} × {{ item.quantity }}
                  </li>
                </ul>
              </div>
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
import { getAuth, signOut } from 'firebase/auth'
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
  // 元件掛載時開始監聽 Firestore "orders" 集合
  unsub = onSnapshot(
    collection(db, "orders"), // 要監聽的集合
    snapshot => {
      // snapshot 代表 "orders" 集合的即時資料快照
      // 轉換成一般陣列格式，附上 doc.id
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 資料拿到後關閉 loading 狀態
      loading.value = false;
    }
  );
});

onUnmounted(() => 
  // 元件卸載時停止監聽，避免記憶體洩漏
  unsub && unsub()
);


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

// 訂單分類
const pendingOrders = computed(() => orders.value.filter(o => o.status === "未送單"));
const shippedOrders = computed(() => orders.value.filter(o => o.status === "已送單"));
const completedOrders = computed(() => orders.value.filter(o => o.status === "完成"));

// 搜尋過濾
const filterByName = (list) => {
  if (!searchQuery.value) return list;
  return list.filter(o => o.customer?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()));
};

const filteredPending = computed(() => filterByName(pendingOrders.value));
const filteredShipped = computed(() => filterByName(shippedOrders.value));
const filteredCompleted = computed(() => filterByName(completedOrders.value));

// 登出功能
const logout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("authToken"); // ✅ 清除 token
    router.push("/login");
  } catch (err) {
    console.error("登出失敗", err);
  }
};
</script>
