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
    let logicaPrestamos = [];

    // const libros = await Libro.find({}, '_id nombre_libro autor id_prestamo');
    // const prestamos = await Prestamo.find({}, 'fecha_entrega id_usuario');
    // const usuarios = await Usuario.find({}, 'nombre apellido');

    // for (const libro of libros) {
    //   if (libro.id_prestamo == null) {
    //     logicaPrestamos.push({
    //       _id: libro._id,
    //       libro: libro.nombre_libro + ' - ' + libro.autor,
    //       usuario: '',
    //       prestamo: 'Ninguno',
    //     })       
    //   } else {
    //     // Trae fecha e id_usuario
    //     const prest = prestamos.find(item => item._id == libro.id_prestamo);
    //     // Trae nombre y apellido de Usuario
    //     const usua = usuarios.find(item => item._id == prest.id_usuario);

    //     logicaPrestamos.push({
    //       _id: libro._id,
    //       libro: libro.nombre_libro + ' - ' + libro.autor,
    //       usuario: usua.nombre + ' ' + usua.apellido,
    //       prestamo: prest.fecha_entrega,
    //     });
    //   }

    // Para mejorar el rendimiento se resuelven las promesas al tiempo (en paralelo)
    const libros = Libro.find({}, '_id nombre_libro autor id_prestamo');
    const prestamos = Prestamo.find({}, 'fecha_entrega id_usuario');
    const usuarios = Usuario.find({}, 'nombre apellido');
    
    await Promise.all([libros, prestamos, usuarios]).
    then(values => {
      for (const libro of values[0]) {
        if (libro.id_prestamo == null) {
          logicaPrestamos.push({
            _id: libro._id,
            libro: libro.nombre_libro + ' - ' + libro.autor,
            usuario: '',
            prestamo: 'Ninguno',
          })       
        } else {
          // Trae fecha e id_usuario
          const prest = values[1].find(item => item._id == libro.id_prestamo);
          // Trae nombre y apellido de Usuario
          const usua = values[2].find(item => item._id == prest.id_usuario);

          logicaPrestamos.push({
            _id: libro._id,
            libro: libro.nombre_libro + ' - ' + libro.autor,
            usuario: usua.nombre + ' ' + usua.apellido,
            prestamo: prest.fecha_entrega,
          });
        }
      }      
    });

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