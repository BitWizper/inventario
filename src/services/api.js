import axios from 'axios'

// Conexión al backend (debe estar corriendo en el puerto 3000)
const API_BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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