<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-200 p-6">

<!-- 頁首 -->
<div class="flex items-center w-full justify-between mb-6 sm:mb-10 sm:px-0">
  <!-- 左側占位 -->
  <div class="w-[70px] sm:w-[90px]"></div>

  <!-- 標題 -->
  <h1 class="text-xl sm:text-3xl font-semibold text-gray-800 text-center flex-1">
    後台訂單管理
  </h1>

  <!-- 登出按鈕（固定在右側） -->
  <div class="w-[70px] sm:w-[90px] flex justify-end">
    <el-button
      type="info"
      plain
      @click="logout"
      class="text-sm sm:text-base"
    >
      登出
    </el-button>
  </div>
</div>



    <!-- 訂單卡片 -->
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
              class="bg-gray-100 rounded-2xl p-5 flex flex-col justify-between h-full"
            >
              <div>
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
                <p class="text-gray-800 mb-4">
                  日期: {{ order.createdAt?.toDate().toLocaleString() }}
                </p>
              </div>

              <!-- 送單按鈕 -->
              <el-button
                type="primary"
                class="w-full mt-auto"
                @click="isGuest ? showGuestWarning() : markAsShipped(order.id)"
              >
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
              class="bg-gray-100 rounded-2xl p-5 flex flex-col justify-between h-full"
            >
              <div>
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
                <p class="text-gray-800 mb-4">
                  日期: {{ order.createdAt?.toDate().toLocaleString() }}
                </p>
              </div>

              <!-- 完成付款按鈕 -->
              <el-button
                type="success"
                class="w-full mt-auto"
                @click="isGuest ? showGuestWarning() : markAsCompleted(order.id)"
              >
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
              class="bg-gray-100 rounded-2xl p-5 flex flex-col justify-between h-full"
            >
              <div>
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
                <p class="text-gray-800 mb-4">
                  完成日期: {{ order.completedAt?.toDate().toLocaleString() }}
                </p>
              </div>
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
import { getAuth, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const activeTab = ref("pending");
const searchQuery = ref("");
const orders = ref([]);
const loading = ref(true);
const router = useRouter();
const auth = getAuth();
const isGuest = ref(false);

let unsub;

// 判斷是否為訪客
onMounted(() => {
  console.log(auth.currentUser);
  if (auth.currentUser) {
    isGuest.value = auth.currentUser.isAnonymous;
  }
  auth.onAuthStateChanged(user => {
    isGuest.value = user?.isAnonymous || false;
  });

  // Firestore 即時監聽
  unsub = onSnapshot(collection(db, "orders"), snapshot => {
    orders.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    loading.value = false;
  });
});

onUnmounted(() => unsub && unsub());

// 對訪客點擊按鈕時跳出警告
const showGuestWarning = (actionName) => {
  if (isGuest.value) {
    Swal.fire({
      icon: "warning",
      title: "訪客不可操作",
      text: `訪客身份無法操作此功能，請使用正式帳號登入。`,
    });
    return true;
  }
  return false;
};

// 訂單操作
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

// 登出
const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("authToken");
    router.push("/login");
  } catch (err) {
    console.error("登出失敗", err);
  }
};
</script>
