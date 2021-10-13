import express from 'express';
const router = express.Router();

// importar el modelo usuario
import Usuario from '../models/usuario';

// Agregar una usuario
router.post('/nuevo-usuario', async(req, res) => {
  const body = req.body;  
  try {
    const usuarioDB = await Usuario.create(body);
    res.status(200).json(usuarioDB); 
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

router.get('/usuario/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const usuarioDB = await Usuario.findOne({_id});
    res.json(usuarioDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});
 
// Get con todos los documentos
router.get('/usuario', async(req, res) => {
  try {
    const usuarioDb = await Usuario.find();
    res.json(usuarioDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Delete eliminar una usuario
router.delete('/usuario/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const usuarioDb = await Usuario.findByIdAndDelete({_id});
    if(!usuarioDb){
      return res.status(400).json({
        mensaje: 'No se encontró el id indicado',
        error
      })
    }
    res.json(usuarioDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Put actualizar una usuario
router.put('/usuario/:id', async(req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const usuarioDb = await Usuario.findByIdAndUpdate(
      _id,
      body,
      {new: true});
    res.json(usuarioDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;