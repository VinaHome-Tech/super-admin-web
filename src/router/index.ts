import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DiemDung from '@/views/KhaiBao/DiemDung.vue'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    component: LoginView,
  },
  {
    path: '/KhaiBao',
    component: DefaultLayout,
    children: [
      { path: 'DiemDung', name: 'diemdung', component: DiemDung },
      { path: 'NhaXe', name: 'nhaxe', component: () => import('@/views/KhaiBao/NhaXe.vue') },
      { path: 'TaiKhoan', name: 'taikhoan', component: () => import('@/views/KhaiBao/TaiKhoan.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router