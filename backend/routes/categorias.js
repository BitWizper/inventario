const express = require('express')
const router = express.Router()

// GET todas las categorías
router.get('/', (req, res) => {
  const query = 'SELECT * FROM categorias ORDER BY id DESC'
  
  req.db.query(query, (err, results) => {
    if (err) {
      console.error('Error GET categorías:', err)
      return res.status(500).json({ error: 'Error al obtener categorías' })
    }
    res.json(results)
  })
})

// GET categoría por ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM categorias WHERE id = ?'
  
  req.db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error GET categoría:', err)
      return res.status(500).json({ error: 'Error al obtener categoría' })
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json(results[0])
  })
})

// POST crear categoría
router.post('/', (req, res) => {
  const { nombre, descripcion } = req.body
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }
  
  const query = 'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)'
  
  req.db.query(query, [nombre, descripcion || null], (err, result) => {
    if (err) {
      console.error('Error POST categoría:', err)
      return res.status(500).json({ error: 'Error al crear categoría' })
    }
    res.json({ 
      id: result.insertId, 
      message: 'Categoría creada exitosamente' 
    })
  })
})

// PUT actualizar categoría
router.put('/:id', (req, res) => {
  const { nombre, descripcion } = req.body
  
  const query = 'UPDATE categorias SET nombre=?, descripcion=? WHERE id=?'
  
  req.db.query(query, [nombre, descripcion, req.params.id], (err, result) => {
    if (err) {
      console.error('Error PUT categoría:', err)
      return res.status(500).json({ error: 'Error al actualizar categoría' })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json({ message: 'Categoría actualizada exitosamente' })
  })
})

// DELETE eliminar categoría
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM categorias WHERE id=?'
  
  req.db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error DELETE categoría:', err)
      return res.status(500).json({ error: 'Error al eliminar categoría' })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json({ message: 'Categoría eliminada exitosamente' })
  })
})

module.exports = router