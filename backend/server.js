const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ✅ VERIFICAR que las variables de entorno existen
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('❌ Faltan variables de entorno:', missingEnvVars.join(', '))
} else {
  console.log('✅ Variables de entorno cargadas correctamente')
}

// Configuración de Clever Cloud - CON LÍMITE BAJO DE CONEXIONES
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 2,        // Límite de 2 conexiones simultáneas
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

// Manejar errores del pool
pool.on('error', (err) => {
  console.error('❌ Error en el pool de conexiones:', err.message)
})

// Verificar conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error conectando a Clever Cloud:', err.message)
    console.error('Configuración usada:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    })
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
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Error de conexión a base de datos',
        error: err.message,
        envVars: {
          DB_HOST: process.env.DB_HOST ? '✅' : '❌',
          DB_USER: process.env.DB_USER ? '✅' : '❌',
          DB_PASSWORD: process.env.DB_PASSWORD ? '✅' : '❌',
          DB_NAME: process.env.DB_NAME ? '✅' : '❌'
        }
      })
    }
    connection.release()
    res.json({ 
      status: 'OK', 
      message: 'Servidor funcionando',
      db: 'Conectado',
      timestamp: new Date().toISOString()
    })
  })
})

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`)
  })
}

// Exportar para Vercel
module.exports = app