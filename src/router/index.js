import { createRouter, createWebHistory } from 'vue-router'
import InventarioView from '../views/InventarioView.vue'

const routes = [
  {
    path: '/',
    redirect: '/inventario'
  },
  {
    path: '/inventario',
    name: 'Inventario',
    component: InventarioView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router