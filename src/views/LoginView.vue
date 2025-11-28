<template>
  <div class="login-page">
    <div class="login-card">

      <!-- Logo -->
      <div class="logo-wrap">
        <img :src="Logo" alt="Logo" class="logo" />
      </div>

      <el-card>
        <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-position="top"
          @submit.prevent="handleLogin">
          <!-- Username -->
          <el-form-item label="Username" prop="username">
            <el-input v-model="loginForm.username" placeholder="Enter username" clearable>
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Password -->
          <el-form-item label="Password" prop="password">
            <el-input v-model="loginForm.password" placeholder="Enter password" type="password" show-password clearable
              @keyup.enter="handleLogin">
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <!-- Button -->
          <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading">
            Login
          </el-button>
        </el-form>
      </el-card>

    </div>
  </div>
</template>



<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// Import logo (adjust path as needed)
import Logo from '@/assets/images/logo-4.png' // Thay đổi path này theo dự án của bạn

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: 'Please enter your username', trigger: 'blur' },
    { min: 3, message: 'Username must be at least 3 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
})

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true

      // Simulate API call
      setTimeout(() => {
        const { username, password } = loginForm

        if (username === 'admin' && password === '123456') {
          ElMessage.success({
            message: 'Đăng nhập thành công!',
            type: 'success',
            duration: 2000
          })

          // TODO: chuyển hướng sau khi login
          // router.push('/dashboard')
        } else {
          ElMessage.error({
            message: 'Tên đăng nhập hoặc mật khẩu không đúng!',
            type: 'error',
            duration: 3000
          })
        }

        loading.value = false
      }, 1000)
    } else {
      ElMessage.warning('Please check your login information.')
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
}

.login-card {
  width: 100%;
  max-width: 450px;

}

.logo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo {
  max-width: 180px;
  /* GIỚI HẠN logo */
  height: auto;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
