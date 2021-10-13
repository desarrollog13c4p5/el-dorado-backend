import express from 'express';
const router = express.Router();

// importar el modelo usuario
import Libro from '../models/libro';

// Agregar una usuario
router.post('/nuevo-libro', async(req, res) => {
  const body = req.body;  
  try {
    const libroDB = await Libro.create(body);
    res.status(200).json(libroDB); 
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});


router.delete('/libro/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const libroDb = await Libro.findByIdAndDelete({_id});
    if(!libroDb){
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json(libroDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

  // Put actualizar una usuario
router.put('/libro/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    try {
      const libroDb = await Libro.findByIdAndUpdate(
        _id,
        body,
        {new: true});
      res.json(libroDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

// Get con parámetros
router.get('/libro/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const libroDB = await Libro.findOne({_id});
    res.json(libroDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con todos los documentos
router.get('/libro', async(req, res) => {
  try {
    const libroDb = await Libro.find();
    res.json(libroDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;