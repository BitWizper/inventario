const express = require('express')
const router = express.Router()

// GET todos los productos
router.get('/', (req, res) => {
  req.db.getConnection((err, connection) => {
    if (err) {
      console.error('Error de conexión:', err)
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id DESC
    `
    
    connection.query(query, (err, results) => {
      connection.release()
      if (err) {
        console.error('Error GET productos:', err)
        return res.status(500).json({ error: 'Error al obtener productos' })
      }
      res.json(results)
    })
  })
})

// GET producto por ID
router.get('/:id', (req, res) => {
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `
    
    connection.query(query, [req.params.id], (err, results) => {
      connection.release()
      if (err) {
        console.error('Error GET producto:', err)
        return res.status(500).json({ error: 'Error al obtener producto' })
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      res.json(results[0])
    })
  })
})

// POST crear producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, talla, color, stock, categoria_id } = req.body
  
  if (!nombre || !precio || !talla || stock === undefined) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }
  
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, talla, color, stock, categoria_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    
    connection.query(query, [nombre, descripcion, precio, talla, color, stock, categoria_id || null], (err, result) => {
      connection.release()
      if (err) {
        console.error('Error POST producto:', err)
        return res.status(500).json({ error: 'Error al crear producto' })
      }
      res.json({ 
        id: result.insertId, 
        message: 'Producto creado exitosamente' 
      })
    })
  })
})

// PUT actualizar producto
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, talla, color, stock, categoria_id } = req.body
  
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = `
      UPDATE productos 
      SET nombre=?, descripcion=?, precio=?, talla=?, color=?, stock=?, categoria_id=?
      WHERE id=?
    `
    
    connection.query(query, [nombre, descripcion, precio, talla, color, stock, categoria_id || null, req.params.id], (err, result) => {
      connection.release()
      if (err) {
        console.error('Error PUT producto:', err)
        return res.status(500).json({ error: 'Error al actualizar producto' })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      res.json({ message: 'Producto actualizado exitosamente' })
    })
  })
})

// PATCH actualizar stock
router.patch('/:id/stock', (req, res) => {
  const { stock } = req.body
  
  if (stock === undefined || stock < 0) {
    return res.status(400).json({ error: 'Stock inválido' })
  }
  
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = 'UPDATE productos SET stock=? WHERE id=?'
    
    connection.query(query, [stock, req.params.id], (err, result) => {
      connection.release()
      if (err) {
        console.error('Error PATCH stock:', err)
        return res.status(500).json({ error: 'Error al actualizar stock' })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      res.json({ message: 'Stock actualizado exitosamente' })
    })
  })
})

// DELETE eliminar producto
router.delete('/:id', (req, res) => {
  req.db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Error de base de datos' })
    }
    
    const query = 'DELETE FROM productos WHERE id=?'
    
    connection.query(query, [req.params.id], (err, result) => {
      connection.release()
      if (err) {
        console.error('Error DELETE producto:', err)
        return res.status(500).json({ error: 'Error al eliminar producto' })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      res.json({ message: 'Producto eliminado exitosamente' })
    })
  })
})

module.exports = router