import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

const app = express();

/*
// Conexión base de datos local
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/ElDorado_DB';
const options = {useNewUrlParser: true, useUnifiedTopology: true};

// Or using promises
mongoose.connect(uri, options).then(
  // ready to use. The `mongoose.connect()` promise resolves to mongoose //// instance. 
  () => { console.log('Conectado a DB') },
  // handle initial connection error
  err => { console.log(err) }
);
*/

/*
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://fredyg:mision2022@eldorado.cdqms.mongodb.net/ElDorado_DB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connected to database in MongoDB Atlas')
  const collection = client.db("ElDorado_DB").collection("usuario");
  // perform actions on the collection object
  client.close();
});
*/

// Conexión base de datos MongoDB Atlas
const mongoose = require('mongoose');

var cadenaConexion = 'mongodb+srv://fredyg:mision2022@eldorado.cdqms.mongodb.net/ElDorado_DB?retryWrites=true&w=majority'
mongoose.connect(cadenaConexion, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, res) {
  if(err) {
    console.log('Error al conectar con MongoDB' + err);
  }else{   
     console.log('Conectado a MongoDB Atlas');
  }
});



// Middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, 'public')));

// Rutas
/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/
app.use('/api', require('./routes/usuario'));
app.use('/api', require('./routes/libro'));
app.use('/api', require('./routes/prestamo'));

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));

app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), function () {
  console.log('Example app listening on port'+ app.get('puerto'));
});