<template>
  <div class="flex h-screen">

    <!-- SIDEBAR -->
    <el-menu
      router
      :default-active="route.path"
      :default-openeds="defaultOpeneds"
      class="w-[220px] h-full border-r"
      background-color="#ffffff"
      text-color="#333"
      active-text-color="#409eff"
    >
      <!-- Dashboard -->
      <el-menu-item index="/TongQuan">
        <span>Tổng quan</span>
      </el-menu-item>

      <!-- SUBMENU: Khai Báo -->
      <el-sub-menu index="/KhaiBao">
        <template #title>
          <span>Khai báo</span>
        </template>

        <el-menu-item index="/KhaiBao/NhaXe">
          Nhà xe
        </el-menu-item>

        <el-menu-item index="/KhaiBao/DiemDung">
          Điểm dừng
        </el-menu-item>

      </el-sub-menu>

      <!-- Users -->
      <el-menu-item index="/users">
        <span>Quản lý người dùng</span>
      </el-menu-item>
    </el-menu>

    <!-- MAIN CONTENT -->
    <div class="flex-1 p-4 bg-gray-50 overflow-auto">
      <router-view />
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

/**
 * Tự động mở các submenu cha
 * Nếu đường dẫn là "/KhaiBao/NhaXe"
 * thì "/KhaiBao" sẽ được mở
 */
const defaultOpeneds = computed(() => {
  const segments = route.path.split("/");

  // Nếu path là /KhaiBao/NhaXe → open submenu /KhaiBao
  if (segments.length > 2) {
    return [`/${segments[1]}`];
  }

  return [];
});
</script>
