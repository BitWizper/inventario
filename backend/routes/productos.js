const express = require('express')
const router = express.Router()

// GET todos los productos
router.get('/', (req, res) => {
  const query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.id DESC
  `
  
  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Error GET productos:', err)
      return res.status(500).json({ error: 'Error al obtener productos' })
    }
    res.json(results)
  })
})

// GET producto por ID
router.get('/:id', (req, res) => {
  const query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.id = ?
  `
  
  req.db.query(query, [req.params.id], (err, results) => {
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

// POST crear producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, talla, color, stock, categoria_id } = req.body
  
  if (!nombre || !precio || !talla || stock === undefined) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }
  
  const query = `
    INSERT INTO productos (nombre, descripcion, precio, talla, color, stock, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  
  req.db.query(query, [nombre, descripcion, precio, talla, color, stock, categoria_id || null], 
    (err, result) => {
      if (err) {
        console.error('Error POST producto:', err)
        return res.status(500).json({ error: 'Error al crear producto' })
      }
      res.json({ 
        id: result.insertId, 
        message: 'Producto creado exitosamente' 
      })
    }
  )
})

// PUT actualizar producto
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, talla, color, stock, categoria_id } = req.body
  
  const query = `
    UPDATE productos 
    SET nombre=?, descripcion=?, precio=?, talla=?, color=?, stock=?, categoria_id=?
    WHERE id=?
  `
  
  req.db.query(query, [nombre, descripcion, precio, talla, color, stock, categoria_id || null, req.params.id], 
    (err, result) => {
      if (err) {
        console.error('Error PUT producto:', err)
        return res.status(500).json({ error: 'Error al actualizar producto' })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' })
      }
      res.json({ message: 'Producto actualizado exitosamente' })
    }
  )
})

// PATCH actualizar stock
router.patch('/:id/stock', (req, res) => {
  const { stock } = req.body
  
  if (stock === undefined || stock < 0) {
    return res.status(400).json({ error: 'Stock inválido' })
  }
  
  const query = 'UPDATE productos SET stock=? WHERE id=?'
  
  req.db.query(query, [stock, req.params.id], (err, result) => {
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

// DELETE eliminar producto
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM productos WHERE id=?'
  
  req.db.query(query, [req.params.id], (err, result) => {
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

module.exports = router