<template>
    <div class="flex h-screen">

        <!-- Sidebar -->
        <el-menu router class="w-64 h-full border-r" background-color="#ffffff" text-color="#333"
            active-text-color="#409eff">

            <el-menu-item index="/TongQuan">
                <span>Dashboard</span>
            </el-menu-item>
            <!-- SUB MENU -->
            <el-sub-menu index="/KhaiBao">
                <template #title>
                    <span>Khai Báo</span>
                </template>
                <el-menu-item index="/KhaiBao/NhaXe">
                    Nhà xe
                </el-menu-item>
                <el-menu-item index="/KhaiBao/DiemDung">
                    Điểm dừng
                </el-menu-item>


            </el-sub-menu>

            <!-- Menu bình thường -->


            <el-menu-item index="/users">
                <span>Quản lý người dùng</span>
            </el-menu-item>

        </el-menu>

        <!-- MAIN CONTENT -->
        <div class="flex-1 p-6 bg-gray-50 overflow-auto">
            <router-view />
        </div>

    </div>
</template>

<script setup lang="ts">
</script>
