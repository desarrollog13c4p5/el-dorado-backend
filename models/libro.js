import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const libroSchema = new Schema({
  nombre_libro: {type: String, required: [true, 'Nombre obligatorio']},
  autor: String,
  id_prestamo: String,
  editorial: String,
  categoria: String,
  fecha_pub:{type: Date},
  activo: {type: Boolean, default: true}
});

// Convertir a modelo
const Libro = mongoose.model('Libro', libroSchema);

export default Libro;