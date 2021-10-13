import express from 'express';
const router = express.Router();

// importar modelos
import Prestamo from '../models/prestamo';
import Libro from '../models/libro';
import Usuario from '../models/usuario';

// Agregar un prestamo
router.post('/nuevo-prestamo', async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    // Crear Prestamo
    const prestamoDB = await Prestamo.create(body);
    console.log(prestamoDB._id);

    // Actualizar id_prestamo en Libro
    const libroDb = await Libro.findByIdAndUpdate(
      body.id_libro,
      {
        id_prestamo: prestamoDB._id
      },
      { new: true });
    res.json(libroDb);

    res.status(200).json(prestamoDB);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Borrar Prestamo
router.delete('/prestamo/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    // Borrar Prestamo
    const libro = await Libro.findOne({ _id });
    await Prestamo.findByIdAndDelete({ _id: libro.id_prestamo })

    // Actualizar id_prestamo en Libro
    const libroDb = await Libro.findByIdAndUpdate(
      _id,
      {
        id_prestamo: null
      },
      { new: true }
    );

    if (!libroDb) {
      return res.status(400).json({
        mensaje: 'No se borro prestamo del libro: ' + _id,
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

// Put actualizar una prestamo
router.put('/prestamo/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const prestamoDb = await Prestamo.findByIdAndUpdate(
      _id,
      body,
      { new: true });
    res.json(prestamoDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con parámetros
router.get('/prestamo/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const prestamoDB = await Prestamo.findOne({ _id });
    res.json(prestamoDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Get con todos los documentos
router.get('/prestamo', async (req, res) => {
  try {
    const libros = await Libro.find();
    let logicaPrestamos = [];

    for (const libro of libros) {
      let temp_prestamo = '';
      let temp_usuario = '';

      if (libro.id_prestamo == null) {
        temp_prestamo = 'Ninguno'
      } else {
        // Trae fecha e id_usuario
        await Prestamo.findOne({ _id: libro.id_prestamo })
          .then((res) => {
            temp_prestamo = res.fecha_entrega;
            console.log(temp_prestamo);
            temp_usuario = res.id_usuario;
          })
          .catch((error) => {
            temp_prestamo = 'Error'
            console.log(error);
          });

        // Trae nombre y apellido de Usuario
        if (temp_prestamo != 'Error') {
          await Usuario.findOne({ _id: temp_usuario })
            .then((res) => {
              temp_usuario = res.nombre + ' ' + res.apellido;
              console.log(temp_usuario);
            })
            .catch((error) => {
              temp_prestamo = 'Error'
              console.log(error);
            });
        }
      }

      logicaPrestamos.push({
        _id: libro._id,
        libro: libro.nombre_libro + ' - ' + libro.autor,
        usuario: temp_usuario,
        prestamo: temp_prestamo,
      })
    }

    res.json(logicaPrestamos);

  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;