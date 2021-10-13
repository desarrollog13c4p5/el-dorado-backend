import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const prestamoSchema = new Schema({
  // nombre_libro: {type: String, required: [true, 'Nombre obligatorio']},
  fecha_entrega: String,
  id_usuario: String,
  nombre_libro: String,
  // nombre: {type: String, required: [true, 'Nombre obligatorio']},
  nombre: String,
  // apellido: {type: String, required: [true, 'Apellido obligatorio']},
  apellido: String,
  identificacion: Number,
  // id_libro: Number,
  autor: String,
  editorial: String,
  categoria: String,
  activo: {type: Boolean, default: true}
});

// Convertir a modelo
const Prestamo = mongoose.model('Prestamo', prestamoSchema);

export default Prestamo;