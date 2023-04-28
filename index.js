const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

const PORT = process.env.PORT || 3055;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db',
})

connection.connect(error => {
    if (error) throw error;
    console.log('Database Running')
})

app.get('/', (request, response) => {
    response.send('App Running')
});

app.get('/form', (req, res) => {
    const sql = 'SELECT * FROM form';

    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        }else{
            res.send('Not result');
        }
    });
});

app.post('/send-form', (request, response) => {
    connection.query('INSERT INTO form SET ?', request.body, (error, result) => {
        if (error) throw error;
        response.send('Information registered successfully');
    });
});

app.put('/update-row/:id', (request, response) => {
    const id = request.params.id;
    connection.query('UPDATE form SET ? WHERE idform = ?', [request.body, id], (error, result) => {
        if (error) throw error;
        response.send('Updated successfully');
    });
});

app.delete('/delete-row/:idform', async(req, res) => {
    const id = req.params
    const sql = `DELETE FROM form WHERE idform = ${id.idform}`

    await connection.query(sql, error => {
      if (error) throw error

      res.send('Deleted successfully')
    })
})

app.listen(PUERTO, ()=> console.log(`Servidor corriendo en el puerto '${PORT}'`));