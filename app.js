const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear y abrir la base de datos
const db = new sqlite3.Database('./miBaseDeDatos.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado a la base de datos SQLite.');
});

// Crear la tabla "todos"
db.run(`CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  todo TEXT NOT NULL,
  created_at INTEGER
)`);

app.get('/', (req, res) => {
  res.send('Hola Mundo con Express y Node.js!');
});


app.post('/agrega_todo', (req, res) => {
  const { todo } = req.body;
  const created_at = Math.floor(Date.now() / 1000);

  const sql = `INSERT INTO todos (todo, created_at) VALUES (?,?)`;
  db.run(sql, [todo, created_at], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send({ error: 'Error al guardar en la base de datos' });
      return;
    }
    // Envía una respuesta con estado HTTP 201 y los datos insertados
    res.status(201).send({ id: this.lastID, todo, created_at });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Cerrar la base de datos al cerrar la aplicación
process.on('SIGINT', () => {
  db.close(() => {
    console.log('La base de datos SQLite ha sido cerrada');
    process.exit(0);
  });
});
