const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración de Clever Cloud
const dbConfig = {
  host: process.env.DB_HOST || 'bz1k2riqdiarqfaa6de9-mysql.services.clever-cloud.com',
  user: process.env.DB_USER || 'u7mhnlkxtge3ehkz',
  password: process.env.DB_PASSWORD || 'YmhHFtkNAw1IlkZNUAd0',
  database: process.env.DB_NAME || 'bz1k2riqdiarqfaa6de9',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

// Verificar conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a Clever Cloud:', err.message)
    return
  }
  console.log('✅ Conectado a Clever Cloud MySQL')
  connection.release()
})

// Middleware para disponibilizar pool
app.use((req, res, next) => {
  req.db = pool
  next()
})

// Importar rutas
const productsRoutes = require('./routes/productos')
const categoriesRoutes = require('./routes/categorias')

// Usar rutas
app.use('/api/productos', productsRoutes)
app.use('/api/categorias', categoriesRoutes)

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  })
})

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`)
  console.log(`📦 Endpoints disponibles:`)
  console.log(`   GET    http://localhost:${PORT}/api/productos`)
  console.log(`   POST   http://localhost:${PORT}/api/productos`)
  console.log(`   PUT    http://localhost:${PORT}/api/productos/:id`)
  console.log(`   DELETE http://localhost:${PORT}/api/productos/:id`)
  console.log(`   GET    http://localhost:${PORT}/api/categorias`)
  console.log(`   POST   http://localhost:${PORT}/api/categorias`)
  console.log(`   PUT    http://localhost:${PORT}/api/categorias/:id`)
  console.log(`   DELETE http://localhost:${PORT}/api/categorias/:id`)
  console.log(`   GET    http://localhost:${PORT}/api/health`)
})