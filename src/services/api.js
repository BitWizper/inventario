import axios from 'axios'

// ✅ Usa ruta relativa - funciona local y producción
// En desarrollo: Vite redirige /api a http://localhost:3000/api
// En producción: Vercel redirige /api a la serverless function
const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 segundos de timeout
})

// Interceptor para manejar errores de red
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de red: No se puede conectar al servidor')
    } else if (error.response) {
      console.error(`Error ${error.response.status}:`, error.response.data)
    }
    return Promise.reject(error)
  }
)

// Servicios para Productos
export const productosService = {
  getAll() {
    return api.get('/productos')
  },
  
  getById(id) {
    return api.get(`/productos/${id}`)
  },
  
  create(producto) {
    return api.post('/productos', producto)
  },
  
  update(id, producto) {
    return api.put(`/productos/${id}`, producto)
  },
  
  delete(id) {
    return api.delete(`/productos/${id}`)
  },
  
  updateStock(id, stock) {
    return api.patch(`/productos/${id}/stock`, { stock })
  }
}

// Servicios para Categorías
export const categoriasService = {
  getAll() {
    return api.get('/categorias')
  },
  
  getById(id) {
    return api.get(`/categorias/${id}`)
  },
  
  create(categoria) {
    return api.post('/categorias', categoria)
  },
  
  update(id, categoria) {
    return api.put(`/categorias/${id}`, categoria)
  },
  
  delete(id) {
    return api.delete(`/categorias/${id}`)
  }
}